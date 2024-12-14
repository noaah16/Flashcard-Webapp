'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import Placeholder from '@tiptap/extension-placeholder'

const Tiptap = ({ id, onUpdate }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Schreibe hier die Frage"
            }),
        ],
        content: '',
        onUpdate: ({editor}) => {
            onUpdate(editor.getHTML())
        },
    })

    if(!editor) return <div className="tiptap-placeholder" />
    
    return <EditorContent editor={editor} />
}

export default Tiptap