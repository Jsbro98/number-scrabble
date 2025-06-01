import { evaluate } from 'mathjs';
import { MovableGridCell } from './movableGridCell';
import { EqualsTile, NumberTile, OperatorTile } from './tile';

/*
  ####################################################
                      Types
  ####################################################
*/
export enum Movement {
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
}

export type StringOrNull = string | null;
export type Tile = NumberTile | OperatorTile | EqualsTile;
export type ScoreState = {
  player1: number;
  player2: number;
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

export interface CellPosition {
  row: number;
  column: number;
}

export interface ScoreManager {
  getState: () => ScoreState;
  updateScore: (player: keyof ScoreState, value: number) => ScoreState;
  resetScore: () => ScoreState;
}

export interface TraversableCell {
  moveCell(movement: Movement): void;
  left: StringOrNull;
  right: StringOrNull;
  up: StringOrNull;
  down: StringOrNull;
}

// *================================================================*
// *------------------- Core game modules --------------------------*
// *================================================================*

/*
  ####################################################
      Main drag n drop functionality object
  ####################################################
*/

export const DragNDropManager = (() => {
  // --- used for drag n drop functionality ---
  let dragElem: Element | null = null;

  // --- used to keep track of last placed equals tile ---
  let equalsTiles: EqualsTile[] = [];

  // --- used for grid data tracking ---
  let grid: GameGrid;

  function setGameGrid(setValue: GameGrid) {
    grid = setValue;
  }

  function getGameGrid(): GameGrid {
    return grid;
  }

  function getEqualsArray(): EqualsTile[] {
    return equalsTiles;
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

        if (dragElem !== null && checkIfDropIsAllowed(e, dragElem)) {
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
    // ##### dragstart #####
    element.addEventListener('dragstart', (e) => {
      if (e.target instanceof Element) {
        dragElem = e.target;

        if (!dropAllowedHelper.containerContainsCell(e.target.parentElement!)) {
          return;
        }
      }

      const [row, column] = getCellPositionAndValue(e, true);
      grid.removeCell(row, column);

      if (e.target instanceof EqualsTile) {
        const equalsIndex = equalsTiles.findIndex(
          (tile) => tile.position.row === row && tile.position.column === column
        );

        if (equalsIndex !== -1) {
          equalsTiles.splice(equalsIndex, 1);
        }
      }
    });

    // ##### dragend #####
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
        equalsTiles.push(e.target);
        const [row, column] = getCellPositionAndValue(e);
        equalsTiles.at(-1)!.position = { row, column };
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
    getEqualsArray,
  };
})();

// ##### Double-click handler #####
/* - dragstart & dragend are simulated to ensure
     grid tracking logic execution
*/
export const DoubleClickHandler = {
  handleDoubleClick(event: MouseEvent) {
    const tile = event.currentTarget as Tile;
    const parent = tile.parentElement;
    const originalContainer = this.getOriginalContainer(tile);

    // if the tile is already in it's home container, return
    if (parent && parent.classList.contains(originalContainer)) {
      return;
    }

    // now grab the container
    const originalElement = document.querySelector('.' + originalContainer);

    if (!originalElement) {
      throw new Error(
        `Original container not found for tile type: ${tile.constructor.name}`
      );
    }

    tile.dispatchEvent(new DragEvent('dragstart')); // simulate dragstart event

    parent?.removeChild(tile);
    originalElement.appendChild(tile);

    tile.dispatchEvent(new DragEvent('dragend')); // simulate dragend event
  },

  getOriginalContainer(tile: Tile): string {
    if (tile instanceof NumberTile) return 'number-tile-container';
    if (tile instanceof OperatorTile) return 'operator-tile-container';
    if (tile instanceof EqualsTile) return 'equals-tile-container';
    throw new Error('Unknown tile type');
  },
};

/*
  ####################################################
          Game score keeping functionality
  ####################################################
*/

export function createScoreState(): ScoreState {
  return {
    player1: 0,
    player2: 0,
  };
}

// I wanted to try a functional approach to keeping score
export function ScoreManagerFactory(
  initialState: ScoreState = createScoreState()
): ScoreManager {
  let state = initialState;
  return {
    getState: (): ScoreState => ({ ...state }),
    updateScore: (player: keyof ScoreState, value: number): ScoreState => {
      state = {
        ...state,
        [player]: state[player] + value,
      };
      return state;
    },
    resetScore: (): ScoreState => {
      state = createScoreState();
      return state;
    },
  };
}

/*
  ####################################################
          Main equality checking function
  ####################################################
*/

export function checkEquality(equalsTile: EqualsTile): boolean {
  const grid = DragNDropManager.getGameGrid();
  const row = equalsTile.position.row;
  const column = equalsTile.position.column;

  // used to see if upDown or leftRight will be used
  let skipLeftRight = false;
  let skipUpDown = false;

  // used for easy grid movement
  const gridCell: MovableGridCell = new MovableGridCell(grid, row, column);

  if (gridCell.left === null || gridCell.right === null) skipLeftRight = true;
  if (gridCell.up === null || gridCell.down === null) skipUpDown = true;

  // respective left & right/up & down grid references
  const leftRight = ['='];
  const upDown = ['='];

  if (!skipLeftRight) {
    while (gridCell.left) {
      gridCell.moveCell(Movement.left);

      if (gridCell.current === null) break;

      leftRight.unshift(gridCell.current);
    }

    gridCell.resetGridValues();

    while (gridCell.right) {
      gridCell.moveCell(Movement.right);

      if (gridCell.current === null) break;

      leftRight.push(gridCell.current);
    }

    // get grid ready for possible up & down traversal
    gridCell.resetGridValues();
  }

  if (!skipUpDown) {
    while (gridCell.up) {
      gridCell.moveCell(Movement.up);

      if (gridCell.current === null) break;

      upDown.unshift(gridCell.current);
    }

    gridCell.resetGridValues();

    while (gridCell.down) {
      gridCell.moveCell(Movement.down);

      if (gridCell.current === null) break;

      upDown.push(gridCell.current);
    }

    gridCell.resetGridValues();
  }

  // used for final return values
  let leftRightEval: boolean;
  let upDownEval: boolean;

  if (!skipLeftRight) {
    leftRightEval = leftRight
      .join('')
      .split('=')
      .map((expression) => evaluate(expression))
      .every((val, _, arr) => val === arr[0]); // using (val, _, arr) to reference chained array
  }

  if (!skipUpDown) {
    upDownEval = upDown
      .join('')
      .split('=')
      .map((expression) => evaluate(expression))
      .every((val, _, arr) => val === arr[0]);
  }

  if (skipLeftRight) return upDownEval!;
  if (skipUpDown) return leftRightEval!;
  return leftRightEval! && upDownEval!;
}

// *================================================================*
// *----------------------------------------------------------------*
// *================================================================*

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

export function TileFactory(type: string) {
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

export function GameGridFactory(): GameGrid {
  return {
    rows: [
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ],

    lastTenMoves: [],

    getCell(row: number, index: number): string | null {
      if (row < 0 || row > 14 || index < 0 || index > 14) return null;

      const returnValue = this.rows[row][index];

      if (returnValue === '') return null;

      return returnValue;
    },

    setCell(row: number, index: number, value: string) {
      this.rows[row][index] = value;
      this.lastTenMoves.push({ position: [row, index], value });

      if (this.lastTenMoves.length > 10) {
        this.lastTenMoves.shift();
      }
    },

    removeCell(row: number, index: number) {
      this.rows[row][index] = '';
      for (const move of this.lastTenMoves) {
        if (move.position[0] === row && move.position[1] === index) {
          const index = this.lastTenMoves.indexOf(move);
          this.lastTenMoves.splice(index, 1);
        }
      }
    },
  };
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
