using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Backend.Models;
using Backend.Models.Database;
using Backend.Services;
using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using static Backend.Models.Client.Types;
using Backend.Models.Client;
using Backend.Common;
using FluentValidation;

namespace Backend.Controllers
{

    public class RootMutationType
    {
        public async Task<AuthResponse> Register(
            [Service] IAccountService accountService,
            [GraphQLNonNullType] RegisterFormInput form
        )
        {
            var validator = new RegistrationValidator();
            var results = validator.Validate(form);
            if (!results.IsValid)
            {
                return new AuthResponse
                {
                    status = false,
                    message = string.Join(", ", results.Errors.Select(vf => vf.ErrorMessage)),
                    token = null
                };
            }

            return await accountService.Register(form, new string[] { SPriceUserRole.User });
        }

        [Authorize]
        public FavouriteListItemDTO AddToFavouriteList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IFavouriteListService favouriteListService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int productId
        )
        {
            var result = favouriteListService.AddToFavouriteList((int)contextAccessor.GetCurrentUserID(), productId);
            return mapper.Map<FavouriteListItemDTO>(result);
        }

        [Authorize]
        public FavouriteListItemDTO RemoveFromFavouriteList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IFavouriteListService favouriteListService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int productId
        )
        {
            var result = favouriteListService.RemoveFromFavouriteList((int)contextAccessor.GetCurrentUserID(), productId);
            return mapper.Map<FavouriteListItemDTO>(result);
        }


        [Authorize]
        public ShoppingListItemDTO AddToShoppingList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] ShoppingListItemAddInput item
        )
        {
            var result = shoppingListService.AddToShoppingList((int)contextAccessor.GetCurrentUserID(), item);
            return mapper.Map<ShoppingListItemDTO>(result);
        }

        [Authorize]
        public ShoppingListItemDTO UpdateShoppingListItem(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] ShoppingListItemUpdateInput item
        )
        {
            var result = shoppingListService.UpdateShoppingListItem((int)contextAccessor.GetCurrentUserID(), item);
            return mapper.Map<ShoppingListItemDTO>(result);
        }

        [Authorize]
        public ShoppingListItemDTO RemoveFromShoppingList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int itemId
        )
        {
            var result = shoppingListService.RemoveFromShoppingList((int)contextAccessor.GetCurrentUserID(), itemId);
            return mapper.Map<ShoppingListItemDTO>(result);
        }

        [Authorize]
        public ShoppingListDTO ArchiveShoppingList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper
        )
        {
            var shoppingList = shoppingListService.ArchiveShoppingList((int)contextAccessor.GetCurrentUserID());
            return mapper.Map<ShoppingListDTO>(shoppingList);
        }

        [Authorize]
        public ShoppingListDTO RemoveShoppingList(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper,
            int listId
        )
        {
            var shoppingList = shoppingListService.RemoveShoppingList((int)contextAccessor.GetCurrentUserID(), listId);
            return mapper.Map<ShoppingListDTO>(shoppingList);
        }
    }


    public class RootQueryType
    {
        [Authorize]
        public async Task<UserDTO> GetCurrentUser(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IAccountService accountService,
            [Service] IMapper mapper
        )
        {
            var user = await accountService.GetCurrentUser(contextAccessor.HttpContext);
            return mapper.Map<UserDTO>(user);
        }
        public async Task<AuthResponse> Authenticate(
            [GraphQLNonNullType] string email,
            [GraphQLNonNullType] string password,
            [Service] IAccountService accountService
        )
        {
            return await accountService.Authenticate(email, password);
        }

        public IQueryable<ProductDTO> GetActiveProducts(
            [Service] IProductService productService,
            [Service] IMapper mapper,
            [Service] IHttpContextAccessor contextAccessor,
            [GraphQLNonNullType] int offset,
            [GraphQLNonNullType] int limit,
            [GraphQLNonNullType] FilterType filterType,
            IEnumerable<int> categoryIds, int? vendorId
        )
        {
            IEnumerable<Product> result = productService.GetActiveProducts(offset, limit, filterType, categoryIds, vendorId);
            return mapper.Map<IEnumerable<ProductDTO>>(result).AsQueryable();
        }

        public ProductDTO GetProduct(
            [Service] IProductService productService,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int id
        )
        {
            var userId = contextAccessor.GetCurrentUserID();
            var result = productService.GetById(id);
            if (result is null)
            {
                return null;
            }
            return mapper.Map<ProductDTO>(result);
        }

        [Authorize]
        public async Task<SearchResultDTO> GetSearchResult(
            [Service] ISearchService searchService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] string text
        )
        {
            var result = await searchService.SearchForAsync(text);
            return mapper.Map<SearchResultDTO>(result);
        }

        public IQueryable<CategoryDTO> GetTopLevelCategories(
            [Service] ICategoryService categoryService,
            [Service] IMapper mapper
        )
        {
            var result = categoryService.GetAllTopLevel();
            return mapper.Map<IEnumerable<CategoryDTO>>(result, opt => opt.Items[ResolutionContextKeys.ContainsProductsFlag] = true).AsQueryable();
        }

        public IQueryable<CategoryDTO> GetSubCategories(
            [Service] ICategoryService categoryService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int categoryId
        )
        {
            var result = categoryService.GetSubCategories(categoryId);
            return mapper.Map<IEnumerable<CategoryDTO>>(result, opt => opt.Items[ResolutionContextKeys.ContainsProductsFlag] = true).AsQueryable();
        }

        public IQueryable<CategoryDTO> GetCategories(
            [Service] ICategoryService categoryService,
            [Service] IMapper mapper,
            [GraphQLNonNullType] int productId
        )
        {
            var result = categoryService.GetCategories(productId);
            return mapper.Map<IEnumerable<CategoryDTO>>(result).AsQueryable();
        }

        public IQueryable<VendorDTO> GetVendors(
            [Service] IGetEntityService<Vendor> vendorService,
            [Service] IMapper mapper
        )
        {
            var result = vendorService.GetAll();
            return mapper.Map<IEnumerable<VendorDTO>>(result, opt => opt.Items[ResolutionContextKeys.ContainsProductsFlag] = true).AsQueryable();
        }

        [Authorize]
        public IQueryable<FavouriteListItemDTO> GetFavouriteList(
            [Service] IFavouriteListService favouriteListService,
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IMapper mapper
        )
        {
            var favouriteList = favouriteListService.GetFavouriteList((int)contextAccessor.GetCurrentUserID());
            return mapper.Map<IEnumerable<FavouriteListItemDTO>>(favouriteList).AsQueryable();
        }

        [Authorize]
        public IEnumerable<ShoppingListDTO> GetShoppingLists(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper
        )
        {
            var shoppingList = shoppingListService.GetShoppingLists((int)contextAccessor.GetCurrentUserID());
            return mapper.Map<IEnumerable<ShoppingListDTO>>(shoppingList).AsQueryable();
        }

        [Authorize]
        public IQueryable<ShoppingListItemDTO> GetShoppingListItems(
            [Service] IHttpContextAccessor contextAccessor,
            [Service] IShoppingListService shoppingListService,
            [Service] IMapper mapper,
            int? listId
        )
        {
            var shoppingListItems = shoppingListService.GetShoppingListItems((int)contextAccessor.GetCurrentUserID(), listId);
            return mapper.Map<IEnumerable<ShoppingListItemDTO>>(shoppingListItems).AsQueryable();
        }

    }
}


//Dummy namespace for GraphQL codegen compatibility
namespace GraphQL { }