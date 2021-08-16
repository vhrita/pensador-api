require('express-async-errors');
const express = require('express');
const puppeteer = require('puppeteer');

const server = express();
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

const baseURL = "https://www.pensador.com";

function openBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        waitUntil: 'domcontentloaded',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    return browser;
}

function closeBrowser(browser) {
    await browser.close();
}

server.get('/', (request, response) => {
    response.status(200).send({
        "status" : "success",
        "doc" : "https://github.com/vhrita/pensador-api#readme"
    })
});

server.get('/search', (request, response) => {
    let q = request.query.q;
    let limit = request.query.limit ? request.query.limit : 10;

    const page = openBrowser();

    page.goto();

    response.status(200).send({q, limit});
});

server.use((error, req, response, next) => {
    console.log(`${error.stack}`);
    response.status(error.statusCode ? error.statusCode : 500)
    .send({'Error' : error.statusCode ? error.message : 'Internal Server Error'});
});

const port = process.env.PORT || 3000;
server.listen(port, () =>{
    console.log(`Listening on port: ${port}`);
});