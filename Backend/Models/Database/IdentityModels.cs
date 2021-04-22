using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace Backend.Models.Database
{

    public static class SPriceUserRole
    {
        public const string Admin = "Admin";
        public const string User = "User";

        public static string[] roles = { Admin, User };

        public static bool RoleExists(string role)
        {
            return System.Array.Exists(roles, element => element.ToLower() == role.ToLower());
        }
    }

    public class SPriceUser : IdentityUser<int>
    {
        public static readonly string UsernameSeparator = ":";
        public static readonly string AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -._@+";

        public int? ContactDetailsId { get; set; }

        public virtual ContactDetail ContactDetails { get; set; }

        public SPriceUser(string email, string userName, string securityStamp)
        {
            Email = email;
            UserName = userName + UsernameSeparator + email;
            SecurityStamp = securityStamp;
        }

        private SPriceUser() { }
    }

    public class SPriceRole : IdentityRole<int>
    {
        public SPriceRole(string name) : base(name) { }
    }

    public class SPriceIdentityContext : IdentityDbContext<SPriceUser, SPriceRole, int>
    {
        public SPriceIdentityContext(DbContextOptions<SPriceIdentityContext> options)
            : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //to avoid validation failure due to not complete info about other entities and dependencies
            builder
                .Ignore<ContactDetail>();
        }
    }

}