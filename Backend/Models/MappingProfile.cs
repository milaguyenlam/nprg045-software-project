using System.Linq;
using AutoMapper;
using Backend.Models.Database;
using Backend.Common;
using NetTopologySuite.Geometries;
using NetTopologySuite;
using static Backend.Models.Client.Types;
using Backend.Models.Crawler;
using Backend.Models.AppSearch;
using System.Collections.Generic;
using System;

namespace Backend.Models
{
    public static class ResolutionContextKeys
    {
        public static readonly string ContainsProductsFlag = "containsProductsFlag";
    }

    //The transformation serve to hide internal object structure or making complex transformation over the returned data
    public class MappingProfile : Profile
    {
        private class CategoryResolver : IValueResolver<Database.Category, CategoryDTO, string>
        {
            public string Resolve(Database.Category source, CategoryDTO destination, string member, ResolutionContext context)
            {
                return source.CategoryTrans.Where(tr => tr.Language.Code.ToLower() == Helpers.GetCurrentLanguage().ToLower())
                                    .FirstOr<CategoryTran>(DefaultObjects.CategoryTran).Name;
            }
        }

        private class CategoryDTOContainsProductsResolver : IValueResolver<Database.Category, CategoryDTO, bool>
        {
            public bool Resolve(Database.Category source, CategoryDTO destination, bool destMember, ResolutionContext context)
            {
                if (context.Options.Items.ContainsKey(ResolutionContextKeys.ContainsProductsFlag))
                {
                    return source.ProductCategories.Any();
                }
                return false;
            }
        }

        private class VendorDTOContainsProductsResolver : IValueResolver<Database.Vendor, VendorDTO, bool>
        {
            public bool Resolve(Database.Vendor source, VendorDTO destination, bool destMember, ResolutionContext context)
            {
                if (context.Options.Items.ContainsKey(ResolutionContextKeys.ContainsProductsFlag))
                {
                    return source.Stores.Any(store => store.ActiveOffers.Any());
                }
                return false;
            }
        }

        private class ContactDetailsGeoFromCrawlerResolver : IValueResolver<Crawler.ContactDetails, Database.ContactDetail, Geometry>
        {
            public Geometry Resolve(Crawler.ContactDetails src, Database.ContactDetail dst, Geometry destMember, ResolutionContext context)
            {
                if (src.Geolocation == null)
                {
                    return null;
                }

                var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(4326);
                return geometryFactory.CreatePoint(new NetTopologySuite.Geometries.Coordinate(src.Geolocation.Longitude, src.Geolocation.Latitude));
            }
        }

        private class ProductCategoriesFromCrawlerResolver :
            IValueResolver<Crawler.Product, Database.Product, ICollection<ProductCategory>>
        {
            public ICollection<ProductCategory> Resolve(Crawler.Product src, Database.Product dst, ICollection<ProductCategory> destMember, ResolutionContext context)
            {
                ICollection<ProductCategory> result = new List<ProductCategory>();
                foreach (var cat in src.Categories)
                {
                    result.Add(
                      new ProductCategory
                      {
                          Category = new Database.Category { InternalName = cat.Name },
                          Product = dst
                      }
                    );
                }

                return result;
            }
        }

        private class ContactDetailsGeoToDTOResolver : IValueResolver<ContactDetail, ContactDetailsDTO, GeolocationDTO>
        {
            public GeolocationDTO Resolve(ContactDetail src, ContactDetailsDTO dst, GeolocationDTO destMember, ResolutionContext context)
            {
                if (src.Geolocation == null)
                {
                    return null;
                }
                return new GeolocationDTO() { longitude = (float)src.Geolocation.PointOnSurface.X, latitude = (float)src.Geolocation.PointOnSurface.Y };
            }
        }

        public MappingProfile()
        {
            //From DB types to client types
            CreateMap<SearchResult, SearchResultDTO>();

            CreateMap<Database.SPriceUser, UserDTO>()
                .ForMember(dest => dest.username, opt => opt.MapFrom(src => src.ContactDetails.Name));

            CreateMap<Database.ActiveOffer, ActiveOfferDTO>();

            CreateMap<Database.Store, StoreDTO>();

            CreateMap<Database.Category, CategoryDTO>()
                .ForMember(
                    dest => dest.name,
                    opt => opt.MapFrom<CategoryResolver>()
                )
                .ForMember(dest => dest.containsProducts, opt => opt.MapFrom<CategoryDTOContainsProductsResolver>());

            CreateMap<Database.Producer, ProducerDTO>();

            CreateMap<Database.Product, ProductDTO>()
                .ForMember(
                    dest => dest.categories,
                    opt => opt.MapFrom(src => src.ProductCategories.Select(cl => cl.Category))
                );

            CreateMap<Backend.Models.Database.FavouriteListItem, FavouriteListItemDTO>();

            CreateMap<Database.Vendor, VendorDTO>()
                .ForMember(dest => dest.containsProducts, opt => opt.MapFrom<VendorDTOContainsProductsResolver>());

            CreateMap<Database.ContactDetail, ContactDetailsDTO>()
                .ForMember(
                    dest => dest.geolocation,
                    opt => opt.MapFrom<ContactDetailsGeoToDTOResolver>()
                );

            CreateMap<Database.ShoppingList, ShoppingListDTO>()
                .ForMember(
                    dest => dest.closeTime,
                    opt => opt.MapFrom(src => src.CloseTime.ToString())
                );

            CreateMap<Database.ShoppingListItem, ShoppingListItemDTO>();

            CreateMap<Database.FavouriteListItem, FavouriteListItemDTO>();

            //From Crawler types to DB types
            CreateMap<Crawler.Offer, Database.ActiveOffer>()
                .ForMember(
                    dest => dest.FromDate,
                    opt => opt.MapFrom(src => DateTime.Parse(src.FromDate))
                ).ForMember(
                    dest => dest.ToDate,
                    opt => opt.MapFrom(src => DateTime.Parse(src.ToDate))
                ).ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Crawler.Product, Database.Product>().ForMember(
                dest => dest.ProductCategories,
                opt => opt.MapFrom<ProductCategoriesFromCrawlerResolver>()
            );

            CreateMap<Crawler.Category, Database.Category>().ForMember(
                dest => dest.InternalName,
                opt => opt.MapFrom(src => src.Name)
            );

            CreateMap<Crawler.Producer, Database.Producer>();

            CreateMap<Crawler.Store, Database.Store>();

            CreateMap<Crawler.Vendor, Database.Vendor>();

            CreateMap<Crawler.ContactDetails, Database.ContactDetail>().ForMember(
                dest => dest.Geolocation,
                opt => opt.MapFrom<ContactDetailsGeoFromCrawlerResolver>()
            );

        }
    }

}
