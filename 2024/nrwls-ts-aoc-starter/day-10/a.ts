import { runSolution } from '../utils.ts';

function parseMap(data: string[]) {
  // parse the input into a 2D array of integers
  return data
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

function exploreTrails(map: number[][], start: [number, number]) {
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
  ];
  const visited = new Set();
  const queue = [[...start, map[start[0]][start[1]]]]; // [row, col, height]
  const reachableNines = new Set();
  while (queue.length > 0) {
    const [row, col, height] = queue.shift();
    const key = `${row},${col}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (
        newRow >= 0 &&
        newRow < map.length &&
        newCol >= 0 &&
        newCol < map[0].length
      ) {
        const newHeight = map[newRow][newCol];
        if (newHeight === height + 1) {
          queue.push([newRow, newCol, newHeight]);
          if (newHeight === 9) {
            reachableNines.add(`${newRow},${newCol}`);
          }
        }
      }
    }
  }
  return reachableNines.size;
}

/** provide your solution as the return of this function */
export async function day10a(data: string[]) {
  console.log(data);
  const map = parseMap(data);
  const trailheads = findTrailheads(map);
  let score = 0;
  for (const trailhead of trailheads) {
    score += exploreTrails(map, trailhead);
  }
  return score;
}

await runSolution(day10a);
