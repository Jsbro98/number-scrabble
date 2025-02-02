import { GameGrid, Movement, StringOrNull, TraversableCell } from './utils';
import { match } from 'ts-pattern';

export class MovableGridCell implements TraversableCell {
  private grid: GameGrid;
  private orignialRowValue: number;
  private originalColumnValue: number;
  public currentRow: number;
  public currentColumn: number;
  public left: StringOrNull;
  public right: StringOrNull;
  public up: StringOrNull;
  public down: StringOrNull;
  public current: StringOrNull;

  constructor(grid: GameGrid, row: number, column: number) {
    this.grid = grid;
    this.currentRow = row;
    this.currentColumn = column;
    this.originalColumnValue = column;
    this.orignialRowValue = row;
    this.left = grid.getCell(row, column - 1);
    this.right = grid.getCell(row, column + 1);
    this.up = grid.getCell(row - 1, column);
    this.down = grid.getCell(row + 1, column);
    this.current = grid.getCell(row, column);
  }

  public moveCell(movement: Movement): void {
    match(movement)
      .with(Movement.left, () => this.moveLeft())
      .with(Movement.right, () => this.moveRight())
      .with(Movement.up, () => this.moveUp())
      .with(Movement.down, () => this.moveDown())
      .exhaustive();
  }

  public resetGridValues() {
    this.currentColumn = this.originalColumnValue;
    this.currentRow = this.orignialRowValue;
    this.updateValues();
  }

  private moveLeft() {
    this.currentColumn -= 1;
    this.updateValues();
  }

  private moveRight() {
    this.currentColumn += 1;
    this.updateValues();
  }

  private moveUp() {
    this.currentRow -= 1;
    this.updateValues();
  }

  private moveDown() {
    this.currentRow += 1;
    this.updateValues();
  }

  private updateValues() {
    this.left = this.grid.getCell(this.currentRow, this.currentColumn - 1);
    this.right = this.grid.getCell(this.currentRow, this.currentColumn + 1);
    this.up = this.grid.getCell(this.currentRow - 1, this.currentColumn);
    this.down = this.grid.getCell(this.currentRow + 1, this.currentColumn);
    this.current = this.grid.getCell(this.currentRow, this.currentColumn);
  }
}
