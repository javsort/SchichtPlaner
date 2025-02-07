# SchichtPlaner
Software Design Studio Project III

Welcome to SchichtPlaner, a Java-based web-app delivered through React for the front-end and supported on Springboot + MariaDB for backend functionality.

This application is currently being designed and built through a CI/CD workflow enabled by an external server, so all deployments are done here, via GitHub Actions workflows.

This README is a guide to the repository, where you'll find the following folders:

## Current Front-End Access

## .Github - [/.github](./.github)
Here you'll find the Github workflow files which are in charge of the CI/CD deployment process (specifically at [`pipeline-cicd.yml`](./.github/workflows/pipeline-cicd.yml) & at [`re-reploy-container.yml`](./.github/workflows/re-reploy-container.yml))

Also with it, two more helping workflows, [`stop-alles.yml`](./.github/workflows/stop-alles.yml) and [`purge-containers.yml`](./.github/workflows/purge-containers.yml) which as their name establish, they either stop the running containers or purge the unused files and data by the Docker Daemon.

## Planner-Backend - [/planner-backend](./planner-backend/)
Here, you'll find all the Java files that support the backend.

According to the current architecture design, the backend of the application is divided into different modules or containers.

The modules divide as follows:
- [logicGate](./planner-backend/modules/logicGate/)
- [scheduler](./planner-backend/modules/scheduler/)
- [auth](./planner-backend/modules/auth/)
- [to-update]

## Planner-Frontend - [/planner-frontend](./planner-frontend/)
Here, you'll find all the files corresponding to the front-end. 

The front-end is currently running based on React, which is in one container, built from a single [Dockerfike](./planner-frontend/Dockerfile)

## Schichtconfig - [/schichtconfig](./schichtconfig/)
Here, you'll find relevant docker setup files and scripts which help ease-out the deployment process.

Under the [`/docker`](./schichtconfig/docker/) folder, there's a pertinent README with details on what's in the docker compose and helpful commands to check logs, bring down containers and perform other relevant tasks on the server.

Regarding the scripts, only [`build-n-run-local.bat`](./schichtconfig/automation-scripts/build-n-run-local.bat) is intended to be used outside the server environment Which basically does a clean maven install of the packages and deploys the MariaDB container along with the application's backend & front-end containers to check locally for updates.

- Apologizes in advance for lacking a .sh version this file... Coming soon.

On the server end, the GitHub Workflows described above take charge in all the deployment operations.

The remaining scripts are to be used by the containers themselves or to connect to the server.

**!** - Whenever running access to the servers you still need a password to login, so only do it if you have that.

## Tools currenly used:

### - Frontend
- The frontend is running currently thanks to:
    - REACT

### - Backend
- The backend is running currently thanks to:
    - Java - v.21
    - Apache Maven - v.3.6.3
    - SpringBoot - v.3.3.5
    - MariaDB - v.11.6.2

### - DevOps
- For deployments and containerization, the app's setup is being delivered by:
    - GitHub Actions -> perform deployments, purge & stop containers
    - Docker -> containerization, overall app being served by the platform on a separate server running containers
