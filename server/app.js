const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const downloadRoutes = require('./routes/downloadRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const VIDEOS_DIR = path.join(__dirname, 'videos');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false
  })
);
app.use(morgan('tiny'));
app.use(express.json({ limit: '2mb' }));

app.use('/videos', express.static(VIDEOS_DIR));
app.use('/api/download', downloadRoutes);
app.use(express.static(CLIENT_DIR));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIR, 'index.html'));
});

app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, error: message });
});

app.listen(PORT, () => {
  console.log(`Who Shared It running at http://localhost:${PORT}`);
});
