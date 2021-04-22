## Run dockerized solution
Service-name can be found in docker-compose file inside ./Shared/Docker.
If service-name arg is omitted, the whole solution is launched.
For the solution to run correctly some components require correct configuration (mostly passed by environment variables or configuration files).
Note that you need to have DockerHub and Docker installed on your system.

- `cd ./Shared/Deployment`
- `docker-compose up --build --always-recreate-deps --remove-orphans -- <service-name>`

## Howto's
There is a readme.md file inside every component's folder (e.g. ./Backend) describing tutorial for corresponding processes.
