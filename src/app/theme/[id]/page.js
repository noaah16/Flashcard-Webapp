import Link from "next/link";

import { emptyList } from "@/lib/messages";
import { getAllCardsets, getTheme } from "@/app/actions";

import PlusAltIcon from "@/assets/Plus-Alt-Icon";

export const runtime = 'edge';

const Page = async ({params}) => {
    const theme_data = await getTheme(params.id)
    const cardsets_data = await getAllCardsets(params.id)

    if(!theme_data) {
        return <div>
            <p>Dieses Theme gibt es nicht</p>
        </div>
    }

    return (
        <div className="container themes">
            <div className="head">
                <div className="back-to-lib">
                    <Link href={`/`}> {"<-"} Library </Link>
                </div>
                <h1>Theme - { theme_data.name }</h1>
            </div>

            <div className="list">
                {
                    !cardsets_data.length ? emptyList : cardsets_data.map((item, index) => {
                        return (
                            <div key={index} className="item">
                                <p> {item.name.length > 55 ? item.name.substring(0, 55) + "..." : item.name.substring(0, 55)} </p>
                                <div className="item-info">
                                    <p>{item.count_cards || 0} cards</p>
                                    <p>0 cards reviewed</p>
                                </div>
                                <div className="interaction">
                                <button>Start Session</button>
                                    <Link href={`/editor/${item.cardset_id}`}>
                                        <button className="dark">Edit</button>
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            <Link className="create-button" href={`/create/cardset/${params.id}`}>
                <PlusAltIcon/>
                Cardset erstellen
            </Link>
        </div>
    );
}

export default Page;