import { explorerAPIcall, constantsVus, rampingVus } from './scenarios/explorer.js';

// K6 doesn't support ES2018 and therefore spread operator inside object literals.
// We need to use Object.assign instead
const constantsVusScenario = Object.assign(constantsVus, { exec: 'constantsVusFn' });
const rampingVusScenario = Object.assign(rampingVus, { exec: 'rampingVusFn' });

// Test configuration
export const options = {
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ['p(99) < 3000']
  },
  scenarios: {
    constantsVusScenario,
    rampingVusScenario
  }
};

// Executed functions must be exported at main level
export function constantsVusFn() {
  explorerAPIcall();
}
export function rampingVusFn() {
  explorerAPIcall();
}
