// Tile Type
export type Tile = {
  element: Element;
  value: number;
};

// ---------- Main function ----------
function main(): void {
  const tileContainer = document.querySelector('.tile-container');
  console.log(tileContainer);
}
main();
// -----------------------------------

// Tile Generator
export function generateTile(): Tile {
  const element: Element = document.createElement('div');
  element.classList.add('tile');
  const tileValue = getTileNumber();

  return {
    element,
    value: tileValue,
  };

  function getTileNumber(): number {
    return Math.floor(Math.random() * (999 - 0));
  }
}