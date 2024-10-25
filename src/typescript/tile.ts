import { setTileDragEvent } from "./index";

export class NumberTile extends HTMLDivElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setTileDragEvent(this);
    this.setAttribute('data-value', this.getRandomNumber(10));
    this.setAttribute('is', 'number-tile');
    this.setAttribute('draggable', 'true');
    this.classList.add("tile");
    this.textContent = this.dataset.value?.toString()!;
  }

  getDataValueAsNumber(): number {
    return Number(this.dataset.value);
  }

  private getRandomNumber(max: number): string {
    return Math.floor(Math.random() * (max) + 1).toString();
  }
}

customElements.define('number-tile', NumberTile, { extends: 'div' });