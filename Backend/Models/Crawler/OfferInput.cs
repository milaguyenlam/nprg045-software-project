using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using static Backend.Models.Client.Types;

namespace Backend.Models.Crawler
{
    //little workaround of the codegen
    public class Category : Categories
    { }

    public class OfferInput : Offer, IValidatableObject
    {

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Price <= 0)
            {
                yield return new ValidationResult(
                    $"Price must have positive value : {Source}",
                    new[] { "Price" }
                );
            }

            DateTime fromDate = default(DateTime);
            DateTime toDate = default(DateTime);

            if (FromDate != null && !DateTime.TryParse(FromDate, out fromDate))
            {
                yield return new ValidationResult(
                    $"FromDate is of invalid format : {Source}",
                    new[] { "FromDate" }
                );
            }

            if (ToDate != null && !DateTime.TryParse(ToDate, out toDate))
            {
                yield return new ValidationResult(
                    $"Todate is of invalid format : {Source}",
                    new[] { "Todate" }
                );
            }

            if (FromDate != null && ToDate != null && fromDate > toDate)
            {
                yield return new ValidationResult(
                    $"FromDate is later than ToDate : {Source}",
                    new[] { "FromDate", "ToDate" }
                );
            }

            if (FromDate != null && ToDate == null && fromDate > System.DateTime.Today.AddDays(1))
            {
                yield return new ValidationResult(
                    $"FromDate is too farther than tomorrow with no specified ToDate : {Source}",
                    new[] { "FromDate", "ToDate" }
                );
            }

            if (ToDate != null && toDate < System.DateTime.Today)
            {
                yield return new ValidationResult(
                    $"Todate is earlier then today : {Source}",
                    new[] { "ToDate" }
                );
            }

            if (Product.EAN != null && !Double.TryParse(Product.EAN, out _))
            {
                yield return new ValidationResult(
                    $"Invalid EAN format. It has to be numeric or null : {Source}",
                    new[] { "Product.EAN" }
                );
            }

            if (Store.ContactDetails == null || Store.ContactDetails.Geolocation == null
                || Store.ContactDetails.Geolocation.Latitude == 0 || Store.ContactDetails.Geolocation.Longitude == 0)
            {
                yield return new ValidationResult(
                    $"Missing contact details or Geolocation is invalid for a store : {Source}",
                    new[] { "Store.ContactDetails" }
                );
            }

            if (Product.Categories.Count < 1)
            {
                yield return new ValidationResult(
                    $"Product categories cannot be empty : {Source}",
                    new[] { "Product.Categories" }
                );
            }
        }
    }
}