import { EquationChecker } from '../src/typescript/equationChecker';
import { NumberTile, OperatorTile } from '../src/typescript/tile';
import {
  GameGrid,
  GameGridFactory,
  createScoreState,
  ScoreManagerFactory,
  ScoreState,
  ScoreManager,
  GridReferenceManager,
} from '../src/typescript/utils';

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
  const operators = ['+', '-'];

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

// DragNDropManager tests

describe('GridReferenceManager & GameGrid tests', () => {
  let testGrid: GameGrid;

  beforeAll(() => {
    testGrid = GameGridFactory();
  });

  describe('GridReferenceManager', () => {
    it('sets a grid', () => {
      GridReferenceManager.setGrid(testGrid);
      expect(GridReferenceManager.getGrid()).toBeTruthy();
    });
  });

  describe('GameGrid', () => {
    it('sets a value', () => {
      testGrid.setCell(1, 1, 'Hello, World!');
      expect(testGrid.getCell(1, 1)).toBe('Hello, World!');
    });

    it('removes a value', () => {
      testGrid.setCell(1, 1, 'Hello, World!');
      testGrid.removeCell(1, 1);
      expect(testGrid.getCell(1, 1)).toBeNull();
    });

    it('adds items to last ten moves', () => {
      const testArr = testGrid.lastTenMoves;
      testGrid.setCell(10, 10, 'BEEP');
      testArr.shift();
      expect(testArr.length).toBe(1);
      expect(testArr[0]).toBeDefined();
      expect(testArr[0].position).toStrictEqual([10, 10]);
      expect(testArr[0].value).toBe('BEEP');
    });
  });
});

describe('ScoreManagerFactory & createScoreState tests', () => {
  describe('createScoreState tests', () => {
    it('creates a score state', () => {
      const scoreState: ScoreState = createScoreState();
      expect(scoreState).toBeDefined();
      expect(scoreState).toHaveProperty('player1');
      expect(scoreState).toHaveProperty('player2');
      expect(scoreState.player1).toBe(0);
      expect(scoreState.player2).toBe(0);
    });
  });

  describe('ScoreManagerFactory tests', () => {
    let scoreManager: ScoreManager;

    beforeAll(() => {
      scoreManager = ScoreManagerFactory();
    });

    it('creates a score manager', () => {
      expect(scoreManager).toBeDefined();
    });

    it('has all its methods', () => {
      expect(scoreManager).toHaveProperty('getState');
      expect(scoreManager).toHaveProperty('updateScore');
      expect(scoreManager).toHaveProperty('resetScore');
    });

    it('creates new score state each iteration', () => {
      const initialState = scoreManager.getState();
      expect(initialState).toBeDefined();
      expect(initialState).not.toBe(scoreManager.getState());
    });

    it('keeps score throughout state ref changes', () => {
      scoreManager.resetScore();
      scoreManager.updateScore('player1', 10);
      const updatedState = scoreManager.getState();
      expect(updatedState.player1).toEqual(10);
      scoreManager.resetScore();
    });

    it('updates score correctly', () => {
      const initialState = scoreManager.getState();
      const updatedState = scoreManager.updateScore('player1', 10);
      expect(updatedState.player1).toEqual(initialState.player1 + 10);
      expect(updatedState.player2).toEqual(initialState.player2);
      scoreManager.resetScore();
    });

    it('resets score correctly', () => {
      const initialState = scoreManager.getState();
      scoreManager.updateScore('player1', 10);
      expect(scoreManager.getState().player1).toEqual(10);
      const resetState = scoreManager.resetScore();
      expect(resetState).toEqual(initialState);
      expect(resetState).not.toBe(initialState);
    });
  });
});
