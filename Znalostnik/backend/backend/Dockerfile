# Na https://aka.ms/customizecontainer se dozvíte, jak si přizpůsobit kontejner ladění a jak Visual Studio používá tento dokument Dockerfile k sestavení vašich imagí pro rychlejší ladění.

# Tato fáze se používá při spuštění z VS v rychlém režimu (výchozí pro konfiguraci ladění).
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

USER root
RUN apt-get update
RUN apt-get install -y iputils-ping
RUN mkdir -p /app/keys && chown -R $APP_UID:$APP_UID /app/keys

USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Tato fáze slouží k sestavení projektu služby.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["backend/backend.csproj", "backend/"]
RUN dotnet restore "./backend/backend.csproj"
COPY . .
WORKDIR "/src/backend"
RUN dotnet build "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/build
RUN apt-get update && apt-get install -y iputils-ping

# Tato fáze slouží k publikování projektu služby, který se má zkopírovat do konečné fáze.
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Tato fáze se používá v produkčním prostředí nebo při spuštění z VS v běžném režimu (výchozí, když se nepoužívá konfigurace ladění).
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "backend.dll"]