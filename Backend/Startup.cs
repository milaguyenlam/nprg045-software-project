using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

using Backend.Repositories;
using Backend.Services;
using Backend.Models.Database;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Options;
using HotChocolate;
using Backend.Common.Logging;
using Backend.Common;
using Backend.Controllers;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Identity;


namespace Backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;

        }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<RequestLocalizationOptions>(
                options =>
                {
                    var supportedCultures = new List<CultureInfo>
                    {
                        new CultureInfo("cs-CZ"),
                        new CultureInfo("vi-VN")
                    };
                    options.DefaultRequestCulture = new RequestCulture(culture: "cs-CZ", uiCulture: "cs-CZ");
                    options.SupportedCultures = supportedCultures;
                    options.SupportedUICultures = supportedCultures;

                    options.RequestCultureProviders = new List<IRequestCultureProvider>
                    {
                        new QueryStringRequestCultureProvider(),
                        new CookieRequestCultureProvider()
                    };
                }
            );

            services
                .AddGraphQLServer()
                .AddQueryType<RootQueryType>()
                .AddMutationType<RootMutationType>()
                .AddAuthorization()
                .AddFiltering();

            services.AddDbContext<SPriceContext>(options =>
            {
                options
                    .UseLazyLoadingProxies()
                    .UseSqlServer(
                        Configuration.GetConnectionString(),
                        x => x.UseNetTopologySuite()
                    );
            });

            services.AddDbContext<SPriceIdentityContext>(options =>
            {
                options
                    .UseSqlServer(
                        Configuration.GetConnectionString()
                    );
            });

            services.AddIdentity<SPriceUser, SPriceRole>()
                .AddEntityFrameworkStores<SPriceIdentityContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 4;
                options.Password.RequiredUniqueChars = 1;
                options.User.AllowedUserNameCharacters = SPriceUser.AllowedUserNameCharacters + SPriceUser.UsernameSeparator;
                options.User.RequireUniqueEmail = true;
            });

            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateAudience = true,
                            ValidateIssuer = true,
                            ValidateIssuerSigningKey = true,
                            ValidAudience = "audience",
                            ValidIssuer = "issuer",
                            RequireSignedTokens = false,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                                Configuration.GetSJK()
                            ))
                        };

                        options.RequireHttpsMetadata = false;
                        options.SaveToken = true;
                    });

            services
                .AddHttpContextAccessor()
                .AddAutoMapper(typeof(MappingProfile))
                .AddScoped<IImportService, ImportService>()
                .AddScoped<IRepositoryContext, RepositoryContext>()
                .AddScoped<ISearchService, SearchService>()
                .AddScoped<IASSyncService, ASSyncService>()
                .AddScoped<IEntityRepository<Category>, EntityRepository<Category>>()
                .AddScoped<ICategoryService, CategoryService>()
                .AddScoped<IEntityRepository<Vendor>, EntityRepository<Vendor>>()
                .AddScoped<IGetEntityService<Vendor>, GetEntityService<Vendor>>()
                .AddScoped<IEntityRepository<Product>, EntityRepository<Product>>()
                .AddScoped<IProductService, ProductService>()
                .AddScoped<IAccountService, AccountService>()
                .AddScoped<IProductIdentityService, ProductIdentityService>()
                .AddScoped<IShoppingListService, ShoppingListService>()
                .AddScoped<IFavouriteListService, FavouriteListService>()
                .AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory, IServiceProvider serviceProvider)
        {
            loggerFactory.AddFile(
                Configuration.GetSection("Logging")
            );
            app.UseStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseMiddleware<RequestResponseLoggingMiddleware>();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error.html");
            }

            var locOptions = serviceProvider.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value)
                .UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseEndpoints(endpoints =>
                {
                    endpoints.MapGraphQL();
                    endpoints.MapControllers();
                });


            var roleManager = serviceProvider.GetRequiredService<RoleManager<SPriceRole>>();
            foreach (var role in SPriceUserRole.roles)
            {
                var taskRoleExists = roleManager.RoleExistsAsync(role);
                if (!taskRoleExists.Result)
                {
                    roleManager.CreateAsync(new SPriceRole(role)).Wait();
                }
            }

        }
    }

}
