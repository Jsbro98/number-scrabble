import { EquationChecker } from './equationChecker';
import { DragNDropManager, getRandomNumber } from './utils';

export class NumberTile extends HTMLDivElement {
  private numberValue: number;

  constructor() {
    super();
    DragNDropManager.setTileDragEvent(this);
    this.numberValue = getRandomNumber(10);
  }

  connectedCallback() {
    this.setAttribute('data-value', this.numberValue.toString());
    this.setAttribute('is', 'number-tile');
    this.setAttribute('draggable', 'true');
    this.classList.add("tile");
    this.textContent = this.dataset.value?.toString()!;
  }

  getDataValueAsNumber(): number {
    return Number(this.dataset.value);
  }
}

export class OperatorTile extends HTMLDivElement {
  private OPERATORS = ['*', '-', '/', '+'];
  private currentOperator: string;

  constructor() {
    super();
    this.currentOperator = this.getNewOperator();
    DragNDropManager.setTileDragEvent(this);
  }

  connectedCallback() {
    this.setAttribute('is', 'operator-tile');
    this.setAttribute('data-operator', this.currentOperator);
    this.textContent = this.currentOperator;
    this.setAttribute('draggable', 'true');
    this.classList.add("tile");
  }

  private getNewOperator(): string {
    return this.OPERATORS[getRandomNumber(this.OPERATORS.length) - 1];
  }
}

export class EqualsTile extends HTMLDivElement {
  public static eqChecker: EquationChecker = new EquationChecker();

  constructor() {
    super();
    DragNDropManager.setTileDragEvent(this);
  }

  connectedCallback() {
    this.setAttribute('is', 'equals-tile');
    this.setAttribute('draggable', 'true');
    this.classList.add("tile");
    this.textContent = '=';
  }
}

customElements.define('equals-tile', EqualsTile, { extends: 'div' });
customElements.define('number-tile', NumberTile, { extends: 'div' });
customElements.define('operator-tile', OperatorTile, { extends: 'div' });