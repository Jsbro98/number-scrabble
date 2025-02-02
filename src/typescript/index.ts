import {
  DragNDropManager,
  createAndAppendTiles,
  GameGrid,
  GameGridFactory,
  checkEquality,
} from './utils';
import '../style.css';

/*
fixmes:

todo list:

TODO: add double click to return to original container
TODO: change game to better denominations (5s, 2s, or 1s)
TODO: fix equalsTile to remove tiles if they're removed from the board
  - 2/2/2025

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
  // Main game grid
  const gameGrid: GameGrid = GameGridFactory();

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
    const equalsArray = DragNDropManager.getEqualsArray();

    if (equalsArray.length > 0) {
      equalsArray.forEach((equalSign) => {
        console.log(equalSign);
        console.log(checkEquality(equalSign));
      });
    }
  });

  DragNDropManager.setGameGrid(gameGrid);

  DragNDropManager.makeDragAndDropContainer(
    numberTileContainer,
    operatorTileContainer,
    gridContainer,
    equalsTileContainer
  );

  createAndAppendTiles(numberTileContainer, 30, 'number');
  createAndAppendTiles(operatorTileContainer, 20, 'operator');
  createAndAppendTiles(equalsTileContainer, 5, 'equals');
}

main();

// ########################################################################
// ########################################################################
