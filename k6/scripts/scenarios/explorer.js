import http from 'k6/http';
import { check, sleep } from 'k6';
import { exploreFeedQuery } from '../queries.js';

// API setup
const payload = JSON.stringify(exploreFeedQuery);
const API = 'https://api-zkevm-goerli.lens.dev';
const params = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const constantsVus = {
  executor: 'constant-vus',
  duration: '1m',
  vus: 2500
};

export const rampingVus = {
  executor: 'ramping-vus',
  startTime: '30s',
  startVUs: 0,
  stages: [
    { duration: '1m', target: 2500 },
    { duration: '30s', target: 0 }
  ]
};

export function explorerAPIcall() {
  let res = http.post(API, payload, params);
  // Validate response status
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
