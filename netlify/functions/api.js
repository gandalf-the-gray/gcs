const mongoose = require("mongoose");
const {log, getWazowski, verifyQueryBody, verifyAdmin, getLogFile} = require("../../utils.js");

async function connectToMongo() {
    await mongoose.connect(`mongodb+srv://nitesh:ilSX2zLf1MDNM8pS@cluster0.z2qmspp.mongodb.net/`);
    await("connected to mongo", "info");
}

// Query model
const querySchema = {
    name: {type: String, required: true},
    message: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String},
}

// Query model ends

exports.handler = async function(event, __) {
    const requestPath = event.path.split("/.netlify/functions/api/")[1];
    const requestMethod = event.httpMethod;
    const pathSplits = requestPath.split("/");

    if(pathSplits.length > 2 || (pathSplits[0] !== "queries" && pathSplits[0] !== "query")) {
        return {
            statusCode: 200,
            headers: {'Content-type' : 'image/jpg'},
            body: await getWazowski(),
            isBase64Encoded : true,
        }
    } else {
        try{
            await connectToMongo();
            const queryModel = mongoose.model("query", querySchema);
            let statusCode = 200;
            let body = {};
            if(pathSplits[0] === "queries") {
                if(requestMethod === "GET") {
                    body = await queryModel.find({});
                } else if(requestMethod === "POST") {
                    const reqBody = JSON.parse(event.body);
                    const errorMessage = verifyQueryBody(reqBody);
                    if(errorMessage !== null) {
                        body = {message: errorMessage};
                    } else {
                        statusCode = 201;
                        body = await queryModel.create({name: reqBody.name, message: reqBody.message, phoneNo: reqBody.phoneNo, email: reqBody.email});
                    }
                } else if (requestMethod === "DELETE") {
                    const errorMessage = verifyAdmin(event);
                    if(errorMessage !== null) {
                        statusCode = 401;
                        body = {message: errorMessage};
                    } else {
                        await queryModel.delete({});
                        statusCode = 204;
                    }
                } else {
                    statusCode = 400;
                    body = {message: "PUT method not allowed"};
                }
            } else {
                const queryId = pathSplits[1];
                if(!queryId) {
                    statusCode = 422;
                    body = {message: "Query ID is required"};
                } else {
                    if(requestMethod === "GET") {
                        body = await queryModel.find({_id: queryId});
                    } else if(!await queryModel.exists({_id: queryId})) {
                        statusCode = 400;
                        body = {message: "Query doesn't exist"};
                    } else if(requestMethod === "PUT") {
                        const reqBody = JSON.parse(event.body);
                        const errorMessage = verifyQueryBody(reqBody);
                        if(errorMessage !== null) {
                            statusCode = 422;
                            body = {message: errorMessage};
                        } else {
                            body = await queryModel.findOneAndUpdate({_id: queryId}, {$set: {name: reqBody.name, message: reqBody.message, phoneNo: reqBody.phoneNo, email: reqBody.email}}, {new: true});
                        }
                    } else if(requestMethod === "DELETE") {
                        const errorMessage = verifyAdmin(event);
                        if(errorMessage !== null) {
                            statusCode = 401;
                            body = {message: errorMessage};
                        } else {
                            await queryModel.deleteOne({_id: queryId});
                        }
                    } else {
                        statusCode = 400;
                        body = {message: "POST method not allowed"};
                    }
                }
            }
            return {
                statusCode,
                body: JSON.stringify(body),
            }
        } catch(e) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: e.message})
            }
        }
    }
}
