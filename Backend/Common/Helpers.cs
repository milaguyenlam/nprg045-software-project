using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Backend.Common
{
    public abstract class JsonSerializable
    {
        public virtual string ToJson()
        {
            return JsonConvert.SerializeObject(this, Formatting.Indented);
        }
    }

    public abstract class JsonDeserializable<T>
    {
        public static T FromJson(string json)
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
    }


    public static class Helpers
    {
        //from optional parameter culture. https://localhost:5001/graphql/?culture=cs-CZ or ?culture=vi-VN
        public static string GetCurrentLanguage()
        {
            return System.Threading.Thread.CurrentThread.CurrentUICulture.TwoLetterISOLanguageName;
        }
    }
}
