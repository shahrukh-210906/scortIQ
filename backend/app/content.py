"""Small seed curriculum. Editorial review is required before public release."""

CHAPTERS = [
    {
        "id": "chemical-reactions",
        "title": "Chemical reactions",
        "subject": "Chemistry",
        "description": "Spot the signs of change. Understand what happens when substances react.",
        "minutes": 20,
        "color": "peach",
        "topics": [
            {
                "id": "reactions-signs",
                "title": "Recognising a chemical reaction",
                "explanation": "A chemical reaction produces new substances. Clues can include a gas being released, a colour change, a temperature change, or a precipitate. A clue alone is not always proof: boiling water also produces bubbles but is a physical change.",
                "example": "When magnesium burns, it reacts with oxygen to form magnesium oxide. The bright light and new white solid are signs of a chemical reaction.",
                "question": "Why is melting ice a physical change?",
                "answer": "It remains water; no new substance forms.",
            },
            {
                "id": "reactions-balance",
                "title": "Balancing equations",
                "explanation": "Atoms are conserved during a chemical reaction. Balance an equation by changing coefficients in front of formulas, never the subscripts inside a formula.",
                "example": "2H₂ + O₂ → 2H₂O. Both sides contain four hydrogen atoms and two oxygen atoms.",
                "question": "Why must we not change H₂O to H₂O₂ to balance water formation?",
                "answer": "Changing subscripts changes the substance: H₂O₂ is hydrogen peroxide.",
            },
            {
                "id": "reactions-types",
                "title": "Types of reactions",
                "explanation": "In a combination reaction, two or more reactants form one product. In a decomposition reaction, one reactant breaks into two or more products. Displacement reactions involve a more reactive element replacing another.",
                "example": "CaO + H₂O → Ca(OH)₂ is a combination reaction.",
                "question": "Which type is a reaction with one reactant and multiple products?",
                "answer": "A decomposition reaction.",
            },
        ],
    },
    {
        "id": "light",
        "title": "Light & reflection",
        "subject": "Physics",
        "description": "Follow a ray of light. Discover how mirrors form the images we see.",
        "minutes": 18,
        "color": "lavender",
        "topics": [
            {
                "id": "light-reflection",
                "title": "Laws of reflection",
                "explanation": "The angle of incidence equals the angle of reflection. Both angles are measured from the normal, an imaginary line perpendicular to the surface. The incident ray, reflected ray and normal lie in the same plane.",
                "example": "A ray arriving at 30° to the normal leaves at 30° to the normal.",
                "question": "If a ray makes 20° with the mirror surface, what is its angle of incidence?",
                "answer": "70°, because the normal is perpendicular to the surface.",
            },
            {
                "id": "light-images",
                "title": "Plane mirror images",
                "explanation": "A plane mirror forms a virtual, upright image of the same size as the object. The image appears as far behind the mirror as the object is in front.",
                "example": "An object 2 m in front of a plane mirror has its image 2 m behind the mirror.",
                "question": "Can a plane mirror's virtual image be projected onto a screen?",
                "answer": "No. The rays only appear to come from behind the mirror.",
            },
        ],
    },
    {
        "id": "life-processes",
        "title": "Life processes",
        "subject": "Biology",
        "description": "Explore the everyday processes that keep living things alive.",
        "minutes": 22,
        "color": "mint",
        "topics": [
            {
                "id": "life-nutrition",
                "title": "Nutrition in plants",
                "explanation": "Green plants use light energy to make carbohydrates from carbon dioxide and water during photosynthesis. Chlorophyll absorbs light, and oxygen is released.",
                "example": "A leaf takes in carbon dioxide through stomata. Roots absorb the water needed for photosynthesis.",
                "question": "What is the role of chlorophyll?",
                "answer": "It absorbs the light energy used in photosynthesis.",
            },
            {
                "id": "life-respiration",
                "title": "Cellular respiration",
                "explanation": "Cells break down food to release usable energy. Aerobic respiration uses oxygen. Breathing moves air into and out of the body; cellular respiration is a chemical process inside cells.",
                "example": "During exercise, muscles need more energy, so breathing and heart rate usually increase.",
                "question": "Are breathing and cellular respiration the same process?",
                "answer": "No. Breathing exchanges air; respiration releases energy from food in cells.",
            },
        ],
    },
]

# Answer indices and rationales must never be returned before submission.
QUESTIONS = {
    "chemical-reactions": [
        {
            "id": "cr1",
            "prompt": "Which observation most clearly indicates a new substance has formed?",
            "options": [
                "Ice melting",
                "Water evaporating",
                "A white solid forming when two solutions mix",
                "Sugar dissolving",
            ],
            "correct": 2,
            "reason": "An insoluble new solid (a precipitate) can indicate a chemical reaction.",
        },
        {
            "id": "cr2",
            "prompt": "Which equation is balanced?",
            "options": ["H₂ + O₂ → H₂O", "2H₂ + O₂ → 2H₂O", "H₂ + 2O₂ → H₂O", "2H₂ + 2O₂ → H₂O"],
            "correct": 1,
            "reason": "Each side has four hydrogen atoms and two oxygen atoms.",
        },
        {
            "id": "cr3",
            "prompt": "When balancing an equation, what can you change?",
            "options": [
                "Element symbols",
                "Subscripts in formulas",
                "Coefficients before formulas",
                "The identity of the products",
            ],
            "correct": 2,
            "reason": "Coefficients change the number of molecules without changing the substances.",
        },
    ],
    "light": [
        {
            "id": "li1",
            "prompt": "A ray has an angle of incidence of 40°. What is its angle of reflection?",
            "options": ["20°", "40°", "50°", "80°"],
            "correct": 1,
            "reason": "The angle of reflection equals the angle of incidence.",
        },
        {
            "id": "li2",
            "prompt": "Reflection angles are measured from which line?",
            "options": ["The mirror surface", "The reflected ray", "The normal", "The horizon"],
            "correct": 2,
            "reason": "Both angles are measured from the normal, perpendicular to the surface.",
        },
        {
            "id": "li3",
            "prompt": "An object is 3 m in front of a plane mirror. Where does its image appear?",
            "options": ["On the mirror", "1.5 m behind it", "3 m behind it", "6 m behind it"],
            "correct": 2,
            "reason": "The image distance behind a plane mirror equals the object's distance in front.",
        },
    ],
    "life-processes": [
        {
            "id": "lp1",
            "prompt": "What supplies the energy for photosynthesis?",
            "options": ["Soil", "Light", "Oxygen", "Carbon dioxide"],
            "correct": 1,
            "reason": "Light supplies the energy absorbed by chlorophyll.",
        },
        {
            "id": "lp2",
            "prompt": "Which gas is released during photosynthesis?",
            "options": ["Nitrogen", "Carbon dioxide", "Oxygen", "Hydrogen"],
            "correct": 2,
            "reason": "Oxygen is released during photosynthesis.",
        },
        {
            "id": "lp3",
            "prompt": "Which statement distinguishes breathing from cellular respiration?",
            "options": [
                "Both happen only in the lungs",
                "Breathing releases energy from glucose",
                "Breathing exchanges air; respiration releases energy from food",
                "Plants do not respire",
            ],
            "correct": 2,
            "reason": "Breathing is ventilation; cellular respiration releases energy inside cells.",
        },
    ],
}


def chapter_by_id(chapter_id: str):
    return next((c for c in CHAPTERS if c["id"] == chapter_id), None)


def topic_by_id(topic_id: str):
    for chapter in CHAPTERS:
        for topic in chapter["topics"]:
            if topic["id"] == topic_id:
                return chapter, topic
    return None
