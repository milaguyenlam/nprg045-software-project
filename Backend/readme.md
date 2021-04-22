# Tutorials

## Generating DB entities to EF

- dotnet ef dbcontext scaffold Name=Default Microsoft.EntityFrameworkCore.SqlServer --force -o Models/Database -c "SPriceContext"

## Migrating Identity related tables to DB
Make sure you have your database up an running (and connection string is correctly set up to connect to the running database)

- dotnet ef migrations add CreateIdentity --context SPriceIdentityContext
- dotnet ef database update --context SPriceIdentityContext

## Running locally
There are 2 external dependencies that the app uses, namely database(has to be in a correct format according to the solutions data model) and appsearch server. Connection to these dependencies can be configured in appsettings.Development.json (appsettings.json for production purposes - dockerized solution)
Note that for the project to run correctly `dotnet restore` needs to be executed prior to `dotnet run`.

- You can run the backend app locally using `dotnet run` command.