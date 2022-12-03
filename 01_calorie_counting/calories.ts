// Copyright 2022 Max Sprauer

import * as fs from "fs";

process.chdir(__dirname);
var lines = fs.readFileSync("input.txt", "utf8");

const calGroups = lines.split("\n\n");
const cals = calGroups.map((group) => group.split("\n").map((cal) => +cal)); // Convert string to int

const calSums = cals.map((group) => group.reduce((prev, cur) => prev + cur, 0));
calSums.sort((a, b) => b - a);

console.log("Part one: " + calSums[0]);
console.log(
  "Part two: " + calSums.splice(0, 3).reduce((prev, cur) => prev + cur, 0)
);
