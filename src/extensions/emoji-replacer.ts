import { Node, nodeInputRule } from '@tiptap/core'

import { EMOJI_EMOTICONS, EMOTICON_REGEX, UNICODE_REGEX } from '../data'
import { parseTwemoji } from '../helpers'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        emojiReplacer: {
            insertEmoji: (emoji: string) => ReturnType
        }
    }
}

const EmojiReplacer = Node.create({
    name: 'emojiReplacer',
    group: 'inline',
    inline: true,
    selectable: false,
    atom: true,
    addAttributes() {
        return {
            emoji: {
                default: null,
                parseHTML: (element) => element.children[0].getAttribute('alt'),
                renderHTML: (attributes) => {
                    if (!attributes.emoji) {
                        return {}
                    }

                    if (UNICODE_REGEX.test(attributes.emoji)) {
                        return parseTwemoji(attributes.emoji)
                    }

                    return parseTwemoji(EMOJI_EMOTICONS[attributes.emoji])
                },
            },
        }
    },
    parseHTML() {
        return [{ tag: 'span[data-emoji-replacer]' }]
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', { 'data-emoji-replacer': '' }, ['img', HTMLAttributes]]
    },
    renderText({ node }) {
        return node.attrs.emoji
    },
    addCommands() {
        return {
            insertEmoji: (emoji) => ({ tr, dispatch }) => {
                const node = this.type.create({ emoji })

                if (dispatch) {
                    tr.replaceRangeWith(tr.selection.from, tr.selection.to, node)
                }

                return true
            },
        }
    },
    addKeyboardShortcuts() {
        return {
            Backspace: () => {
                const bla = this.editor.commands.first(({ commands }) => [
                    //() => commands.undoInputRule(),
                    () => commands.deleteSelection(),
                    () => commands.joinBackward(),
                    () => commands.selectNodeBackward(),
                    //() => commands.setMeta('preventDispatch', true),

                ])
                console.log(bla)
                //console.log('BACK', this.editor.commands.insertContent('j'))

                return true
            }
        }
    },
    /*addKeyboardShortcuts() {
        return {
            Backspace: () =>
                this.editor.commands.command(({ tr, state }) => {
                    const { empty, anchor } = state.selection

                    if (!empty) {
                        return false
                    }

                    let isKeyboardEventHandled = false

                    state.doc.nodesBetween(anchor - 1, anchor, (node, position) => {
                        if (node.type.name === this.name) {
                            tr.deleteRange(position, position + node.nodeSize)
                            isKeyboardEventHandled = true

                            return false
                        }
                    })

                    return isKeyboardEventHandled
                }),
        }
    },*/
    addInputRules() {
        return [
            nodeInputRule({
                find: EMOTICON_REGEX,
                type: this.type,
                getAttributes: (match) => {
                    return {
                        emoji: match[1],
                    }
                },
            }),
            nodeInputRule({
                find: UNICODE_REGEX,
                type: this.type,
                getAttributes: (match) => ({
                    emoji: match[0],
                }),
            }),
        ]
    },
})

export { EmojiReplacer }
