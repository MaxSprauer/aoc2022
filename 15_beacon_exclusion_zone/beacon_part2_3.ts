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

  combine(r2: Range): Range {
    return new Range(
      Math.min(this.start, r2.start),
      Math.max(this.end, r2.end)
    );
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
  // for each row
  //   for each sensor
  //     calculate range covered in this row
  //   combine ranges
  //   should end up with one range, 0 - max

  const ranges: Range[] = [];

  sensors.forEach((s) => {
    const remaining = s.radius - Math.abs(s.y - row);

    if (remaining >= 0) {
      ranges.push(
        new Range(Math.max(0, s.x - remaining), Math.min(MAXX, s.x + remaining))
      );
    }
  });

  // They should all at least touch or overlap if there are no gaps, right?
  ranges.sort((r1, r2) => r1.start - r2.start);
  const firstRange = ranges.shift();

  const finalRange = ranges.reduce((prev, cur) => {
    if (prev.overlap(cur)) {
      return prev.combine(cur);
    } else {
      // We're going to check for full range, so returning this non-full range should work.
      return cur;
    }
  }, firstRange);

  if (finalRange && (finalRange.start !== 0 || finalRange.end !== MAXX)) {
    console.log(
      chalk.magentaBright("Part Two:"),
      "Current row: ",
      row,
      "Final Range: ",
      finalRange,
      "List of ranges: ",
      ranges
    );
    // 2557297 * 4000000 + 3267339 = 10229191267339
    exit();
  }

  return -1;
}

for (let row = 0; row <= MAXY; row++) {
  row % 100 === 0 && console.log("Row ", row);
  const res = coverageOnARow(row);
}
