import { setTileDragEvent, getRandomNumber } from './index';

export class NumberTile extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setTileDragEvent(this);
    this.setAttribute('data-value', getRandomNumber(10).toString());
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
  }

  connectedCallback() {
    setTileDragEvent(this);
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

customElements.define('number-tile', NumberTile, { extends: 'div' });
customElements.define('operator-tile', OperatorTile, { extends: 'div' });