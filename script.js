import http from "k6/http";
import { check, group } from "k6";
import { tagWithCurrentStageProfile } from "https://jslib.k6.io/k6-utils/1.3.0/index.js";

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
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
};

// Set up data for processing, share data among VUs
export function setup() {
  /* TODO: Find a reason to set something up? */
}

// Run the test function, usually default
export default function () {
  tagWithCurrentStageProfile();

  group("visit root page", function () {
    const response = http.get(`http://${__ENV.MY_HOSTNAME}/`);
    check(response, {
      "check HTTP status was 200 OK": (res) => res.status === 200,
      "verify root page has message": (res) =>
        res.body.includes("What a wonderful kind of day."),
    });
  });
}

// Process result of setup code, stop test environment
export function teardown(data) {
  /* TODO: Find a reason to tear something down */
}

export function handleSummary(data) {
  return {
    "summary.json": JSON.stringify(data),
  };
}
