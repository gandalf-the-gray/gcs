const path = require("path");
const fs = require("fs/promises");

async function log(message, category = "error") {
    try {
        const date = new Date().toLocaleString("in-EN", { timeZone: "Asia/Kolkata"});;
        const logMessage = `${category} ${date} => ${message}`;
        await fs.appendFile(path.join(process.cwd(), "logs.txt"), logMessage);
        return true;
    } catch(e) {
        return false;
    }
}

async function getWazowski() {
    const path = path.join(process.cwd(), "img", "wazowski.jpg");
    return await fs.readFile(path);
}

async function getLogFile() {
    const path = path.join(process.cwd(), "logs.txt");
    return await fs.readFile(path);
}

module.exports = {log, getWazowski, getLogFile};
