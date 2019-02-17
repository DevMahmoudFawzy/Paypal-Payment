const fetch = require('node-fetch');
const base64 = require('base-64');
const fs = require('fs');

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
            .then(reply => {
                console.log('200 success!!');
                resolve(reply.access_token);
            })
            .catch(err => {
                console.log('ozo error here');
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
                    }
                }`
        })
            .then(response => response.json())
            .then(reply => {
                const approval_url = reply.links.find(a => a.rel === 'approval_url').href;
                var obj = {
                    table: []
                };
                fs.readFile('./data/paypal_data.json', 'utf8', function readFileCallback(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (data) {
                            obj = JSON.parse(data); //now it an object
                        }
                        obj.table.push({ PaymentID: reply.id, CreateTime: reply.create_time, AccessToken: appAccessToken }); //add some data
                        var json = JSON.stringify(obj); //convert it back to json
                        fs.writeFile('./data/paypal_data.json', json, 'utf8', (err2, data2) => {

                        }); // write it back
                    }
                });
                resolve(approval_url);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function executePayment(paymentId, payerId) {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/paypal_data.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                reject(err);
            } else {
                if (data) {
                    var obj = JSON.parse(data); //now it an object
                    const paymentIndex = obj.table.findIndex(a => a.PaymentID == paymentId);
                    if (paymentIndex !== -1) {
                        obj.table[paymentIndex].PayerID = payerId;
                        var json = JSON.stringify(obj); //convert it back to json
                        fs.writeFile('./data/paypal_data.json', json, 'utf8', (err2, data2) => {

                        }); // write it back
                        fetch(`https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + obj.table[paymentIndex].AccessToken
                            },
                            body: `{
                                    "payer_id": "${payerId}"
                                }`
                        })
                            .then(response => response.json())
                            .then(reply => {
                                resolve(reply);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    } else {
                        reject('no id');
                    }
                } else {
                    reject('no data');
                }
            }
        });
    });
}

module.exports = {
    AuthenticateApp: authenticateApp,
    CreatePayment: createPayment,
    ExecutePayment: executePayment
};
