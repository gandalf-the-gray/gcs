const { log, getLogFile} = require("../../utils.js");

exports.handler = async function() {
    try {
        return {
            statusCode: 200,
            headers: {
                'content-type': 'text/plain'
            },
            body: await getLogFile(),
        }
    } catch(e) {
        if(e.code === "ENOENT") {
            return {statusCode: 200, body: JSON.stringify({message: "no logs"})};
        }
        return {
            statusCode: 500,
            body: JSON.stringify({message: e.message}),
        }
    }
}