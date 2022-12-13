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
let ROUNDS = 10000;
const MONKEY_COUNT = monkeys.length;

// The idea here is all that we care about is if the worry is divisible
// by any of the prime numbers on the input list.  We then use that to
// determine which monkey to throw to.  We don't actually care about the
// value of the worry.  But we do add to the value of the worry, which
// means we can't just use prime factors.  (The worry gets too big when
// it is multiplied or squared.)
//
// So say our divisors are 2, 5, 7.  If we mod our worry by the product of
// those prime numbers, we know that the remainder will be the same as if
// we mod'ed the original number.  That allows us to mod the worry during
// each round to keep the number small after multiplication.
//
// For example:
// Worry   Adjusted Worry (mod 2*5*7)    Divisible by 2      Divisble by 5   Divisible by 7
//   69     69                           69/2 = 34R1 No      69/5 = 13R1 No  69/7 = 9R6 No
//   70     0                            0/2 = 0R0 Yes       0/5 = 0R0 Yes   0/7 = 0R0  Yes
//  139     69                           139/2 = 69R1 No     139/5 = 27R4 No 139/7 = 19R6 No
//  140     70                           140/2 = 70R0 Yes    140/5 =28R0 Yes 140/7 = 20R0 Yes

const SUPERMOD = monkeys.reduce((prev, m) => prev * m.testDivisible, 1);

for (let ii = 1; ii <= ROUNDS; ii++) {
  for (let mm = 0; mm < MONKEY_COUNT; mm++) {
    while (monkeys[mm].items.length) {
      // Inspect an item
      monkeys[mm].inspect();
      monkeys[mm].inspCount++;

      // Relief
      monkeys[mm].items[0] = monkeys[mm].items[0] % SUPERMOD;

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

console.log(chalk.yellowBright("Part Two:"));
monkeys.forEach((monkey) => {
  console.log(`Monkey ${monkey.number} inspected ${monkey.inspCount}`);
});
