// localStorage
export const ls: Store = {
  set (key: string, value: any) {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  },
  get (key: string) {
    let value = localStorage.getItem(key);
    if (value === null) {
      return null;
    };

    try {
      value = JSON.parse(value);
    } catch (e) { /* ignore*/ };
    return value;
  },
  del (key: string) {
    localStorage.removeItem(key);
    return true;
  },
  list () {
    return Object.keys(localStorage);
  },
  burn () {
    localStorage.clear();
    return true;
  }
};

// sessionStorage
export const ss: Store = {
  set (key: string, value: any) {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(key, JSON.stringify(value));
    return true;
  },
  get (key: string) {
    let value = sessionStorage.getItem(key);
    if (value === null) {
      return null;
    };

    try {
      value = JSON.parse(value);
    } catch (e) { /* ignore*/ };
    return value;
  },
  del (key: string) {
    sessionStorage.removeItem(key);
    return true;
  },
  list () {
    return Object.keys(sessionStorage);
  },
  burn () {
    sessionStorage.clear();
    return true;
  }
};