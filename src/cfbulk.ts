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

const REQ = async (url: string, options: RequestInit) => {
  let //
    response = null,
    error = null;
  try {
    response = fetch(url, options)
      .then(response => response.json())
  } catch (err) {
    error = error;
  }

  return [response, error];
};

/*
- get: list -> GET: <NS>/<key>
- set: PUT: <NS>/bulk, [KVBody]
- del: DELETE: <NS>/bulk, [keys]
- list: GET: <NS>/keys
- burn: List -> Del
*/

// BEHOLD, the GENERATOR
export const generate_api = (account_id: string, namespace_id: string, token: string) => {
  const root = Root(account_id, namespace_id);
  const get = async (keys: string[]) => {
    const options = Options(token, 'GET');

    return Promise.all(
      keys.map(async (e: any) =>
        await REQ(`${root}/${e.name}`, options)
      )
    );
  };

  const set = async (bodies: KVBody[]) => {
    let url = `${root}/bulk`;
    const options = Options(token, 'POST', bodies);
    return await REQ(url, options);
  };

  const list = async () => {
    let url = `${root}/keys`;
    const options = Options(token, 'GET');
    return await REQ(url, options);
  };

  const del = async (keys: string[]) => {
    let url = `${root}/bulk`;
    const options = Options(token, 'DELETE', keys);
    return await REQ(url, options);
  };

  const burn = async () => {
    let [keys, error]: any = await list();
    if (error) {
      return false;
    } else {
      keys = keys.result;
    };

    [, error] = await del(keys);
    if (error)
      return [null, error];

    return [true, null];
  };

  return { get, set, del, list, burn };
};
