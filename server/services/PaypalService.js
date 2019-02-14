const fetch = require('node-fetch');
const base64 = require('base-64');

function authenticateApp() {
    const username = 'AUN7VSNweEDzKHyZOQwERvZ4xR-LXcPU2UNPorGfwOYMguRIouCfD0qQKE9qw6YVIKd0BR0Te2BggMuO';
    const password = 'EKXQsXChDc70h6XgRDZ-bIaftMPVoNCa2JmEvDWs6BK2GGPOh-oZCsQLAQn7L71ug3xGjMgdJacVlZZs';

    return new Promise((resolve, reject) => {
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
            .then(reply => { console.log('200 success!!'); resolve(reply.access_token) })
            .catch(err => {
                reject(err);
            });
    });
}

function createPayment(appAccessToken, origin) {
    return new Promise((resolve, reject) => {
        fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + appAccessToken
            },
            body: `{
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "transactions": [{
                        "amount": {
                            "total": "7.47",
                            "currency": "USD"
                        }
                    }],
                    "redirect_urls": {
                        "return_url": "${origin}/payment/success",
                        "cancel_url": "${origin}/payment/error"
                    },
                }`
        })
            .then(response => response.json())
            .then(reply => {
                const approval_url = reply.links.find(a => a.rel === 'approval_url').href;
                resolve(approval_url);
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = {
    AuthenticateApp: authenticateApp,
    CreatePayment: createPayment
};
