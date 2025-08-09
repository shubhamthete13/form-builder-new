import type { FieldSchema } from '../types';

export function hasCycle(fields: FieldSchema[]): boolean {
  const adj = new Map<string, string[]>();
  fields.forEach(f => adj.set(f.id, f.derived?.parents ?? []));

  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string): boolean {
    if (stack.has(node)) return true; // found cycle
    if (visited.has(node)) return false;

    visited.add(node);
    stack.add(node);

    for (const neighbor of adj.get(node) || []) {
      if (dfs(neighbor)) return true;
    }
    stack.delete(node);
    return false;
  }

  for (const id of adj.keys()) {
    if (dfs(id)) return true;
  }
  return false;
}
