// TODO continue here

import { evaluate, MathExpression } from 'mathjs';

export type Equation = {
  leftSide: string;
  rightSide: string;
}

export class EquationChecker {
  private equation: Equation;

  constructor(eq: Equation) {
    this.equation = eq;
  }

  private get leftSide(): string {
    return this.equation.leftSide;
  }

  private get rightSide(): string {
    return this.equation.rightSide;
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

    let processedLeft: number = NaN
    let processedRight: number = NaN

    if (left && right) {
      return left === right;
    }

    if (!left) {
      processedLeft = evaluate(left as MathExpression);
    }

    if (!right) {
      processedRight = evaluate(right as MathExpression);
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