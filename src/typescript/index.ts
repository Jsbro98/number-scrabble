import {
  DragNDropManager,
  createAndAppendTiles,
  GameGrid,
  checkEquality,
  GameGridFactory,
} from './utils';
import '../style.css';

/*
fixmes:

todo list:

TODO: add double click to return to original container
TODO: change game to better denominations (5s, 2s, or 1s)
TODO: test and possibly fix when equations touch
  - rewrite equation handling to be less verbose.
  - this should lead to fixing the combinations listed below
    ** accumulate the whole string & split at the "=" signs

1/4 - continue with equation combinations as listed above ^^
  ex: 1 + 1 = 4 - 2 = 3 - 1

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

  createAndAppendTiles(numberTileContainer, 30, 'number');
  createAndAppendTiles(operatorTileContainer, 20, 'operator');
  createAndAppendTiles(equalsTileContainer, 5, 'equals');
}

main();

// ########################################################################
// ########################################################################
