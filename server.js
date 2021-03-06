'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const app = express();
const citiesPath = path.join(__dirname, 'cities.json');

app.use(bodyParser.json());
app.use(morgan('short'));

app.get('/citeis', (req, res, next) => {
  fs.readFile(citiesPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500);
      next(err);
    }

    const cities = JSON.parse(data);

    res.send(cities);
  });
});

app.get('/cities/id', (req, res) => {
  fs.readFile(citiesPath, (err, data) => {
    if (err) {
      res.status(500);
      next(err);
    }

    const id = Number.parseInt(req.params.id);
    const cities = JSON.parse(data);

    if (id < 0 || id >= cities.length || Number.isNaN(id)) {
      // BONUS
    }

    res.send(cities[id]);
  });
});

app.post('/cities', (res, req, next) => {
  const name = req.body.name;
  const state = req.body.state;

  if (!name || !state) {
    const err = new Error('Bad Request');

    res.status(400);
    next(err);
  }

  let newCity = { name, state };

  fs.readFile(citiesPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500);
      next(err);
    }

    let cities = JSON.parse(data);

    cities.push(newCity);
    cities = JSON.stringify(cities);

    fs.writeFile(citiesPath, cities, (err) => {
      if (err) {
        res.status(500);
        next(err);
      }

      res.send(newCity);
    })
  });
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.send(err.message);
})

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
