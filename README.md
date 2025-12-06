# Znalostník
Ročníková a bakalářská práce na téma: Nástroj pro procvičování učiva

# Požadavky 
Verze nebo novější
- Docker 28.1.1 
- .NET 10.0
- Angular CLI: 20.0.2
- Node: 22.16.0
- Package Manager: npm 10.9.2
- Capacitator - 7.4.0
- Android studio - vývoj Android mobilní aplikace
- XCode - vývoj IOS mobilní aplikace

# Build webové aplikace
```
ng build
```
# Build mobilní aplikace
- Je předem třeba mít buildnutý webovou aplikaci, ze které se vytváří mobilní aplikace

## Verze Android
```
npx cap add android
npx cap sync android
npx cap open android
```

## Verze IOS
- Je třeba mít mac zařízení, jinak to není možné
```
npx cap add ios
npx cap sync ios
npx cap open ios
```

# Zapnutí Structurizr:
```
docker pull structurizr/lite
cd /workspace
docker run -it --rm -p 8080:8080 -v .:/usr/local/structurizr structurizr/lite
```

# Nasazení Znalostníku:
```
docker compose build
docker compose up
```

