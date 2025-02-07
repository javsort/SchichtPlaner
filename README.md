# SchichtPlaner
Software Design Studio Project III

Welcome to SchichtPlaner, a Java-based web-app delivered through React for the front-end and supported on Springboot + MariaDB for backend functionality.

This application is currently being designed and built through a CI/CD workflow enabled by an external server, so all deployments are done here, via GitHub Actions workflows.

This README is a guide to the repository, where you'll find the following folders and helping sections:

**:warning:! For deployment instructions, head down to the Schichtconfig section below**

## Live Application Access
The application running on server can be accessed through here! `http://138.199.161.219:3000/login`

## Tools currenly used:
**:warning:!** - The tools marked with a '*' are the ones needed at your local machine before deployment

### - Frontend
- The frontend is running currently thanks to:
    - REACT
    - Node.js * - v18.20.6 (on server)
    - npm * - v. 10.8.2 (on server)

### - Backend
- The backend is running currently thanks to:
    - Java - v.21 *
    - Apache Maven - v.3.6.3 *
    - SpringBoot - v.3.3.5
    - MariaDB - v.11.6.2

### - DevOps
- For deployments and containerization, the app's setup is being delivered by:
    - GitHub Actions
        - Perform deployments, purge & stop containers
    - Docker Daemon - v.27.5.1 *
        - Containerization, overall app being served by the platform on a separate server running containers

## Schichtconfig - [/schichtconfig](./schichtconfig/)
Here, you'll find relevant docker setup files and scripts which help ease-out the deployment process.

Under the [`/docker`](./schichtconfig/docker/) folder, there's a pertinent README with details on what's in the docker compose and helpful commands to check logs, bring down containers and perform other relevant tasks on the server.

Regarding the scripts, only [`build-n-run-local.bat`](./schichtconfig/automation-scripts/build-n-run-local.bat) / [`build-n-run-local.sh`](./schichtconfig/automation-scripts/build-n-run-local.sh) is intended to be used outside the server environment Which basically does a clean maven install of the packages and deploys the MariaDB container along with the application's backend & front-end containers to check locally for updates.

### Local Deployment
**:warning:!** - Remember to run these scripts directly from the [`./schichtconfig/automation-scripts/`](./schichtconfig/automation-scripts/) folder

- For deployment on **Linux / MacOS**:
```sh
$ chmod +x ./build-n-run-local.sh

$ ./build-n-run-local.sh
```
**:warning:!** - build-n-run-local.sh already gives the `chmod` permissions to the maven wrapper, so it is only needed to give it once to this script.

- For deployment on **Windows**:
```cmd
./build-n-run-local.bat
```

Whenever running locally, to check the front-end, once the application is built and running, access the site through: `http://localhost:3000`

### Production Deployment
On the server end, the GitHub Workflows described above take charge in all the deployment operations.

To deploy on production follow these next steps:
1. Open the repository, through this [link](https://github.com/javsort/SchichtPlaner)
2. Head to the `Actions` tab from the repository menu
3. To deploy...
    - All containers:
        1. Click on the workflow titled [`CI/CD Pipeline - All Containers`](https://github.com/javsort/SchichtPlaner/actions/workflows/pipeline-cicd.yml)
        2. Click on the `Run workflow` button, and then `Run workflow` again.
        3. Done! The application will be deployed.
    - A specific container:
        1. Click on the workflow titled [`CI/CD Pipeline - Specific Container`](https://github.com/javsort/SchichtPlaner/actions/workflows/pipeline-cicd.yml)
        2. Click on the `Run workflow` button
        3. You will be prompted to enter the *'Name of the container'*, please make sure the container's name matches with its name on the [docker-compose](./schichtconfig/docker/docker-compose.yml)
        4. Once written the name of the cotnainer, click on `Run workflow` again.
        3. Done! The specified container will be deployed.

The remaining scripts are to be used by the containers themselves or to connect to the server.

**:warning:!** - Whenever running access to the servers you still need a password to login, so only do it if you have that.

## .Github - [/.github](./.github)
Here you'll find the Github workflow files which are in charge of the CI/CD deployment process (specifically at [`pipeline-cicd.yml`](./.github/workflows/pipeline-cicd.yml) & at [`re-reploy-container.yml`](./.github/workflows/re-reploy-container.yml))

Also with it, two more helping workflows, [`stop-alles.yml`](./.github/workflows/stop-alles.yml) and [`purge-containers.yml`](./.github/workflows/purge-containers.yml) which as their name establish, they either stop the running containers or purge the unused files and data by the Docker Daemon.

## Planner-Backend - [/planner-backend](./planner-backend/)
Here, you'll find all the Java files that support the backend.

According to the current architecture design, the backend of the application is divided into different modules or containers.

The modules divide as follows:
| Container Name       | Java Module Name                                       |
|:--------------------:|:------------------------------------------------------:|
| planner-logic-gate   | [logicGate](./planner-backend/modules/logicGate/)      |
| planner-scheduler    | [scheduler](./planner-backend/modules/scheduler/)      |
| planner-auth         | [auth](./planner-backend/modules/auth/)                |
| Coming Soon!         | -                                                      |

To build the backend individually, 

## Planner-Frontend - [/planner-frontend](./planner-frontend/)
Here, you'll find all the files corresponding to the front-end. 

The front-end is currently running based on React, which is in one container, built from a single [Dockerfike](./planner-frontend/Dockerfile)