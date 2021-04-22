using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Globalization;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;


namespace Backend.Common
{

    public static class HttpContextAccessorExtentions
    {
        public static int? GetCurrentUserID(this IHttpContextAccessor contextAccessor)
        {
            var idClaim = contextAccessor.HttpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return idClaim == null || idClaim.Value == null ? null : int.Parse(idClaim.Value);
        }
    }

    public static class StringExtensions
    {
        //removes nonalphanumber chars from a string and strips diacritics
        public static string Canonize(this string catName)
        {
            string text = System.Text.RegularExpressions.Regex.Replace(catName.Trim().ToLower(), "[^\\w]", "");
            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();
            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }
            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }

    public static class EnumerableExtensions
    {
        public static T FirstOr<T>(this IEnumerable<T> source, T alternate)
        {
            foreach (T t in source)
                return t;
            return alternate;
        }

        public static IEnumerable<T> Randomize<T>(this IEnumerable<T> source)
        {
            Random rnd = new Random();
            return source.OrderBy<T, int>((item) => rnd.Next());
        }
    }

    public static class ListExtensions
    {
        public static IEnumerable<IReadOnlyList<T>> Split<T>(this IReadOnlyList<T> list, int batchSize)
        {
            return list
                .Select((x, i) => new { Index = i, Value = x })
                .GroupBy(x => x.Index / batchSize)
                .Select(x => x.Select(v => v.Value).ToList())
                .ToList();
        }
    }
    public static class ControllerExtensions
    {
        public static string GetRequestLanguage(this Microsoft.AspNetCore.Mvc.ControllerBase controller)
        {
            var rqf = controller.Request.HttpContext.Features.Get<Microsoft.AspNetCore.Localization.IRequestCultureFeature>();
            return rqf.RequestCulture.UICulture.TwoLetterISOLanguageName.ToUpper();
        }
    }

    public static class ConfigurationExtensions
    {
        public static string GetConnectionString(this IConfiguration configuration)
        {
            return configuration["CONNECTION_STRING"] ?? configuration.GetConnectionString("Default");
        }
        public static string GetASSearchUrl(this IConfiguration configuration)
        {
            return configuration["AS_SEARCH_URL"] ?? configuration["AppSearch:Search:Uri"];
        }

        public static string GetASDocumentUrl(this IConfiguration configuration)
        {
            return configuration["AS_DOCUMENT_URL"] ?? configuration["AppSearch:Sync:Uri"];
        }

        public static string GetASSearchKey(this IConfiguration configuration)
        {
            return configuration["AS_SEARCH_KEY"] ?? configuration["AppSearch:Search:SearchKey"];
        }

        public static string GetASPrivateKey(this IConfiguration configuration)
        {
            return configuration["AS_PRIVATE_KEY"] ?? configuration["AppSearch:Sync:PrivateKey"];
        }

        public static string GetSJK(this IConfiguration configuration)
        {
            return configuration["SEC_SJK"] ?? configuration["Security:SJK"];
        }

        public static double GetASSearchThreshold(this IConfiguration configuration)
        {
            return double.Parse(configuration["AS_SEARCH_THRESHOLD"] ?? configuration["AppSearch:Search:SearchThreshold"]);
        }
        public static double GetASIdentityThreshold(this IConfiguration configuration)
        {
            return double.Parse(configuration["AS_IDENTITY_THRESHOLD"] ?? configuration["AppSearch:Search:IdentityThreshold"]);
        }
        public static double GetASSimilarityThreshold(this IConfiguration configuration)
        {
            return double.Parse(configuration["AS_SIMILARITY_THRESHOLD"] ?? configuration["AppSearch:Search:SimilarityThreshold"]);
        }
        public static int GetASSyncBatchSize(this IConfiguration configuration)
        {
            return int.Parse(configuration["AppSearch:Sync:MaxBatchSize"]);
        }
        public static int GetASSyncWaitPeriod(this IConfiguration configuration)
        {
            return int.Parse(configuration["AppSearch:Sync:WaitPeriod"]);
        }
        public static int GetASSyncMaxIterations(this IConfiguration configuration)
        {
            return int.Parse(configuration["AppSearch:Sync:MaxIterations"]);
        }
    }

}
