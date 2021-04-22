using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.AspNetCore.Localization;
using Backend.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Threading.Tasks;
using Backend.Models.AppSearch;
using Backend.Repositories;
using System.Collections.Generic;
using Backend.Common;


namespace Backend.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class Debug : Controller
    {
        private readonly IServiceProvider provider;
        private readonly IWebHostEnvironment env;
        private readonly IRepositoryContext repositoryContext;

        public Debug(IServiceProvider provider, IWebHostEnvironment env, IRepositoryContext repositoryContext)
        {
            this.provider = provider;
            this.env = env;
            this.repositoryContext = repositoryContext;
        }

        [HttpGet]
        public IActionResult TestNewVersion()
        {
            return Ok("new version!!!");
        }

        [HttpGet]
        //culture values: vi-VN, cs-CZ
        public IActionResult SetLanguage(string culture, string returnUrl)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
            );
            return LocalRedirect(returnUrl);
        }

        [HttpGet]
        public IActionResult ASSync()
        {
            IASSyncService asSyncService = provider.GetService<IASSyncService>();
            asSyncService.SyncASDocumentsAsync().Wait();
            return Ok("Done");
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!env.IsDevelopment())
                context.Result = NotFound();

            base.OnActionExecuting(context);
        }

        [HttpGet]
        public IActionResult Error()
        {
            var y = 0;
            var x = 1 / y;
            return Ok(x);
        }

        [HttpGet]
        public void Test()
        {
            var st = Backend.Models.AppSearch.SearchEntityType.PRODUCT;
            var t = st.IsTypeOf(new Backend.Models.Database.Product() { Name = "true" });
            var f = st.IsTypeOf(new Backend.Models.Database.Vendor() { Name = "false" });
            return;
        }

        [HttpGet]
        public string CanonizeStr(string str)
        {
            return str.Canonize();
        }

    }
}
