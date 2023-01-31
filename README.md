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
PORT=8000
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
PORT=8000
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

Two (2) docker containers will be created namely:

```bash
1. avail_missed_blocks_server_1 : 'for the express serve'
2. avail_missed_blocks_db_1 : 'For the postgres databse'
```

(C) Run the database migration against the `avail_missed_blocks_server_1` docker container.

```bash
docker exec avail_missed_blocks_server_1 yarn migrate
```

Query parameter `decode=true` can be used to return submitted data in base64 encoded string:

```bash
curl -s localhost:7000/v1/appdata/<block-number>?decode=true
```

Result:

```json
{ "block": 386, "extrinsics": ["{base64_encoded_submit_data}"] }
```

Returns the Mode of the Light Client

```bash
curl -s localhost:7000/v1/mode
```

Returns the status of a latest block

```bash
curl -s localhost:7000/v1/status
```

Returns the latest block

```bash
curl -s localhost:7000/v1/latest_block
```

## Test Code Coverage Report

We are using [grcov](https://github.com/mozilla/grcov) to aggregate code coverage information and generate reports.

To install grcov, run:

```bash
cargo install grcov
```

Source code coverage data is generated when running tests with:

```bash
env RUSTFLAGS="-C instrument-coverage" \
	LLVM_PROFILE_FILE="tests-coverage-%p-%m.profraw" \
	cargo test
```

To run the service:
Open `http://localhost:7000/api/missed-blocks/24` from your browser to view missed blocks within the last 24 hours, if you want to view for the last 1 hour all you need to do is to change the 24 in the url to 1 `http://localhost:7000/api/missed-blocks/1` or for any number of hours you intend viewing
