type browserStorage = typeof localStorage | typeof sessionStorage;

type U<T> = T | undefined;
type N<T> = T | null;
type UN<T> = T | undefined | null;
type P<T> = Promise<T>;
type S<T> = T | Promise<T>;

type setBody = KVBody[] | KVMini[] | KVSQL[];

interface Store {
  get (...key: string[]): S<any>;
  set (bodies: setBody): S<boolean>;
  del (...key: string[]): S<boolean>;
  list (): S<string[]>;
  burn (): S<boolean>;
  dump (): S<any[]>;
};

interface KVSQL {
  id: string | number;
  [key: string]: any;
}

interface KVMini {
  key: string;
  value: any;
};

interface KVBody {
  key: string;
  value: string;
  expiration?: number;
  expiration_ttl?: number;
  metadata?: any;
};