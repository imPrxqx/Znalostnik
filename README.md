# Znalostník
Ročníková a bakalářská práce na téma: Nástroj pro procvičování učiva

# Požadavky 
Verze nebo novější
- Docker 28.1.1 
- .NET 8
- Angular CLI: 20.0.2
- Node: 22.16.0
- Package Manager: npm 10.9.2


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

