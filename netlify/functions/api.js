const mongoose = require("mongoose");
const {log, getWazowski, verifyQueryBody, verifyAdmin} = require("../../utils.js");

async function connectToMongo() {
    await mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.z2qmspp.mongodb.net/`);
    await log("connected to mongo", "info");
}

// Query model
const querySchema = {
    name: {type: String, required: true},
    message: {type: String, required: true},
    phoneNo: {type: String, required: true},
    email: {type: String},
}
const QueryModel = mongoose.model("query", querySchema);

// Query model ends

exports.handler = async function(event, __) {
    const requestPath = event.path.split("/.netlify/functions/api/")[1];
    const requestMethod = event.httpMethod;
    const pathSplits = requestPath ? requestPath.split("/") : null;

    if(!pathSplits || pathSplits.length > 2 || pathSplits[0] !== "queries") {
        return {
            statusCode: 200,
            headers: {'Content-type' : 'image/jpg'},
            body: await getWazowski(),
            isBase64Encoded : true,
        }
    } else {
        try{
            await connectToMongo();
            let statusCode = 200;
            let body = {};
            if(pathSplits.length === 1) {
                if(requestMethod === "GET") {
                    body = await QueryModel.find({});
                } else if(requestMethod === "POST") {
                    const reqBody = JSON.parse(event.body);
                    const errorMessage = verifyQueryBody(reqBody);
                    if(errorMessage !== null) {
                        statusCode = 422;
                        body = {message: errorMessage};
                    } else {
                        await QueryModel.create({name: reqBody.name, message: reqBody.message, phoneNo: reqBody.phoneNo, email: reqBody.email});
                        statusCode = 201;
                        body = reqBody;
                    }
                } else if (requestMethod === "DELETE") {
                    const errorMessage = verifyAdmin(event);
                    if(errorMessage !== null) {
                        statusCode = 401;
                        body = {message: errorMessage};
                    } else {
                        await QueryModel.deleteMany({});
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
                        body = await QueryModel.find({_id: queryId});
                    } else if(!await QueryModel.exists({_id: queryId})) {
                        statusCode = 400;
                        body = {message: "Query doesn't exist"};
                    } else if(requestMethod === "PUT") {
                        const reqBody = JSON.parse(event.body);
                        const errorMessage = verifyQueryBody(reqBody);
                        if(errorMessage !== null) {
                            statusCode = 422;
                            body = {message: errorMessage};
                        } else {
                            body = await QueryModel.findOneAndUpdate({_id: queryId}, {$set: {name: reqBody.name, message: reqBody.message, phoneNo: reqBody.phoneNo, email: reqBody.email}}, {new: true});
                        }
                    } else if(requestMethod === "DELETE") {
                        const errorMessage = verifyAdmin(event);
                        if(errorMessage !== null) {
                            statusCode = 401;
                            body = {message: errorMessage};
                        } else {
                            await QueryModel.deleteOne({_id: queryId});
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
            await log(e.message);
            return {
                statusCode: 500,
                body: JSON.stringify({message: "sum ting wen wong"})
            }
        }
    }
}
