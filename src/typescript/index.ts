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

TODO: make turn switching possible
TODO: add drawing tiles when low or empty option (uses turn)
  - limit number of refills (game ending metric)
TODO: add score keeping
  - create a object for keeping score
TODO: change game to better denominations (5s, 2s, or 1s)

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
  const currentPlayer = document.querySelector('.current-player');

  if (
    numberTileContainer === null ||
    operatorTileContainer === null ||
    equalsTileContainer === null ||
    gridContainer === null ||
    submitButton === null ||
    currentPlayer === null
  ) {
    throw new Error('one of the game container selectors returned null');
  }

  submitButton.addEventListener('click', () => {
    const equalsArray = DragNDropManager.getEqualsArray();
    if (equalsArray.length <= 0) return;

    return equalsArray.forEach((equals) => {
      checkEquality(equals);
    });
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
