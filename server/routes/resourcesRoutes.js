const express = require('express');
const { getResources } = require('../controllers/resourcesController');

const router = express.Router();

router.get('/resources', getResources);

module.exports = router;
