# .Github - /.github
Here you'll find the Github workflow files which are in charge of the CI/CD deployment process (specifically at [`pipeline-cicd.yml`](./workflows/pipeline-cicd.yml) & at [`re-reploy-container.yml`](./workflows/re-reploy-container.yml))

Also with it, two more helping workflows, [`stop-alles.yml`](./workflows/stop-alles.yml) and [`purge-containers.yml`](./workflows/purge-containers.yml) which as their name establish, they either stop the running containers or purge the unused files and data by the Docker Daemon.

> [!IMPORTANT]
> Remember that all github workflow files are *ONLY* runnable through this repo's main GitHub Page.