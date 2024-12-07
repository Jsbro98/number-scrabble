/*
  ##################################
  Interfaces
  ##################################
*/

export interface GameGrid {
  rows: string[][];
  lastTenMoves: GameMove[];
  getCell(row: number, index: number): string | null;
  setCell(row: number, index: number, value: string): void;
  removeCell(row: number, index: number): void;
}

export interface GameMove {
  position: [number, number];
  value: string;
}

/*
  ##################################
  Helper functions used in index.ts
  ##################################
*/

import { EqualsTile, NumberTile, OperatorTile } from './tile';

// Random number generator
export function getRandomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

// Create and Append tile function
export function createAndAppendTiles(
  container: Element,
  numberOfTiles: number,
  type: string
): void {
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

  // --- used to keep track of last placed equals tile ---
  let lastPlacedEqualsTile: EqualsTile;

  // --- used for grid data tracking ---
  let grid: GameGrid;

  function setGameGrid(setValue: GameGrid) {
    grid = setValue;
  }

  function getGameGrid(): GameGrid {
    return grid;
  }

  function getLastPlacedEquals(): EqualsTile {
    return lastPlacedEqualsTile;
  }

  // helper object used only for checkIfDropIsAllowed
  const dropAllowedHelper = {
    dragElemIsMatchingContainerClass(
      target: Element,
      dragElement: Element
    ): boolean {
      const targetClassName = target.classList[0].split('-')[0];
      const dragElemClassName = dragElement.getAttribute('is')?.split('-')[0];

      return targetClassName === dragElemClassName;
    },

    containerContainsCell(container: Element): boolean {
      return container.classList.contains('cell');
    },

    isATileContainer(elem: Element): boolean {
      const className = elem.classList[0].split('-')[0];
      return (
        className.includes('number') ||
        className.includes('equals') ||
        className.includes('operator')
      );
    },
  };

  // ##### DragNDropManager Functions #####

  // Drag n drop container enabler
  function makeDragAndDropContainer(...elements: Element[]) {
    elements.forEach((elem) => {
      elem.addEventListener('drop', (e) => {
        e.preventDefault();

        if (!(e.target instanceof Element)) return;
        if (
          !e.target.classList.contains('drag-target') &&
          !e.target.classList.contains('cell')
        )
          return;
        if (e.target.classList.contains('cell') && e.target.hasChildNodes())
          return;

        if (dragElem != null && checkIfDropIsAllowed(e, dragElem)) {
          dragElem.parentNode?.removeChild(dragElem);
          e.target.appendChild(dragElem);
          dragElem = null;
        }
      });

      // Allow drop within containers
      elem.addEventListener('dragover', (e) => {
        e.preventDefault();
      });
    });
  }

  // Draggable tile logic
  function setTileDragEvent(element: Element) {
    element.addEventListener('dragstart', (e) => {
      if (e.target instanceof Element) {
        dragElem = e.target;

        if (!dropAllowedHelper.containerContainsCell(e.target.parentElement!)) {
          return;
        }
      }

      const [row, column] = getCellPositionAndValue(e, true);
      grid.removeCell(row, column);
    });

    element.addEventListener('dragend', (e) => {
      if (e.target instanceof Element) {
        if (!dropAllowedHelper.containerContainsCell(e.target.parentElement!)) {
          return;
        }
      }
      const [row, column, value] = getCellPositionAndValue(e, false);
      if (value) {
        grid.setCell(row, column, value);
      } else {
        throw new Error('value is undefined in getCellPositionAndValue');
      }
      console.log(e.target instanceof EqualsTile);
      if (e.target instanceof EqualsTile) {
        lastPlacedEqualsTile = e.target;
      }
    });
  }

  // private
  function checkIfDropIsAllowed(event: Event, dragElem: Element): boolean {
    if (!event.target) throw new Error('e.target is falsy!');

    const target = event.target as Element;

    if (dropAllowedHelper.containerContainsCell(target)) return true;
    if (
      dropAllowedHelper.isATileContainer(target) &&
      dropAllowedHelper.dragElemIsMatchingContainerClass(target, dragElem)
    )
      return true;

    return false;
  }

  // private
  function getCellPositionAndValue(
    e: Event,
    removal: boolean
  ): [number, number] | [number, number, string] {
    const tile = e.target as Element;
    const cell = tile.parentElement!;

    const text: string = tile.textContent!;
    const column: number = Number(cell.parentElement?.classList[1]) - 1;
    const row: number = (() => {
      const columnChildren = cell.parentNode?.children;
      return Array.prototype.indexOf.call(columnChildren, cell);
    })();

    if (removal) {
      return [row, column];
    }

    return [row, column, text];
  }

  // ##### DragNDrop public functions #####
  return {
    makeDragAndDropContainer,
    setTileDragEvent,
    setGameGrid,
    getGameGrid,
  };
})();
