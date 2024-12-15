import Link from "next/link";
import {getAllCards, getCardset} from "@/app/actions";
import PlusAltIcon from "@/assets/Plus-Alt-Icon";
import {emptyList} from "@/lib/messages";

const Page = async ({params}) => {
    const cardset_data = await getCardset(params.id)
    const cards_data = await getAllCards(params.id)

    if(!cardset_data) {
        return <div>
            <p>Dieses Cardset gibt es nicht</p>
        </div>
    }

    return (
        <div className="container">
            <div className="head">
                <div className="back-to-lib">
                    <Link href={`/theme/${cardset_data.theme_id}`}> {"<-"} Back to theme </Link>
                </div>
                <h1>Edit cards</h1>
            </div>
            <div className="list">
                {
                    !cards_data.length ? emptyList : cards_data.map((item, index) => {
                        return (
                            <Link href={`/editor/edit/${item.flashcard_id}`} key={index}>
                                <div className="item center">
                                    <p> { item.name.replace(/\?/g, "") }? </p>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
            <Link className="create-button" href={`/create/flashcard/${params.id}`}>
                <PlusAltIcon/>
                Flashcard erstellen
            </Link>
        </div>
    );
}

export default Page;