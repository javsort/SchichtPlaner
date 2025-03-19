# .Github - /.github
Here you'll find the Github workflow files which are in charge of the CI/CD deployment process (specifically at [`pipeline-cicd.yml`](./.github/workflows/pipeline-cicd.yml) & at [`re-reploy-container.yml`](./.github/workflows/re-reploy-container.yml))

Also with it, two more helping workflows, [`stop-alles.yml`](./.github/workflows/stop-alles.yml) and [`purge-containers.yml`](./.github/workflows/purge-containers.yml) which as their name establish, they either stop the running containers or purge the unused files and data by the Docker Daemon.