'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation';

import { createTheme } from "@/app/actions";

import XAltIcon from "@/assets/X-Alt-Icon";

export default function Page() {
    const router = useRouter();

    const [name, setName] = useState("")

    const handleCancelClick = async () => {
        router.back()
        router.refresh()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const result = await createTheme(name);

        if(result.acknowledged) {
            router.push("/");
            router.refresh()
        } else {
            // CODE
        }

    }

    return (
        <div className="container">
            <div className="create-head">
                <h1>Thema erstellen</h1>
                <button onClick={handleCancelClick} className="icon-button">
                    <XAltIcon/>
                </button>
            </div>
            <div className="head-bottom-text">
                <h3>In dem Theme musst du weitere Kartensets erstellen</h3>
            </div>

            <form onSubmit={handleSubmit}>
                <input minLength={4} onChange={(e) => {setName(e.target.value)}} placeholder="Name des Themas" />
                <button>Erstellen</button>
            </form>

        </div>
    );
}
