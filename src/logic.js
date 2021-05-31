import * as R from "ramda";

const BLOCK = "O";
export const DIRECTIONS = { UP: 1, DOWN: 2, LEFT: 3, RIGHT: 4 };
DIRECTIONS.toString = function (x) {
  switch (x) {
    case DIRECTIONS.UP:
      return "UP";
    case DIRECTIONS.DOWN:
      return "DOWN";
    case DIRECTIONS.LEFT:
      return "LEFT";
    case DIRECTIONS.RIGHT:
      return "RIGHT";
    default:
      return "UNKOWN";
  }
};

export function makeGrid(x, y) {
  const grid = [];
  for (let i = 0; i < x; i++) {
    grid[i] = [];
    for (let j = 0; j < y; j++) {
      grid[i][j] = 0;
    }
  }
  grid.size = [x, y];
  grid.terminalStates = [];
  return grid;
}

export function addTerminalState(i, j, value, grid) {
  let newGrid = R.clone(grid);
  newGrid[i][j] = value;
  newGrid.terminalStates = getTerminalStates(grid);
  newGrid.terminalStates.push([i, j]);
  return newGrid;
}
export function isTerminalState(i, j, grid) {
  return grid.terminalStates.some(([x, y]) => x === i && j === y);
}

export function addBlock(i, j, grid) {
  return updateCellValue(i, j, BLOCK, grid);
}

export function isBlock(i, j, grid) {
  return getCellValue(i, j, grid) === BLOCK;
}
export function isValueBlock(value) {
  return value === BLOCK;
}
function getTerminalStates(grid) {
  return grid.terminalStates || [];
}

export function step(R, gamma, T, grid, i = 0, j = 0, resultGrid = grid) {
  if (i === sizeOfGrid(grid)[0]) {
    return resultGrid;
  }
  const [nextI, nextJ] = nextCell(i, j, sizeOfGrid(grid));
  if (isTerminalState(i, j, grid) || isBlock(i, j, grid)) {
    return step(R, gamma, T, grid, nextI, nextJ, resultGrid);
  }

  const allValues = calculateAllValuesForCell(i, j, grid, R, gamma, T);
  const bestValue = Math.max(...allValues);
  const newGrid = updateCellValue(i, j, bestValue, resultGrid);
  return step(R, gamma, T, grid, nextI, nextJ, newGrid);
}

export function algorithm(
  grid,
  howManySteps = 10,
  Reward = 0,
  gamma = 0.9,
  eps = 0.01
) {
  let newGrid = R.clone(grid);
  for (let i = 0; i < howManySteps; i++)
    newGrid = step(Reward, gamma, 0.8, newGrid);
  return newGrid;
}

export function getDirection(i, j, grid) {
  const { up, down, left, right } = getNeighborValues(
    i,
    j,
    grid,
    Number.MIN_SAFE_INTEGER
  );

  const bestValue = Math.max(up, down, left, right);

  if (bestValue === left) return DIRECTIONS.LEFT;
  if (bestValue === right) return DIRECTIONS.RIGHT;
  if (bestValue === down) return DIRECTIONS.DOWN;
  return DIRECTIONS.UP;
}

export function getCellValue(i, j, grid) {
  try {
    return grid[i][j];
  } catch (e) {
    return undefined;
  }
}
function equals([i, j], [x, y]) {
  return i === x && j === y;
}
function isValidCoordForCell(i, j, gridSize) {
  return i >= 0 && i < gridSize[0] && j >= 0 && j < gridSize[1];
}
function isValidNeighbor(i, j, grid) {
  return !isBlock(i, j, grid) && isValidCoordForCell(i, j, sizeOfGrid(grid));
}

function getNeighborValues(i, j, grid, defaultCellValue = 0) {
  const upCellValue = isValidNeighbor(i - 1, j, grid)
    ? getCellValue(i - 1, j, grid)
    : defaultCellValue;
  const rightCellValue = isValidNeighbor(i, j + 1, grid)
    ? getCellValue(i, j + 1, grid)
    : defaultCellValue;
  const leftCellValue = isValidNeighbor(i, j - 1, grid)
    ? getCellValue(i, j - 1, grid)
    : defaultCellValue;
  const bottomCellValue = isValidNeighbor(i + 1, j, grid)
    ? getCellValue(i + 1, j, grid)
    : defaultCellValue;

  return {
    up: upCellValue,
    left: leftCellValue,
    right: rightCellValue,
    down: bottomCellValue,
  };
}

function calculateAllValuesForCell(i, j, grid, R, gamma, T) {
  const thisCellValue = getCellValue(i, j, grid);

  const upCellValue = isValidNeighbor(i - 1, j, grid)
    ? getCellValue(i - 1, j, grid)
    : thisCellValue;
  const rightCellValue = isValidNeighbor(i, j + 1, grid)
    ? getCellValue(i, j + 1, grid)
    : thisCellValue;
  const leftCellValue = isValidNeighbor(i, j - 1, grid)
    ? getCellValue(i, j - 1, grid)
    : thisCellValue;
  const bottomCellValue = isValidNeighbor(i + 1, j, grid)
    ? getCellValue(i + 1, j, grid)
    : thisCellValue;

  const result = [];

  result.push(
    0.8 * (R + gamma * upCellValue) +
      0.1 * (R + gamma * rightCellValue) +
      0.1 * (R + gamma * leftCellValue)
  );

  result.push(
    0.8 * (R + gamma * bottomCellValue) +
      0.1 * (R + gamma * rightCellValue) +
      0.1 * (R + gamma * leftCellValue)
  );

  result.push(
    0.8 * (R + gamma * rightCellValue) +
      0.1 * (R + gamma * upCellValue) +
      0.1 * (R + gamma * bottomCellValue)
  );

  result.push(
    0.8 * (R + gamma * leftCellValue) +
      0.1 * (R + gamma * upCellValue) +
      0.1 * (R + gamma * bottomCellValue)
  );
  return result;
}

export function sizeOfGrid(grid) {
  return grid.size;
}
function nextCell(i, j, [x, y]) {
  if (j + 1 >= y) {
    return [i + 1, 0];
  }
  return [i, j + 1];
}

export function updateCellValue(i, j, newValue, grid) {
  const newGrid = R.clone(grid);
  newGrid[i][j] = newValue;
  return newGrid;
}
