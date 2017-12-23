const https = require('http');

https.get('http://tonny-zhang.github.io/info.php', (res) => {
    let content = Buffer.alloc(0);
    res.on('data', (chunk) => {
        content = Buffer.concat([content, chunk]);
    });
    res.on('end', () => {
        console.log(content.toString());
    });
});

console.log(module);