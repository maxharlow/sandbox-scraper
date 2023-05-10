import React from 'react'

const h = React.createElement

function page({ data }) {
    return h('html', {}, ...[
        h('head', {}, ...[
            h('meta', { charSet: 'utf-8' })
        ]),
        h('body', {}, ...[
            h('style', {}, [
                'table { margin-top: 20px; border-collapse: collapse; }',
                'td, th { padding: 5px; border: 1px solid black; text-align: left; }'
            ].concat()),
            h('h1', {}, 'Sandbox Scraper'),
            h('a', { href: '/csv', download: 'sandbox-scrape.csv' }, 'Download CSV file'),
            h('table', {}, ...[
                data.headers.map(header => {
                    return h('th', { key: header }, header)
                }),
                data.rows.map(row => {
                    return h('tr', { key: row[0] }, ...[
                        row.map(column => h('td', { key: `${row[0]}-${column}` }, column))
                    ])
                })
            ])
        ])
    ])
}

export default page
