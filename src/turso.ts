import { createClient } from "@libsql/client/web";

class Turso {
  private turso: any;
  private t: string;

  constructor(url: string, token: string, table: string) {
    this.turso = createClient({
      url: url, authToken: token
    });
    this.t = table;
  }
  async get (id: string) {
    return await this.turso.execute({
      sql: `SELECT * FROM ${this.t} WHERE id = ?`,
      args: [id],
    })
  };

  async set (body: KVBody | KVMini) {
    return await this.turso.execute({
      sql: `INSERT INTO ${this.t} (id, body) VALUES (?, ?)`,
      args: [body.key, body.value],
    });
  }

  async del (id: U<string>) {
    return await this.turso.execute({
      sql: `DELETE FROM ${this.t} WHERE id = ?`,
      args: [id],
    });
  };

  async list () {
    return await this.turso.execute(`SELECT * FROM ${this.t}`)
  }

  async burn () {
    return false;
  };

  async dump () {
    return await this.turso.execute(`SELECT * FROM ${this.t}`);
  };
}

export const libsql = (url: string, token: string): Store => {
  return new Turso(url, token);
};