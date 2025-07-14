## When New package Installed

```bash
docker compose down -v
docker compose up --build
```

> the -v flag removes all the annonymous volumnes (node_moduels), forcing docker to re-create fresh one and install npm modules

> In this case, all the node_module of all Services will be re-installed

## Solution 2

Name the volume, just like tagging volume by service, and re-build the volumne

```yml
volumes:
  - ./upload-service/:/app
  - upload-service-node-modules:/app/node_modules
```

now -

```bash
docker compose stop upload-service
docker volume rm $(docker volume ls -q -f dangling=true)
docker compose up --build upload-service
```

## Best Practice - Install New modules inside docker

```bash
docker compose run upload-service npm install
```
