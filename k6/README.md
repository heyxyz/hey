# ZKEVM lens API load testing

Demonstrates how to run load tests with containerised instances of K6, Grafana and InfluxDB.

### Source

The setup has been borrowed from the following repository:
https://github.com/luketn/docker-k6-grafana-influxdb

There's also a related article https://medium.com/swlh/beautiful-load-testing-with-k6-and-docker-compose-4454edb3a2e3

## How to run

### Through Docker

- You must be at /k6 level in the lineaster repository
- run `chmod +x k6/run-load-test.sh` to allow script execution
- open Grafana dashboard at http://localhost:3000/d/k6/k6-load-testing-results in your browser
- run `./k6/run-load-test.sh` in your terminal. This will spin up Grafana dashboard and DB, then run specified test file
- check results inside Grafana dashboard

### Directly with `k6`

> Warning: No support for Grafana dashboard

- You must be at /k6 level in the lineaster repository
- run `k6 run scripts/test.js`

## How to add more scenarios

A k6 test file is composed of a main test file `test.js`, that imports scenarios and functions to execute them. For convenience, queries are exported in a separate file and can be imported inside scenarios or main file.

```
- k6/
-- test.js
-- queries.js
-- scenarios/
--- explorer.js
--- your_scenario.js
```

Due to k6 constraints, functions that are referenced inside each scenarios must be exported at main level.

Also, k6 doesn't support `ES2018`, so spread operator with objects literals is not supported
