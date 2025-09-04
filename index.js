require('dotenv').config();
const express = require('express');
const path = require('path');
const dashboardRouter = require('./src/routes/index');
const config = require('./src/config/config');

const app = express();
const port = config.port;

app.use(express.json());


app.use(express.static(path.join(__dirname, 'client/build')));


app.use('/api', dashboardRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Error serving React app');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});