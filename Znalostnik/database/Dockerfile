FROM postgres:17.4

RUN apt-get update 
RUN apt-get install -y iputils-ping

COPY ./init.sql /docker-entrypoint-initdb.d/