import chalkAnimation from 'chalk-animation';
import { database } from './database.js';
import express from 'express';
import logger from 'morgan';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger('dev'));
app.use('/',express.static('client'));

app.post('/wordScore', async (req, res) => {
  const { name, word, score } = req.body;
  await database.saveWordScore(name, word, score);
  res.status(200).json({ status: "success" });
});

app.get('/highestWordScores', async (req, res) => {
  const topScores = await database.top10WordScores();

  res.status(200).json(topScores);
});


app.post('/gameScore', async (req, res) => {
  const { name, score } = req.body;
  await database.saveGameScore(name, score);
  res.status(200).json({ status: 'success' });
});



app.get('/gameScore', async (req, res) => {
  const topScores = await database.top10GameScores();
  res.status(200).json(topScores);
});


// This matches all routes that are not defined.
app.all('*', async (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start the server.
app.listen(port, () => {
  const msg = `Server started on http://localhost:${port}`;
  const rainbow = chalkAnimation.rainbow(msg);

  setTimeout(() => {
    rainbow.stop(); 
  }, 2000);
});
