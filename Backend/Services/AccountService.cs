using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Models.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Backend.Common;
using static Backend.Models.Client.Types;
using Backend.Repositories;

namespace Backend.Services
{
    public interface IAccountService
    {
        Task<SPriceUser> GetCurrentUser(HttpContext httpContext);
        Task<AuthResponse> Authenticate(string email, string password);
        Task<AuthResponse> Register(RegisterFormInput registerForm, IEnumerable<string> roles);
    }
    public class AccountService : IAccountService
    {
        private readonly UserManager<SPriceUser> userManager;
        private readonly IConfiguration configuration;
        private readonly IRepositoryContext repositoryContext;

        public AccountService(UserManager<SPriceUser> userManager, IRepositoryContext repositoryContext, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.configuration = configuration;
            this.repositoryContext = repositoryContext;
        }

        public async Task<SPriceUser> GetCurrentUser(HttpContext httpContext)
        {
            var user = await userManager.GetUserAsync(httpContext.User);
            user.ContactDetails = repositoryContext.ContactDetails.GetByPrimaryKeys(user.ContactDetailsId);
            return user;
        }

        public async Task<AuthResponse> Authenticate(string email, string password)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user != null && await userManager.CheckPasswordAsync(user, password))
            {
                return new AuthResponse
                {
                    status = true,
                    message = "User successfully logged in!",
                    token = await GenerateAccessToken(user)
                };

            }

            if (user == null)
            {
                return new AuthResponse
                {
                    status = false,
                    message = "Email address not found!",
                    token = null
                };
            }

            return new AuthResponse
            {
                status = false,
                message = "Invalid password!",
                token = null
            };
        }
        public async Task<AuthResponse> Register(RegisterFormInput registerForm, IEnumerable<string> roles)
        {
            var extraRoles = roles.Except(SPriceUserRole.roles);
            if (extraRoles.Any())
            {
                return FailedRegistration($"Roles {string.Join(", ", extraRoles)} don't exist.");
            }

            var userExists = await userManager.FindByEmailAsync(registerForm.email);
            if (userExists != null)
            {
                return FailedRegistration($"User with {registerForm.email} already exists!");
            }

            var user = new SPriceUser(
                registerForm.email,
                registerForm.username,
                Guid.NewGuid().ToString()
            );
            var userCreateResult = await userManager.CreateAsync(user, registerForm.password);
            if (!userCreateResult.Succeeded)
            {
                var errors = userCreateResult.Errors.Select(err => err.Code + ": " + err.Description + ". ");
                return FailedRegistration($"User creation failed! {String.Join(", ", errors)}");
            }

            var contactDetail = repositoryContext.ContactDetails.Get(c => c.Email == user.NormalizedEmail
                                    && registerForm.username == c.Name);
            if (user.ContactDetailsId == null && contactDetail != null)
            {
                user.ContactDetailsId = contactDetail.Id;
                await userManager.UpdateAsync(user);
            }

            var roleAssignResult = await userManager.AddToRolesAsync(user, roles);
            if (!roleAssignResult.Succeeded)
            {
                await userManager.DeleteAsync(user);
                return FailedRegistration("User registration failed! Role could not be assigned!");
            }

            return new AuthResponse
            {
                status = true,
                message = $"User {registerForm.email} as " + string.Join(", ", roles) + " registered successfully!",
                token = await GenerateAccessToken(user)
            };
        }

        private static AuthResponse FailedRegistration(string errorMessage)
        {
            return new AuthResponse
            {
                status = false,
                message = errorMessage,
                token = null
            };
        }

        private async Task<string> GenerateAccessToken(SPriceUser user)
        {
            var roles = await userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetSJK()));

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                "issuer",
                "audience",
                claims,
                expires: DateTime.Now.AddHours(
                    int.Parse(configuration["Security:TokenExpirationHours"])
                ),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}