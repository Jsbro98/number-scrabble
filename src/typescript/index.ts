import { makeDragAndDropContainer, createAndAppendTiles } from './utils';

/*
todo list:

TODO move all functions to their own file to avoid test import errors
TODO create drag n drop to return tile back to container
TODO create custom classes for:
  - EqualsTile
*/


// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {

  const numberTileContainer = document.querySelector('.number-tile-container');
  const operatorTileContainer = document.querySelector('.operator-tile-container');
  const cells = document.querySelectorAll('.cell');

  if (numberTileContainer === null || operatorTileContainer === null || cells === null) {
    throw new Error('one of the game container selectors returned null');
  }

  makeDragAndDropContainer(numberTileContainer, operatorTileContainer, ...cells);
  createAndAppendTiles(numberTileContainer, 10, 'number');
  createAndAppendTiles(operatorTileContainer, 5, 'operator');
}

main();

// ########################################################################
// ########################################################################