# ukv

!> Work in progress

## Everything is Storage
A Store type has a general api which unifies the api format across many storage types

```ts
// Syn
interface Store {
  // get a value from the storage
  get(key: string): any;
  // set a value in the storage
  set(key: string, value: any): void;
  // delete a value
  del(key: string): void;
  // list all keys
  list(): string[];
  // clear all keys
  burn(): void;
}
```

## Storage Types
### LocalStorage/SessionStorage
```ts
import { LS, SS } from 'ukv/browser';

// use the methods directly
LS.get('key');
SS.list();
```

### Cloudflare Workers KV
**from Account i.e to use API**:
```ts
import { CF } from 'ukv/cloudflare';

const cf = CF('ACCOUNT_ID', 'NAMESPACE_ID', 'API_KEY');

// use the methods directly
cf.set('key', 'value');
cf.list();
```

**from Worker i.e to use KV**
```ts
import { CF } from 'ukv/cloudflare';

const cf = CF(KVNAMESPACE);

// use the methods directly
cf.get('key');
cf.burn();
```
