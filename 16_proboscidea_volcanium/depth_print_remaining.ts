// Copyright 2023 Max Sprauer
// This is part 2 by running part 1 once and using its final state as input
// to run part 1 again as the elephant.

// So what this is saying is that the maxiumum overall flow includes the
// maximum flow for one actor and then the best the second actor can do
// with the remaining valves.  I don't know if that is always true.
// I haven't been able to prove it to myself.  It seems like there
// should be cases where by "cooperating" the two actors can each
// get lower individual totals, but a higher combined total.

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { msleep as sleep } from "sleep";
import { uniq } from "lodash";

const TICKS_START = 26;

process.chdir(__dirname);
const lines = fs
  .readFileSync(process.argv[2] ?? "input.txt", "utf8")
  .trim()
  .split("\n");

type Valve = {
  name: string;
  flowRate: number;
};

type Edge = {
  start: string;
  end: string;
};

type State = {
  ticks: number;
  currentNode: string;
  previousNode: string;
  totalFlow: number;
  valves: Array<Valve>;
};

const Valves = Array<Valve>();
const Edges = new Array<Edge>();

lines.forEach((line) => {
  // Valve GG has flow rate=0; tunnels lead to valves FF, HH
  const [, valve, flowRate, tunnels] = line.match(
    /^Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/
  );

  tunnels
    .split(",")
    .map((x) => x.trim())
    .forEach((end) => {
      Edges.push({ start: valve, end: end });
    });

  Valves.push({ name: valve, flowRate: parseInt(flowRate) });
});

console.log("Edges", Edges);
console.log("Valves", Valves);

const Nodes = uniq([...Edges.map((e) => e.start), ...Edges.map((e) => e.end)]);
console.log("Nodes", Nodes);

const copy = (x) => JSON.parse(JSON.stringify(x));

const initialState: State = {
  ticks: TICKS_START,
  currentNode: "AA",
  previousNode: "",
  totalFlow: 0,
  valves: Valves,
};

const finishStates: State[] = new Array();

const dfs = (state: State, highestFlow = 0): number => {
  if (state.ticks - 1 <= 0) {
    if (state.totalFlow > highestFlow) {
      highestFlow = state.totalFlow;
      console.log(
        "New highest:",
        highestFlow,
        "Closed valves left:",
        state.valves
          .filter((v) => v.flowRate > 0)
          .map((v) => v.name)
          .join(", ")
      );

      finishStates.push(state);
    }

    return highestFlow;
  }

  // Outstanding is an overestimate of remaining possible flow
  const outstanding =
    (state.ticks - 1) *
    state.valves.reduce((prev, cur) => prev + cur.flowRate, 0);
  if (state.totalFlow + outstanding < highestFlow) {
    return highestFlow;
  }

  // This doesn't work; I don't understand why.  The above block works and is more aggressive.
  // if (0 === state.valves.reduce((prev, cur) => prev + cur.flowRate, 0)) {
  //   return;
  // }

  // Check to see if this valve can be opened
  const flowRate = state.valves.find(
    (node) => node.name === state.currentNode
  ).flowRate;
  const dests = Edges.filter((edge) => edge.start === state.currentNode).map(
    (edge) => edge.end
  );

  // If we can open this valve, try that
  if (flowRate > 0) {
    const newValves = copy(state.valves);
    const openValve = newValves.find((v) => v.name === state.currentNode);
    openValve.flowRate = 0;

    dests.forEach((dest) => {
      const openState = {
        ticks: state.ticks - 2, // One to open, one to move
        currentNode: dest,
        previousNode: state.currentNode,
        totalFlow: state.totalFlow + (state.ticks - 1) * flowRate,
        valves: newValves,
      };

      highestFlow = Math.max(highestFlow, dfs(openState, highestFlow));
    });
  }

  dests.forEach((dest) => {
    // Don't return to same node we just came from if we didn't just open this one.
    // Do we need better cycle detection?  Cycles could be allowed if at least one is opened.
    if (dest === state.previousNode) {
      return highestFlow;
    }

    const leaveState = {
      ticks: state.ticks - 1,
      currentNode: dest,
      previousNode: state.currentNode,
      totalFlow: state.totalFlow,
      valves: state.valves,
    };

    highestFlow = Math.max(highestFlow, dfs(leaveState, highestFlow));
  });

  return highestFlow;
};

const highestFlow = dfs(initialState);
console.log("Part One Highest flow:", highestFlow);

// Now send the elephant
let highestTotal = highestFlow;
const state = finishStates.pop();
const elephantTotal = dfs({
  ...state,
  ticks: TICKS_START,
  currentNode: "AA",
  previousNode: "",
});

console.log("grand total: %d", elephantTotal);
