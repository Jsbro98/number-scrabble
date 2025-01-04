import { EqualsTile, NumberTile, OperatorTile } from './tile';
import { Equation, EquationChecker } from './equationChecker';

/*
  ####################################################
                      Types
  ####################################################
*/

export type CellPosition = {
  row: number;
  column: number;
};

/*
  ####################################################
                      Interfaces
  ####################################################
*/

export interface GameGrid {
  rows: string[][];
  lastTenMoves: GameMove[];
  getCell(row: number, index: number): string | null;
  setCell(row: number, index: number, value: string): void;
  removeCell(row: number, index: number): void;
}

export interface GameMove {
  position: [number, number];
  value: string;
}

/*
  ####################################################
      Main drag n drop functionality object
  ####################################################
*/

export const DragNDropManager = (() => {
  // --- used for drag n drop functionality ---
  let dragElem: Element | null = null;

  // --- used to keep track of last placed equals tile ---
  let lastPlacedEqualsTile: EqualsTile | null = null;

  // --- used for grid data tracking ---
  let grid: GameGrid;

  function setGameGrid(setValue: GameGrid) {
    grid = setValue;
  }

  function getGameGrid(): GameGrid {
    return grid;
  }

  function getLastPlacedEquals(): EqualsTile | null {
    return lastPlacedEqualsTile;
  }

  // helper object used only for checkIfDropIsAllowed
  const dropAllowedHelper = {
    dragElemIsMatchingContainerClass(
      target: Element,
      dragElement: Element
    ): boolean {
      const targetClassName = target.classList[0].split('-')[0];
      const dragElemClassName = dragElement.getAttribute('is')?.split('-')[0];

      return targetClassName === dragElemClassName;
    },

    containerContainsCell(container: Element): boolean {
      return container.classList.contains('cell');
    },

    isATileContainer(elem: Element): boolean {
      const className = elem.classList[0].split('-')[0];
      return (
        className.includes('number') ||
        className.includes('equals') ||
        className.includes('operator')
      );
    },
  };

  // ##### DragNDropManager Functions #####

  // Drag n drop container enabler
  function makeDragAndDropContainer(...elements: Element[]) {
    elements.forEach((elem) => {
      elem.addEventListener('drop', (e) => {
        e.preventDefault();

        if (!(e.target instanceof Element)) return;
        if (
          !e.target.classList.contains('drag-target') &&
          !e.target.classList.contains('cell')
        )
          return;
        if (e.target.classList.contains('cell') && e.target.hasChildNodes())
          return;

        if (dragElem != null && checkIfDropIsAllowed(e, dragElem)) {
          dragElem.parentNode?.removeChild(dragElem);
          e.target.appendChild(dragElem);
          dragElem = null;
        }
      });

      // Allow drop within containers
      elem.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
    });
  }

  // Draggable tile logic
  function setTileDragEvent(element: Element) {
    element.addEventListener('dragstart', (e) => {
      if (e.target instanceof Element) {
        dragElem = e.target;

        if (!dropAllowedHelper.containerContainsCell(e.target.parentElement!)) {
          return;
        }
      }

      const [row, column] = getCellPositionAndValue(e, true);
      grid.removeCell(row, column);
    });

    element.addEventListener('dragend', (e) => {
      if (e.target instanceof Element) {
        if (!dropAllowedHelper.containerContainsCell(e.target.parentElement!)) {
          return;
        }
      }
      const [row, column, value] = getCellPositionAndValue(e, true);
      if (value) {
        grid.setCell(row, column, value);
      } else {
        throw new Error('value is undefined in getCellPositionAndValue');
      }
      if (e.target instanceof EqualsTile) {
        lastPlacedEqualsTile = e.target;
        const [row, column] = getCellPositionAndValue(e);
        lastPlacedEqualsTile.position = { row, column };
      }
    });
  }

  // private
  function checkIfDropIsAllowed(event: Event, dragElem: Element): boolean {
    if (!event.target) throw new Error('e.target is falsy!');

    const target = event.target as Element;

    if (dropAllowedHelper.containerContainsCell(target)) return true;
    if (
      dropAllowedHelper.isATileContainer(target) &&
      dropAllowedHelper.dragElemIsMatchingContainerClass(target, dragElem)
    )
      return true;

    return false;
  }

  // ##### DragNDrop public functions #####
  return {
    makeDragAndDropContainer,
    setTileDragEvent,
    setGameGrid,
    getGameGrid,
    getLastPlacedEquals,
  };
})();

/*
  ####################################################
          Helper functions used in index.ts
  ####################################################
*/

// Random number generator
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

// Create and Append tile function
export function createAndAppendTiles(
  container: Element,
  numberOfTiles: number,
  type: string
): void {
  for (let i = 0; i < numberOfTiles; i++) {
    container.appendChild(TileFactory(type));
  }
}

// Tile factory
function TileFactory(type: string) {
  if (type === 'number') {
    return new NumberTile();
  }

  if (type === 'operator') {
    return new OperatorTile();
  }

  if (type === 'equals') {
    return new EqualsTile();
  }

  throw new TypeError('type parameter is not valid');
}

function getCellPositionAndValue(
  e: Event,
  includeValue: boolean = false
): [number, number] | [number, number, string] {
  const tile = e.target as Element;
  const cell = tile.parentElement!;

  const text: string = tile.textContent!;
  const column: number = Number(cell.parentElement?.classList[1]) - 1;
  const row: number = (() => {
    const columnChildren = cell.parentNode?.children;
    return Array.prototype.indexOf.call(columnChildren, cell);
  })();

  if (includeValue) {
    return [row, column, text];
  }

  return [row, column];
}

// ##### function for gameGrid equation checking checking #####

export function checkEquality(equalsTile: EqualsTile): boolean {
  const grid = DragNDropManager.getGameGrid();
  const equationChecker: EquationChecker = new EquationChecker();
  const row = equalsTile.position.row;
  const column = equalsTile.position.column;

  const upDown = traverseUpDown(row, column);
  const leftRight = traverseLeftRight(row, column);

  let leftRightEval: boolean = false;
  let upDownEval: boolean = false;

  if (leftRight) {
    equationChecker.setEquation(leftRight);
    leftRightEval = equationChecker.checkEquation();
  }

  if (upDown) {
    equationChecker.setEquation(upDown);
    upDownEval = equationChecker.checkEquation();
  }

  if (upDown && leftRight) {
    return leftRightEval && upDownEval;
  }

  if (upDown && leftRight === null) {
    return upDownEval;
  }

  if (upDown === null && leftRight) {
    return leftRightEval;
  }

  console.log('Error evaluating equality in "checkEquality" in utils.ts');
  return false;

  // helper functions for grid traversal
  function traverseUpDown(row: number, column: number): Equation | null {
    const leftSide = [];
    const rightSide = [];
    let currentRow = row;
    let currentColumn = column;

    let above = grid.getCell(++currentRow, currentColumn);

    if (above === null) {
      return null;
    }

    while (above) {
      leftSide.push(above);
      above = grid.getCell(++currentRow, currentColumn);
    }

    // reset values before loop
    [currentRow, currentColumn] = [row, column];

    let below = grid.getCell(--currentRow, currentColumn);

    if (below === null) {
      return null;
    }

    while (below) {
      rightSide.unshift(below);
      below = grid.getCell(--currentRow, column);
    }

    return { leftSide: leftSide.join(' '), rightSide: rightSide.join(' ') };
  }

  function traverseLeftRight(row: number, column: number): Equation | null {
    const leftSide = [];
    const rightSide = [];
    let currentRow = row;
    let currentColumn = column;

    let left = grid.getCell(currentRow, --currentColumn);

    if (left === null) {
      return null;
    }

    while (left) {
      leftSide.unshift(left);
      left = grid.getCell(currentRow, --currentColumn);
    }

    // reset values before loop
    [currentRow, currentColumn] = [row, column];

    let right = grid.getCell(currentRow, ++currentColumn);

    if (right === null) {
      return null;
    }

    while (right) {
      rightSide.push(right);
      right = grid.getCell(currentRow, ++currentColumn);
    }

    return { leftSide: leftSide.join(' '), rightSide: rightSide.join(' ') };
  }
}
