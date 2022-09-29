import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import type { Extensions } from '@tiptap/react'

import { EmojiReplacer } from '../extensions'

import './Tiptap.scss'

type TiptapProps = {
    content?: string
    placeholder?: string
    withPlaceholderExtension?: boolean
    withEmojisReplacer?: boolean
}

function Tiptap({
    content = '',
    placeholder = "Type '/' for actions…",
    withPlaceholderExtension = false,
    withEmojisReplacer = false,
}: TiptapProps) {
    const extensions: Extensions = [StarterKit]

    if (withPlaceholderExtension) {
        extensions.push(
            Placeholder.configure({
                placeholder,
            }),
        )
    }

    if (withEmojisReplacer) {
        extensions.push(EmojiReplacer)
    }

    const editor = useEditor({
        extensions,
        content,
    })

    if (!editor) {
        return null
    }

    return (
        <>
            <div className="WhiteCard">
                <EditorContent editor={editor} />
            </div>
            <h2>HTML Output</h2>
            <div className="WhiteCard">
                <pre>{editor.getHTML()}</pre>
            </div>
        </>
    )
}

export { Tiptap }
