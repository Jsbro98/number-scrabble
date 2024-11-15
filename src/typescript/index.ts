import { DragNDropManager, createAndAppendTiles } from './utils';
import '../style.css';

/*
fixmes:

todo list:
TODO: create submit button for turn submition
TODO: implement equals tile functionality
TODO: implement input tracking for simplification
TODO: add click to return to original container

*/


// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {

  const numberTileContainer = document.querySelector('.number-tile-container');
  const operatorTileContainer = document.querySelector('.operator-tile-container');
  const equalsTileContainer = document.querySelector('.equals-tile-container');
  const gridContainer = document.querySelector('.grid-container');

  if (
    numberTileContainer === null
    || operatorTileContainer === null
    || equalsTileContainer === null
    || gridContainer === null
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