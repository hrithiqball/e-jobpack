import express from 'express';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import Router from './routes';
import app from './server';

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));

// serve
app.use(express.static('public'));
app.use(
  express.static(path.join('upload'), {
    dotfiles: 'allow',
  }),
);

// api
app.use(Router);
