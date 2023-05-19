const { getLogFile } = require("../../utils.js");

exports.handler = async function(event, __) {
    return {
        statusCode: 200,
        headers: {'Content-type' : 'text/plain'},
        body: await getLogFile(),
        isBase64Encoded : true,
    }
}