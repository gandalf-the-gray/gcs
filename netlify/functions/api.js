const mongoose = require("mongoose");
const {log, getWazowski} = require("../../utils.js");

(async function() {
    while(true) {
        try{
            const username = process.env.MONGO_DB_USERNAME;
            const password = process.env.MONGO_DB_PASSWORD;
            await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.z2qmspp.mongodb.net/`);
            await log("connected to mongo", "info");
            break;
        } catch(e) {
            await log(e.message);
            await new Promise((res, _) => setTimeout(res, 1000));
        }
    }
})();

// Query model
const querySchema = {
    name: {type: String, required: true},
    message: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String},
}

const queryModel = mongoose.model("query", querySchema);
// Query model ends

exports.handler = async function(event, __) {
    const requestPath = event.path.split("/.netlify/functions/api/")[1];
    const pathSplits = requestPath.split("/");
    if(pathSplits.length > 2 || (pathSplits[0] !== "queries" && pathSplits[0] !== "query")) {
        return {
            statusCode: 200,
            headers: {'Content-type' : 'image/jpg'},
            body: await getWazowski(),
            isBase64Encoded : true,
        }
    } else {
        return {
            statusCoe: 200,
            body: JSON.stringify({event}),
        }
    }
}
