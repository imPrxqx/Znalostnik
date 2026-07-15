# Znalostnik

A web application for creating, managing, and running interactive exercises.
The application allows users to create custom activities, run sessions with multiple participants,
evaluate results, and use adaptive algorithms for selecting suitable activities.

## Features

- creation and editing of interactive exercises
- multiple activity types
- running exercises through live sessions
- individual and team solving 
- real-time communication between clients
- storing completed session history
- adaptive activity selection based on user performance

## Technologies

### Backend

- ASP.NET Core (.NET)
- C#
- Entity Framework Core
- PostgreSQL
- ASP.NET Core Identity
- SignalR
- Newtonsoft.Json

### Frontend

- Angular
- TypeScript
- Angular Material
- Angular CDK
- SCSS
- RxJS
- SignalR
- Chart.js
- Prettier
  
### Infrastructure

- PostgreSQL
- Node
- Nginx
- Docker
- Docker compose

## Activities

Activities are defined using JSON schemas in the application.

Each activity consists of:

- activity content definition
- answer definition
- solution definition
- evaluator for checking user responses

New activity types can be added by:

1. defining JSON schemas for each part of the activity
2. adding the JSON schemas to the appropriate folders inside `Schemas`
3. implementing an evaluator using the `IAnswerEvaluator` interface
4. creating a frontend component for rendering the new activity type
5. registering the new activity in the application configuration files `Program.cs` and `registry-activity.ts`
   
## Session Game Modes

Session game modes define the rules and flow of a running exercise session.

The application supports multiple game modes and allows adding new ones without major
changes to the existing system.

Each game mode can define:

- session flow and lifecycle
- activity selection logic
- session state management

New game modes can be added by:

1. implementing the backend `IGameMode` interface
2. creating frontend components for host and participant views
3. defining required configuration parameters
4. registering the new mode in the application configuration in files  `Program.cs` and `registry-session.ts`

## Adaptive Algorithms

The application supports adaptive activity selection based on user performance.

Implemented algorithms:

- Bayesian Knowledge Tracing
- Thompson Sampling

New adaptive algorithms can be added by:

1. implementing the backend `ISelectionAlgorithm` interface
2. defining the required algorithm state and add this state to `AlgorithmsState`
3. registering the new algorithm in file  `Program.cs`


## Deployment

### 1. Create an environment file and configure values

Create a `.env` file in the root directory:

```env
# Ports
FRONTEND_HOST_PORT=<HOST PORT>
BACKEND_HOST_PORT=<HOST PORT>
DATABASE_HOST_PORT=<HOST PORT>
ADMINER_HOST_PORT=<HOST PORT>
REVERSE_PROXY_PORT=<HOST PORT>

# Database
DATABASE_SERVER=<DATABASE SERVER>
DATABASE_NAME=<DATABASE NAME>
DATABASE_USER=<DATABASE USER>
DATABASE_PASS=<DATABASE PASSWORD>

# Backend
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_EMAIL=<GOOGLE EMAIL>
SMTP_EMAIL_PASS=<GOOGLE EMAIL APP PASSWORD>
```

### 2. Start 

```
docker compose build
docker compose up
```

