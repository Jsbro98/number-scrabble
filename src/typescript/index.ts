import {
  DragNDropManager,
  createAndAppendTiles,
  GameGrid,
  checkEquality,
} from './utils';
import '../style.css';

/*
fixmes:

todo list:

TODO: add double click to return to original container
TODO: change game to better denominations (5s, 2s, or 1s)
TODO: test and possibly fix when equations touch

1/4 - continue with equation combinations as listed above ^^
  ex: 1 + 1 = 4 - 2 = 3 - 1

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
  // Main game grid
  const gameGrid: GameGrid = {
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
      for (let move of this.lastTenMoves) {
        if (move.position[0] === row && move.position[1] === index) {
          const index = this.lastTenMoves.indexOf(move);
          this.lastTenMoves.splice(index, 1);
        }
      }
    },
  };

  const numberTileContainer = document.querySelector('.number-tile-container');
  const operatorTileContainer = document.querySelector(
    '.operator-tile-container'
  );
  const equalsTileContainer = document.querySelector('.equals-tile-container');
  const gridContainer = document.querySelector('.grid-container');
  const submitButton = document.querySelector('.submit-move');

  if (
    numberTileContainer === null ||
    operatorTileContainer === null ||
    equalsTileContainer === null ||
    gridContainer === null ||
    submitButton === null
  ) {
    throw new Error('one of the game container selectors returned null');
  }

  submitButton.addEventListener('click', () => {
    const currentEquals = DragNDropManager.getLastPlacedEquals();

    if (currentEquals) {
      console.log(checkEquality(currentEquals));
    }
  });

  DragNDropManager.setGameGrid(gameGrid);

  DragNDropManager.makeDragAndDropContainer(
    numberTileContainer,
    operatorTileContainer,
    gridContainer,
    equalsTileContainer
  );

  createAndAppendTiles(numberTileContainer, 20, 'number');
  createAndAppendTiles(operatorTileContainer, 10, 'operator');
  createAndAppendTiles(equalsTileContainer, 5, 'equals');
}

main();

// ########################################################################
// ########################################################################
