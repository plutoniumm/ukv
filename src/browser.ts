const generate = (storage: browserStorage): Store => ({
  set (bodies: KVMini[]) {
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].value =
        typeof bodies[i].value === 'string'
          ? bodies[i].value
          : JSON.stringify(bodies[i].value);
      storage.setItem(bodies[i].key, bodies[i].value);
    }
    return true;
  },
  get (...key: string[]) {
    if (key.length === 1) {
      return storage.getItem(key[0]);
    };

    let value = key
      .map((e: any) => storage.getItem(e));

    for (let i = 0; i < value.length; i++) {
      try {
        if (value[i] === null) continue;
        value[i] = JSON.parse(value[i]);
      } catch (e) { /* ignore*/ };
    };
    return value;
  },
  del (...key: string[]) {
    key.map((e: any) => storage.removeItem(e));
    return true;
  },
  list () {
    return Object.keys(storage);
  },
  burn () {
    storage.clear();
    return true;
  }
});

export const LS = generate(localStorage);
export const SS = generate(sessionStorage);