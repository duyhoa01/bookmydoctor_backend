let Payment = (doctor_id, description, cost) => {
    return new Promise((resolve, reject) => {
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        //parameters
        var partnerCode = process.env.partnerCode;
        var accessKey = process.env.accessKey;
        var secretkey = process.env.secretkey;
        var requestId = partnerCode + new Date().getTime();
        var orderId = requestId;
        var orderInfo = description;
        var redirectUrl = `https://bookmydoctor.netlify.app/payment/return`;
        var ipnUrl = `${process.env.HOST_BASE}/payment/notify`;
        // var ipnUrl = "localhost:3000/api/payment/notify"
        // var redirectUrl = "https://webhook.site/c91ae285-2eed-44e7-80d1-d124b23c6802";
        var amount = cost;
        var requestType = "captureWallet"
        var extraData = Buffer.from(doctor_id.toString()).toString('base64'); //pass empty value if your merchant does not have stores
        // var extraData = "";
        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
        //puts raw signature
        console.log("--------------------RAW SIGNATURE----------------")
        console.log(rawSignature)
        //signature
        const crypto = require('crypto');
        var signature = crypto.createHmac('sha256', secretkey)
            .update(rawSignature)
            .digest('hex');
        console.log("--------------------SIGNATURE----------------")
        console.log(signature)

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: extraData,
            requestType: requestType,
            signature: signature,
            lang: 'en'
        });
        //Create the HTTPS objects
        const https = require('https');
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        }
        const req = https.request(options, (res) => {
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            console.log('status', res.statusCode);
            var body = [];
            res.on('data', function (chunk) {
                body.push(chunk);
            });
            res.on('end', function () {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        // send the request
        req.write(requestBody);
        req.end();
    });
}
let ReturnPayment = (data) => {

    let resData = {};
    let accessKey = process.env.accessKey.toString();
    var partnerCode = process.env.partnerCode;
    var secretkey = process.env.secretkey;
    if (data.resultCode != 0) {
        resData.errCode = 1;
        resData.message = "Thanh toán thất bại";
        return resData;
    }
    var rawSignature = "accessKey=" + accessKey
    + "&amount=" + data.amount
    + "&extraData=" + data.extraData
    + "&message=" + data.message
    + "&orderId=" + data.orderId
    + "&orderInfo=" + data.orderInfo
    + "&orderType=" + data.orderType
    + "&partnerCode=" + partnerCode
    + "&payType=" + data.payType
    + "&requestId=" + data.requestId
    + "&responseTime=" + data.responseTime
    + "&resultCode=" + data.resultCode
    + "&transId=" + data.transId

    console.log(rawSignature);
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');

    console.log(signature);
    console.log(data.signature);
    if (signature !== data.signature) {
        resData.errCode = 2;
        resData.message = "Request không hợp lệ";
        return resData;
    }
    resData.errCode = 0;
    resData.message = "Thanh toán thành công";
    return resData;
}
let NotifyPayment = (data) => {
    var secretkey = process.env.secretkey;
    var signature = data.signature;

    let resData = {};
    var partnerCode = process.env.partnerCode;
    let accessKey = process.env.accessKey.toString();
    if (data.resultCode != 0) {
        resData.errCode = 1;
        resData.message = "Thanh toán thất bại";
        return resData;
    }
    var rawSignature = "accessKey=" + accessKey
        + "&amount=" + data.amount
        + "&extraData=" + data.extraData
        + "&message=" + data.message
        + "&orderId=" + data.orderId
        + "&orderInfo=" + data.orderInfo
        + "&orderType=" + data.orderType
        + "&partnerCode=" + partnerCode
        + "&payType=" + data.payType
        + "&requestId=" + data.requestId
        + "&responseTime=" + data.responseTime
        + "&resultCode=" + data.resultCode
        + "&transId=" + data.transId

    console.log(rawSignature);
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    console.log(signature);
    console.log(data.signature);

    if (signature !== data.signature) {
        resData.errCode = 2;
        resData.message = "Request không hợp lệ";
        return resData;
    }
    resData.errCode = 0;
    resData.message = "Thanh toán thành công";
    let doctor_id = Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii');
    console.log(doctor_id); // doctor_id dang la string
    console.log('cap nhat trang thai giao dich');
    return resData;
}
module.exports = {
    Payment,
    ReturnPayment,
    NotifyPayment
}