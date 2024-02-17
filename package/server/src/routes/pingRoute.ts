import express from 'express';

import { PingController } from '../controllers/pingController';

const router = express.Router();
const pingController = new PingController();

router.get('/', async (_req, res) => {
  const response = await pingController.getMessage();

  return res.send(response);
});

export default router;
