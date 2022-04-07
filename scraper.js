import Zod from 'zod'
import Axios from 'axios'
import * as Cheerio from 'cheerio'

function validate(config) {
    const schema = Zod.object({
        url: Zod.string().url(),
        rowSelector: Zod.string(),
        columnSelectors: Zod.array(
            Zod.union([
                Zod.object({
                    title: Zod.string(),
                    selector: Zod.string(),
                    type: Zod.string().optional()
                }),
                Zod.object({
                    title: Zod.string(),
                    selector: Zod.string(),
                    attribute: Zod.string()
                })
            ])
        )
    })
    const result = schema.safeParse(config)
    if (!result.success) result.error.issues.forEach(error => {
        console.log(`ERROR: ${error.message} ${error.path.join('.')} needs ${error.expected} but got ${error.received}`)
    })
}

async function run(config) {
    validate(config)
    console.log(`Running new scrape at ${new Date().toISOString()}...`)
    const response = await Axios.get(config.url)
    const document = Cheerio.load(response.data)
    const rows = document(config.rowSelector).get()
    return {
        headers: config.columnSelectors.map(column => column.title),
        rows: rows.map(element => {
            const row = Cheerio.load(element)
            return config.columnSelectors.map(column => {
                const selection = row(column.selector)
                return column.attribute ? selection.attr(column.attribute) : selection[column.type || 'text']()
            })
        })
    }
}

export default run
