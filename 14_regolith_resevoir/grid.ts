import chalk from "chalk";
import { assert, clear } from "console";
import nodeTest from "node:test";
import { SOURCE_X, SOURCE_Y } from "./sand";

export class Grid {
  grid: string[][];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  dropX: number;
  dropY: number;
  restCount: number;

  constructor(minX, maxX, minY, maxY) {
    this.minX = minX;
    this.maxX = maxX;
    this.minY = minY;
    this.maxY = maxY;
    this.restCount = 0;

    this.grid = Array();
    for (let i = minY; i <= maxY; i++) {
      this.grid[i] = new Array();
      for (let j = minX; j <= maxX; j++) {
        this.grid[i][j] = ".";
      }
    }

    this.grid[SOURCE_Y][SOURCE_X] = "+";
  }

  drop() {
    this.dropX = SOURCE_X;
    this.dropY = SOURCE_Y;
  }

  step(): boolean {
    // Can move down
    if (
      this.dropY + 1 > this.maxY ||
      this.grid[this.dropY + 1][this.dropX] == "."
    ) {
      this.dropY++;
      return true;
    } else if (
      this.dropY + 1 > this.maxY ||
      this.dropX - 1 < this.minX ||
      this.grid[this.dropY + 1][this.dropX - 1] == "."
    ) {
      // Can move down/left
      this.dropY++;
      this.dropX--;
      return true;
    } else if (
      this.dropY + 1 > this.maxY ||
      this.dropX + 1 > this.maxX ||
      this.grid[this.dropY + 1][this.dropX + 1] == "."
    ) {
      // Can move down/right
      this.dropY++;
      this.dropX++;
      return true;
    }

    // Done
    this.grid[this.dropY][this.dropX] = "o";
    this.restCount++;
    return false;
  }

  atBottom(): boolean {
    return this.dropY === this.maxY;
  }

  drawLine(prevX, prevY, x, y) {
    if (prevX === x) {
      for (let ii = Math.min(prevY, y); ii <= Math.max(y, prevY); ii++) {
        this.grid[ii][x] = "#";
      }
    } else if (prevY === y) {
      for (let ii = Math.min(x, prevX); ii <= Math.max(prevX, x); ii++) {
        this.grid[y][ii] = "#";
      }
    } else {
      assert(false, "Not a line?");
    }
  }

  print() {
    let lines = "";
    for (let yy = this.minY; yy <= this.maxY; yy++) {
      let line = "";
      for (let xx = this.minX; xx <= this.maxX; xx++) {
        let char;
        switch (this.grid[yy][xx]) {
          case "#":
            char = chalk.bgGray(chalk.black("#"));
            break;
          case "o":
            char = chalk.yellow("o");
            break;
          case ".":
            char = chalk.gray(".");
            break;
          case "+":
            char = chalk.red("+");
            break;
        }
        line +=
          this.dropX === xx && this.dropY === yy
            ? chalk.yellowBright("o")
            : char;
      }
      lines += line + "\n";
    }
    console.clear();
    console.log(lines);
  }
}
