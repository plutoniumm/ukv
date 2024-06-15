# ukv

```sh
npm install ukv
```

## Everything is Storage
A Store type has a general api which unifies the api format across many storage types

```ts
// Syn
interface Store {
  get(key: string): any;
  set(bodies: any[]): void;
  del(key: string): void;
  // list all keys
  list(): string[];
  // clear all keys
  burn(): void;
  // list all keys and values
  dump(): Record<string, any>;
}
```

## Storage Types
### LocalStorage/SessionStorage
```ts
import { LS, SS } from 'ukv/browser';

LS.get('key');
SS.list();
```

### Cloudflare Workers KV
**from Account i.e to use API**:
```ts
import { CF } from 'ukv/cloudflare';
const cf = CF('ACCOUNT_ID', 'NAMESPACE_ID', 'API_KEY');

cf.set([
  // key, value, metadata?
  { key: 'key', value: 'value', metadata: {} },
  { key: 'key2', value: 'value2', metadata: {} }
]);
cf.list();
```

**from Worker i.e to use KV**
```ts
import { CF } from 'ukv/cloudflare';
const cf = CF(KVNAMESPACE);

cf.get('key');
cf.burn();
```

### Turso DB
```ts
import { Turso } from 'ukv/turso';
const TABLE_NAME = 'notes';
const client = new Turso(TURSO_URL, TURSO_AUTH, TABLE_NAME);

client.set([
  // all keys are per your cols
  { id: 'key', col1: 'value1', col2: 'value2' },
  { id: 'key2', col1: 'value3', col2: 'value3' }
]);

client.get('key');
client.list();
```

> For safety `.burn()` will throw. Use `.del()` one by one instead.
> `.list` and `.dump` are identical here.