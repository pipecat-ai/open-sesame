> [!CAUTION]
> This repo is no longer maintained. Checkout [pipecat-examples](https://github.com/pipecat-ai/pipecat-examples) for recent demos and example code. 

<img alt="open-sesame" width="480px" height="auto" src="./docs/sesame-banner.png">

# Open Sesame

Open Source multi-modal LLM environment. Host your own web and mobile chat interface, powered by real-time bots that provide voice AI interactivity with an emphasis on:

- Using any model for any conversation thread
- Data ownership
- Great voice integration
- Open source and extensibility

## Table of Contents

- [Quickstart](#quickstart)
- [CLI Commands](#open-sesame-cli)
- [Overview and Concepts](#overview-and-concepts)
  - [Database Setup](#database-setup)
  - [Project Structure](#project-structure)
  - [API](#api)
  - [Workspaces](#workspaces)
  - [Services](#services)
  - [Authentication](#authentication)
- [Client Apps](#client-apps)
- [Core Technologies](#core-technologies)

## Quickstart

### Prerequisites

- Python 3.10 or higher
- Database supporting async sessions
  - Storage is used for user accounts, service keys, workspace settings and conversation history. Currently, the app requires PostgresSQL, but more database types are planned for the future.
- API keys for:
  - Large Language Model provider
  - Text-to-Speech provider
  - Speech-to-Text provider
  - Real-time media transport

### Installation Steps

1. **Install Dependencies**
```bash
python -m venv venv
source venv/bin/activate  # Or OS-specific activation
pip install -r sesame/dev-requirements.txt
cd sesame/
```

2. **Configure Environment**
```bash
python sesame.py init
```
This creates a `.env` file. Alternatively, copy `sesame/env.example` to `sesame/.env` and configure manually.

3. **Set Up Database**

```bash
# Note: optional, if you skipped this step during init
python sesame.py init-db
```

... or manually, set these environment variables:
```
SESAME_DATABASE_ADMIN_USER="postgres"
SESAME_DATABASE_ADMIN_PASSWORD=""
SESAME_DATABASE_NAME="postgres"
SESAME_DATABASE_HOST="localhost"
SESAME_DATABASE_PORT="5432"
SESAME_DATABASE_USER="sesame"
SESAME_DATABASE_PASSWORD="your-strong-password"
```

> 💡 Ensure you are using a database that accepts session mode typically available on port `5432`. If you are using Supabase, the URL provided in the settings panel defaults to "transaction mode". See [Database setup](#database-setup) for details.

4. **Test Database Connection**
```bash
python sesame.py test-db --admin  # Test admin credentials
python sesame.py run-schema       # Apply database schema
python sesame.py test-db          # Test user credentials
```
> 💡 The Open Sesame CLI will not create the database for you. If the database does not exist (if you are using a local psql, for example), please ensure to run `CREATE DATABASE dbname;` where `dbname` matched your `SESAME_DATABASE_NAME`.

5. **Create User**
```bash
python sesame.py create-user
```

You must have a least one user account in order to generate a token (used to query the API.)

6. **Launch Application**
```bash
python sesame.py run
```
Visit the provided URL (e.g., `http://127.0.0.1:8000`) to access the dashboard.

### Troubleshooting

- Verify `.env` configuration
- Test database credentials
- Run tests: `PYTHONPATH=. pytest tests/ -s -v`

Manual server launch:
```bash
python -m uvicorn webapp.main:app --reload
```

### Run a client

See [Client Apps](#client-apps) section to start chatting to a bot!

## CLI Commands

```bash
python sesame.py --help          # Show available commands
python sesame.py init            # Create .env file
python sesame.py init-db         # Configure database
python sesame.py test-db         # Test database connection
python sesame.py run-schema      # Apply database schema
python sesame.py create-user     # Create new user
python sesame.py run             # Launch application
python sesame.py services        # List registered services
```

## Overview and Concepts

### Database Setup

Requires PostgreSQL with extensions specified in `schema/postgresql.sql`. Cloud-hosted options like Render or Supabase in production. See [database documentation](./docs/database.md) for details.

### Project Structure

Core modules:
- `webapp`: FastAPI routes for authentication and database communication
- `bots`: Pipecat bot pipelines for inference and voice communication
- `common`: Shared libraries

### API

The `webapp` must be running in order for your client and bots to function. 

It defines an API that exposes several HTTP routes, such as workspace or conversation creation.

```
python sesame.py run
```

Swagger docs are available at `/docs`, e.g. `http://localhost:8000/docs`. You must authenticate requests via with a valid user token.
### Workspaces

Workspaces define the environment in which you interact with your bot. They contain:

- Conversations and messages
- Config options for your bot pipelines
- Optional: workspace specific services and keys (see [services](s#ervices) section below.)

Workspaces are unique per user, and you can create as many as you like to support various use-cases. All the clients in this repo support initial workspace configuration steps.

### Services

Open Sesame bots require that you configure services and their associated API keys and required config options.

Single-turn HTTP bots require:

- `llm` (e.g. OpenAI, Together AI, Anthropic etc.)

Realtime voice bots require:

- `transport` (e.g. Daily)
- `llm` (e.g. OpenAI, Together AI, Anthropic etc.)
- `stt` (e.g. Deepgram, Azure etc.)
- `tts` (e.g. Cartesia, ElevenLabs etc.)

You can configure services at either:
 - **user level**
    - Accessible across all user workspaces.

 - **workspace level**
    - Only accessible for that specific workspace. This is useful if you want to override a service key or config option within the context of a specific workspace.

### Authentication

All requests require valid user tokens. See [authentication documentation](./docs/authentication.md).

## Client Apps

Available clients:
- [Web](./client/web/README.md)
- [Android](./client/android/README.md)
- [iOS](./client/ios/README.md)

Coming soon:
- Command-line interface

## Core Technologies

Built with:
- [Pipecat](https://www.pipecat.ai) - Realtime bot pipelines
- [RTVI](https://github.com/pipecat-ai/rtvi-client-web) - Client-Bot interface standard
