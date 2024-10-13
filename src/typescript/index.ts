// Tile Type
export type Tile = {
  element: Element;
  value: number;
};

// ########################################################################
// ########################################################################
// ---------- Main function ----------

function main(): void {
  const tileContainer = document.querySelector('.tile-container');

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
  element.classList.add('tile');
  const tileValue = getTileNumber();
  element.textContent = tileValue.toString();

  return {
    element,
    value: tileValue,
  };

  function getTileNumber(): number {
    return Math.floor(Math.random() * (10) + 1);
  }
}

// Draggable tile logic