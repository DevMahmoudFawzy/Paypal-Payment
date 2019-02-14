const express = require('express');
const router = express.Router();

const { AuthenticateApp, CreatePayment } = require('../services/PaypalService');

router.post('/pay', async (req, res) => {

    try {
        const accessToken = await AuthenticateApp();
        if (accessToken) {
            const approvalURL = await CreatePayment(accessToken, req.get('origin'));
            return res.send({ status: true, ApprovalURL: approvalURL });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: 'server error!!' });
    }
});

module.exports = router;