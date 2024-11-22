import { evaluate, MathExpression } from 'mathjs';

export type Equation = {
  leftSide: string;
  rightSide: string;
};

export class EquationChecker {
  private equation?: Equation;

  constructor();
  constructor(eq: Equation);

  constructor(eq?: Equation) {
    if (eq) {
      this.setEquation(eq);
    }
  }

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

  private isSideLengthOne(side: string): string | false {
    if (side.length === 1 && !isNaN(Number(side))) {
      return side;
    }

    return false;
  }

  checkEquation(): boolean {
    let left: string | false = this.isSideLengthOne(this.leftSide);
    let right: string | false = this.isSideLengthOne(this.rightSide);

    let processedLeft: number = NaN;
    let processedRight: number = NaN;

    if (left && right) {
      return left === right;
    }

    if (!left) {
      processedLeft = evaluate(this.leftSide as MathExpression);
    }

    if (!right) {
      processedRight = evaluate(this.rightSide as MathExpression);
    }

    if (isNaN(processedLeft) || isNaN(processedRight)) {
      throw new Error('Error evaluating in EquationChecker');
    }

    return processedLeft === processedRight;
  }

  setEquation(eq: Equation) {
    this.equation = eq;
  }
}
