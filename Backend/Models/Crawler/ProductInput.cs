using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Backend.Models.Crawler
{
    public class ProductInput : Product, IValidatableObject
    {
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Categories.Count < 1)
            {
                yield return new ValidationResult(
                    $"Categories cannot be empty: {Name}",
                    new[] { "Categories" }
                );
            }
        }
    }
}