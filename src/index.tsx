import React from 'react'
import { render } from 'react-dom'

import { Tiptap } from './components'

import './index.scss'

render(
    <Tiptap
        placeholder="Type an emoticon (e.g, :D) and a space…"
        withPlaceholderExtension={true}
        withEmojisReplacer={true}
    />,
    document.getElementById('root'),
)
