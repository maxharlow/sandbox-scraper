import HTTP from 'http'
import Papaparse from 'papaparse'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import FSExtra from 'fs-extra'
import Yaml from 'yaml'
import scraper from './scraper.js'
import tablePage from './table-page.js'
import errorPage from './error-page.js'

async function scrape() {
    const configfile = await FSExtra.readFile('config.yaml', 'utf8')
    const config = Yaml.parse(configfile)
    return scraper(config)
}

function run() {
    const server = HTTP.createServer(async (request, response) => {
        if (request.url === '/') {
            try {
                const data = await scrape()
                const html = ReactDOMServer.renderToStaticMarkup(React.createElement(tablePage, { data }))
                response.write(html)
            }
            catch (e) {
                const message = e.message
                console.log(`Error: ${message}`)
                const html = ReactDOMServer.renderToStaticMarkup(React.createElement(errorPage, { message }))
                response.write(html)
            }
        }
        else if (request.url === '/csv') {
            try {
                const data = await scrape()
                const csv = Papaparse.unparse({
                    fields: data.headers,
                    data: data.rows
                })
                response.write(csv)
            }
            catch (e) {
                const message = e.message
                response.write(message)
            }
        }
        response.end()
    })
    server.listen(8080)
}

run()
