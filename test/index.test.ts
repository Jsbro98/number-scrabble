import { EquationChecker } from '../src/typescript/equationChecker';
import { NumberTile, OperatorTile } from '../src/typescript/tile';

// NumberTile tests
describe('NumberTile Generator Function Tests', () => {
  let tile: NumberTile;

  beforeAll(() => {
    tile = new NumberTile();
  });

  it('generates a tile instance', () => {
    expect(tile).toBeTruthy();
    expect(tile).toBeInstanceOf(NumberTile);
  });

  it('has each required value', () => {
    for (let i = 0; i < 5; i++) {
      tile = new NumberTile();
      tile.connectedCallback();
      expect(tile).toBeTruthy();
      expect(tile.dataset.value).toBeTruthy();
      expect(tile.getDataValueAsNumber()).toBeGreaterThanOrEqual(0);
      expect(tile.getDataValueAsNumber()).toBeLessThan(11);
    }
  });
});

// OperatorTile Tests
describe('OperatorTile Generator Tests', () => {
  let tile: OperatorTile;
  const operators = ['+', '-', '*', '/'];

  beforeAll(() => {
    tile = new OperatorTile();
    document.body.appendChild(tile);
  });

  it('creates a tile instance', () => {
    expect(tile).toBeTruthy();
  });

  it('has the required OperatorTile values', () => {
    expect(tile).toBeTruthy();
    expect(tile).toBeInstanceOf(Element);

    for (let i = 0; i < 10; i++) {
      tile = new OperatorTile();
      tile.connectedCallback();
      expect(operators).toContain(tile.dataset.operator);
    }
  });
});

// EquationChecker tests

describe('EquationChecker Tests', () => {
  let ec: EquationChecker;

  beforeAll(() => {
    ec = new EquationChecker();
  });
  it('successfully creates an instance', () => {
    ec.setEquation({ leftSide: '5 + 5', rightSide: '25 * 9' });
    expect(ec).toBeDefined();
    expect(ec).toBeInstanceOf(EquationChecker);
  });

  it('checks equations', () => {
    ec.setEquation({ leftSide: '10 * 25 + 500', rightSide: '5 - 1 / 4' });
    expect(ec.checkEquation()).toBeFalsy();

    ec.setEquation({ leftSide: '5 + 5', rightSide: '5 + 5' });
    expect(ec.checkEquation()).toBeTruthy();
  });
});
