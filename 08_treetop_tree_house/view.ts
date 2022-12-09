// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
var lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

class Grid {
  width: number;
  height: number;
  grid: number[][];

  constructor(lines: string[]) {
    this.width = lines[0].length;
    this.height = lines.length;
    this.grid = new Array(this.height)
      .fill(0)
      .map(() => new Array(this.width).fill(0));

    lines.forEach((line, y) => {
      line.split("").forEach((char, x) => {
        // Note: 0,0 is the top left.
        this.grid[y][x] = +char;
      });
    });
  }

  isTreeVisible(x, y, height) {
    let rowVisL = true;
    let rowVisR = true;
    let colVisU = true;
    let colVisD = true;

    // Check row
    for (let xx = 0; xx < x; xx++) {
      if (this.grid[y][xx] >= height) {
        rowVisL = false;
      }
    }

    for (let xx = x + 1; xx < this.width; xx++) {
      if (this.grid[y][xx] >= height) {
        rowVisR = false;
      }
    }

    // Check column
    for (let yy = 0; yy < y; yy++) {
      if (this.grid[yy][x] >= height) {
        colVisU = false;
      }
    }

    for (let yy = y + 1; yy < this.height; yy++) {
      if (this.grid[yy][x] >= height) {
        colVisD = false;
      }
    }

    return rowVisL || rowVisR || colVisU || colVisD;
  }

  getVisible(): number {
    let count = 0;
    this.grid.forEach((_, y) =>
      this.grid[y].forEach((height, x) => {
        count += this.isTreeVisible(x, y, height) ? 1 : 0;
      })
    );

    return count;
  }

  getScenicScore(x, y, height): number {
    let l = 0,
      r = 0,
      u = 0,
      d = 0;

    // Check row
    for (let xx = x - 1; xx >= 0; xx--) {
      l++;
      if (this.grid[y][xx] >= height) {
        break;
      }
    }

    for (let xx = x + 1; xx < this.width; xx++) {
      r++;
      if (this.grid[y][xx] >= height) {
        break;
      }
    }

    // Check column
    for (let yy = y - 1; yy >= 0; yy--) {
      u++;
      if (this.grid[yy][x] >= height) {
        break;
      }
    }

    for (let yy = y + 1; yy < this.height; yy++) {
      d++;
      if (this.grid[yy][x] >= height) {
        break;
      }
    }

    return u * d * l * r;
  }

  getHighestScore(): number {
    let score = 0;
    this.grid.forEach((_, y) =>
      this.grid[y].forEach((height, x) => {
        score = Math.max(score, this.getScenicScore(x, y, height));
      })
    );

    return score;
  }
}

const grid = new Grid(lines);
console.log(chalk.cyanBright("Part One:"), grid.getVisible());
console.log(chalk.greenBright("Part Two:"), grid.getHighestScore());
