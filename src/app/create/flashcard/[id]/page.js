'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react'
import {createCardDraft, finishCreateCard} from "@/app/actions";

import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import XAltIcon from "@/assets/X-Alt-Icon";

export default function Page({params}) {
    const router = useRouter();

    const [draftFlashcardId, setDraftFlashcardId] = useState("")
    
    const [page, setPage] = useState("question")

    const questionEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Frage" })],
        content: '',
    })
    const answerEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Antwort" })],
        content: '',
    })

    const handleCancelClick = async () => {
        router.back()
        router.refresh()
    }

    const handleSubmitSaveDraft = async (event) => {
        event.preventDefault()

        const result = await createCardDraft(params.id, questionEditor.getText(), questionEditor.getHTML());

        if(result.acknowledged) {
            setDraftFlashcardId(result.id)
            setPage("answer")
        } else {
            // CODE
        }

    }

    const handleSubmitCreate = async (event) => {
        event.preventDefault()

        const result = await finishCreateCard(draftFlashcardId, params.id, answerEditor.getHTML())

        if(result.acknowledged) {
            router.push(`/editor/${params.id}`)
            router.refresh()
        } else {
            // CODE
        }

    }

    switch (page) {
        case "question":
            return <div className="container">
                <div className="create-head">
                    <h1>Card erstellen - Frage</h1>
                    <button onClick={handleCancelClick} className="icon-button">
                        <XAltIcon/>
                    </button>
                </div>
                <div className="head-bottom-text">
                    <h3>Unfertige Flashcards werden als Draft gespeichert.</h3>
                </div>
                <form onSubmit={handleSubmitSaveDraft}>
                    <EditorContent editor={questionEditor} />
                    <button>Weiter (automatisch als Entwurf speichern)</button>
                </form>
            </div>
        case "answer":
            return <div className="container">
                <div className="create-head">
                    <h1>Card erstellen - Antwort</h1>
                    <button onClick={handleCancelClick} className="icon-button">
                        <XAltIcon/>
                    </button>
                </div>
                <div className="head-bottom-text">
                    <h3>Unfertige Flashcards werden als Draft gespeichert.</h3>
                </div>

                <form onSubmit={handleSubmitCreate}>
                    <EditorContent editor={answerEditor} />
                    <button>Erstellen</button>
                </form>
            </div>
        default:
            return <div className="container">
                <p>Laura ist schuld</p>
            </div>
    }
}
