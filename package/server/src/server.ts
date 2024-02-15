import express, { Application, Request, Response } from 'express';
import config from './configs/appConfig';

const app: Application = express();
const port = config.port;

app.get('/', (req: Request, res: Response) => {
  res.send('Image server running');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
