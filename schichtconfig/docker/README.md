# Docker
The docker-compose in this file includes a MariaDB image, which establishes the Database setup for the overall project.

# Docker commands for server
## Specific commands

### Find docker compose file location
```bash
find / -name docker-compose.yml 2>/dev/null
```

### Check live status for all containers
```bash
docker stats
```

### Check a container's logs
```bash
docker logs <container-name>
```

### Check specific app logs (For backend only)
```bash
docker exec -it <container-name> tail -f /app/logs/<java-app-name>.log
```

## CRUD for containers
### Bring up containers
```bash
docker-compose -f .\docker-compose-test.yml up --build
```

### Bring down -> Stop and remove containers
```bash
docker-compose -f .\docker-compose-test.yml down
```

### Stop containers
```bash
docker-compose -f .\docker-compose-test.yml stop
```

### Remove containers
```bash
docker-compose -f .\docker-compose-test.yml rm
```