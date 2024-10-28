// helper functions used for main in index.ts

import { NumberTile, OperatorTile } from "./tile";


// used for drag n drop
let dragElem: Element | null = null;

// Random number generator
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * (max) + 1);
}

// Create and Append tile function
export function createAndAppendTiles(container: Element, numberOfTiles: number, type: string): void {
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

// Drag n drop container enabler
export function makeDragAndDropContainer(...element: Element[]) {
  element.forEach(elem => {
    elem.addEventListener('drop', e => {
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
    elem.addEventListener('dragover', e => {
      console.log('dragging...');
      console.log({ dragElem, target: e.target });
      e.preventDefault();
    });
  })
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

export default { makeDragAndDropContainer, createAndAppendTiles };