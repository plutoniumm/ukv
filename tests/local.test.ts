import { CF } from './src/cloudflare';
import { ACC_ID, NS_ID, TOKEN } from "./env.js"

const CS = CF(ACC_ID, NS_ID, TOKEN);

const toString = (e: any) => {
  if (typeof e === 'string') {
    return e;
  } else if (typeof e === 'object') {
    return JSON.stringify(e);
  };
}

// const data = await CS.get('hi', 'undefined');
// console.log("get", toString(data));
// const list = await CS.list();
// console.log("list", toString(list));

// set
const new_data = [
  { key: 'hi', value: 'hello' },
  { key: 'hello', value: 'hi' }
];
const set = await CS.set(new_data);
console.log("set", toString(set));


const list = await CS.list();
console.log("list", toString(list));

// // delete
// const del = await CS.del(list[0] as string);

// const CS = CF(c.env.NS);
// const burn = await CS.burn();
// console.log("burn", toString(burn));