const empty_list = [
    "Die Butze is leer 🤨",
    "Irgendwie nichts los hier 😔",
    "Kp was du hier machst, aber hier ist nix 🤔",
    "Hier gibt’s echt gar nix zu sehen 🤷‍♂️",
    "Nope, nix da. 😔",
    "Ist das ’ne Geisterstadt? 👻",
    "Leer wie der Kühlschrank um Mitternacht. 🥶",
    "Du bist wohl in der falschen Ecke gelandet… 🚫",
    "Vielleicht mal woanders schauen? 🔍",
    "Hier steppt kein Bär, hier ist tote Hose. 🐻❌",
];

const getRIndex = Math.floor(Math.random() * empty_list.length);

export const emptyList = empty_list[getRIndex];