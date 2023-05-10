import React from 'react'

const h = React.createElement

function page({ message }) {
    return h('html', {}, ...[
        h('head', {}, ...[
            h('meta', { charSet: 'utf-8' })
        ]),
        h('body', {}, ...[
            h('h1', {}, 'Sandbox Scraper'),
            h('p', {}, message)
        ])
    ])
}

export default page
