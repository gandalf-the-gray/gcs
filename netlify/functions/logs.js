const { getFiles } = require("../../utils.js");

exports.handler = async function(event, __) {
    return {
        statusCode: 200,
        // headers: {'Content-type' : 'text/plain'},
        body: JSON.stringify({files: await getFiles(),})
    }
}