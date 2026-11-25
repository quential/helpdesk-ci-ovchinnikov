const { once } = require('node:events');
const { createPool, initDb } = require('../../src/db');
const { createServer } = require('../../src/server');
let pool, server, base;

beforeAll(async () => {
  if (process.env.DB_NAME !== 'helpdesk_test') throw new Error('Use helpdesk_test only');
  pool = createPool();
  await initDb(pool);
  server = createServer(pool).listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (pool) await pool.end();
});

test('health checks the real database', async () => {
  const res = await fetch(`${base}/health`);
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ status: 'ok' });
});

test('POST persists a ticket and GET returns it', async () => {
  const res = await fetch(`${base}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'VPN does not connect', priority: 'high' })
  });
  expect(res.status).toBe(201);
  const ticket = await res.json();
  expect(ticket.response_minutes).toBe(60);
  const saved = await pool.query('SELECT title FROM tickets WHERE id=$1', [ticket.id]);
  expect(saved.rows[0].title).toBe('VPN does not connect');
  const list = await (await fetch(`${base}/tickets`)).json();
  expect(list).toContainEqual(ticket);
});

test('invalid priority returns 400', async () => {
  const res = await fetch(`${base}/tickets`, {
    method: 'POST',
    body: JSON.stringify({ title: 'Broken VPN', priority: 'wrong' })
  });
  expect(res.status).toBe(400);
});
