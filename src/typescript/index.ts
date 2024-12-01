import { DragNDropManager, createAndAppendTiles, GameGrid } from './utils';
import '../style.css';

/*
fixmes:

todo list:
TODO: create submit button for turn submition
TODO: implement equals tile functionality
TODO: implement input tracking for equals and submit
  - Use a closure for the addEventListener function for grid-container?
TODO: add click to return to original container

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
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

    getCell(row: number, index: number): string | null {
      const returnValue = this.rows[row][index];

      if (returnValue === '') return null;

      return returnValue;
    },

    setCell(row: number, index: number, value: string) {
      this.rows[row][index] = value;
    },

    removeCell(row: number, index: number) {
      this.rows[row][index] = '';
    },
  };

  DragNDropManager.setGameGrid(gameGrid);

  const numberTileContainer = document.querySelector('.number-tile-container');
  const operatorTileContainer = document.querySelector(
    '.operator-tile-container'
  );
  const equalsTileContainer = document.querySelector('.equals-tile-container');
  const gridContainer = document.querySelector('.grid-container');

  if (
    numberTileContainer === null ||
    operatorTileContainer === null ||
    equalsTileContainer === null ||
    gridContainer === null
  ) {
    throw new Error('one of the game container selectors returned null');
  }

  DragNDropManager.makeDragAndDropContainer(
    numberTileContainer,
    operatorTileContainer,
    gridContainer,
    equalsTileContainer
  );

  createAndAppendTiles(numberTileContainer, 10, 'number');
  createAndAppendTiles(operatorTileContainer, 5, 'operator');
  createAndAppendTiles(equalsTileContainer, 3, 'equals');
}

main();

// ########################################################################
// ########################################################################
