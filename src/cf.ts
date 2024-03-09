const Root = (account_id: string, namespace_id: string) => `https://api.cloudflare.com/client/v4/accounts/${account_id}/storage/kv/namespaces/${namespace_id}`;

const Options = (token: string, method: string, body?: any) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });
  method = method.toUpperCase();

  const body_object: any = { method, headers };
  if (method === 'POST') {
    body_object['body'] = JSON.stringify(body);
  };

  return body_object;
};

/*
- get: list -> GET: <NS>/<key>
- set: PUT: <NS>/bulk, [KVBody]
- del: DELETE: <NS>/bulk, [keys]
- list: GET: <NS>/keys
- burn: List -> Del
*/

// BEHOLD, the GENERATOR
class Account {
  #root = '';
  #token = '';
  constructor(account_id: string, namespace_id: string, token: string) {
    this.#root = Root(account_id, namespace_id);
    this.#token = token;
  }

  async #REQ (url: string, options: RequestInit) {
    let res = null, error = null;
    try {
      res = fetch(url, options).then(r => r.json())
    } catch (err) {
      error = err;
    }

    return [res, error];
  };

  async get (keys: string[]) {
    const options = Options(this.#token, 'GET');
    return Promise.all(
      keys.map((e: string) =>
        this.#REQ(`${this.#root}/${e}`, options)
      )
    );
  }

  async set (bodies: KVBody[]) {
    const url = `${this.#root}/bulk`;
    const options = Options(this.#token, 'POST', bodies);
    return await this.#REQ(url, options);
  }

  async list () {
    const url = `${this.#root}/keys`;
    const options = Options(this.#token, 'GET');
    return await this.#REQ(url, options);
  }

  async del (keys: string[]) {
    const url = `${this.#root}/bulk`;
    const options = Options(this.#token, 'DELETE', keys);
    return await this.#REQ(url, options);
  }

  async burn () {
    let [keys, error] = await this.list();
    if (error) {
      return false;
    } else {
      keys = keys.result;
    }

    [, error] = await this.del(keys);
    if (error)
      return [null, error];

    return [true, null];
  }
}

// CLOUDFLARE
class Namespace {
  ns = null;
  constructor(ns: KVNamespace) {
    this.ns = ns;
  }

  async get (...keys: string[]) {
    return Promise.all(
      keys.map((e: any) => this.ns.get(e))
    );
  };

  d (opts: any): any {
    return opts === undefined ? ({}) : opts;
  }

  async set (bodies: KVBody[]) {
    let promises = bodies.map((e: any) =>
      this.ns.put(e.key, e.value, this.d(e.options))
    );

    return await Promise.all(promises);
  };

  async list (): P<string[]> {
    const list = await this.ns.list();
    return list.keys.map((e: any) => e.name);
  };

  async del (...keys: string[]) {
    let promises = keys.map((e: any) => this.ns.delete(e));

    return await Promise.all(promises);
  };

  async burn () {
    let keys = await this.list();
    if (!keys) {
      return false;
    }
    return await this.del(...keys);
  };
}

export const CF = (...something: any) => {
  if (something.length === 1 && something[0].get) {
    return new Namespace(something[0]);
  } else {
    return new Account(...something as [string, string, string]);
  }
};