type browserStorage = typeof localStorage | typeof sessionStorage;

type U<T> = T | undefined;
type N<T> = T | null;
type UN<T> = T | undefined | null;
type P<T> = Promise<T>;
type S<T> = T | Promise<T>;

interface SyncStore {
  get (...key: string[]): any;
  set (bodies: KVBody[] | KVMini[]): boolean;
  del (...key: string[]): boolean;
  list (): string[];
  burn (): boolean;
  dump (): any[];
};

interface AsyncStore {
  get (...key: string[]): Promise<any>;
  set (bodies: KVBody[] | KVMini[]): Promise<boolean>;
  del (...key: string[]): Promise<boolean>;
  list (): Promise<string[]>;
  burn (): Promise<boolean>;
  dump (): Promise<any[]>;
};

type Store = SyncStore | AsyncStore;

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