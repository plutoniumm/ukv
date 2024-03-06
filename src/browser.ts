const generate = (storage: browserStorage): Store => ({
  set (key: string, value: any) {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    storage.setItem(key, JSON.stringify(value));
    return true;
  },
  get (key: string) {
    let value = storage.getItem(key);
    if (value === null) {
      return null;
    };

    try {
      value = JSON.parse(value);
    } catch (e) { /* ignore*/ };
    return value;
  },
  del (key: string) {
    storage.removeItem(key);
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

export const ls = generate(localStorage);
export const ss = generate(sessionStorage);