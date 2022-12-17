// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
var sleep = require("sleep");

process.chdir(__dirname);
const lines = fs
  .readFileSync(process.argv[2] ?? "input.txt", "utf8")
  .trim()
  .split("\n");

class Point {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }

  toString() {
    return this.x + "," + this.y;
  }

  equals(p: Point) {
    return this.x === p.x && this.y === p.y;
  }
}

class Grid {
  grid: string[];
  width: number;
  height: number;
  start: Point;
  goal: Point;
  fewestSteps: number;

  constructor(lines) {
    this.grid = lines;
    this.height = lines.length;
    this.width = lines[0].length;

    for (let yy = 0; yy < this.height; yy++) {
      if (!this.start && this.grid[yy].indexOf("S") !== -1) {
        this.start = new Point(this.grid[yy].indexOf("S"), yy);
      }
      if (!this.goal && this.grid[yy].indexOf("E") !== -1) {
        this.goal = new Point(this.grid[yy].indexOf("E"), yy);
      }
    }
  }

  print() {
    let buf = "";
    for (let yy = 0; yy < 6; yy++) {
      buf += this.grid[yy] + "\n";
    }

    console.log(buf);
  }

  isSteppable(pos: Point, nextPos: Point) {
    if (nextPos.y < 0 || nextPos.y >= this.height) return false;

    if (nextPos.x < 0 || nextPos.x >= this.width) return false;

    if (!unvisited.has(nextPos.toString())) {
      return false;
    }

    let curCharCode = this.grid[pos.y].charCodeAt(pos.x);
    let nextCharCode = this.grid[nextPos.y].charCodeAt(nextPos.x);

    if (pos.equals(this.goal)) {
      curCharCode = "z".charCodeAt(0);
    }

    if (nextPos.equals(this.goal)) {
      nextCharCode = "z".charCodeAt(0);
    }

    if (pos.equals(this.start)) {
      curCharCode = "a".charCodeAt(0);
    }

    if (nextPos.equals(this.start)) {
      nextCharCode = "a".charCodeAt(0);
    }

    return curCharCode - nextCharCode <= 1;
  }

  step(pos: Point): Point | null {
    const distanceToPos = distances.get(pos.toString());

    const left = new Point(pos.x - 1, pos.y);
    if (this.isSteppable(pos, left)) {
      if (distances.get(left.toString()) > distanceToPos + 1) {
        distances.set(left.toString(), distanceToPos + 1);
      }
    }

    const right = new Point(pos.x + 1, pos.y);
    if (this.isSteppable(pos, right)) {
      if (distances.get(right.toString()) > distanceToPos + 1) {
        distances.set(right.toString(), distanceToPos + 1);
      }
    }

    const up = new Point(pos.x, pos.y - 1);
    if (this.isSteppable(pos, up)) {
      if (distances.get(up.toString()) > distanceToPos + 1) {
        distances.set(up.toString(), distanceToPos + 1);
      }
    }

    const down = new Point(pos.x, pos.y + 1);
    if (this.isSteppable(pos, down)) {
      if (distances.get(down.toString()) > distanceToPos + 1) {
        distances.set(down.toString(), distanceToPos + 1);
      }
    }

    unvisited.delete(pos.toString());

    // Map keys are [0], values are [1]
    distances = new Map([...distances].sort((a, b) => a[1] - b[1]));

    for (const d of distances.entries()) {
      if (d[1] !== Infinity && unvisited.has(d[0])) {
        const [x, y] = d[0].split(",");
        return new Point(x, y);
      }
    }

    return null;
  }
}

const grid = new Grid(lines);
assert(grid.start && grid.goal && grid.width && grid.height);

const unvisited = new Set<string>();
let distances = new Map<string, number>();

for (let yy = 0; yy < grid.height; yy++) {
  for (let xx = 0; xx < grid.width; xx++) {
    const p = new Point(xx, yy);
    unvisited.add(p.toString());
    distances.set(p.toString(), p.equals(grid.goal) ? 0 : Infinity);
  }
}

let pos = grid.goal;

while (true) {
  if (!pos) {
    console.error("Ran out of unvisited");
    exit();
  }

  if (grid.grid[pos.y][pos.x] === "a") {
    console.log(chalk.redBright("Part Two: "), distances.get(pos.toString())); // 530 is too high
    exit();
  }

  pos = grid.step(pos);
}
