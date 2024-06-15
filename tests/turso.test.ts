import { TURSO_AUTH, TURSO_URL } from '../env.js';
import { Turso } from '../src/turso';

const CS = new Turso(TURSO_URL, TURSO_AUTH, "notes");

// set
// [ "ID", "name", "full_name", "preview", "date", "body", "category" ],
// [ "INTEGER", "TEXT", "TEXT", "TEXT", "TEXT", "BLOB", "TEXT" ]
const new_data = [{
  id: 1,
  name: 'first_note',
  full_name: 'first note long name',
  preview: 'i did a thing with note',
  date: new Date().toISOString(),
  body: 'this is the body of the note',
  category: 'test'
}][0];
const set = await CS.set(new_data);

// get
const data = await CS.get(1);
console.log("get", data);

// delete
const del = await CS.del(1);
console.log("delete", del);

// list
const list = await CS.list();
console.log("list", list);