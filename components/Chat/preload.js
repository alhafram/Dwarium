async function processLineByLine() {
    const fs = require('fs');
    const path = require('path')
    const readline = require('readline')
    const filePath = path.join(__dirname, 'logs', 'chat.log')

    const fileStream = fs.createReadStream(filePath)
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        let elem = document.createElementFromString(line)
        document.querySelector("body > div.messageLogs").appendChild(elem)
    }
    scrollToBottom()
    fs.watch(filePath, function(eventName, filename) {
        const fileStream1 = fs.createReadStream(filePath)
        const rl1 = readline.createInterface({
            input: fileStream1,
            crlfDelay: Infinity
        });
        let currentLine = null
        rl1.on('line', function(line) {
            currentLine = line;
        });
        fileStream1.on('end', function() {
            let elem = document.createElementFromString(currentLine)
            document.querySelector("body > div.messageLogs").appendChild(elem)
            filterLog()
        });
    });
}


window.addEventListener('DOMContentLoaded', async () => {
    await processLineByLine()
    filterLog()
})

Document.prototype.createElementFromString = function(str) {
    const element = new DOMParser().parseFromString(str, 'text/html');
    const child = element.documentElement.querySelector('body').firstChild;
    return child;
};
