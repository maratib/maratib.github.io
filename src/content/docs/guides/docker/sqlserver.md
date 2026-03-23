---
title: Setup SQLServer 
description: Setting up SQLServer in docker
date: 2026-03-23
author: maratib
featured: true
sidebar:
  order: 3
---

SQL Server is not natively supported by MacOS, so we will install it via Docker step by step.
```bash
# Pull the SQL Server docker image:
docker pull mcr.microsoft.com/mssql/server

# Create a persistent volume (optional but recommended): To prevent losing your databases if the container is stopped or removed, create a Docker volume for data persistence:
docker volume create sqlserver_data


# Run the SQL Server container: 
docker run -e "ACCEPT_EULA=Y" \
-e "MSSQL_SA_PASSWORD=Sam@4344" \
-p 1433:1433 \
--name sqlserver2022 \
-v sqlserver_data:/var/opt/mssql \
-d mcr.microsoft.com/mssql/server:2022-latest

```

Note: The password must meet SQL Server's strength requirements (at least eight characters, including uppercase, lowercase, and special characters) or the container will fail to start.