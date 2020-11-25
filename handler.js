'use strict';
const { setBody } = require("./helper");
const fetch = require('node-fetch');
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

module.exports.linkPreview = async (event, context, callback) => {
    if (!event.queryStringParameters.links) return callback(null, {"statusCode": 400, "headers": headers, "body": "There are no query params"})

    const linkArr = event.queryStringParameters.links.split(',');
    const promises = linkArr.map(link => {
        return fetch(link);
    })

    await Promise
        .allSettled(promises)
        .then(async results => {

            let body = [];
            for (let i = 0; i < results.length; i++) {
                if (results[i].status === 'fulfilled') {
                    const bodyHtml = await results[i].value.text();
                    body = [...body, {"id": i, ...setBody(bodyHtml)}]
                }
            }

            if (results.every(r => r.status === 'rejected')) {
                callback(null, {"statusCode": 200, "headers": headers, "body": JSON.stringify({"error":"There are no valid url links"})})
            } else {
                callback(null, {"statusCode": 200, "headers": headers, "body": JSON.stringify(body)})
            }
    })
};
