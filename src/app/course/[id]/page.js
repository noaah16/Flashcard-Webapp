'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getAnotherCourseCard, startCourse, updateCourseCard } from "@/app/actions";

import XAltIcon from "@/assets/X-Alt-Icon";

const Page = ({params}) => {
    const router = useRouter();

    const [data, setData] = useState(null)
    const [flashcard, setFlashcard] = useState({})
    const [flipped, setFlipped] = useState(false);
    const [finished, setFinished] = useState(false)

    const [loadCard, setLoadCard] = useState(false)

    const handleCancelClick = async () => {
        router.push(`/theme/${data["__theme"].theme_id}`)
        router.refresh()
    }

    const handleClickNo = async (event) => {
        event.preventDefault()
        if(loadCard) return

        const cardElement = document.querySelector(`.flip-card-back`)
        cardElement.classList.add("red-border")

        setLoadCard(true)

        const result = await updateCourseCard(params.id, flashcard.flashcard_id, false);
        if(!result.acknowledged) return null

        const data = await getAnotherCourseCard(params.id)

        setTimeout(() => {
            setFlashcard(data["flashcard"])

            setData(prevState => ({
                ...prevState,
                _cards_count: data["_cards_count"],
                _finished_count: data["_finished_count"]
            }))

            setLoadCard(false)
            setFlipped(false)
            cardElement.classList.remove("red-border")
        }, 300)
    }

    const handleClickYes = async (event) => {
        event.preventDefault()
        if(loadCard) return

        const cardElement = document.querySelector(`.flip-card-back`)
        cardElement.classList.add("green-border")

        setLoadCard(true)

        const result = await updateCourseCard(params.id, flashcard.flashcard_id, true);
        if(!result.acknowledged) return null

        const data = await getAnotherCourseCard(params.id)

        setTimeout(() => {
            if(data["flashcard"] === null) {
                setFinished(true)
            } else {
                setFlashcard(data["flashcard"])
            }

            setData(prevState => ({
                ...prevState,
                _cards_count: data["_cards_count"],
                _finished_count: data["_finished_count"]
            }))

            setLoadCard(false)
            setFlipped(false)
            cardElement.classList.remove("green-border")
        }, 500)

    }

    const handleClickFlip = () => {
        setFlipped(!flipped)
    }

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await startCourse(params.id)
                setData(data)
                setFlashcard(data["flashcard"])
            } catch (e) {
                console.error('Fehler beim Laden der Flashcard:', e)
            }
        }
        fetchCourse().then()
    }, [params.id])

    useEffect(() => {
        if(finished || (data && data["_cards_count"] === data["_finished_count"])) {
            router.push(`/course/complete/${params.id}`)
        }
    }, [finished, data, router, params.id]);

    if(!flashcard && !finished) {
        return <div className="course-container">
            <p>Warte kurz...</p>
        </div>
    }

    if(!data) {
        return <div className="course-container">
            <p>Warte kurz...</p>
        </div>
    }

    return (
        <div className="course-container">
            <div className="course-head">
                <div className="course-info">
                    <div className="course-info-title">
                        <label> {data["__theme"].name} </label>
                        <h3> {data["__cardset"].name} </h3>
                    </div>
                    <button onClick={handleCancelClick} className="icon-button">
                        <XAltIcon/>
                    </button>
                </div>
                <div className="process-container">
                    <div className="process-bar">
                        <div className="process"
                             style={{width: `${100 / data["_cards_count"] * data["_finished_count"]}%`}}/>
                    </div>
                    <div className="process-stats">
                        <label>{ data["_finished_count"] } cards reviewed</label>
                        <label>{ data["_cards_count"] } cards</label>
                    </div>
                </div>
            </div>
            <div onClick={handleClickFlip} className={`flip-card ${flipped ? "flipped" : ""}`}>
                <div className="flip-card-inner">
                    <div className="flip-card-front">
                        <div className="type">Frageseite</div>
                        <div dangerouslySetInnerHTML={{ __html: flashcard["questionHTML"] }} />
                    </div>
                    <div className="flip-card-back">
                        <div className="type">Antwortseite</div>
                        <div className="flip-card-content" dangerouslySetInnerHTML={{__html: flashcard["answerHTML"]}}/>
                    </div>
                </div>
            </div>
            <div className="course-interactions">
                <button disabled={!flipped} onClick={handleClickNo} className="no">No</button>
                <button onClick={handleClickFlip} className="btn-flip">Flip</button>
                <button disabled={!flipped} onClick={handleClickYes} className="yes">Yes</button>
            </div>
        </div>
    )
}

export default Page;