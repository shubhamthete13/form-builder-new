import { Parser } from 'expr-eval';
import type { DerivedConfig } from '../types';

export function evaluateDerived(derived: DerivedConfig, fieldValues: Record<string, any>) {
  const vars: Record<string, number | string> = {};

  // Map parents as p_<id>
  derived.parents.forEach(pid => {
    vars['p_' + pid] = fieldValues[pid];
  });

  try {
    const exp = Parser.parse(derived.formula); // e.g. "p_field1 + p_field2"
    return exp.evaluate(vars);
  } catch (e) {
    return null;
  }
}
