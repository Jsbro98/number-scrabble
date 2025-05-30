import {
  CellPosition,
  DoubleClickHandler,
  DragNDropManager,
  getRandomNumber,
} from './utils';

export class NumberTile extends HTMLDivElement {
  private numberValue: number;

  constructor() {
    super();
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
    this.setAttribute('draggable', 'true');
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
    this.setAttribute('draggable', 'true');
    this.classList.add('tile');
  }

  private getNewOperator(): string {
    return this.OPERATORS[getRandomNumber(this.OPERATORS.length)];
  }
}

export class EqualsTile extends HTMLDivElement {
  private tilePosition!: CellPosition;

  constructor() {
    super();
    DragNDropManager.setTileDragEvent(this);
    this.addEventListener(
      'dblclick',
      DoubleClickHandler.handleDoubleClick.bind(DoubleClickHandler)
    );
  }

  connectedCallback() {
    this.setAttribute('is', 'equals-tile');
    this.setAttribute('draggable', 'true');
    this.classList.add('tile');
    this.textContent = '=';
  }

  get position(): CellPosition {
    return this.tilePosition;
  }
  set position(value: CellPosition) {
    this.tilePosition = value;
  }
}

customElements.define('equals-tile', EqualsTile, { extends: 'div' });
customElements.define('number-tile', NumberTile, { extends: 'div' });
customElements.define('operator-tile', OperatorTile, { extends: 'div' });
