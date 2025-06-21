import { MovableGridCell } from './movableGridCell';
import {
  CellPosition,
  DirectionState,
  DoubleClickHandler,
  DragNDropManager,
  getRandomNumber,
  checkEquality,
  EqualityCheckResult,
  GridReferenceManager,
} from './utils';

export class NumberTile extends HTMLDivElement {
  private numberValue: number;

  constructor() {
    super();
    this.setAttribute('draggable', 'true');
    this.setAttribute('dblclick-listener', 'true');
    DragNDropManager.setTileDragEvent(this);
    this.numberValue = getRandomNumber(10);
    this.addEventListener(
      'dblclick',
      DoubleClickHandler.handleDoubleClick.bind(DoubleClickHandler)
    );
  }

  connectedCallback() {
    this.setAttribute('data-value', this.numberValue.toString());
    this.setAttribute('is', 'number-tile');
    this.classList.add('tile');
    this.textContent = this.dataset.value?.toString()!;
  }

  getDataValueAsNumber(): number {
    return Number(this.dataset.value);
  }
}

export class OperatorTile extends HTMLDivElement {
  private OPERATORS = ['-', '+'];
  private currentOperator: string;

  constructor() {
    super();
    this.setAttribute('draggable', 'true');
    this.setAttribute('dblclick-listener', 'true');
    this.currentOperator = this.getNewOperator();
    DragNDropManager.setTileDragEvent(this);
    this.addEventListener(
      'dblclick',
      DoubleClickHandler.handleDoubleClick.bind(DoubleClickHandler)
    );
  }

  connectedCallback() {
    this.setAttribute('is', 'operator-tile');
    this.setAttribute('data-operator', this.currentOperator);
    this.textContent = this.currentOperator;
    this.classList.add('tile');
  }

  private getNewOperator(): string {
    return this.OPERATORS[getRandomNumber(this.OPERATORS.length)];
  }
}

export class EqualsTile extends HTMLDivElement {
  private tilePosition!: CellPosition;
  private directionState: DirectionState = {
    upDown: { isSet: false, changed: false },
    leftRight: { isSet: false, changed: false },
  };

  constructor() {
    super();
    this.setAttribute('draggable', 'true');
    this.setAttribute('dblclick-listener', 'true');
    DragNDropManager.setTileDragEvent(this);
    this.addEventListener(
      'dblclick',
      DoubleClickHandler.handleDoubleClick.bind(DoubleClickHandler)
    );
    this.addEventListener('dragend', this.checkIfTileWasAddedNear);
  }

  connectedCallback() {
    this.setAttribute('is', 'equals-tile');
    this.classList.add('tile');
    this.textContent = '=';
  }

  get position(): CellPosition {
    return this.tilePosition;
  }
  set position(value: CellPosition) {
    this.tilePosition = value;
  }

  get scoreDirections(): DirectionState {
    return this.directionState;
  }

  public runEqualityCheck(): EqualityCheckResult {
    return checkEquality(this);
  }

  public changeDirectionState(direction: keyof DirectionState) {
    if (direction !== 'leftRight' && direction !== 'upDown') {
      throw new Error("Invalid direction provided to 'changeDirectionState'");
    }
    this.directionState[direction].isSet = true;
  }

  public checkIfTileWasAddedNear(): void {
    const cell = new MovableGridCell(
      GridReferenceManager.getGrid(),
      this.position.row,
      this.position.column
    );

    if (
      cell.left &&
      cell.right &&
      this.scoreDirections.leftRight.isSet === false
    ) {
      this.scoreDirections.leftRight.changed = true;
      // if a player moves previously set tiles, change it back
    } else {
      this.scoreDirections.leftRight.isSet === false;
    }

    if (cell.up && cell.down && this.scoreDirections.upDown.isSet === false) {
      this.scoreDirections.upDown.changed = true;
    } else {
      this.scoreDirections.upDown.isSet === false;
    }
  }

  public resetDirections(): void {
    this.scoreDirections.leftRight.changed = false;
    this.scoreDirections.upDown.changed = false;
  }
}

customElements.define('equals-tile', EqualsTile, { extends: 'div' });
customElements.define('number-tile', NumberTile, { extends: 'div' });
customElements.define('operator-tile', OperatorTile, { extends: 'div' });
