import express, { Request, Response } from 'express';
import favicon from 'serve-favicon';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import assetRoute from './routes/assetRoute';
import userRoute from './routes/userRoute';
import Router from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

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

// swagger
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, { swaggerOptions: { url: '/swagger.json' } }),
);

// api
app.use('/upload/asset', assetRoute);
app.use('/upload/user', userRoute);
app.use(Router);

app.get('/', (req: Request, res: Response) => {
  res.send('Image server running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
