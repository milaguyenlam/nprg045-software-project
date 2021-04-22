using System.Collections.Generic;
using Newtonsoft.Json;

namespace Backend.Models.Import
{

    public class Category
    {
        [JsonProperty("Name")]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = false)]
        public string Name { get; set; }

        [JsonProperty("PicturePath", Required = Newtonsoft.Json.Required.DisallowNull, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string PicturePath { get; set; }
    }

    public class CategoryDefinition
    {
        [JsonProperty("Category")]
        [System.ComponentModel.DataAnnotations.Required]
        public Category Category { get; set; }

        [JsonProperty("SubCategories")]
        [System.ComponentModel.DataAnnotations.Required]
        public IEnumerable<Category> SubCategories { get; set; }
    }
}