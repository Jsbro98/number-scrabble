import { generateTile, Tile } from '../src/typescript/index';

describe("Tile Generator Function Tests", () => {
  let tile: Tile;

  beforeAll(() => {
    tile = generateTile();
  });

  it("generates a tile instance", () => {
    expect(tile).toBeTruthy();
  });

  it("has each required value", () => {
    expect(tile).toBeTruthy();
    expect(tile.element).toBeInstanceOf(Element);
    expect(tile.element).toBeTruthy();
    expect(tile.value).toBeTruthy();
    expect(tile.value).toBeGreaterThan(0);
    expect(tile.value).toBeLessThan(1000);
  });
});
