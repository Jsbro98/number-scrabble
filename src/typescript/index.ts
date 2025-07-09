/**
 * Number Scrabble
 *
 *  !IMPORTANT! to reset the game, refresh the page.
 *
 * Rules:
 *   1. You can place as many tiles as you want during a given turn
 *
 *   2. the number on the tiles is their point value.
 *      the equations entire point value is calculated by adding
 *      all the tiles together in a equation
 *     ex: 2 + 2 = 4 this gives 8 points to the player
 *
 *   3. equations can be chained for maximum points
 *     ex: 2 + 2 = 4 = 8 / 2 this gives 18 points to the player
 *
 *   4. tiles will become immovable after they're scored
 *
 *   5. you cannot chain on operators & operands to already existing equations
 *      only new equations starting with an equals sign ('=') tile.
 *      ex:
 *       1 + 1 = 2 => *submits* scored
 *       (1 +) 1 + 1 = 2 (+ 1) <- this is then not allowed
 *        ^^              ^^
 *       operators & operands within the () signal new tiles the player added
 *
 * TODOs and fixmes are tracked in the comments below for ongoing development.
 */

import {
  DragNDropManager,
  createAndAppendTiles,
  createSubmitButtonListener,
} from './utils';
import '../style.css';

/*
'*1*' syntax is used indicate which order the TODOs I'll work on them in

fixmes:

todo list:

TODO: add a reset button?

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
  addPlayerLogic();
  addLogicToUIAndGrid();
}

main();

// ########################################################################
// ########################################################################

// ---- Main helpers ----

function addLogicToUIAndGrid(): void {
  const gridContainer = document.querySelector('.grid-container');
  const submitButton = document.querySelector('.submit-move');
  const currentPlayer = document.querySelector('.current-player');

  if (
    gridContainer === null ||
    submitButton === null ||
    currentPlayer === null
  ) {
    throw new Error('one of the game container selectors returned null');
  }

  DragNDropManager.makeDragAndDropContainer(gridContainer);

  submitButton.addEventListener('click', createSubmitButtonListener());
}

function addPlayerLogic(): void {
  addLogicToPlayer('player-one');
  addLogicToPlayer('player-two');
}

function addLogicToPlayer(player: string): void {
  const root = document.querySelector(`.${player}`)!;
  const numberTileContainer = root.querySelector('.number-tile-container');
  const operatorTileContainer = root.querySelector('.operator-tile-container');
  const equalsTileContainer = root.querySelector('.equals-tile-container');

  if (
    numberTileContainer === null ||
    operatorTileContainer === null ||
    equalsTileContainer === null
  ) {
    throw new Error('one of the game container selectors returned null');
  }

  DragNDropManager.makeDragAndDropContainer(
    numberTileContainer,
    operatorTileContainer,
    equalsTileContainer
  );

  createAndAppendTiles(numberTileContainer, 30, 'number');
  createAndAppendTiles(operatorTileContainer, 20, 'operator');
  createAndAppendTiles(equalsTileContainer, 15, 'equals');
}
