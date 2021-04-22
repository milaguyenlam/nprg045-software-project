using System.Collections.Generic;
using Backend.Repositories;
using System.Net.Http;
using System;
using Backend.Models.Database;
using Microsoft.Extensions.Configuration;
using Backend.Models.AppSearch;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text;
using static Backend.Models.Client.Types;
using System.Linq;
using Microsoft.Extensions.Logging;
using Backend.Common;

namespace Backend.Services
{
    public interface ISearchService
    {
        Task<SearchResult> SearchForAsync(string searchText);
    }

    public class SearchService : ISearchService
    {
        private double searchThreshold;
        private readonly IRepositoryContext repositoryContext;
        public SearchService(IRepositoryContext repositoryContext, IConfiguration configuration)
        {
            this.repositoryContext = repositoryContext;
            searchThreshold = configuration.GetASSearchThreshold();
        }

        public async Task<SearchResult> SearchForAsync(string text)
        {
            var query = new BaseSearchRequestContent(text);
            return await repositoryContext.AppSearch.SearchFor(query, searchResponse =>
            {
                return ConstructSearchResult(searchResponse.results);
            });
        }

        private SearchResult ConstructSearchResult(IEnumerable<SearchResponse.ResultDocument> documents)
        {
            var asDocMappings = repositoryContext.ASDocMappings;
            var searchResult = new SearchResult();
            foreach (var doc in documents)
            {
                CategoryTran categoryTran;
                Vendor vendor;
                Product product;
                string docId = doc.id.raw;
                if (doc._meta.score < searchThreshold)
                {
                    continue;
                }
                if (asDocMappings.TryMapTo<CategoryTran>(docId, repositoryContext.CategoryTrans, SearchEntityType.CATEGORY, out categoryTran))
                {
                    searchResult.categories.Add(categoryTran.Category);
                }
                else if (asDocMappings.TryMapTo<Vendor>(docId, repositoryContext.Vendors, SearchEntityType.VENDOR, out vendor))
                {
                    searchResult.vendors.Add(vendor);
                }
                else if (asDocMappings.TryMapTo<Product>(docId, repositoryContext.Products, SearchEntityType.PRODUCT, out product))
                {
                    searchResult.products.Add(product);
                }
            }
            return searchResult;
        }
    }
}