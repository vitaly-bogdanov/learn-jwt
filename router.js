const { Router } = require('express');
const router = Router();

const TokensController = require('./TokensController.js');

router.post('/get-access-refresh', TokensController.getAccessRefresh);
router.post('/refresh', TokensController.refreshTokens);

module.exports = router;