import { runSolution } from '../utils.ts';

function* generatePermutations<T>(elements: T[], length: number) {
  if (length === 0) {
    yield [];
    return;
  }
  for (const element of elements) {
    for (const permutation of generatePermutations(elements, length - 1)) {
      yield [element, ...permutation];
    }
  }
}

type Operation = (a: number, b: number) => number;

const operations: Operation[] = [
  (a: number, b: number) => a + b,
  (a: number, b: number) => a * b,
];

class Equation {
  private constructor(readonly result: number, readonly values: number[]) {}

  canPossiblyBeTrue() {
    const [firstValue, ...restOfValues] = this.values;
    for (const permutation of generatePermutations(
      operations,
      restOfValues.length
    )) {
      const permutationResult = permutation.reduce(
        (acc, operation, index) => operation(acc, restOfValues[index]),
        firstValue
      );
      if (permutationResult === this.result) {
        return true;
      }
    }
    return false;
  }

  static fromEquationString(s: string) {
    const [resultString, valuesString] = s.split(': ');
    const result = Number(resultString);
    const values = valuesString.split(' ').map(Number);
    return new Equation(result, values);
  }
}

/** provide your solution as the return of this function */
export async function day7a(data: string[]) {
  console.log(data);
  let sum = 0;
  for (const equationString of data) {
    if (equationString.length === 0) {
      continue;
    }
    const equation = Equation.fromEquationString(equationString);
    if (!equation.canPossiblyBeTrue()) {
      continue;
    }
    sum += equation.result;
  }
  return sum;
}

await runSolution(day7a);
