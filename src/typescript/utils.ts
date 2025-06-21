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
type EqualityDirectionalArray = {
  skipped: boolean;
  result: string[];
};

/*
  ####################################################
                      Interfaces
  ####################################################
*/
export interface DirectionState {
  upDown: { isSet: boolean; changed: boolean };
  leftRight: { isSet: boolean; changed: boolean };
}
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

export interface EqualityCheckResult {
  result: boolean;
  leftRightValues: EqualityDirectionalArray;
  upDownValues: EqualityDirectionalArray;
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
              Grid reference tracker
  ####################################################
*/

export const GridReferenceManager = (() => {
  let grid: GameGrid = GameGridFactory();
  return {
    getGrid: (): GameGrid => grid,
  };
})();

/*
  ####################################################
                Equals tile tracker
  ####################################################
*/

export const EqualsTiles = (() => {
  let tiles: EqualsTile[] = [];

  return {
    addTile(tile: EqualsTile): void {
      tiles.push(tile);
    },

    removeTile(tile: EqualsTile): void {
      tiles = tiles.filter((t) => {
        return t !== tile;
      });
    },

    getTiles(): EqualsTile[] {
      return tiles;
    },
  };
})();

/*
  ####################################################
      Main drag n drop functionality object
  ####################################################
*/

export const DragNDropManager = (() => {
  // --- used for drag n drop functionality ---
  let dragElem: Element | null = null;

  // --- used for grid data tracking ---
  let grid: GameGrid = GridReferenceManager.getGrid();

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
        EqualsTiles.removeTile(e.target);
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
        EqualsTiles.addTile(e.target);
        const [row, column] = getCellPositionAndValue(e);
        e.target.position = { row, column };
      }
      // have each equals check if a tile was added around it
      EqualsTiles.getTiles().forEach((tile) => {
        tile.checkIfTileWasAddedNear();
      });
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

export function checkEquality(equalsTile: EqualsTile): EqualityCheckResult {
  const grid = GridReferenceManager.getGrid();
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
    traverse(Movement.left, leftRight, 'unshift', () => gridCell.left);
    traverse(Movement.right, leftRight, 'push', () => gridCell.right);
  }

  if (!skipUpDown) {
    traverse(Movement.up, upDown, 'unshift', () => gridCell.up);
    traverse(Movement.down, upDown, 'push', () => gridCell.down);
  }

  return {
    result: finalResultFrom(directionEvals()),
    leftRightValues: {
      skipped: skipLeftRight,
      result: leftRight,
    },
    upDownValues: {
      skipped: skipUpDown,
      result: upDown,
    },
  };

  // --- Helper functions ---

  // used for moving gridCell
  function traverse(
    direction: Movement,
    arr: string[],
    method: 'push' | 'unshift',
    check: () => StringOrNull
  ): void {
    while (check()) {
      gridCell.moveCell(direction);
      if (gridCell.current === null) break;
      arr[method](gridCell.current);
    }

    // get grid ready for another direction traversal
    gridCell.resetGridValues();
  }

  // consumes config results & outputs a final boolean
  function finalResultFrom({
    leftRightEval,
    upDownEval,
  }: {
    leftRightEval: boolean;
    upDownEval: boolean;
  }): boolean {
    if (skipLeftRight) return upDownEval!;
    if (skipUpDown) return leftRightEval!;
    return leftRightEval! && upDownEval!;
  }

  // configures array results based on skip conditions
  function directionEvals(): { leftRightEval: boolean; upDownEval: boolean } {
    let leftRightEval: boolean = false;
    let upDownEval: boolean = false;

    if (!skipLeftRight) {
      leftRightEval = evaluateExpression(leftRight);
    }

    if (!skipUpDown) {
      upDownEval = evaluateExpression(upDown);
    }

    return { leftRightEval, upDownEval };
  }

  // check a string array for total equality
  function evaluateExpression(arr: string[]): boolean {
    try {
      return arr
        .join('')
        .split('=')
        .map((expression) => evaluate(expression))
        .every((val, _, arr) => val === arr[0]); // using (val, _, arr) to reference chained array
    } catch (_) {
      return false;
    }
  }
}

/*
  ####################################################
            Submit button composed function
  ####################################################
*/

export function createSubmitButtonListener(): () => void {
  type TileGroup = {
    tile: EqualsTile;
    outcome: EqualityCheckResult;
  };
  const scoreManager = ScoreManagerFactory();
  const player = {
    current: getCurrentPlayer(),
    switchTurns() {
      this.current = this.current === 'player1' ? 'player2' : 'player1';
    },
  };

  // main listener
  return function submitButtonFunction() {
    if (updatePointsIfAllEqual()) {
      updateDivText();
      changeCurrentPlayer();
      player.switchTurns();
    }
  };

  // ----- createSubmitButtonListener helper functions -----

  function updatePointsIfAllEqual(): boolean {
    const tiles: EqualsTile[] = createEqualsToBeScored(EqualsTiles.getTiles());

    if (tiles.length <= 0) return false;

    const equalityResults = tiles.map((tile) => ({
      tile,
      outcome: tile.runEqualityCheck(),
    }));

    const allEqual = equalityResults.every(
      (tileGroup) => tileGroup.outcome.result
    );

    if (allEqual) {
      for (const tileGroup of equalityResults) {
        const pointsSent = sendPoints(tileGroup);
        if (pointsSent) {
          return true;
        }
      }
    }

    return false;
  }

  // --- updatePointsIfAllEqual helpers ---

  // give ScoreManager the points
  function sendPoints(group: TileGroup): boolean {
    const { outcome } = group;

    // tuple of the keys to iterate over
    const directions = ['leftRightValues', 'upDownValues'] as const;
    const associatedKeys = {
      leftRightValues: 'leftRight',
      upDownValues: 'upDown',
    } as const;

    for (const dir of directions) {
      const { scoreDirections } = group.tile;
      const { skipped, result: values } = outcome[dir];
      const currentDirectionObj = scoreDirections[associatedKeys[dir]];

      if (!skipped && !currentDirectionObj.isSet) {
        const points = values
          .filter((val) => (!!Number(val) ? true : false))
          .map((val) => Number(val))
          .reduce((acc, val) => acc + val, 0);
        group.tile.changeDirectionState(associatedKeys[dir]);
        scoreManager.updateScore(player.current as keyof ScoreState, points);
        group.tile.resetDirections();
        return true;
      }
    }

    return false;
  }

  // update the current score div textContent
  function updateDivText() {
    const playerNumber: string = player.current.at(-1)!;
    const currentPlayerDiv: Element = document.querySelector(
      `.player-${playerNumber} > :nth-child(2)`
    )!;

    currentPlayerDiv.textContent = scoreManager
      .getState()
      [`${player.current as keyof ScoreState}`].toString();
  }
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

export function getCellPositionAndValue(
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

function getCurrentPlayer(): string {
  return document
    .querySelector('.current-player-span')!
    .textContent?.split(' ')
    .join('')
    .toLowerCase()!;
}

function changeCurrentPlayer(): void {
  const currentPlayer = getCurrentPlayer();
  const nextPlayer = currentPlayer === 'player1' ? 'Player 2' : 'Player 1';
  document.querySelector('.current-player-span')!.textContent = nextPlayer;
}

function createEqualsToBeScored(tiles: EqualsTile[]): EqualsTile[] {
  return tiles.filter((tile) =>
    Object.values(tile.scoreDirections).some((dir) => dir.changed)
  );
}
