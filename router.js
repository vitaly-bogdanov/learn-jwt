const { Router } = require('express');
const router = Router();

const TokensController = require('./TokensController');

router.post('/get-access-refresh', [], TokensController.getAccessRefresh);
router.post('/refresh', [], TokensController.refreshTokens);

module.exports = router;