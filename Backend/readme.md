# Tutorials

## Generating DB entities to EF

- dotnet ef dbcontext scaffold Name=Default Microsoft.EntityFrameworkCore.SqlServer --force -o Models/Database -c "SPriceContext"

## Migrating Identity related tables to DB
Make sure you have your database up an running (and connection string is correctly set up to connect to the running database)

- dotnet ef migrations add CreateIdentity --context SPriceIdentityContext
- dotnet ef database update --context SPriceIdentityContext

## Running locally
You can run the backend app locally using `dotnet run` command.
Note that for the project to run correctly `dotnet restore` needs to be executed prior to `dotnet run`.