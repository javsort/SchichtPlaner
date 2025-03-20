# Planner-Frontend

According to the current architecture design, the backend of the application is divided into different modules or containers.

The modules divide as follows:
| Container Name       | Java Module Name                                                       |
|:--------------------:|:----------------------------------------------------------------------:|
| planner-logic-gate   | [logicGate](./modules/logicGate/)                                      |
| planner-scheduler    | [scheduler](./modules/scheduler/)                                      |
| planner-auth         | [auth](./modules/auth/)                                                |
| planner-stats        | [statistics](./modules/statistics/) (work in progress)                 |
| Coming Soon!         | -                                                                      |


To run the full backend, it is sufficient to simply go back to [../schichtconfig/automation-scripts/](../schichtconfig/automation-scripts/) and run [`./no-front-buildnrun-loc.sh`](../schichtconfig/automation-scripts/no-front-buildnrun-loc.sh) / [`./no-front-buildnrun-loc.bat`](../schichtconfig/automation-scripts/no-front-buildnrun-loc.bat) depending of your OS.
```sh
$ cd schichtconfig/automation-scripts

$ chmod +x ./no-front-buildnrun-loc.sh (if on linux)

$ ./no-front-buildnrun-loc.sh

```

To exclusively install dependencies or build the backend, it is sufficient to...
```sh
$ cd schichtconfig/automation-scripts/

:: To install dependencies
$ chmod +x ./clean-install.sh (only if on linux)

$ ./clean-install.sh

:: To build and package
$ chmod +x ./build-local.sh (only if on linux)

$ ./build-local.sh

```
or...

```sh
$ cd planner-backend/

$ chmod +x ./mvnw (if on linux)

:: To install dependencies
$ ./mvnw clean install

:: To build and package
$ ./mvnw clean package
```

**:warning:!** - If on Linux, remember to give the `chmod +x <script-name.sh>` permission to any script you'd like to run.