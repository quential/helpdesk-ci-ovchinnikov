const http = require('node:http');
const { createPool, initDb } = require('./db');
const { responseMinutes } = require('./sla');

function createServer(pool) {
  return http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    try {
      if (req.method === 'GET' && req.url === '/health') {
        await pool.query('SELECT 1');
        return res.end(JSON.stringify({ status: 'ok' }));
      }
      if (req.method === 'GET' && req.url === '/tickets') {
        const result = await pool.query('SELECT * FROM tickets ORDER BY id');
        return res.end(JSON.stringify(result.rows));
      }
      if (req.method === 'POST' && req.url === '/tickets') {
        let body = '';
        for await (const chunk of req) {
          body += chunk;
          if (body.length > 10000) throw new RangeError('Body too large');
        }
        const payload = JSON.parse(body);
        if (!payload || typeof payload !== 'object') throw new RangeError('Object required');
        const { title, priority } = payload;
        if (typeof title !== 'string' || !title.trim()) {
          throw new RangeError('Title is required');
        }
        const minutes = responseMinutes(priority);
        const result = await pool.query(
          'INSERT INTO tickets(title, priority, response_minutes) VALUES ($1, $2, $3) RETURNING *',
          [title.trim(), priority, minutes]
        );
        res.statusCode = 201;
        return res.end(JSON.stringify(result.rows[0]));
      }
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (error) {
      res.statusCode = error instanceof RangeError || error instanceof SyntaxError ? 400 : 503;
      res.end(JSON.stringify({ error: res.statusCode === 400 ? 'Invalid ticket' : 'Database unavailable' }));
    }
  });
}

if (require.main === module) {
  const pool = createPool();
  initDb(pool).then(() => {
    createServer(pool).listen(Number(process.env.PORT || 3000), '0.0.0.0');
    console.log('Helpdesk API started');
  }).catch(async () => {
    console.error('Database initialization failed');
    await pool.end();
    process.exitCode = 1;
  });
}

module.exports = { createServer };
