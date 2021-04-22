FROM mcr.microsoft.com/mssql/server:2019-latest
USER root
COPY SPrice.bak SPrice.bak
COPY restore_db.sql restore_db.sql
COPY import-db.sh import-db.sh
RUN chmod +x import-db.sh
COPY entrypoint.sh entrypoint.sh
CMD /bin/bash ./entrypoint.sh