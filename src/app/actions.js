'use server'

import { generateId } from "@/lib/id";
import mongodb from "@/lib/mongodb";

export const getTheme = async (theme_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const themes_collection = await database.collection("themes");

        return await themes_collection.findOne({
            user_id: process.env.DB_USER,
            theme_id: theme_id
        })
    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const getAllThemes = async () => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const themes_collection = await database.collection("themes");

        console.log(`user ${process.env.DB_USER}`)

        const themes = await themes_collection.find({
            user_id: process.env.DB_USER,
        }).toArray();

        return JSON.parse(JSON.stringify(themes));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const createTheme = async (name) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const themes_collection = await database.collection("themes");

        const themes = await themes_collection.insertOne({
            user_id: process.env.DB_USER,
            theme_id: generateId(),
            name: name
        })

        return JSON.parse(JSON.stringify({
            acknowledged: themes.acknowledged,
            insertedId: themes.insertedId
        }));
    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const deleteTheme = async (theme_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const themes_collection = await database.collection("themes");

        return await themes_collection.deleteOne({
            user_id: process.env.DB_USER,
            theme_id: theme_id
        })
    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}

export const getCardset = async (cardset_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const cardset_collection = await database.collection("cardsets");

        const cardset = await cardset_collection.findOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id
        })

        return JSON.parse(JSON.stringify(cardset));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const getAllCardsets = async (theme_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const cardset_collection = await database.collection("cardsets");

        return await cardset_collection.find({
            user_id: process.env.DB_USER,
            theme_id: theme_id
        }).toArray();

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const createCardset = async (theme_id, name) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const cardset_collection = await database.collection("cardsets");

        const cardsets = await cardset_collection.insertOne({
            user_id: process.env.DB_USER,
            theme_id: theme_id,
            cardset_id: generateId(),
            name: name,
            count_cards: 0
        })

        return JSON.parse(JSON.stringify({
            acknowledged: cardsets.acknowledged,
            insertedId: cardsets.insertedId
        }));
    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const deleteCardset = async (cardset_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const cardset_collection = await database.collection("cardsets");

        return await cardset_collection.deleteOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id
        })
    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}

export const getCardById = async (flashcard_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");

        const flashcard = await flashcards_collection.findOne({
            user_id: process.env.DB_USER,
            flashcard_id: flashcard_id
        })

        return JSON.parse(JSON.stringify(flashcard));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const getAllCards = async (cardset_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");

        return await flashcards_collection.find({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id
        }).toArray()

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const createCardDraft = async (cardset_id, name, questionHTML) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");
        const cardset_collection = await database.collection("cardsets");

        const flashcardId = generateId()

        const flashcard= await flashcards_collection.insertOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
            flashcard_id: flashcardId,
            draft: true,

            name: name,
            questionHTML: questionHTML
        })

        const count_cards = await flashcards_collection.countDocuments({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id
        })

        await cardset_collection.updateOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id
        }, {
            $set: { count_cards: count_cards }
        })

        return JSON.parse(JSON.stringify({
            id: flashcardId,
            acknowledged: flashcard.acknowledged,
            insertedId: flashcard.insertedId
        }));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const finishCreateCard = async (flashcard_id, cardset_id, answerHTML) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");

        const flashcard = await flashcards_collection.updateOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
            flashcard_id: flashcard_id,
        }, {
            $set: {
                answerHTML: answerHTML,
                draft: false,
            }
        })

        return JSON.parse(JSON.stringify({
            acknowledged: flashcard.acknowledged,
            matchedCount: flashcard.matchedCount
        }));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const updateCard = async (flashcard_id, name, questionHTML, answerHTML) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");

        const flashcard = await flashcards_collection.updateOne({
            user_id: process.env.DB_USER,
            flashcard_id: flashcard_id,
        }, {
            $set: {
                name: name,
                questionHTML: questionHTML,
                answerHTML: answerHTML,
                draft: false,
            }
        })

        return JSON.parse(JSON.stringify({
            acknowledged: flashcard.acknowledged,
            matchedCount: flashcard.matchedCount
        }));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}

export const startCourse = async (cardset_id) => {
    const client = await mongodb;
    const database = client.db("flashcard-app");
    const flashcards_collection = await database.collection("flashcards");
    const cardset_collection = await database.collection("cardsets");
    const themes_collection = await database.collection("themes");

    const session = client.startSession();

    try {
        session.startTransaction();

        const cardset = await cardset_collection.findOneAndUpdate({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
        }, {
            $set: {
                status: "started" // not_started - started
            }
        })

        const theme = await themes_collection.findOne({
            user_id: process.env.DB_USER,
            theme_id: cardset.theme_id
        })

        const flashcard = await flashcards_collection.aggregate([
            {
                $match: {
                    user_id: process.env.DB_USER,
                    cardset_id: cardset_id,
                    draft: false,
                }
            },
            {
                $sample: { size: 1 }
            }
        ]).toArray();

        const finished_count = await flashcards_collection.countDocuments({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
            status: "finished"
        });

        const cards_count = await flashcards_collection.countDocuments({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
        });

        await session.commitTransaction();

        return JSON.parse(JSON.stringify({
            flashcard: flashcard[0],
            __theme: theme,
            __cardset: cardset,
            _cards_count: cards_count,
            _finished_count: finished_count,
        }))

    } catch (e) {
        console.error(e);
        await session.abortTransaction();
        return { error: "ERROR" };
    }
}
export const resetCourse = async (cardset_id) => {
    const client = await mongodb;
    const database = client.db("flashcard-app");
    const flashcards_collection = await database.collection("flashcards");
    const cardset_collection = await database.collection("cardsets");

    const session = client.startSession()

    try {
        session.startTransaction();

        const cardset = await cardset_collection.updateOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
        }, {
            $set: {
                status: "not_started",
                finished_count: 0
            }
        })

        await flashcards_collection.updateMany({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
        }, {
            $set: {
                status: "unfinished"
            }
        })

        await session.commitTransaction();

        return JSON.parse(JSON.stringify({
            acknowledged: cardset.acknowledged,
            matchedCount: cardset.matchedCount,
        }));

    } catch (e) {
        console.error(e);
        await session.abortTransaction();
        return { error: "ERROR" };
    }

}

export const getAnotherCourseCard = async (cardset_id) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");
        const cardset_collection = await database.collection("cardsets");

        const flashcard = await flashcards_collection.aggregate([
            {
                $match: {
                    user_id: process.env.DB_USER,
                    cardset_id: cardset_id,
                    draft: false,
                    $or: [
                        { status: "unfinished" },
                        { status: { $exists: false } }
                    ]
                }
            },
            {
                $sample: { size: 1 }
            }
        ]).toArray();

        const finished_count = await flashcards_collection.countDocuments({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
            status: "finished"
        });
        const cards_count = await flashcards_collection.countDocuments({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
        });

        if(!flashcard[0]) {
            await cardset_collection.updateOne({
                cardset_id: cardset_id,
            }, {
                $set: {
                    status: "finished"
                }
            })
        }

        return JSON.parse(JSON.stringify({
            flashcard: flashcard[0] || null,
            _cards_count: cards_count,
            _finished_count: finished_count,
        }))

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
export const updateCourseCard = async (cardset_id, flashcard_id, type) => {
    try {
        const client = await mongodb
        const database = client.db("flashcard-app");
        const flashcards_collection = await database.collection("flashcards");
        const cardset_collection = await database.collection("cardsets");

        const flashcard = await flashcards_collection.updateOne({
            user_id: process.env.DB_USER,
            cardset_id: cardset_id,
            flashcard_id: flashcard_id
        }, {
            $set: {
                status: type ? "finished" : "unfinished"
            }
        })

        if(type) {
            await cardset_collection.updateOne({
                user_id: process.env.DB_USER,
                cardset_id: cardset_id,
            }, {
                $inc: {
                    finished_count: 1
                }
            })
        }

        return JSON.parse(JSON.stringify({
            acknowledged: flashcard.acknowledged,
            matchedCount: flashcard.matchedCount,
        }));

    } catch (e) {
        console.error(e);
        return { error: "ERROR" };
    }
}
