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

describe('EquationChecker Tests', () => {
  let ec: EquationChecker;

  beforeAll(() => {
    ec = new EquationChecker();
  })
  it('successfully creates an instance', () => {
    ec.setEquation({ leftSide: '5 + 5', rightSide: '25 * 9' });
    expect(ec).toBeDefined();
    expect(ec).toBeInstanceOf(EquationChecker);
  })

  it('checks equations', () => {
    ec.setEquation({ leftSide: '10 * 25 + 500', rightSide: '5 - 1 / 4' });
    expect(ec.checkEquation()).toBeFalsy();

    ec.setEquation({ leftSide: '5 + 5', rightSide: '5 + 5' });
    expect(ec.checkEquation()).toBeTruthy();
  })
})