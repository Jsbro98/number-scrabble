import { NumberTile, OperatorTile } from "./tile";

/*

todo list:

TODO create drag n drop to return tile back to container
TODO create custom classes for:
  - EqualsTile
*/

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

    const element = TileFactory(type);
    container.appendChild(element);
  }
}

// Tile factory
export function TileFactory(type: string) {
  if (type === 'number') {
    return new NumberTile();
  }

  if (type === 'operator') {
    return new OperatorTile();
  }

  throw new TypeError('type parameter is not valid');
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
export function setTileDragEvent(element: Element) {
  element.addEventListener('dragstart', e => {
    console.log('dragStart');

    if (e.target instanceof Element) {
      dragElem = e.target;
      console.log({ dragElem, target: e.target });
    }
  });
}
