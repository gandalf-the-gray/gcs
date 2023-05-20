const path = require("path");
const fs = require("fs/promises");

async function log(message, category = "error") {
    try {
        const date = new Date().toLocaleString("in-EN", { timeZone: "Asia/Kolkata"});;
        const logMessage = `${category}:${date} => ${message}\n`;
        await fs.appendFile("/tmp/logs.txt", logMessage);
        return true;
    } catch(e) {
        return false;
    }
}

// Content related functions
async function getWazowski() {
    const filePath = path.join(process.cwd(), "assets", "images", "wazowski.jpg");
    return await fs.readFile(filePath, {encoding: "base64"});
}

async function getLogFile() {
    const filePath = "/tmp/logs.txt";
    return await fs.readFile(filePath, {encoding: "utf-8"});
}

// Validations functions
function verifyAdmin(event) {
    if(event.headers.authorization && event.headers.authorization === process.env.ADMIN_PASSWORD) {
        return null;
    } else {
        return "Unauthorized access";
    }
}

function verifyQueryBody(body) {
    if(body.name && body.phoneNo && body.message) {
        if(body.phoneNo >= (10 ** 9)) {
            return null;
        } else {
            return "Contact number should have exactly 10 digits";
        }
    } else {
        return "Name, message and contact number are required";
    }
}

module.exports = {log, getWazowski, getLogFile, verifyAdmin, verifyQueryBody};
