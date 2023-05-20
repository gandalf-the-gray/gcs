const path = require("path");
const fs = require("fs/promises");

async function log(message, category = "error") {
    try {
        const date = new Date().toLocaleString("in-EN", { timeZone: "Asia/Kolkata"});;
        const logMessage = `${category} ${date} => ${message}\n`;
        await fs.appendFile(path.join(process.cwd(), "tmp", "text", "logs.txt"), logMessage);
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
    const filePath = path.join(process.cwd(), "tmp", "text", "logs.txt");
    return await fs.readFile(filePath, {encoding: "utf-8"});
}

// Validations functions
function verifyAdmin(event) {
    return event.headers.authorization && event.headers.authorization === process.env.ADMIN_PASSWORD ? null : false;
}

function verifyQueryBody(body) {
    if(body.name && body.phoneNo && body.message) {
        if(body.phoneNo.length === 10) {
            return null;
        } else {
            return "Phone number should have exactly 10 digits";
        }
    } else {
        return "Name, message and phone number are required";
    }
}

module.exports = {log, getWazowski, getLogFile, verifyAdmin, verifyQueryBody};
