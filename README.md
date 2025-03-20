# SchichtPlaner
Software Design Studio Project III

Welcome to SchichtPlaner, a Java-based web-app delivered through React for the front-end and supported on Springboot + MariaDB for backend functionality.

This application is currently being designed and built through a CI/CD workflow enabled by an external server, so all deployments are done here, via GitHub Actions workflows.

This README is a guide to the repository, where you'll find the following folders and helping sections:

**:warning:! For deployment instructions, head down to the Local Deployment section below**

## Live Application Access
The application running on server can be accessed through here! `http://138.199.161.219:3000/login`

- To Login, there are some sample accounts you can use right [here](./schichtconfig/Test_accounts.md)

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

## Local Deployment

> [!IMPORTANT]
> **:warning:!** - **BEFORE** performing a local deployment, be sure to check [`.env.production`](./planner-frontend/.env.production) under the `planner-frontend` folder and ensure that it looks like this:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```
This is to ensure all frontend requests make their way to the backend **LOCALLY** and not to the server.

> [!IMPORTANT]
> **:warning:!** - Remember to run these scripts directly from the [`./schichtconfig/automation-scripts/`](./schichtconfig/automation-scripts/) folder

- For deployment on **Linux / MacOS**:
```sh
$ ./build-n-run-local.sh
```
**:warning:!** - build-n-run-local.sh already gives the `chmod` permissions to the maven wrapper, so it is only needed to give it once to this script.

- For deployment on **Windows**:
```bat
./build-n-run-local.bat
```

Whenever running locally, to check the front-end, once the application is built and running, access the site through: `http://localhost:3000`

## Tests!

### Selenium Integration Tests
Selenium tests are now available for role creation and user creation. To access them, go through `/shichtconfig/integrated_selenium_tests`, or click [here](./schichtconfig/integrated_selenium_tests/)

To run them, you'll need to have python installed in your system with the necessary dependencies, and must have a running instance of `build-n-run-local` (ensure you're running this script right with the suggestions made at `Local Deployment` above this section in the README).

To run all tests it is sufficient to call directly from the `integrated_selenium_tests` folder:
```
python -m main
```

### SpringBoot Tests
If you'd like to run the build tests for the backend (even though these are run upon building), these are also automated thanks to `run_tests.bat` & `run_tests.sh`!

If on linux, again, rememnber to perform `$ chmod +x ./run_tests.sh` to ensure its runnable in your system.

For the test files themselves, be sure to visit the `/test` folders in the module. So far most being implemented at the [Auth Module](./planner-backend/modules/auth/src/test/java/com/LIT/auth/).

## Schichtconfig - [/schichtconfig](./schichtconfig/)
[Here](./schichtconfig/), you'll find relevant docker setup files and scripts which help ease-out the deployment process.

## .Github - [/.github](./.github)
[Here](./.github), you'll find all the GitHub Workflow YML files that support the backend with its pertinent README

## Planner-Backend - [/planner-backend](./planner-backend/)
[Here](./planner-backend/), you'll find all the Java files that support the backend with its pertinent README

## Planner-Frontend - [/planner-frontend](./planner-frontend/)
[Here](./planner-frontend/), you'll find all the files corresponding to the front-end with its pertinent README

## Tools currenly used:
**:warning:!** - The tools marked with a '*' are the ones needed at your local machine before deployment

### - Frontend
- The frontend is running currently thanks to:
    - REACT
    - Node.js
    - npm

### - Backend
- The backend is running currently thanks to:
    - Java
    - Apache Maven
    - SpringBoot
    - MariaDB

### - DevOps
- For deployments and containerization, the app's setup is being delivered by:
    - GitHub Actions
        - Perform deployments, purge & stop containers
    - Docker Daemon
        - Containerization, overall app being served by the platform on a separate server running containers
