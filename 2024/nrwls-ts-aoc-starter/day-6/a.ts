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

const getUpperBounds = (data: Array<{ length: number }>) => ({
  x: data[0].length - 1,
  y: data.length - 1,
});

interface Position {
  x: number;
  y: number;
}

enum Direction {
  Up = '^',
  Down = 'v',
  Left = '<',
  Right = '>',
}

interface Guard extends Position {
  direction: Direction;
}

const findGuard = (mapData: MapData) => {
  for (const y in mapData) {
    const row = mapData[y];
    for (const x in row) {
      if (Object.values(Direction).includes(row[x] as Direction)) {
        return {
          direction: row[x] as Direction,
          x: Number(x),
          y: Number(y),
        } satisfies Guard;
      }
    }
  }
  throw new Error('No guard found');
};

const getNextPosition = (guard: Guard): Position => {
  switch (guard.direction) {
    case Direction.Up:
      return {
        x: guard.x,
        y: guard.y - 1,
      };
    case Direction.Down:
      return {
        x: guard.x,
        y: guard.y + 1,
      };
    case Direction.Left:
      return {
        x: guard.x - 1,
        y: guard.y,
      };
    case Direction.Right:
      return {
        x: guard.x + 1,
        y: guard.y,
      };
  }
};

const obstructionAtPosition = (mapData: MapData, { x, y }: Position) =>
  mapData[y]?.[x] === '#';

const turnRight = (guard: Guard) => {
  switch (guard.direction) {
    case Direction.Up:
      guard.direction = Direction.Right;
      break;
    case Direction.Down:
      guard.direction = Direction.Left;
      break;
    case Direction.Left:
      guard.direction = Direction.Up;
      break;
    case Direction.Right:
      guard.direction = Direction.Down;
  }
  return guard;
};

/**
 * Inclusive range check
 */
const within = (x: number, min: number, max: number) => x >= min && x <= max;

/**
 * Inclusive 2D range check
 */
const within2d = (
  c: Position,
  upperBounds: Position,
  lowerBounds: Position = { x: 0, y: 0 }
) =>
  within(c.x, lowerBounds.x, upperBounds.x) &&
  within(c.y, lowerBounds.y, upperBounds.y);

/** provide your solution as the return of this function */
export async function day6a(data: string[]) {
  console.log(data);
  const mapData = parseData(data);
  const upperBounds = getUpperBounds(mapData);
  const guard = findGuard(mapData);
  const visitedPositions = new Set<`${number},${number}`>();
  do {
    visitedPositions.add(`${guard.x},${guard.y}`);
    const nextPosition = getNextPosition(guard);
    if (obstructionAtPosition(mapData, nextPosition)) {
      turnRight(guard);
    } else {
      guard.x = nextPosition.x;
      guard.y = nextPosition.y;
    }
  } while (within2d(guard, upperBounds));
  return visitedPositions.size;
}

await runSolution(day6a);
