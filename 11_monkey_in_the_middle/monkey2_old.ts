import * as fs from "fs";
import chalk from "chalk";
import { exit } from "process";
import { assert } from "console";
import { memoize } from "lodash";
const prime = require("prime-factorization");
const factorize = memoize((n) => prime.Factorize(n, "asArray"));
const isPrime = memoize((n) => prime.IsPrime(n));

if (process.argv.length < 3) exit(1);
process.chdir(__dirname);

class Monkey {
  "number": number;
  "items": number[]; // Only used to initialize pfact
  "pfact": number[][]; // Array of prime factors of the worry levels in the items array
  "operation": string;
  "testDivisible": number;
  "ifTrue": number;
  "ifFalse": number;
  "inspCount": number;

  static from(json: string) {
    const m = Object.assign(new Monkey(), json);
    m.pfact = m.items.map((i) => factorize(i));
    return m;
  }

  // Assumes first in list
  inspect() {
    if (this.operation === "knew = old * old") {
      this.pfact[0] = this.pfact[0].concat(this.pfact[0]);
    } else {
      const [_, op, numS] = this.operation.match(/knew = old (\W) (\d+)/);
      const num = parseInt(numS);

      if (op === "*") {
        this.pfact[0].push(num);
      } else if (op === "+") {
        const total = this.pfact[0].reduce((prev, n) => prev * n, 1);

        // console.log(`${total} + ${num} -> ${this.pfact[0]}`);

        console.log(`Factorize `, total + num);
        this.pfact[0] = isPrime(total + num)
          ? [total + num]
          : factorize(total + num);
        // console.log(`  -> ${this.pfact[0]}`);
      } else {
        assert(false, op, num);
      }
    }
  }

  // Assumes first in list
  throw() {
    return this.pfact.shift();
  }

  receive(worry: number[]) {
    this.pfact.push(worry);
  }
}

const monkeys = JSON.parse(fs.readFileSync(process.argv[2], "utf8").trim()).map(
  Monkey.from
);

const SUPERMOD = monkeys.reduce((prev, m) => prev * m.testDivisible, 1);

let ROUNDS = 20;
const MONKEY_COUNT = monkeys.length;

for (let ii = 1; ii <= ROUNDS; ii++) {
  console.log(`Round ${ii} begins`);
  for (let mm = 0; mm < MONKEY_COUNT; mm++) {
    while (monkeys[mm].pfact.length) {
      // Inspect an item
      monkeys[mm].inspect();
      monkeys[mm].inspCount++;

      // No Relief!
      // monkeys[mm].items[0] = Math.floor(monkeys[mm].items[0] / 3);

      // Test worry level and take action
      const target = monkeys[mm].pfact[0].includes(monkeys[mm].testDivisible)
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

// We check if the number is divisble by a list of possible numbers
// When recalculating the big number, mod by the product of the list, so
// the answer is still divisible
