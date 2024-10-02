// Tile generator
export type Tile = {
  element: Element
  value: number;
}

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
  };
}