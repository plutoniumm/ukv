import { CF } from './src/cloudflare';
import { Hono } from 'hono';

const app = new Hono();

const toString = (e: any) => {
  if (typeof e === 'string') {
    return e;
  } else if (typeof e === 'object') {
    return JSON.stringify(e);
  };
}

app
  .get('/', async (c) => {
    const CS = CF(c.env.NS);

    const data = await CS.get('hi', 'hello');
    console.log("get", toString(data));
    const list = await CS.list();
    console.log("list", toString(list));

    // set
    const new_data = [
      { key: 'hi', value: 'hello' },
      { key: 'hello', value: 'hi' }
    ];
    const set = await CS.set(new_data);

    // delete
    const del = await CS.del(list[0] as string);

    return c.text('Hello Cloudflare Workers!')
  })
  .get('/burn', async (c) => {
    const CS = CF(c.env.NS);
    const burn = await CS.burn();
    console.log("burn", toString(burn));
    return c.text('Burned!')
  });

export default app;