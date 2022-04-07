import HTTP from 'http'
import Papaparse from 'papaparse'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import FSExtra from 'fs-extra'
import Yaml from 'yaml'
import scraper from './scraper.js'
import page from './page.js'

async function scrape() {
    const configfile = await FSExtra.readFile('config.yaml', 'utf8')
    const config = Yaml.parse(configfile)
    return scraper(config)
}

function run() {
    const server = HTTP.createServer(async (request, response) => {
        if (request.url === '/') {
            const data = await scrape()
            const html = ReactDOMServer.renderToStaticMarkup(React.createElement(page, { data }))
            response.write(html)
        }
        else if (request.url === '/csv') {
            const data = await scrape()
            const csv = Papaparse.unparse({
                fields: data.headers,
                data: data.rows
            })
            response.write(csv)
        }
        response.end()
    })
    server.listen(8080)
}

run()
