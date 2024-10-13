// Tile Type
export type Tile = {
  element: Element;
  value: number;
};

let dragElem: Element | null = null;

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {

  const tileContainer = document.querySelector('.tile-container');
  const cells = document.querySelectorAll('.cell');

  setCellDragDropEvents(cells);

  if (tileContainer !== null) {
    for (let i = 0; i < 10; i++) {
      tileContainer.appendChild(generateTile().element);
    }
  } else {
    console.log('title-container is null');
  }
}
main();
// ########################################################################
// ########################################################################

// Tile Generator
export function generateTile(): Tile {
  const element: Element = document.createElement('div');
  const tileValue = getTileNumber();

  element.classList.add('tile');
  element.textContent = tileValue.toString();
  element.setAttribute('draggable', 'true');

  setTileDragEvent(element);

  return {
    element,
    value: tileValue,
  };

  function getTileNumber(): number {
    return Math.floor(Math.random() * (10) + 1);
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
