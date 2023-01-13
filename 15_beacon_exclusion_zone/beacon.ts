// Copyright 2023 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { msleep as sleep } from "sleep";

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

function coverageOnARow(row: number): number {
  const coverage: Set<number> = new Set();

  sensors.forEach((s) => {
    console.log("Processing ", s);
    const remaining = s.radius - Math.abs(s.y - row);

    // Can this sensor reach this row?
    if (remaining >= 0) {
      // remaining is the amount of Manhattan distance left, so it can move left and right on this row
      for (let ii = s.x - remaining; ii <= s.x + remaining; ii++) {
        if (
          !coverage.has(ii) &&
          !beacons.includes(JSON.stringify({ x: ii, y: row })) &&
          !sensorAtPosition(ii, row)
        ) {
          coverage.add(ii);
        }
      }
    }
  });

  return coverage.size;
}
//console.log(sensors);
//console.log(beacons);

const coverage = coverageOnARow(2000000);
console.log(chalk.magentaBright("Part One:"), coverage);
