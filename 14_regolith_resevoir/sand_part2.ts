// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { Grid } from "./grid_part2";
import { msleep as sleep } from "sleep";

export const SOURCE_X = 500;
export const SOURCE_Y = 0;

process.chdir(__dirname);
const lines = fs
  .readFileSync(process.argv[2] ?? "input.txt", "utf8")
  .trim()
  .split("\n");

let minX = SOURCE_X,
  maxX = SOURCE_X,
  minY = SOURCE_Y,
  maxY = SOURCE_Y;

lines.forEach((line) => {
  // 473,73 -> 473,77 -> 466,77 -> 466,82 -> 485,82 -> 485,77 -> 477,77 -> 477,73
  const iter = line.matchAll(/(\d+),(\d+)/g);

  for (let cur = iter.next(); !cur.done; cur = iter.next()) {
    let x = cur.value[1];
    let y = cur.value[2];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
});

// Figure out how wide to make the grid and "ground."
// If a solid triangle is created under the source (disregard the obstacles),
// it will be a 45/45/90 triangle.  Cut that in half to make a 45/45/90 triangle
// on each side.  So the height of the main triangle should also be the length
// of the base of the smaller triangle, i.e. half of the total base.
const h = maxY - minY;
const FUDGE_FACTOR = 10;
const grid = new Grid(
  SOURCE_X - h - FUDGE_FACTOR,
  SOURCE_X + h + FUDGE_FACTOR,
  minY,
  maxY + 2
);

// Stupid to do this twice, but whatever
lines.forEach((line) => {
  // 473,73 -> 473,77 -> 466,77 -> 466,82 -> 485,82 -> 485,77 -> 477,77 -> 477,73
  const iter = line.matchAll(/(\d+),(\d+)/g);
  let lastX, lastY;

  for (let cur = iter.next(); !cur.done; cur = iter.next()) {
    let x = cur.value[1];
    let y = cur.value[2];

    if (lastX && lastY) {
      grid.drawLine(lastX, lastY, x, y);
    }

    lastX = x;
    lastY = y;
  }
});

grid.drawGround();

let blockedNozzle = false;

while (!blockedNozzle) {
  grid.drop();
  let done = false;

  while (!done && !blockedNozzle) {
    done = !grid.step();
    //sleep(10);
    //grid.print();
    blockedNozzle = grid.blockedNozzle();

    if (grid.atBottom()) {
      grid.print();
      console.error("Dropped off bottom; ground is not wide enough.");
      exit(1);
    }
  }
}

grid.print();
console.log(chalk.cyanBright("Part Two:", grid.restCount));
