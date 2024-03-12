const Root = (account_id: string, namespace_id: string) => `https://api.cloudflare.com/client/v4/accounts/${account_id}/storage/kv/namespaces/${namespace_id}`;

const Options = (token: string, method: string, body?: any) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  });
  method = method.toUpperCase();

  const body_object: any = { method, headers };
  if (method === 'POST' || method === 'PUT') {
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
    const res = await fetch(url, options);
    const type = res.headers.get('content-type');
    if (type?.includes('application/json')) {
      return await res.json();
    } else {
      return await res.text();
    }
  };

  // body = [{
  //   "base64": false,
  //   "key": "My-Key",
  //   "expiration": 1578435000,
  //   "expiration_ttl": 300,
  //   "metadata": { "someMetadataKey": "someMetadataValue" },
  //   "value": "Some string"
  // }]


  async get (...keys: string[]) {
    const options = Options(this.#token, 'GET');
    return Promise.all(
      keys.map((e: string) =>
        this.#REQ(`${this.#root}/values/${e}`, options)
      )
    );
  }

  async set (bodies: KVBody[]) {
    bodies = bodies.map(e => {
      if (e.metadata === undefined) e.metadata = {}
      return e;
    })
    const url = `${this.#root}/bulk`;
    const options = Options(this.#token, 'PUT', bodies);
    return await this.#REQ(url, options);
  }

  async list () {
    const url = `${this.#root}/keys`;
    const options = Options(this.#token, 'GET');
    let res = await this.#REQ(url, options) as any;
    if (res?.result === undefined) {
      throw new Error("Error: " + JSON.stringify(res));
    }
    return res.result.map((e: any) => e.name);
  }

  async del (...keys: string[]) {
    const url = `${this.#root}/bulk`;
    const options = Options(this.#token, 'DELETE', keys);
    return await this.#REQ(url, options);
  }

  async burn () {
    let keys = await this.list();
    await this.del(...keys);

    return true;
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

export const CF = (...something: any): Store => {
  if (something.length === 1 && something[0].get) {
    return new Namespace(something[0]);
  } else {
    return new Account(...something as [string, string, string]);
  }
};