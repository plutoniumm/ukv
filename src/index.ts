export { CF as CF } from './cloudflare';
export { LS, SS } from './browser';
export { libsql } from './turso';

// extra methods namespaced
import { query } from './turso';
export const Turso = { query };