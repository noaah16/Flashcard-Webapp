'use client'

import { useRouter } from "next/navigation";

import { useEditor, EditorContent } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import XAltIcon from "@/assets/X-Alt-Icon";
import {useEffect, useState} from "react";
import {getCardById, updateCard} from "@/app/actions";

const Page = ({params}) => {
    const router = useRouter();

    const [flashcard, setFlashcard] = useState()

    const questionEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Frage" })],
        content: '',
        immediatelyRender: false
    })

    const answerEditor = useEditor({
        extensions: [ StarterKit, Placeholder.configure({ placeholder: "Schreibe hier die Antwort" })],
        content: '',
        immediatelyRender: false
    })

    const handleSubmit = async (event) => {
        event.preventDefault()

        const result = await updateCard(
            params.id,
            questionEditor.getText(),
            questionEditor.getHTML(),
            answerEditor.getHTML()
        )

        if(result.acknowledged) {
            router.back()
            router.refresh()
        } else {
            // CODE
        }

    }

    const handleCancelClick = async () => {
        router.back()
        router.refresh()
    }

    useEffect(() => {
        const fetchFlashcard = async () => {
            try {
                const data = await getCardById(params.id);
                setFlashcard(data)
            } catch (e) {
                console.error('Fehler beim Laden der Flashcard:', e);
            }
        }
        fetchFlashcard().then()
    }, [params.id])

    useEffect(() => {
        if (flashcard && questionEditor && answerEditor) {
            questionEditor.commands.setContent(flashcard["questionHTML"]);
            answerEditor.commands.setContent(flashcard["answerHTML"]);
        }
    }, [questionEditor, answerEditor, flashcard]);

    return (
        <div className="container">
            <div className="head">
                <div className="head-title">
                    <h1>Card bearbeiten</h1>
                    <button onClick={handleCancelClick} className="icon-button">
                        <XAltIcon/>
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="edit-container">
                    <EditorContent editor={questionEditor}/>
                    <EditorContent editor={answerEditor}/>
                </div>

                <div className="edit-interactions">
                    <button>Speichern</button>
                </div>
            </form>

        </div>
    );
}

export default Page;