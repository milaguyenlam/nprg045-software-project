## Run dockerized solution
Service-name can be found in docker-compose file inside ./Shared/Docker.
If service-name arg is omitted, the whole solution is launched.
Note that you need to have DockerHub and Docker installed on your system.

- `cd ./Shared/Deployment`
- `docker-compose up --build --always-recreate-deps --remove-orphans -- <service-name>`

## Howto's
There is a readme.md file inside every component folder (e.g. ./Backend) describing corresponding processes. 