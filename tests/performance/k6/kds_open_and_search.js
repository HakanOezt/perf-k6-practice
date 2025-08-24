import http from "k6/http";
import { check, sleep, group } from "k6";

const VUS = parseInt(__ENV.VUS || "15", 10);
const DURATION = __ENV.DURATION || "1m";
const THINK = parseFloat(__ENV.THINK_TIME_SEC || "1");

const BASE_URL = __ENV.BASE_URL || "https://www.wikipedia.org/";
const SEARCH_URL = __ENV.SEARCH_URL ||
    "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=KION&format=json";

export const options = {
    scenarios: {
        open_and_search: {
            executor: "constant-vus",
            vus: VUS,
            duration: DURATION,
            gracefulStop: "30s"
        }
    },
    thresholds: {
        http_req_failed: ["rate<0.01"],
        http_req_duration: ["p(95)<1500"]
    },
    summaryTrendStats: ["avg","med","p(90)","p(95)","p(99)","max"]
};

export default function () {
    group("Seite öffnen", () => {
        const res = http.get(BASE_URL, { headers: { "Accept": "text/html" } });
        check(res, { "200 OK": r => r.status === 200 });
        sleep(THINK);
    });

    group("Suche", () => {
        const res = http.get(SEARCH_URL, { headers: { "Accept": "application/json" } });
        check(res, {
            "Suche 200": r => r.status === 200,
            "JSON": r => String(r.headers["Content-Type"] || "").includes("application/json")
        });
        sleep(THINK);
    });
}