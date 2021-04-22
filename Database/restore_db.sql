CREATE DATABASE SPrice
RESTORE DATABASE SPrice FROM DISK =
"/SPrice.bak"
WITH REPLACE,
MOVE "SPrice" TO "/var/opt/mssql/data/SPrice.mdf",
MOVE "SPrice_log" TO "/var/opt/mssql/data/SPrice_log.ldf"