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
  tail: Point,
  tailVisited: Map<string, boolean>
) => {
  console.clear();
  // for (let yy = head.y + 20; yy >= head.y - 20; yy--) {
  //   for (let xx = head.x - 20; xx <= head.x + 20; xx++) {
  for (let yy = 5; yy >= -15; yy--) {
    let out = "";
    for (let xx = -20; xx <= 20; xx++) {
      if (head.x == xx && head.y == yy) {
        out += chalk.blueBright("H");
      } else if (tail.x == xx && tail.y == yy) {
        out += chalk.greenBright("T");
      } else if (tailVisited.get(new Point(xx, yy).toString())) {
        out += chalk.red("#");
      } else {
        out += "*";
      }
    }
    process.stdout.write(out + "\n");
  }
};

const head = new Point(0, 0);
const tail = new Point(0, 0);

const dirs: { [key: string]: [number, number] } = {
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

lines.forEach((line) => {
  const [, dir, count] = line.match(/([UDLR]) (\d+)/);

  for (let ii = 0; ii < parseInt(count); ii++) {
    head.move(dirs[dir]);

    drawGrid(head, tail, tailVisited);
    sleep.msleep(100);

    minX = Math.min(head.x, minX);
    maxX = Math.max(head.x, maxX);
    minY = Math.min(head.y, minY);
    maxY = Math.max(head.y, maxY);

    if (!head.touching(tail)) {
      if (head.twoUp(tail)) {
        tail.move(dirs.U);
      } else if (head.twoDown(tail)) {
        tail.move(dirs.D);
      } else if (head.twoLeft(tail)) {
        tail.move(dirs.L);
      } else if (head.twoRight(tail)) {
        tail.move(dirs.R);
      } else {
        const xdiff = head.x - tail.x;
        const ydiff = head.y - tail.y;

        if (xdiff > 0) {
          tail.move(dirs.R);
        } else {
          tail.move(dirs.L);
        }

        if (ydiff > 0) {
          tail.move(dirs.U);
        } else {
          tail.move(dirs.D);
        }
      }
    }
    //console.log(head, tail);
    tailVisited.set(tail.toString(), true);
    drawGrid(head, tail, tailVisited);
    sleep.msleep(100);
  }
});

console.log(minX, minY, maxX, maxY);
console.log(head, tail);
console.log(chalk.magenta("Part One:"), tailVisited.size);
