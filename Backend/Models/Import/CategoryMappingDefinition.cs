using System.Collections.Generic;
using Newtonsoft.Json;


namespace Backend.Models.Import
{
    public class MappingPair
    {
        [JsonProperty("Foreign", Required = Newtonsoft.Json.Required.DisallowNull, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string Foreign { get; set; }

        [JsonProperty("SPrice")]
        [System.ComponentModel.DataAnnotations.Required]
        public IEnumerable<string> SPrice { get; set; }

        public override bool Equals(object obj)
        {
            if ((obj is MappingPair other))
            {
                var xHash = new HashSet<string>(SPrice);
                xHash.ExceptWith(new HashSet<string>(other.SPrice));
                return Foreign == other.Foreign && xHash.Count == 0;
            }
            else
            {
                return false;
            }
        }

        public override int GetHashCode()
        {
            int hash = 0;
            foreach (var str in SPrice)
            {
                hash += str.GetHashCode();
            }
            hash += Foreign != null ? Foreign.GetHashCode() : 0;

            return hash;
        }
    }

    public class CategoryMappingDefinition
    {
        [JsonProperty("VendorName")]
        [System.ComponentModel.DataAnnotations.Required(AllowEmptyStrings = false)]
        public string VendorName { get; set; }

        [JsonProperty("VendorThumbnailPath", Required = Newtonsoft.Json.Required.DisallowNull, NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore)]
        public string VendorThumbnailPath { get; set; }

        [JsonProperty("Mapping")]
        [System.ComponentModel.DataAnnotations.Required]
        public IEnumerable<MappingPair> Mapping { get; set; }
    }
}