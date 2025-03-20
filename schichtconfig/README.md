# ShcichtConfig

Here, you'll find relevant docker setup files and scripts which help ease-out the deployment process.

## Docker
Under the [`/docker`](./docker/) folder, there's a pertinent README with details on what's in the docker compose and helpful commands to check logs, bring down containers and perform other relevant tasks on the server.

There is 2 Docker compose files:
- docker-compose.yml
This is the full docker compose file. Used currently on server and on full local builds!

- docker-compose-no-front.yml
Docker compose no front builds the entire application, **EXCEPT** the frontend container. It's with dev purposes.

## Automation-scripts
Regarding the scripts, only [`build-n-run-local.bat`](./schichtconfig/automation-scripts/build-n-run-local.bat) / [`build-n-run-local.sh`](./schichtconfig/automation-scripts/build-n-run-local.sh) is intended to be used outside the server environment Which basically does a clean maven install of the packages and deploys the MariaDB container along with the application's backend & front-end containers to check locally for updates.

Other scripts:
- ./build-local
Build all springboot's modules for the `planner-backend`

- ./clean-install
Perform a clean install for all springboot's modules for the `planner-backend`

- ./jumpstart-backend
SERVER SCRIPT. To be used by each of the spring application's Dockerfiles to ping the server and wait for it to be isntantiated so they're able to run.

- ./logonserver
SERVER SCRIPT. Simplify access to the server

- ./no-front-buildnrun-loc
Build the docker-compose-no-front.yml compose file. E.g., build the application without frontend.

- ./re-build-n-drop-container
SERVER SCRIPT. Rebuild one specific container and redeploy. To be used by github Workflows.

- ./run_tests
Run all the springboot tests!

## Integrated Selenium Tests
The integrated selenium tests folder, is for integration tests done through the Selenium tool.
Currently we are able to test the following:
    - Role - Creation / Update / Deletion
    - User - Creation / Update / Deletion
    - Shifts - (Coming soon...)