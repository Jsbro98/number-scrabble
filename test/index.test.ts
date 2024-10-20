import { generateNumberTile, NumberTile, generateOperatorTile, OperatorTile } from '../src/typescript/index';
import { EquationChecker } from '../src/typescript/equationChecker';

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


// EquationChecker tests

// TODO continue on tests
describe('EquationChecker Tests', () => {
  it('successfully creates an instance', () => {
    const result: EquationChecker = new EquationChecker({ leftSide: '5 + 5', rightSide: '25 * 9' });
    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(EquationChecker);
  })
})