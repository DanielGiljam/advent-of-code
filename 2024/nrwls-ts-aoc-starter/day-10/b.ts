import { runSolution } from '../utils.ts';

function parseMap(inputMap: string[]) {
  // parse the input into a 2D array of integers
  return inputMap
    .filter((row) => row.length > 0)
    .map((row) => row.split('').map(Number));
}

function findTrailheads(map: number[][]) {
  const trailheads: Array<[number, number]> = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === 0) {
        trailheads.push([i, j]);
      }
    }
  }
  return trailheads;
}

function calculateSumOfTrailRatings(map: number[][]) {
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];
  const memo = new Map();
  function countTrails(row: number, col: number) {
    const key = `${row},${col}`;
    if (memo.has(key)) {
      return memo.get(key);
    }
    const currentHeight = map[row][col];
    let trailCount = 0;
    // explore all valid moves
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 &&
        newRow < map.length &&
        newCol >= 0 &&
        newCol < map[0].length &&
        map[newRow][newCol] === currentHeight + 1
      ) {
        // recursively count trails from the new position
        trailCount += countTrails(newRow, newCol);
      }
    }
    // if we are at height 9, this is a valid endpoint
    if (currentHeight === 9) {
      trailCount = 1;
    }
    memo.set(key, trailCount);
    return trailCount;
  }
  const trailheads = findTrailheads(map);
  let sum = 0;
  for (const [row, col] of trailheads) {
    sum += countTrails(row, col);
  }
  return sum;
}

/** provide your solution as the return of this function */
export async function day9b(data: string[]) {
  console.log(data);
  const map = parseMap(data);
  const sum = calculateSumOfTrailRatings(map);
  return sum;
}

await runSolution(day9b);
