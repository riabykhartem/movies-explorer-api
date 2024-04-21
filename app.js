require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const mongoose = require('mongoose');
const { PORT = 3001 } = process.env;
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const helmet = require('helmet');
const { limiter } = require('./utils/constants');

const app = express();

app.use(limiter);

app.use(helmet());

app.use(cors());

app.use(requestLogger);

mongoose.connect('mongodb://127.0.0.1:27017/diplomadb', {autoIndex: true,});

app.use(bodyParser.json());

app.use(routes);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);

