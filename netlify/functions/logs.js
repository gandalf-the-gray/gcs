const { log, getLogFile} = require("../../utils.js");

exports.handler = async function() {
    try {
        await log("trying to connect to mongo", "info");
        return {
            statusCode: 200,
            headers: {
                'content-type': 'text/plain'
            },
            body: await getLogFile(),
        }
    } catch(e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: e.message}),
        }
    }
}