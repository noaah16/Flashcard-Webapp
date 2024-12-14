'use client'

import XAltIcon from "@/assets/X-Alt-Icon";
import {useRouter} from "next/navigation";

export const runtime = 'edge';

const Page = ({params}) => {
    const router = useRouter();

    const handleCancelClick = async () => {
        router.back()
        router.refresh()
    }

    return (
        <div className="container">
            <div className="course-cancel">
                <button onClick={handleCancelClick} className="icon-button">
                    <XAltIcon/>
                </button>
            </div>
            <div className="course-head">
                <label>Lernfeld 11</label>
                <h3>Personalwirtschaft – Personalbeschaffung und -entwicklung im Büroalltag</h3>
                <div className="process-container">
                    <div className="process-bar">
                        <div className="process" style={{ width:'24%' }} />
                    </div>
                    <div className="process-stats">
                        <label>61 cards reviewed</label>
                        <label>100 cards</label>
                    </div>
                </div>
            </div>
            <div className="course-card">

            </div>
        </div>
    )
}

export default Page;