<div align="Center">
<h1>Missed Block</h1>
<h3>Missed blocks services </h3>
</div>

<br>

## Installation

Start by cloning this repo in your local setup:

```ssh
git clone https://github.com/maticnetwork/avail_missed_blocks
```

Create one .env configuration file in the root of the project & put following content.

```bash
touch .env
```

```yaml
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=postgres
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=1234
TOTAL_EXPECTED_BLOCK=15
ENV=dev
PORT=8080
```

## Config reference

```yaml
# Database host
POSTGRES_HOST=127.0.0.1
# Database name
POSTGRES_DB=postgres
#Database Port
POSTGRES_PORT=5432
# Database User
POSTGRES_USER=postgres
# Rough estimate of blocks assumed to be produced in 5 minutes
TOTAL_EXPECTED_BLOCK=15
# Express server port
PORT=8080
```

## Notes

- This service is experiemental, to help us track the number of missed blocks in the avail network, missed blocks could occur for various reasons.
- 1. May be there is a best block stuck issue
- 2. There could be a performamnce issue with the various validator nodes participating on the network

> `This service have a cron job that runs every 5 minutes` the cron job subscribes to finalised block headers at every 5 minutes, looking at the performance of the
> `avail network`,approximately a single block is produced every 20 seconds. which means 15 blocks should be produced every 5 minutes, hence the reason for the
> `TOTAL_EXPECTED_BLOCK=15` in the .env configuration file.

## Usage

(A) cd in to the root directory of the cloned repository

```bash
cd avail_missed_blocks
```

(B) Run the following command to pull the docker images and start the container services :

```bash
docker-compose up --build -d
```

Result:

```bash
Creating network "avail_missed_blocks_default" with the default driver
Building server
[+] Building 421.5s (12/12) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                     0.1s
 => => transferring dockerfile: 192B                                                                                                                     0.0s
 => [internal] load .dockerignore                                                                                                                        0.1s
 => => transferring context: 34B                                                                                                                         0.0s
 => [internal] load metadata for docker.io/library/node:17-alpine                                                                                        3.6s
 => [auth] library/node:pull token for registry-1.docker.io                                                                                              0.0s
 => CACHED [1/6] FROM docker.io/library/node:17-alpine@sha256:76e638eb0d73ac5f0b76d70df3ce1ddad941ac63595d44092b625e2cd557ddbf                           0.0s
 => [internal] load build context                                                                                                                        0.8s
 => => transferring context: 76.74kB                                                                                                                     0.7s
 => [2/6] RUN apk add g++ make py3-pip                                                                                                                 211.3s
 => [3/6] WORKDIR /app                                                                                                                                   0.1s
 => [4/6] COPY package.json .                                                                                                                            0.0s
 => [5/6] COPY . .                                                                                                                                       0.2s
 => [6/6] RUN yarn install                                                                                                                             175.3s
 => exporting to image                                                                                                                                  30.5s
 => => exporting layers                                                                                                                                 30.4s
 => => writing image sha256:9145e879416f467e4e10b301524885d3e8b1bd962754fd888741eeab0a8b5892                                                             0.0s
 => => naming to docker.io/library/avail_missed_blocks_server                                                                                            0.0s

Use 'docker scan' to run Snyk tests against images to find vulnerabilities and learn how to fix them
Creating avail_missed_blocks_db_1 ... done
Creating avail_missed_blocks_server_1 ... done

```

Two (2) docker containers will be created namely:

```bash
1. avail_missed_blocks_server_1 : 'for the express serve'
2. avail_missed_blocks_db_1 : 'For the postgres databse'
```

(C) Run the database migration against the `avail_missed_blocks_server_1` docker container.

```bash
docker exec avail_missed_blocks_server_1 yarn migrate
```

Result:

```bash
yarn run v1.22.19
$ db-migrate --env test up && db-migrate up
received data: CREATE TABLE blocks(id SERIAL PRIMARY KEY, blocknumber BIGINT, hash VARCHAR(255), missedblocks BIGINT, block_produced_within_time BIGINT, createdat TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone);
[INFO] Processed migration 20230116094401-blocks-table
[INFO] Done
[INFO] No migrations to run
[INFO] Done
Done in 1.52s.
```

Query the below url to get missed block for the last 24 hours `http://localhost:8080/api/missed-blocks/{hour}`:

```bash
curl http://localhost:8080/api/missed-blocks/24
```

## Test the missed block service

```bash

Open `http://localhost:8080/api/missed-blocks/24` from your browser to view missed blocks within the last 24 hours if you want to view for the last 1 hour all you need to do is to change the 24 in the url to 1 `http://localhost:7000/api/missed-blocks/1` or for any number of hours you intend viewing.

```
