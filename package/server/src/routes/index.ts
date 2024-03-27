import express from 'express';

import pingRoute from './pingRoute';
import userRoute from './userRoute';
import assetRoute from './assetRoute';
import maintenanceRoute from './maintenanceRoute';
import contractorRoute from './contractor.route';

const router = express.Router();

router.use('/ping', pingRoute);
router.use('/user', userRoute);
router.use('/asset', assetRoute);
router.use('/maintenance', maintenanceRoute);
router.use('/contractor', contractorRoute);

export default router;
