/*
  ##################################
  Helper functions used in index.ts
  ##################################
*/

import { EqualsTile, NumberTile, OperatorTile } from "./tile";



// Random number generator
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * (max));
}

// Create and Append tile function
export function createAndAppendTiles(container: Element, numberOfTiles: number, type: string): void {
  for (let i = 0; i < numberOfTiles; i++) {
    container.appendChild(TileFactory(type));
  }
}

// Tile factory
function TileFactory(type: string) {
  if (type === 'number') {
    return new NumberTile();
  }

  if (type === 'operator') {
    return new OperatorTile();
  }

  if (type === 'equals') {
    return new EqualsTile();
  }

  throw new TypeError('type parameter is not valid');
}



export const DragNDropManager = (() => {

  // --- used for drag n drop functionality ---
  let dragElem: Element | null = null;


  // Drag n drop container enabler
  function makeDragAndDropContainer(...elements: Element[]) {
    elements.forEach(elem => {
      elem.addEventListener('drop', e => {
        if (!(e.target instanceof Element)) return;
        if (!(e.target.classList.contains('drag-target'))) return;

        e.preventDefault();

        if (dragElem) {
          dragElem.parentNode?.removeChild(dragElem);
          e.target.appendChild(dragElem);
          dragElem = null;
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

  return { makeDragAndDropContainer, setTileDragEvent };
})();