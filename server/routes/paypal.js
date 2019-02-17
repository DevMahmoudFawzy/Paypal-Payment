const express = require('express');
const router = express.Router();

const { AuthenticateApp, CreatePayment, ExecutePayment } = require('../services/PaypalService');

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

router.post('/execute', async (req, res) => {
    try {
        const ddd = await ExecutePayment(req.body.PaymentID, req.body.PayerID);
        return res.send({ status: true, message: 'success' });
    } catch (error) {
        return res.status(500).send({ status: false, message: 'error' });
    }
});

module.exports = router;