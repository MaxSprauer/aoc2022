// Copyright 2023 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { msleep as sleep } from "sleep";

const MAXX = 4000000;
const MAXY = 4000000;

process.chdir(__dirname);
const lines = fs
  .readFileSync(process.argv[2] ?? "input.txt", "utf8")
  .trim()
  .split("\n");

type Sensor = {
  x: number;
  y: number;
  radius: number;
};

type Beacon = {
  x: number;
  y: number;
};

const manDist = (
  sensorX: number,
  sensorY: number,
  beaconX: number,
  beaconY: number
): number => Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
const sensors: Sensor[] = [];
const beacons: string[] = [];

lines.forEach((line) => {
  // Sensor at x=14, y=17: closest beacon is at x=10, y=16
  const [, sensorX, sensorY, beaconX, beaconY] = line.match(
    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
  );

  sensors.push({
    x: +sensorX,
    y: +sensorY,
    radius: manDist(+sensorX, +sensorY, +beaconX, +beaconY),
  });

  const beacon = {
    x: +beaconX,
    y: +beaconY,
  };

  if (!beacons.includes(JSON.stringify(beacon))) {
    beacons.push(JSON.stringify(beacon));
  }
});

const sensorAtPosition = (x, y) => sensors.some((s) => s.x === x && s.y === y);

//const oneLineArray: Array<boolean> = new Array(MAXX + 1);

function coverageOnARow(row: number): Array<boolean> {
  //const coverage: Set<number> = new Set();
  // const cov: Array<boolean> = new Array().fill(false, 0, MAXX);
  // oneLineArray.fill(false, 0, MAXX);
  let cov: Array<boolean> = new Array(MAXX + 1);

  sensors.forEach((s) => {
    // console.log("Processing ", s);
    const remaining = s.radius - Math.abs(s.y - row);

    // Can this sensor reach this row?
    if (remaining >= 0) {
      // remaining is the amount of Manhattan distance left, so it can move left and right on this row
      for (
        let ii = Math.max(0, s.x - remaining);
        ii <= Math.min(MAXX, s.x + remaining);
        ii++
      ) {
        cov[ii] = true;
        /*
        if (
          !coverage.has(ii) //&&
          //!beacons.includes(JSON.stringify({ x: ii, y: row })) &&
          // !sensorAtPosition(ii, row)
        ) {
          coverage.add(ii);
        }
        */
      }
    }

    // if (-1 === cov.findIndex((c) => c === false)) {
    //   return;
    // }
  });

  //return coverage;
  return cov;
}
//console.log(sensors);
//console.log(beacons);
/*
for (let row = 0; row <= MAXY; row++) {
  const cov = coverageOnARow(row);
  if (cov.size != MAXX + 1) {
    console.log(chalk.magentaBright("Part Two:"), row, ": ", cov.size);

    for (let jj = 0; jj <= MAXX; jj++) {
      if (!cov.has(jj)) {
        console.log(chalk.redBright(`(${jj}, ${row})`));
        exit(0);
      }
    }
  }
}
*/

for (let row = 0; row <= MAXY; row++) {
  row % 100 === 0 && console.log("Row ", row);
  let res = coverageOnARow(row);
  assert(res.length === MAXX + 1, `res.length is ${res.length}`);
  const ind = res.findIndex((val) => val === undefined); // false);
  if (ind !== -1) {
    console.log(chalk.magentaBright("Part Two:"));

    console.log(chalk.redBright(`(${ind}, ${row})`));
    exit(0);
  }

  res = null;
}
