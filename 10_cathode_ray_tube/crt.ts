// Copyright 2022 Max Sprauer

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
const lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

class CRT {
  grid: string[];

  constructor() {
    this.grid = new Array(6).fill(" ".repeat(40));
  }

  set(x: number, y: number, char: string) {
    assert(x >= 0 && x <= 39);
    assert(y >= 0 && y <= 5);
    this.grid[y] =
      this.grid[y].substring(0, x - 1) + char + this.grid[y].substring(x);
  }

  print() {
    let buf = "";
    for (let yy = 0; yy < 6; yy++) {
      buf += this.grid[yy] + "\n";
    }

    console.log(buf);
  }
}

let pc = 0;
let acc = 1;
let beginNextInst = 1;
let answer = 0;
let crt = new CRT();

for (let cycle = 1; cycle <= 240; cycle++) {
  let m, inst, arg;

  if (cycle === beginNextInst) {
    // Get the previous instruction
    if (pc > 0) {
      m = lines[pc - 1].match(/(\w+)\W?([-\d]+)?/);
      [, inst, arg] = m;

      if (inst === "addx") {
        acc += parseInt(arg);
      }
    }
  }

  // Where is the CRT beam?
  let row = Math.floor((cycle - 1) / 40);
  let col = ((cycle + row) % 41) - 1;

  if (Math.abs(acc - col) <= 1) {
    crt.set(col, row, "#");
  }

  if (cycle === beginNextInst) {
    // Get the current instruction
    m = lines[pc].match(/(\w+)\W?([-\d]+)?/);
    [, inst, arg] = m;

    switch (inst) {
      case "addx":
        beginNextInst = cycle + 2;
        break;

      case "noop":
        beginNextInst = cycle + 1;
        break;

      default:
        assert(false);
        break;
    }

    pc++;
  }

  if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
    answer += cycle * acc;
  }
}

console.log(chalk.greenBright("Part One:", answer));
console.log(chalk.redBright("Part Two:"));
crt.print();
