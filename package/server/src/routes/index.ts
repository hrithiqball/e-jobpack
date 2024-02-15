import express from 'express';

import pingRoute from './pingRoute';
import userRoute from './userRoute';
import assetRoute from './assetRoute';
import maintenanceRoute from './maintenanceRoute';

const router = express.Router();

router.use('/ping', pingRoute);
router.use('/user', userRoute);
router.use('/asset', assetRoute);
router.use('/maintenance', maintenanceRoute);

export default router;
