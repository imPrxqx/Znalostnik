FROM nginx:1.28.0

RUN apt-get update 
RUN apt-get install -y iputils-ping

COPY default.conf /etc/nginx/conf.d/default.conf
