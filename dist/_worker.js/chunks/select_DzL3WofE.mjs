globalThis.process ??= {}; globalThis.process.env ??= {};
import { s as sql } from './schema_D3bIJDv1.mjs';

function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}

export { asc as a, desc as d };
