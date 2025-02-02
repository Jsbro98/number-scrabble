import { evaluate, MathExpression } from 'mathjs';

export type Equation = {
  leftSide: string;
  rightSide: string;
};

export class EquationChecker {
  private equation!: Equation;

  private get hasEquation(): boolean {
    return this.equation !== undefined;
  }

  private get leftSide(): string {
    if (!this.hasEquation) {
      throw new Error('equation left side is undefined');
    }

    return this.equation!.leftSide!;
  }

  private get rightSide(): string {
    if (!this.hasEquation) {
      throw new Error('equation right side is undefined');
    }

    return this.equation!.rightSide!;
  }

  private isSideLengthOne(side: string): number | false {
    if (side.length === 1 && !isNaN(Number(side))) {
      return Number(side);
    }

    return false;
  }

  public checkEquation(): boolean {
    let left: number | false = this.isSideLengthOne(this.leftSide);
    let right: number | false = this.isSideLengthOne(this.rightSide);

    if (left && right) {
      return left === right;
    }

    if (!left) {
      left = evaluate(this.leftSide as MathExpression) as number;
    }

    if (!right) {
      right = evaluate(this.rightSide as MathExpression) as number;
    }

    if (isNaN(left) || isNaN(right)) {
      throw new Error('Error evaluating in EquationChecker');
    }

    return left === right;
  }

  public setEquation(eq: Equation) {
    this.equation = eq;
  }
}
