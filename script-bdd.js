import http from "k6/http";
import { tagWithCurrentStageProfile } from "https://jslib.k6.io/k6-utils/1.3.0/index.js";
import {
  describe,
  expect,
} from "https://jslib.k6.io/k6chaijs/4.3.4.3/index.js";

const endpoint_path = "demo";

// Options define test-run behavior. Most options can be passed in multiple places.
// If an option is defined in multiple places, k6 chooses the value from the highest order of precedence.
// https://grafana.com/docs/k6/latest/using-k6/k6-options/reference/
export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,

  // (`duration` and `stages`) simultaneously is not allowed
  // A string specifying the total duration of the test run.
  // duration: "30s",

  // A list of objects that specify the target number of VUs to ramp up or down;
  // shortcut option for a single scenario with a ramping VUs executor
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m30s", target: 10 },
    { duration: "20s", target: 0 },
  ],

  // Configure under what conditions a test is successful or not
  thresholds: {
    checks: [{ threshold: "rate == 1.00", abortOnFail: true }],
    http_req_failed: [{ threshold: "rate == 0.00", abortOnFail: true }],
  },
};

// Set up data for processing, share data among VUs
export function setup() {
  /* TODO: Find a reason to set something up? */
}

// Run the test function, usually default
// Example using K6Chaijs extension:
// https://github.com/grafana/k6-jslib-k6chaijs
// https://grafana.com/docs/k6/latest/javascript-api/jslib/k6chaijs/config/#config
export default function () {
  tagWithCurrentStageProfile();

  describe("Visit root page", () => {
    const response = http.get(`http://${__ENV.MY_HOSTNAME}/`);

    expect(response.status, "response status").to.equal(200);
    expect(response).to.have.validJsonBody();
    expect(response.json().message, "welcome message").to.equal(
      "What a wonderful kind of day."
    );
  });

  describe("post test data", () => {

    const body = {
      messageId: 1,
      example: {
        placeholder: "K6 Load Testing",
      },
    };

    const response = http.post(`http://${__ENV.MY_HOSTNAME}/${endpoint_path}`, JSON.stringify(body), {headers: { 'Content-Type': 'application/json' }});

    expect(response.status, "response status").to.equal(200);
    expect(response).to.have.validJsonBody();
    expect(response.json().length, "number of records").to.be.above(1)
  });
}

// Process result of setup code, stop test environment
export function teardown(data) {
  /* TODO: Find a reason to tear something down */
}

// TODO: Convert summary to csv format.
// export async function handleSummary(data) {
//   return {
//     "summary-bdd.csv": await CsvSummary(data),
//   };
// }
