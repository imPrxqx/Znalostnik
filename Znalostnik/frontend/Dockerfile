FROM node:22.16.0 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

RUN apt-get update 
RUN apt-get install -y iputils-ping

FROM nginx:1.28.0
COPY --from=build /src/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]