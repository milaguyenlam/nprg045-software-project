using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Backend.Services;
using Backend.Common;
using Backend.Models.Crawler;
using Backend.Models.Import;

namespace Backend.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ImportController : ControllerBase
    {
        private readonly IImportService importService;
        private readonly IASSyncService asSyncService;

        public ImportController(IImportService importService, IASSyncService asSyncService)
        {
            this.importService = importService;
            this.asSyncService = asSyncService;
        }

        [HttpPost]
        public async Task<IActionResult> AddOffers([FromBody] IEnumerable<OfferInput> inputs)
        {
            var added = await importService.AddOffers(inputs);
            await asSyncService.SyncASDocumentsAsync();
            if (added)
            {
                return Ok("All offers added");
            }
            else
            {
                return Accepted("Not all offers added. See logs for details");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddProducts([FromBody] IEnumerable<ProductInput> inputs, string vendorName)
        {
            var added = await importService.AddProducts(inputs, vendorName);
            await asSyncService.SyncASDocumentsAsync();
            if (added)
            {
                return Ok("All products added");
            }
            else
            {
                return Accepted("Not all products added. See logs for details");
            }
        }

        [HttpPost]
        public IActionResult AddCategoryDefinitions([FromBody] IEnumerable<CategoryDefinition> inputs)
        {
            var added = importService.AddCategoryDefinitions(inputs);
            if (added)
            {
                return Ok("Category definitions added");
            }
            else
            {
                return ValidationProblem("Category definitions NOT added. See logs for details.");
            }
        }

        [HttpPost]
        public IActionResult AddCategoryMappings([FromBody] IEnumerable<CategoryMappingDefinition> inputs)
        {
            var added = importService.AddCategoryMappings(inputs);
            if (added)
            {
                return Ok("Category mappings added");
            }
            else
            {
                return ValidationProblem("Category mappings NOT added. See logs for details.");
            }
        }
    }

}
