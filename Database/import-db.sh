#WARNING: use LF
while :
do
    echo "restore starts"
    /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P $MSSQL_SA_PASSWORD -i restore_db.sql
    if [ $? -eq 0 ]
    then
        echo "restore completed"
        break
    else
        echo "server not ready yet..."
        sleep 1
    fi
done
