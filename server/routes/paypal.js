const express = require('express');
const fetch = require('node-fetch');
const base64 = require('base-64');
const router = express.Router();

router.get('/pay', (req, res) => {
    res.send('asdasd');
});

router.post('/pay', (req, res) => {

    const username = 'AUN7VSNweEDzKHyZOQwERvZ4xR-LXcPU2UNPorGfwOYMguRIouCfD0qQKE9qw6YVIKd0BR0Te2BggMuO';
    const password = 'EKXQsXChDc70h6XgRDZ-bIaftMPVoNCa2JmEvDWs6BK2GGPOh-oZCsQLAQn7L71ug3xGjMgdJacVlZZs';
    fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Accept-Language': 'en_US',
            'Authorization': 'Basic ' + base64.encode(username + ":" + password)
        },
        body: "grant_type=client_credentials"
    })
        .then(res => res.json())
        .then(reply => {
            const token = reply.access_token;

            fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Accept-Language': 'en_US',
                    'Authorization': 'Bearer ' + token
                },
                body: `{
                    "intent": "sale",
                    "redirect_urls": {
                        "return_url": "http://localhost:4200/payment/success",
                        "cancel_url": "http://localhost:4200/payment/error"
                    },
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "transactions": [{
                        "amount": {
                            "total": "7.47",
                            "currency": "USD"
                        }
                    }]
                }`
            })
                .then(response => response.json())
                .then(reply => {
                    const approval_url = reply.links.find(a => a.rel === 'approval_url').href;
                    console.log(approval_url);
                    return res.send({ status: true, url: approval_url });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send({ status: false, message: 'server error!!' });
                });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).send({ status: false, message: 'server error!!' });
        });
});

module.exports = router;