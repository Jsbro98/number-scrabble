import { generateNumberTile, NumberTile, generateOperatorTile, OperatorTile } from '../src/typescript/index';

// NumberTile tests
describe("NumberTile Generator Function Tests", () => {
  let tile: NumberTile;

  beforeAll(() => {
    tile = generateNumberTile();
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
    expect(tile.value).toBeLessThan(11);
  });
});

// OperatorTile Tests
describe('OperatorTile Generator Tests', () => {
  let tile: OperatorTile;
  const operators = ['+', '-', '*', '/'];

  beforeAll(() => {
    tile = generateOperatorTile();
  })

  it('creates a tile instance', () => {
    expect(tile).toBeTruthy();
  })

  it('has the required OperatorTile values', () => {
    expect(tile.element).toBeTruthy();
    expect(tile.element).toBeInstanceOf(Element);

    for (let i = 0; i < 10; i++) {
      tile = generateOperatorTile();
      expect(operators).toContain(tile.operator);
    }
  })
})
