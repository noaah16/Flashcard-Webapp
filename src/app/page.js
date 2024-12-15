'use client'

import { useEffect, useState } from "react";
import Link from "next/link";

import { getAllThemes } from "@/app/actions";

import { emptyList } from "@/lib/messages";

import PlusAltIcon from "@/assets/Plus-Alt-Icon";
import Image from "next/image";

const Page = () => {

    const [themesData, setThemesData] = useState(null)

    useEffect(() => {
        const fetchThemes = async () => {
            const data = await getAllThemes()
            setThemesData(data)
        }
        fetchThemes().then()
    }, []);

    if(!themesData) {
        return <div className="container themes">
            <p>Loading...</p>
        </div>
    }

    return (
        <div className="container themes">
            <div className="head">
                <h1>Bibliothek</h1>
            </div>
            <div className="list">
                {
                    !themesData.length ? <p> { emptyList } </p> : themesData.map((item, index) => {
                        return <Link key={index} href={`/theme/${item.theme_id}`}>
                            <div key={index} className="item center">
                                <p> { item.name } </p>
                            </div>
                        </Link>
                    })
                }
            </div>

            <div className="button-container">

                {
                    !themesData.length ? <div className="welcome-newbie">
                        <div className="welcome-bubble">
                            <p>Erstelle hier ein Thema. Du kannst dann in dem Thema Kartensets und Karteikarten
                                erstellen.</p>
                        </div>

                        <div className="welcome-arrow">
                            <Image src="/arrow.png" width="100" height="100" alt="arrow"></Image>
                        </div>

                    </div> : null
                }

                <Link className="create-button" href="/create/theme">
                    <PlusAltIcon/>
                    Thema erstellen
                </Link>
            </div>
        </div>
    );
}

export default Page;
