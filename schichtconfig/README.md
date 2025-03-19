# ShcichtConfig

Here, you'll find relevant docker setup files and scripts which help ease-out the deployment process.

Under the [`/docker`](./schichtconfig/docker/) folder, there's a pertinent README with details on what's in the docker compose and helpful commands to check logs, bring down containers and perform other relevant tasks on the server.

Regarding the scripts, only [`build-n-run-local.bat`](./schichtconfig/automation-scripts/build-n-run-local.bat) / [`build-n-run-local.sh`](./schichtconfig/automation-scripts/build-n-run-local.sh) is intended to be used outside the server environment Which basically does a clean maven install of the packages and deploys the MariaDB container along with the application's backend & front-end containers to check locally for updates.