const { Hono } = require('hono');
const { cors } = require('hono/cors');
const { secureHeaders } = require('hono/secure-headers');
const { serveStatic } = require('@hono/node-server/serve-static');
const path = require('node:path');

const authRoutes = require('./routes/auth.routes');
const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');
const balanceRoutes = require('./routes/balance.routes');
const statisticsRoutes = require('./routes/statistics.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = new Hono();

// Security middleware
app.use('*', secureHeaders());

// CORS configuration
app.use('*', cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'
    : 'http://localhost:5173',
  credentials: true
}));

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/groups', groupRoutes);
app.route('/api/groups', expenseRoutes);
app.route('/api/groups', balanceRoutes);
app.route('/api/groups', statisticsRoutes);
app.route('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the Vue app in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

  app.use('/*', serveStatic({ root: clientDistPath }));

  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', async (c) => {
    if (c.req.path.startsWith('/api')) {
      return c.json({ error: { message: 'Route not found' } }, 404);
    }
    const fs = require('node:fs');
    const indexPath = path.join(clientDistPath, 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    return c.html(html);
  });
}

// Error handling
app.onError((err, c) => {
  console.error(err.stack);
  return c.json({
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  }, err.status || 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: { message: 'Route not found' } }, 404);
});

module.exports = app;
