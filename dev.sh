docker run --name="todobotdb" --rm -d -p 5432:5432 \
-e POSTGRES_PASSWORD=todobot \
-e POSTGRES_USER=todobot \
-e POSTGRES_DB=todobot \
postgres -c log_statement=all