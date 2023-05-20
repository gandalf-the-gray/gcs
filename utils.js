const path = require("path");
const fs = require("fs/promises");

async function log(message, category = "error") {
    try {
        const date = new Date().toLocaleString("in-EN", { timeZone: "Asia/Kolkata"});;
        const logMessage = `${category} ${date} => ${message}\n`;
        await fs.appendFile(path.join(process.cwd(), "assets", "text", "logs.txt"), logMessage);
        return true;
    } catch(e) {
        return false;
    }
}

async function getWazowski() {
    const filePath = path.join(process.cwd(), "assets", "images", "wazowski.jpg");
    return await fs.readFile(filePath);
}

async function getLogFile() {
    const filePath = path.join(process.cwd(), "assets", "text", "logs.txt");
    return await fs.readFile(filePath, {encoding: "utf-8"});
}

module.exports = {log, getWazowski, getLogFile};
