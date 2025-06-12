import {
  DragNDropManager,
  createAndAppendTiles,
  createSubmitButtonListener,
} from './utils';
import '../style.css';

/*
'*1*' syntax is used indicate which order the TODOs I'll work on them in

fixmes:

FIXME: see util.ts for current bug

todo list:

TODO: add game ending metric *2*
  - limit number of tile refils or max points

TODO: change game to better denominations (5s, 2s, or 1s) *1*

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
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

  submitButton.addEventListener('click', createSubmitButtonListener());

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
