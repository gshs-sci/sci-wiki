## SCI wiki
This repository contains the source code of SCI wiki.

## Before Getting Started
docker and docker-compose must be installed

## Getting Started

After cloning this repository to your local development environment, build and start the necessary containers by running:

```bash
docker-compose --profile dev up -d
# If you need rebuild
docker-compose --profile dev up --build -d
```

the development server container along with the redis,mariadb container will start automatically.

Open [http://localhost:3000](http://localhost:3000) in any browser to view the running service.

enter the frontend container by running `docker exec -it sci-frontend-1 /bin/bash`

when you alter the DB schema, run `npx prisma db push` or `npx prisma migrate dev`/
`prisma generate` inside the **frontend** container. 
Also, you can view the database schema by running `npx prisma studio` and visiting [http://localhost:5555](http://localhost:5555).
If you need a sample data for development, run `node db.js`. A sample dataset will be automatically inserted into the database.

You may stop the container by running
```
docker-compose --profile dev down
```
## Tech stack

- **Web framework**: NextJS, ReactJS, 
- **DB**: MariaDB+Prisma, Redis, 
- **CI/CD**: Docker, Docker-Compose