import { runSolution } from '../utils.ts';

type MapData = string[][];

const parseData = (data: string[]) => {
  const mapData: MapData = [];
  for (const row of data) {
    if (row.length > 0) {
      mapData.push(row.split(''));
    }
  }
  return mapData;
};

interface Position {
  x: number;
  y: number;
}

interface Antenna extends Position {
  f: string;
}

const getAntennasGroupedByFrequency = (mapData: MapData) => {
  const groupedByFrequency: { [f: string]: Antenna[] } = {};
  for (const y in mapData) {
    const row = mapData[y];
    for (const x in row) {
      const f = row[x];
      if (f !== '.') {
        const antenna = { f, x: Number(x), y: Number(y) };
        (groupedByFrequency[f] ??= []).push(antenna);
      }
    }
  }
  return groupedByFrequency;
};

const getUpperBounds = (data: Array<{ length: number }>) => ({
  x: data[0].length - 1,
  y: data.length - 1,
});

/**
 * https://stackoverflow.com/a/55492856/9235291
 * (with minor modifications to omit "self pairs")
 */
function* getPairs<T>(array: T[], left?: T): Generator<[T, T]> {
  let i = 0;
  while (i < array.length) {
    if (left != null) {
      if (left !== array[i]) {
        yield [left, array[i]];
      }
    } else {
      yield* getPairs(array.slice(i), array[i]);
    }
    i++;
  }
}

/**
 * Inclusive range check
 */
const within = (x: number, min: number, max: number) => x >= min && x <= max;

/**
 * Inclusive 2D range check
 */
const within2d = (
  position: Position,
  upperBounds: Position,
  lowerBounds: Position = { x: 0, y: 0 }
) =>
  within(position.x, lowerBounds.x, upperBounds.x) &&
  within(position.y, lowerBounds.y, upperBounds.y);

const createEmptyMapData = (upperBounds: Position) =>
  ('.'.repeat(upperBounds.x + 1) + '\n')
    .repeat(upperBounds.y + 1)
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) => row.split(''));

const drawPair = (
  mapData: MapData,
  a1: Antenna,
  a2: Antenna,
  anc1: Position,
  anc2: Position
) => {
  mapData[a1.y][a1.x] = a1.f;
  mapData[a2.y][a2.x] = a1.f;
  const upperBounds = getUpperBounds(mapData);
  if (within2d(anc1, upperBounds)) {
    mapData[anc1.y][anc1.x] = '#';
  }
  if (within2d(anc2, upperBounds)) {
    mapData[anc2.y][anc2.x] = '#';
  }
  return mapData;
};

const printMapData = (mapData: MapData) => {
  console.log(mapData.map((row) => row.join(' ')).join('\n') + '\n');
};

/** provide your solution as the return of this function */
export async function day8a(data: string[]) {
  console.log(data);
  const mapData = parseData(data);
  const upperBounds = getUpperBounds(mapData);
  const groupedByFrequency = getAntennasGroupedByFrequency(mapData);
  const antiNodePositions = new Set<`${number},${number}`>();
  for (const group of Object.values(groupedByFrequency)) {
    for (const [a1, a2] of getPairs(group)) {
      const diff = {
        x: a1.x - a2.x,
        y: a1.y - a2.y,
      };
      const anc1 = {
        x: a1.x + diff.x,
        y: a1.y + diff.y,
      };
      if (within2d(anc1, upperBounds)) {
        antiNodePositions.add(`${anc1.x},${anc1.y}`);
      }
      const anc2 = {
        x: a2.x - diff.x,
        y: a2.y - diff.y,
      };
      if (within2d(anc2, upperBounds)) {
        antiNodePositions.add(`${anc2.x},${anc2.y}`);
      }
      // const _mapData = createEmptyMapData(upperBounds);
      // drawPair(_mapData, a1, a2, anc1, anc2);
      // printMapData(_mapData);
      // drawPair(mapData, a2, a1, anc2, anc1);
    }
  }
  // printMapData(mapData);
  return antiNodePositions.size;
}

await runSolution(day8a);
