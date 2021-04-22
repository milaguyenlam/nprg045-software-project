using System.Collections.Generic;
using Backend.Common;
using Backend.Models;
using Newtonsoft.Json;
using System.Linq;
using Backend.Models.Database;

namespace Backend.Models.AppSearch
{
    public enum SearchEntityType
    {
        PRODUCT = 'P',
        CATEGORY = 'C',
        VENDOR = 'V'
    }

    public static class SearchEntityTypeEnumExtensions
    {
        public static string RawString(this SearchEntityType st)
        {
            switch (st)
            {
                case SearchEntityType.PRODUCT:
                    return "P";
                case SearchEntityType.CATEGORY:
                    return "C";
                case SearchEntityType.VENDOR:
                    return "V";
                default:
                    throw new KeyNotFoundException($"Nonmapped SearchEntityType field used: {st.ToString()}");
            }
        }

        public static bool IsTypeOf<T>(this SearchEntityType st, T obj)
        {
            return (st == SearchEntityType.CATEGORY && obj is Category)
                || (st == SearchEntityType.PRODUCT && obj is Product)
                || (st == SearchEntityType.VENDOR && obj is Vendor);
        }

        public static SearchEntityType FromString(string str)
        {
            if (str.Equals("P"))
                return SearchEntityType.PRODUCT;

            if (str.Equals("C"))
                return SearchEntityType.CATEGORY;

            if (str.Equals("V"))
                return SearchEntityType.VENDOR;

            throw new KeyNotFoundException($"Nonmapped SearchEntityType value used: {str}");
        }
    }

    public class ResponseASDocument
    {
        public int entityId;
        public SearchEntityType type;
        public string docId;
        public bool success;
        public ResponseASDocument(int entityId, SearchEntityType type, bool success, string docId)
        {
            this.docId = docId;
            this.entityId = entityId;
            this.type = type;
            this.success = success;
        }
    }
    public class SearchResult
    {
        public IList<Vendor> vendors = new List<Vendor>();
        public IList<Category> categories = new List<Category>();
        public IList<Product> products = new List<Product>();
    }
    public class CreateRequestASDocument
    {
        public string text;
        public int entityId;
        public SearchEntityType type;
        public CreateRequestASDocument(SearchEntityType type, int entityId, string text)
        {
            this.text = text;
            this.entityId = entityId;
            this.type = type;
        }
    }
    public class ReplaceRequestASDocument
    {
        public string newText;
        public string docId;
        public SearchEntityType type;
        public int entityId;
        public ReplaceRequestASDocument(SearchEntityType type, int entityId, string newText, string docId)
        {
            this.newText = newText;
            this.docId = docId;
            this.type = type;
            this.entityId = entityId;
        }
    }
    public class DeleteRequestASDocument
    {
        public int entityId;
        public string docId;
        public SearchEntityType type;
        public DeleteRequestASDocument(SearchEntityType type, int entityId, string docId)
        {
            this.entityId = entityId;
            this.docId = docId;
            this.type = type;
        }
    }
}