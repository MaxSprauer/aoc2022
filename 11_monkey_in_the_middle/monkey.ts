import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);

class Monkey {
  "number": number;
  "items": number[];
  "operation": string;
  "testDivisible": number;
  "ifTrue": number;
  "ifFalse": number;
  "inspCount": number;

  static from(json) {
    return Object.assign(new Monkey(), json);
  }

  inspect() {
    let knew: number;
    let old = this.items[0];
    eval(this.operation);
    this.items[0] = knew;
  }

  throw() {
    return this.items.shift();
  }

  receive(worry: number) {
    this.items.push(worry);
  }
}

const monkeys = JSON.parse(fs.readFileSync(process.argv[2], "utf8").trim()).map(
  Monkey.from
);
let ROUNDS = 20;
const MONKEY_COUNT = monkeys.length;

for (let ii = 1; ii <= ROUNDS; ii++) {
  for (let mm = 0; mm < MONKEY_COUNT; mm++) {
    while (monkeys[mm].items.length) {
      // Inspect an item
      monkeys[mm].inspect();
      monkeys[mm].inspCount++;

      // Relief
      monkeys[mm].items[0] = Math.floor(monkeys[mm].items[0] / 3);

      // Test worry level and take action
      const target =
        monkeys[mm].items[0] % monkeys[mm].testDivisible === 0
          ? monkeys[mm].ifTrue
          : monkeys[mm].ifFalse;
      const worry = monkeys[mm].throw();
      monkeys[target].receive(worry);
    }
  }
}

console.log(chalk.yellowBright("Part One:"));
monkeys.forEach((monkey) => {
  console.log(`Monkey ${monkey.number} inspected ${monkey.inspCount}`);
});
