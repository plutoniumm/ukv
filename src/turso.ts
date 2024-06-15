import { createClient } from "@libsql/client/web";

export class Turso implements Store {
  private turso: any;
  private t: string;

  constructor(url: string, token: string, table: string) {
    this.turso = createClient({
      url: url, authToken: token
    });
    this.t = table;
  }
  async get (id: string) {
    const sql = "SELECT * FROM " + this.t + " WHERE id = ?";
    console.log("QUERY: ", sql);

    return await this.turso.execute({ sql, args: [id] });
  };

  async set (body: KVSQL[]) {
    const sql = "INSERT INTO notes VALUES (?,?,?,?,?,?,?)";

    if (body.length == 0) {
      return true;
    } else if (body.length == 1) {
      const args = Object.values(body);
      return await this.turso.execute({ sql, args })
    } else {
      let args = body.map(e => Object.values(e));
      args = args.map(e => ({ sql: sql, args: e }));

      return await this.turso.batch(args);
    }
  };

  async del (id: U<string>) {
    const sql = "DELETE FROM " + this.t + " WHERE id = ?";

    return await this.turso.execute({ sql, args: [id], });
  };

  async list () {
    const exec = "SELECT * FROM " + this.t;
    return await this.turso.execute(exec);
  };

  async burn () {
    throw new Error("Disallowed operation.");
    return false;
  };

  dump = this.list;
};