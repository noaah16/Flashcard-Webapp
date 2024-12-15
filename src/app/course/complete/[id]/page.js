'use client'

import { useRouter } from "next/navigation";
import {getCardset, resetCourse, startCourse} from "@/app/actions";
import {useEffect, useState} from "react";
import Link from "next/link";

const Page = ({params}) => {
    const router = useRouter();

    const [cardset, setCardset] = useState(null)

    const handleClickRestart = async (event) => {
        event.preventDefault()

        const result = await resetCourse(params.id)
        if(!result.acknowledged) return null
        
        router.push(`/course/${params.id}`)
    }
    
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCardset(params.id)
                setCardset(data)
            } catch (e) {
                console.error('Fehler beim Laden der Flashcard:', e)
            }
        }
        fetchCourse().then()
    }, [params.id])

    if(!cardset) return null

    return <div className="course-container">
        <div className="course-head">
            <Link href={`/theme/${cardset.theme_id}`}>
                { "<-" } Back to cardset
            </Link>
            <h1>Kurs abgeschlossen!</h1>
            <p>Du kannst den Kurs von neu beginnen.</p>
        </div>
        <div className="course-interactions">
            <button className="dark" onClick={handleClickRestart}>Neustart</button>
            <Link href={`/theme/${cardset.theme_id}`}>
                <button>Abschließen und zurück</button>
            </Link>
        </div>
    </div>
}

export default Page;