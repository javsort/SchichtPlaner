# Planner-Frontend

The front-end is running based on React, which is in one container, built from a single [Dockerfike](./Dockerfile)

To the front-end exclusively on local, it is sufficient to...
```sh
$ cd planner-frontend/

$ npm install

:: To run in dev mode
$ npm start 

:: To run in build version:
$ npm install -g serve

$ npm run build

$ serve -s build
```
