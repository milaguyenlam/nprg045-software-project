using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using GraphQL;

namespace Backend.Models.Client {
  public class Types {
    
    #region ProducerDTO
    public class ProducerDTO {
      #region members
      [JsonProperty("name")]
      public string name { get; set; }
    
      [JsonProperty("thumbnailPath")]
      public string thumbnailPath { get; set; }
      #endregion
    }
    #endregion
    
    #region CategoryDTO
    public class CategoryDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("name")]
      public string name { get; set; }
    
      [JsonProperty("picturePath")]
      public string picturePath { get; set; }
    
      [JsonProperty("parentId")]
      public int? parentId { get; set; }
    
      [JsonProperty("containsProducts")]
      public bool containsProducts { get; set; }
      #endregion
    }
    #endregion
    
    #region ActiveOfferDTO
    public class ActiveOfferDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("fromDate")]
      public string fromDate { get; set; }
    
      [JsonProperty("toDate")]
      public string toDate { get; set; }
    
      [JsonProperty("price")]
      public float price { get; set; }
    
      [JsonProperty("discountRate")]
      public float? discountRate { get; set; }
    
      [JsonProperty("inStockCount")]
      public int? inStockCount { get; set; }
    
      [JsonProperty("isTaxed")]
      public bool? isTaxed { get; set; }
    
      [JsonProperty("product")]
      public ProductDTO product { get; set; }
    
      [JsonProperty("store")]
      public StoreDTO store { get; set; }
    
      [JsonProperty("description")]
      public string description { get; set; }
      #endregion
    }
    #endregion
    
    #region StoreDTO
    public class StoreDTO {
      #region members
      [JsonProperty("vendor")]
      public VendorDTO vendor { get; set; }
    
      [JsonProperty("openingHours")]
      public string openingHours { get; set; }
    
      [JsonProperty("contactDetails")]
      public ContactDetailsDTO contactDetails { get; set; }
      #endregion
    }
    #endregion
    
    #region VendorDTO
    public class VendorDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("name")]
      public string name { get; set; }
    
      [JsonProperty("thumbnailPath")]
      public string thumbnailPath { get; set; }
    
      [JsonProperty("containsProducts")]
      public bool containsProducts { get; set; }
      #endregion
    }
    #endregion
    
    #region ProductDTO
    public class ProductDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("name")]
      public string name { get; set; }
    
      [JsonProperty("description")]
      public string description { get; set; }
    
      [JsonProperty("picturePath")]
      public string picturePath { get; set; }
    
      [JsonProperty("categories")]
      public IEnumerable<CategoryDTO> categories { get; set; }
    
      [JsonProperty("ean")]
      public string ean { get; set; }
    
      [JsonProperty("producer")]
      public ProducerDTO producer { get; set; }
    
      [JsonProperty("activeOffers")]
      public IEnumerable<ActiveOfferDTO> activeOffers { get; set; }
      #endregion
    }
    #endregion
    
    #region ContactDetailsDTO
    public class ContactDetailsDTO {
      #region members
      [JsonProperty("phone")]
      public string phone { get; set; }
    
      [JsonProperty("email")]
      public string email { get; set; }
    
      [JsonProperty("street")]
      public string street { get; set; }
    
      [JsonProperty("city")]
      public string city { get; set; }
    
      [JsonProperty("postCode")]
      public string postCode { get; set; }
    
      [JsonProperty("geolocation")]
      public GeolocationDTO geolocation { get; set; }
    
      [JsonProperty("ico")]
      public string ico { get; set; }
    
      [JsonProperty("country")]
      public string country { get; set; }
      #endregion
    }
    #endregion
    
    #region GeolocationDTO
    public class GeolocationDTO {
      #region members
      [JsonProperty("longitude")]
      public float longitude { get; set; }
    
      [JsonProperty("latitude")]
      public float latitude { get; set; }
      #endregion
    }
    #endregion
    
    #region SearchResultDTO
    public class SearchResultDTO {
      #region members
      [JsonProperty("vendors")]
      public IEnumerable<VendorDTO> vendors { get; set; }
    
      [JsonProperty("categories")]
      public IEnumerable<CategoryDTO> categories { get; set; }
    
      [JsonProperty("products")]
      public IEnumerable<ProductDTO> products { get; set; }
      #endregion
    }
    #endregion
    
    #region RegisterFormInput
    public class RegisterFormInput {
      #region members
      [JsonRequired]
      public string username { get; set; }
    
      [JsonRequired]
      public string email { get; set; }
    
      [JsonRequired]
      public string password { get; set; }
      #endregion
    
      #region methods
      public dynamic GetInputObject()
      {
        IDictionary<string, object> d = new System.Dynamic.ExpandoObject();
    
        var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
        foreach (var propertyInfo in properties)
        {
          var value = propertyInfo.GetValue(this);
          var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;
    
          var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;
          if (requiredProp || value != defaultValue)
          {
            d[propertyInfo.Name] = value;
          }
        }
        return d;
      }
      #endregion
    }
    #endregion
    
    #region AuthResponse
    public class AuthResponse {
      #region members
      [JsonProperty("status")]
      public bool status { get; set; }
    
      [JsonProperty("message")]
      public string message { get; set; }
    
      [JsonProperty("token")]
      public string token { get; set; }
      #endregion
    }
    #endregion
    
    #region UserDTO
    public class UserDTO {
      #region members
      [JsonProperty("username")]
      public string username { get; set; }
    
      [JsonProperty("email")]
      public string email { get; set; }
      #endregion
    }
    #endregion
    public enum FilterType {
      ALL,
      VENDOR,
      CATEGORY
    }
    
    public enum ShoppingListItemState {
      NEW,
      DONE
    }
    
    
    #region ShoppingListItemDTO
    public class ShoppingListItemDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("state")]
      public ShoppingListItemState state { get; set; }
    
      [JsonProperty("activeOffer")]
      public ActiveOfferDTO activeOffer { get; set; }
    
      [JsonProperty("quantity")]
      public int quantity { get; set; }
      #endregion
    }
    #endregion
    
    #region ShoppingListDTO
    public class ShoppingListDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("closeTime")]
      public string closeTime { get; set; }
      #endregion
    }
    #endregion
    
    #region FavouriteListItemDTO
    public class FavouriteListItemDTO {
      #region members
      [JsonProperty("id")]
      public int id { get; set; }
    
      [JsonProperty("product")]
      public ProductDTO product { get; set; }
      #endregion
    }
    #endregion
    
    #region ShoppingListItemAddInput
    public class ShoppingListItemAddInput {
      #region members
      [JsonRequired]
      public int activeOfferId { get; set; }
    
      [JsonRequired]
      public int quantity { get; set; }
      #endregion
    
      #region methods
      public dynamic GetInputObject()
      {
        IDictionary<string, object> d = new System.Dynamic.ExpandoObject();
    
        var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
        foreach (var propertyInfo in properties)
        {
          var value = propertyInfo.GetValue(this);
          var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;
    
          var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;
          if (requiredProp || value != defaultValue)
          {
            d[propertyInfo.Name] = value;
          }
        }
        return d;
      }
      #endregion
    }
    #endregion
    
    #region ShoppingListItemUpdateInput
    public class ShoppingListItemUpdateInput {
      #region members
      [JsonRequired]
      public int id { get; set; }
    
      public int? quantity { get; set; }
    
      public ShoppingListItemState? state { get; set; }
      #endregion
    
      #region methods
      public dynamic GetInputObject()
      {
        IDictionary<string, object> d = new System.Dynamic.ExpandoObject();
    
        var properties = GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
        foreach (var propertyInfo in properties)
        {
          var value = propertyInfo.GetValue(this);
          var defaultValue = propertyInfo.PropertyType.IsValueType ? Activator.CreateInstance(propertyInfo.PropertyType) : null;
    
          var requiredProp = propertyInfo.GetCustomAttributes(typeof(JsonRequiredAttribute), false).Length > 0;
          if (requiredProp || value != defaultValue)
          {
            d[propertyInfo.Name] = value;
          }
        }
        return d;
      }
      #endregion
    }
    #endregion
    
    #region Query
    public class Query {
      #region members
      [JsonProperty("activeProducts")]
      public IEnumerable<ProductDTO> activeProducts { get; set; }
    
      [JsonProperty("product")]
      public ProductDTO product { get; set; }
    
      [JsonProperty("vendors")]
      public IEnumerable<VendorDTO> vendors { get; set; }
    
      [JsonProperty("searchResult")]
      public SearchResultDTO searchResult { get; set; }
    
      [JsonProperty("authenticate")]
      public AuthResponse authenticate { get; set; }
    
      [JsonProperty("currentUser")]
      public UserDTO currentUser { get; set; }
    
      [JsonProperty("topLevelCategories")]
      public IEnumerable<CategoryDTO> topLevelCategories { get; set; }
    
      [JsonProperty("subCategories")]
      public IEnumerable<CategoryDTO> subCategories { get; set; }
    
      [JsonProperty("categories")]
      public IEnumerable<CategoryDTO> categories { get; set; }
    
      [JsonProperty("shoppingListItems")]
      public IEnumerable<ShoppingListItemDTO> shoppingListItems { get; set; }
    
      [JsonProperty("shoppingLists")]
      public IEnumerable<ShoppingListDTO> shoppingLists { get; set; }
    
      [JsonProperty("favouriteList")]
      public IEnumerable<FavouriteListItemDTO> favouriteList { get; set; }
      #endregion
    }
    #endregion
    
    #region Mutation
    public class Mutation {
      #region members
      [JsonProperty("register")]
      public AuthResponse register { get; set; }
    
      [JsonProperty("addToShoppingList")]
      public ShoppingListItemDTO addToShoppingList { get; set; }
    
      [JsonProperty("updateShoppingListItem")]
      public ShoppingListItemDTO updateShoppingListItem { get; set; }
    
      [JsonProperty("removeFromShoppingList")]
      public ShoppingListItemDTO removeFromShoppingList { get; set; }
    
      [JsonProperty("removeShoppingList")]
      public ShoppingListDTO removeShoppingList { get; set; }
    
      [JsonProperty("archiveShoppingList")]
      public ShoppingListDTO archiveShoppingList { get; set; }
    
      [JsonProperty("addToFavouriteList")]
      public FavouriteListItemDTO addToFavouriteList { get; set; }
    
      [JsonProperty("removeFromFavouriteList")]
      public FavouriteListItemDTO removeFromFavouriteList { get; set; }
      #endregion
    }
    #endregion
  }
  
}
