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
log_level = "info"
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

- When running the first light client in a network, it becomes a bootstrap client. Once its execution is started, it is paused until a second light client has been started and connected to it, so that the DHT bootstrap mechanism can complete successfully.
- Immediately after starting a fresh light client, block sync is executed to a block depth set in the `sync_blocks_depth` config parameter. The sync client is using both the DHT and RPC for that purpose.
- In order to spin up a fat client, config needs to contain the `block_matrix_partition` parameter set to a fraction of matrix. It is recommended to set the `disable_proof_verification` to true, because of the resource costs of proof verification.
- `sync_blocks_depth` needs to be set correspondingly to the max number of blocks the connected node is caching (if downloading data via RPC).
- Prometheus is used for exposing detailed metrics about the light client

## Usage

Given a block number (as _(hexa-)_ decimal number), return confidence obtained by the light client for this block:

```bash
curl -s localhost:7000/v1/confidence/ <block-number>
```

Result:

```json
{
  "number": 223,
  "confidence": 99.90234375,
  "serialisedConfidence": "958776730446"
}
```

> `serialisedConfidence` is calculated as:
> `blockNumber << 32 | int32(confidence * 10 ** 7)`, where confidence is represented out of 10 \*\* 9.

Given a block number (as _(hexa-)_ decimal number), return the extrinsic in hex string format, if app id is specified in the config

```bash
curl -s localhost:7000/v1/appdata/<block-number>
```

Result:

```json
{ "block": 386, "extrinsics": ["{hex_encoded_extrinsic}"] }
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

To generate the report, run:

```bash
grcov . -s . \
	--binary-path ./target/debug/ \
	-t html \
	--branch \
	--ignore-not-existing -o \
	./target/debug/coverage/
```

To clean up generate coverage information files, run:

```bash
find . -name \*.profraw -type f -exec rm -f {} +
```

Open `index.html` from the `./target/debug/coverage/` folder to review coverage data.
