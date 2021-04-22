## Client GraphQL codegen

- install npm from https://nodejs.org/en/download/; add the path (usually C:\Program Files\nodejs) to npm to environment variables

- cd Shared/Codegen
- npm install (for the 1st time only)
- npm run generate-client

## Crawler JSON schema codegen

Note that for nswag (csharp codegen) dotnetcore2.1 has to be installed
For details, see ./Shared/CodeGen/package.json

- cd Shared/Codegen
- npm install (for the 1st time only)
- pip install -r requirements.txt" (for the 1st time only)
- npm run generate-crawler 