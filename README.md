# 🛝 K6 Load Testing Playground

As the name of the repository suggests, it's just a [_playground_](https://dictionary.cambridge.org/dictionary/english/playground).
Will be used to test various load testing configurations and various extensions available in [k6](https://k6.io/).

## Prerequisites

1. [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Environment variables

The following environment variables need to be set before attempting to run any of the scripts.
Please note, that `.env` file(s) added will not be read from see [official documentation](https://grafana.com/docs/k6/latest/using-k6/environment-variables/)
on how k6 handles environment variables. An `.env.sample` has been provided as I personally use [`direnv`](https://direnv.net/)
so I can easily load environment variables from the file.

| Environment variable | Description                              | Default value | Required? |
| -------------------- | ---------------------------------------- | ------------- | --------- |
| MY_HOSTNAME          | The hostname for the RESTful API service | N/A           | Yes       |

## Usage

1. Run any of the JavaScript (.js) files using the following command e.g.:

   ```shell
   k6 run script.js
   ```

2. Review output file located in root directory e.g. `summary*.(csv/json)`
