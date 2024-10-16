/*

todo list:

TODO create equals sign tile
TODO create functionality for equation checking
TODO create drag n drop to return tile back to container

*/

// Tile Type
export type NumberTile = {
  element: Element;
  value: number;
};

export type OperatorTile = {
  element: Element;
  operator: string;
};

// used for drag n drop
// TODO remove from global scope
let dragElem: Element | null = null;

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {

  const numberTileContainer = document.querySelector('.number-tile-container');
  const operatorTileContainer = document.querySelector('.operator-tile-container');
  const cells = document.querySelectorAll('.cell');

  setCellDragDropEvents(cells);

  if (numberTileContainer !== null) {
    createAndAppendTiles(numberTileContainer, 10, 'number');
  }

  if (operatorTileContainer !== null) {
    createAndAppendTiles(operatorTileContainer, 5, 'operator');
  }
}
main();
// ########################################################################
// ########################################################################

// Random number generator
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * (max) + 1);
}

// Create and Append tile function
function createAndAppendTiles(container: Element, numberOfTiles: number, type: string): void {
  for (let i = 0; i < numberOfTiles; i++) {
    container.appendChild(TileFactory(type).element);
  }
}

// Tile factory
export function TileFactory(type: string) {
  if (type === 'number') {
    return generateNumberTile();
  }

  if (type === 'operator') {
    return generateOperatorTile();
  }

  throw new TypeError('type parameter is not valid');
}

// NumberTile Generator
export function generateNumberTile(): NumberTile {
  const element: Element = createTileElement();
  const tileValue = getRandomNumber(10);
  element.textContent = tileValue.toString();

  setTileDragEvent(element);

  return {
    element,
    value: tileValue,
  };
}

// OperatorTile generator
export function generateOperatorTile(): OperatorTile {
  const operators: string[] = ['+', '-', '*', '/'];
  const element = createTileElement();
  const operatorValue = operators[getRandomNumber(operators.length) - 1];
  element.textContent = operatorValue;

  setTileDragEvent(element);

  return {
    element,
    operator: operatorValue,
  }
}

// Cell event logic
function setCellDragDropEvents(cells: NodeListOf<Element>) {
  cells.forEach(cell => {
    cell.addEventListener('drop', e => {
      console.log('drop');
      e.preventDefault();

      if (dragElem) {
        dragElem.parentNode?.removeChild(dragElem);
        if (e.target instanceof Element) {
          e.target.appendChild(dragElem);
          dragElem = null;
        }
      }
    });

    // Allow drop
    cell.addEventListener('dragover', e => {
      e.preventDefault();
    });
  });
}

// Tile element creator
export function createTileElement(): Element {
  const element: Element = document.createElement('div');
  element.classList.add('tile');
  element.setAttribute('draggable', 'true');

  return element;
}

// Draggable tile logic
function setTileDragEvent(element: Element) {
  element.addEventListener('dragstart', e => {
    console.log('dragStart');

    if (e.target instanceof Element) {
      dragElem = e.target;
      console.log({ dragElem, target: e.target });
    }
  });
}
