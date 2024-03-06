export const generate_ns = (ns: KVNamespace) => {
  const get = async (keys: string[]) => {
    return Promise.all(
      keys.map((e: any) => ns.get(e.name))
    );
  };

  const set = async (bodies: KVBody[]) => {
    let promises = bodies.map((e: any) =>
      ns.put(e.name, e.value, e.options)
    );

    return await Promise.all(promises);
  };

  const list = async () => ns.list();

  const del = async (keys: string[]) => {
    let promises = keys.map((e: any) => ns.delete(e));

    return await Promise.all(promises);
  };

  const burn = async () => {
    let keys = await list();
    if (!keys) {
      return false;
    }
    keys = keys.keys.map((e: any) => e.name) as any;
    return await del(keys);
  };

  return { get, set, del, list, burn };
}