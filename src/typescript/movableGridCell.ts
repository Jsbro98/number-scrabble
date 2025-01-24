import { GameGrid, Movement, StringOrNull, TraversableCell } from './utils';
import { match } from 'ts-pattern';

export class MovableGridCell implements TraversableCell {
  private grid: GameGrid;
  public left: StringOrNull;
  public right: StringOrNull;
  public up: StringOrNull;
  public down: StringOrNull;

  constructor(grid: GameGrid, row: number, column: number) {
    this.grid = grid;
    this.left = grid.getCell(row, column - 1);
    this.right = grid.getCell(row, column + 1);
    this.up = grid.getCell(row - 1, column);
    this.down = grid.getCell(row + 1, column);
  }

  public moveCell(movement: Movement): void {
    match(movement)
      .with(Movement.left, () => this.moveLeft())
      .with(Movement.right, () => this.moveRight())
      .with(Movement.up, () => this.moveUp())
      .with(Movement.down, () => this.moveDown())
      .exhaustive();
  }

  private moveLeft() {}

  private moveRight() {}

  private moveUp() {}

  private moveDown() {}
}
