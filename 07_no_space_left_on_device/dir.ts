// Copyright 2022 Max Sprauer
// Turn the input into a shell script we can run on an empty file system.

import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);
var lines = fs.readFileSync(process.argv[2], "utf8").trim().split("\n");

const ROOT = "/Volumes/Day7";
console.log(`cd ${ROOT}`);

lines.forEach((line) => {
  let m;

  if (line[0] === "$") {
    // We're looking at commands

    if (line === "$ cd /") {
      // NOP
    } else if (line === "$ cd ..") {
      console.log("cd ..");
    } else if ((m = line.match(/\$ cd ([\w.]+)/)) != null) {
      console.log(`mkdir ${m[1]}`);
      console.log(`cd ${m[1]}`);
    } else if (line === "$ ls") {
      // NOP - Go to ls parsing
    } else {
      assert(false, line);
    }
  } else {
    // We're looking at ls output

    if ((m = line.match(/(\d+) ([\w.]+)/)) != null) {
      console.log(`dd if=/dev/zero of=${m[2]} bs=${m[1]} count=1`);
    } else if ((m = line.match(/dir (\w+)/)) != null) {
      // NOP - Created when we cd
    } else {
      assert(false, line);
    }
  }
});
