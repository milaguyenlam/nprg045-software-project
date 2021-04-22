using static Backend.Models.Client.Types;
using FluentValidation;


namespace Backend.Models.Client
{
    public class RegistrationValidator : AbstractValidator<RegisterFormInput>
    {
        public RegistrationValidator()
        {
            RuleFor(x => x.email).Length(5, 50).WithMessage("The email is too short or too long");
            RuleFor(x => x.email).EmailAddress().WithMessage("The email is not of correct format");
            RuleFor(x => x.username).Length(1, 30).WithMessage("The username is too short or too long");
            RuleFor(x => x.username).Must(BeCorrectCharacter)
                .WithMessage("The username contains invalid characters");
            RuleFor(x => x.password).MinimumLength(4).WithMessage("The password is too short, must be at least 4 characters");
        }

        private bool BeCorrectCharacter(string username)
        {
            foreach (var c in username)
            {
                if (!Backend.Models.Database.SPriceUser.AllowedUserNameCharacters.Contains(c))
                    return false;
            }
            return true;
        }
    }

}