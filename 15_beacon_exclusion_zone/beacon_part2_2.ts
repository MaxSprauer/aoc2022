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

class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  overlap(r2: Range): boolean {
    return (
      (this.start >= r2.start && this.start <= r2.end) || // this.start overlaps r2 range
      (this.end >= r2.start && this.end <= r2.end) || // this.end overlaps r2 range
      (this.start <= r2.start && this.end >= r2.end) // this range includes r2 range
    );
  }

  combine(r2: Range) {
    this.start = Math.min(this.start, r2.start);
    this.end = Math.max(this.end, r2.end);
  }
}

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

// Returns x coordinate missing coverage or -1
function coverageOnARow(row: number): number {
  for (let xx = 0; xx <= MAXX; xx++) {
    if (
      !sensors.some((s) => {
        const remaining = s.radius - Math.abs(s.y - row) - Math.abs(s.x - xx);

        // for each row
        //   for each sensor
        //     calculate range covered in this row
        //   combine ranges
        //   should end up with one range, 0 - max

        // Can this sensor reach this position?
        return remaining >= 0;
      })
    ) {
      return xx;
    }
  }

  return -1;
}

for (let row = 0; row <= MAXY; row++) {
  row % 100 === 0 && console.log("Row ", row);
  const res = coverageOnARow(row);

  if (res !== -1) {
    console.log(chalk.magentaBright("Part Two:"));

    console.log(chalk.redBright(`(${res}, ${row})`));
    exit(0);
  }
}
