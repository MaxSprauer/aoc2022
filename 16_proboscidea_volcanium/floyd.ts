// Copyright 2023 Max Sprauer

// Everything in this file is wrong.  Ignore all of it.

// I realized that this is different than the shortest path problem, because there is
// not a defined end point.  So I read up on the Floyd-Warshall algorithm.  It may be
// that Johnson's algorithm is better for the sparse graph, but this seemed more straightforward
// to implement.

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { msleep as sleep } from "sleep";
import { uniq } from "lodash";

const TICKS_START = 2;

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

// const Edges = new Set<Edge>();

const valves = Array<Valve>();
const edges = new Array<Edge>();

lines.forEach((line) => {
  // Valve GG has flow rate=0; tunnels lead to valves FF, HH
  const [, valve, flowRate, tunnels] = line.match(
    /^Valve (\w+) has flow rate=(\d+); tunnel[s]? lead[s]? to valve[s]? (.*)/
  );

  tunnels
    .split(",")
    .map((x) => x.trim())
    .forEach((end) => {
      edges.push({ start: valve, end: end });
    });

  valves.push({ name: valve, flowRate: parseInt(flowRate) });
});

console.log("edges", edges);
console.log("valves", valves);

const nodes = uniq([...edges.map((e) => e.start), ...edges.map((e) => e.end)]);
console.log("nodes", nodes);

const closedValves = new Set(nodes);
console.log("closedValves", closedValves);

const matrix = new Map();
nodes.forEach((start) => {
  nodes.forEach((end) => {
    const edge = edges.find((e) => e.start === start && e.end === end);

    if (edge) {
      // There is a path to this edge, set weight as flow rate of end.
      const flowRate = valves.find((v) => v.name === end).flowRate;
      matrix.set(`${start},${end}`, flowRate);
    } else {
      matrix.set(`${start},${end}`, 0);
    }
  });
});

let total = 0;
let ticks = TICKS_START;
while (ticks > 0) {
  // for (let ticks = TICKS_START; ticks > 0; ticks--) {
  console.log(matrix);

  /*
  for k from 1 to |V|:
      for i from 1 to |V|:
          for j from 1 to |V|:
              if M[i][j] > M[i][k] + M[k][j]:
                  M[i][j] = M[i][k] + M[k][j]

  Modifications to Floyd-Warshall:
    - after each valve is opened, its flowRate goes to 0
    - comparing weights compares using one turn to open the current value (times flow rate)
      versus two turns to move and open another valve (times flow rate)
    - recalculate the matrix after each tick 
    - .. add to total as each valve is opened 
    - we're looking for the highest weight instead of shortest path
    - at the end, the highest value in the matrix should be the answer (but we won't have the path)
  */

  const closeValve = (valve) => {
    nodes.forEach((start) => {
      matrix.set(`${start},${valve}`, 0);
    });
  };

  nodes.forEach((k) => {
    nodes.forEach((i) => {
      nodes.forEach((j) => {
        const ik = matrix.get(`${i},${k}`);
        const kj = matrix.get(`${k},${j}`);
        const ij = matrix.get(`${i},${j}`);
        const sum = ik + kj;
        // if (ij > 0 && ik > 0 && kj > 0) {
        //   console.log(ij, kj, ik);
        // }
        if (ij > 0 && ik > 0 && kj > 0) {
          // if the valve is closed and the flow rate * ( ticks - 1 ) > flow rate of destination * (ticks - 2)
          //  then open the valve and add to total and set all the edges from the node to 0?
          // otherwise

          // If the ik + kj paths are bigger than the original ij path, use them
          if (ij * (ticks - 1) < sum * (ticks - 2)) {
            console.log(`${i},${j} = ${sum}`);
            matrix.set(`${i},${j}`, sum);
          }
        }
      });
    });
  });

  ticks--;
}

console.log("matrix", matrix);
