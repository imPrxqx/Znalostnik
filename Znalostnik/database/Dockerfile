FROM postgres:17.4

RUN apt-get update 
RUN apt-get install -y iputils-ping
RUN apt-get -y install postgresql-16-cron && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./init.sql /docker-entrypoint-initdb.d/

