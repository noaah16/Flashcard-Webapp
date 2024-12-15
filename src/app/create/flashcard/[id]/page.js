'use client'

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

import {createCardDraft, finishCreateCard, getAIAnswers} from "@/app/actions";

import XAltIcon from "@/assets/X-Alt-Icon";

export default function Page({params}) {
    const router = useRouter();

    const [isAiError, setIsAiError] = useState(false)
    const [aiAnswers, setAiAnswers] = useState([])
    const [draftFlashcardId, setDraftFlashcardId] = useState("")

    const [page, setPage] = useState("question")

    const questionEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Frage" })],
        immediatelyRender: false,
        content: '',
    })
    const answerEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Antwort" })],
        immediatelyRender: false,
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

    const handleSelectAnswer = async (answer) => {
        if(!answerEditor) return
        answerEditor.commands.setContent(answer)
    }

    useEffect(() => {
        const fetchAIAnswers = async () => {
            const data = await getAIAnswers(questionEditor.getText())
            if(data.error) return setIsAiError(true)
            setAiAnswers(data.answers)
        }

        if(page === "answer") {
            console.log("Hallo", page)
            fetchAIAnswers().then()
        }
    }, [page, questionEditor]);

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
                    <EditorContent editor={answerEditor}/>
                    <button>Erstellen</button>
                </form>

                <div className="ai-stuff">
                    <h3>KI-Generierte Antworten</h3>
                    <label>zum auswählen, anklicken</label>

                    {
                        aiAnswers && aiAnswers.length ? <div className="ai-list">
                            {
                                aiAnswers.map((value, index) => {
                                    return (
                                        <div onClick={() => handleSelectAnswer(value)} key={index}
                                             className="ai-item">
                                            {value}
                                        </div>
                                    )
                                })
                            }
                        </div> : <div className="ai-list">
                            {
                                isAiError ? <p>Es konnten keine Antworten generiert werden</p> : <p>Antworten werden geladen...</p>
                            }
                        </div>
                    }
                </div>
            </div>
        default:
            return <div className="container">
                <p>Laura ist schuld</p>
            </div>
    }
}
