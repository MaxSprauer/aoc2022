import * as fs from "fs";
import chalk from "chalk";

process.chdir(__dirname);
var lines = fs.readFileSync("input.txt", "utf8").trim().split("\n");

// Dumb, but fast
const scores = {
  "A X": 3,
  "A Y": 6,
  "A Z": 0,
  "B X": 0,
  "B Y": 3,
  "B Z": 6,
  "C X": 6,
  "C Y": 0,
  "C Z": 3,
};

const values = {
  X: 1,
  Y: 2,
  Z: 3,
};

const partOne = lines.reduce(
  (prev, line) => prev + scores[line] + values[line[2]],
  0
);

console.log(chalk.magenta("Part One:"), partOne);

const partTwo = lines.reduce((prev, line) => {
  let myChoice;
  let theirChoice = line[0];
  switch (line[2]) {
    case "X":
      // Lose
      for (const [key, value] of Object.entries(scores)) {
        if (key[0] === theirChoice && value === 0) {
          myChoice = key[2];
          break;
        }
      }
      break;

    case "Y":
      // Draw
      myChoice = String.fromCharCode(
        "X".charCodeAt(0) + (theirChoice.charCodeAt(0) - "A".charCodeAt(0))
      );
      break;

    case "Z":
      // Win
      for (const [key, value] of Object.entries(scores)) {
        if (key[0] === theirChoice && value === 6) {
          myChoice = key[2];
          break;
        }
      }
      break;
  }
  return prev + scores[`${theirChoice} ${myChoice}`] + values[myChoice];
}, 0);

console.log(chalk.magenta("Part Two:"), partTwo);
