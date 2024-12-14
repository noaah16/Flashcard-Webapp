'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createCardset } from "@/app/actions";

import XAltIcon from "@/assets/X-Alt-Icon";

export const runtime = 'edge';

export default function Page({params}) {
    const router = useRouter();

    const [name, setName] = useState("")

    const handleCancelClick = async () => {
        router.back()
        router.refresh()
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const result = await createCardset(params.id, name);

        if(result.acknowledged) {
            router.push(`/theme/${params.id}`);
            router.refresh()
        } else {
            // CODE
        }

    }

    return (
        <div className="container">
            <div className="create-head">
                <h1>Cardset erstellen</h1>
                <button onClick={handleCancelClick} className="icon-button">
                    <XAltIcon/>
                </button>
            </div>
            <div className="head-bottom-text">
                <h3>In dem Cardset können Karteikarten erstellt werden</h3>
            </div>

            <form onSubmit={handleSubmit}>
                <input minLength={4} onChange={(e) => {
                    setName(e.target.value)
                }} placeholder="Name des Kartensets"/>
                <button>Erstellen</button>
            </form>

        </div>
    );
}
