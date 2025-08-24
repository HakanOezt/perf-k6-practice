import http from "k6/http";
import { check, sleep } from "k6";

const VUS = parseInt(__ENV.VUS || "20", 10);
const DURATION = __ENV.DURATION || "3m";
const THINK = parseFloat(__ENV.THINK_TIME_SEC || "1");
const BASE_URL = __ENV.BASE_URL || "https://www.wikipedia.org/";

export const options = {
  scenarios: {
    open_only: { executor: "constant-vus", vus: VUS, duration: DURATION, gracefulStop: "30s" }
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<1500"]
  },
  summaryTrendStats: ["avg","med","p(90)","p(95)","p(99)","max"]
};

export default function () {
  const res = http.get(BASE_URL, { headers: { "Accept": "text/html" } });
  check(res, {
    "200 OK": r => r.status === 200,
    "HTML geladen": r => String(r.headers["Content-Type"] || "").includes("text/html")
  });
  sleep(THINK);
}
