// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
var sleep = require("sleep");

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
const lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

class Point {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move([x, y]) {
    this.x += x;
    this.y += y;
  }

  touching(p2: Point) {
    return Math.abs(this.x - p2.x) <= 1 && Math.abs(this.y - p2.y) <= 1;
  }

  // This point is two up from p2
  twoUp(p2: Point) {
    return this.y === p2.y + 2 && this.x === p2.x;
  }

  // This point is two down from p2
  twoDown(p2: Point) {
    return this.y === p2.y - 2 && this.x === p2.x;
  }

  // This point is two left of p2
  twoLeft(p2: Point) {
    return this.x === p2.x - 2 && this.y === p2.y;
  }

  // This point is two right of p2
  twoRight(p2: Point) {
    return this.x === p2.x + 2 && this.y === p2.y;
  }

  toString() {
    return this.x + "," + this.y;
  }
}

const MINX = -236;
const MINY = -45;
const MAXX = 222;
const MAXY = 196;

const drawGrid = (
  head: Point,
  tails: Point[],
  tailVisited: Map<string, boolean>
) => {
  console.clear();
  // for (let yy = head.y + 20; yy >= head.y - 20; yy--) {
  //   for (let xx = head.x - 20; xx <= head.x + 20; xx++) {
  for (let yy = 5; yy >= -15; yy--) {
    let out = "";
    for (let xx = -20; xx <= 20; xx++) {
      if (head.x === xx && head.y === yy) {
        out += chalk.blueBright("H");
      } else if (tails[8].x == xx && tails[8].y == yy) {
        out += chalk.whiteBright("T");
      } else {
        let drawn = false;
        for (let tt = 0; tt < 8 && !drawn; tt++) {
          if (tails[tt].x === xx && tails[tt].y === yy) {
            out += chalk.greenBright(tt + 1);
            drawn = true;
          }
        }

        if (!drawn) {
          if (tailVisited.get(new Point(xx, yy).toString())) {
            out += chalk.red("#");
          } else {
            out += "*";
          }
        }
      }
    }
    process.stdout.write(out + "\n");
  }
};

const head = new Point(0, 0);
const tails: Point[] = Array.from(Array(9), () => {
  return new Point(0, 0);
});

const DIRS: { [key: string]: [number, number] } = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
};

let minX = 0,
  minY = 0,
  maxX = 0,
  maxY = 0;
const tailVisited = new Map();
const SLEEP = 0;

lines.forEach((line) => {
  const [, dir, count] = line.match(/([UDLR]) (\d+)/);

  for (let ii = 0; ii < parseInt(count); ii++) {
    head.move(DIRS[dir]);

    drawGrid(head, tails, tailVisited);
    sleep.msleep(SLEEP);

    minX = Math.min(head.x, minX);
    maxX = Math.max(head.x, maxX);
    minY = Math.min(head.y, minY);
    maxY = Math.max(head.y, maxY);

    for (let tt = 0; tt < 9; tt++) {
      let prev = tt === 0 ? head : tails[tt - 1];
      let segment = tails[tt];

      if (!prev.touching(segment)) {
        if (prev.twoUp(segment)) {
          segment.move(DIRS.U);
        } else if (prev.twoDown(segment)) {
          segment.move(DIRS.D);
        } else if (prev.twoLeft(segment)) {
          segment.move(DIRS.L);
        } else if (prev.twoRight(segment)) {
          segment.move(DIRS.R);
        } else {
          const xdiff = prev.x - segment.x;
          const ydiff = prev.y - segment.y;

          if (xdiff > 0) {
            segment.move(DIRS.R);
          } else {
            segment.move(DIRS.L);
          }

          if (ydiff > 0) {
            segment.move(DIRS.U);
          } else {
            segment.move(DIRS.D);
          }
        }
      }
      drawGrid(head, tails, tailVisited);
      sleep.msleep(SLEEP / 10);
    }

    tailVisited.set(tails[8].toString(), true);
    drawGrid(head, tails, tailVisited);
    sleep.msleep(SLEEP);
  }
});

console.log(minX, minY, maxX, maxY);
console.log(head, tails);
console.log(chalk.magenta("Part Two:"), tailVisited.size);
