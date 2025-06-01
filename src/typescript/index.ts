import {
  DragNDropManager,
  createAndAppendTiles,
  GameGrid,
  GameGridFactory,
  checkEquality,
  ScoreManagerFactory,
  ScoreManager,
} from './utils';
import '../style.css';

/*
'*1*' syntax is used indicate which order the TODOs I'll work on them in

fixmes:

todo list:

TODO: add drawing tiles when low or empty option (uses turn) *3*
  - limit number of refills (game ending metric)

TODO: add score keeping *2*
  - make turn switching possible
  - implement logic using ScoreManager & ScoreState
    + display the logic to the player-one-score & player-two-score

TODO: add point collecting system for when a turn is submitted *1*
  - logic should be if checkEquality returns true, add the points to the
  current player's score

TODO: change game to better denominations (5s, 2s, or 1s) *4*

*/

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
  // Main game grid
  const gameGrid: GameGrid = GameGridFactory();

  // Main score keeping logic
  const scoreManager: ScoreManager = ScoreManagerFactory();

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
