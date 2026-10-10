"""Original draft topic practice; educator review remains required."""

from .content import QUESTIONS

TOPIC_QUESTIONS = {
    "reactions-signs": [
        QUESTIONS["chemical-reactions"][0],
        {
            "id": "signs-physical",
            "prompt": "Why does melting ice not prove a chemical reaction?",
            "options": [
                "Water becomes oxygen",
                "No new substance forms",
                "Every state change is chemical",
            ],
            "correct": 1,
            "reason": "The substance remains water even though its state changes.",
        },
    ],
    "reactions-balance": QUESTIONS["chemical-reactions"][1:],
    "reactions-types": [
        {
            "id": "types-combination",
            "prompt": "CaO + H₂O → Ca(OH)₂ is which type of reaction?",
            "options": ["Combination", "Decomposition", "Displacement"],
            "correct": 0,
            "reason": "Two reactants combine to form one product.",
        },
        {
            "id": "types-decomposition",
            "prompt": "One reactant breaks into several products. Which type is this?",
            "options": ["Combination", "Decomposition", "Displacement"],
            "correct": 1,
            "reason": "Decomposition breaks one reactant into multiple products.",
        },
    ],
    "light-reflection": QUESTIONS["light"][:2],
    "light-images": [
        QUESTIONS["light"][2],
        {
            "id": "images-virtual",
            "prompt": "Can a plane mirror image be projected onto a screen?",
            "options": ["Yes, always", "No, it is virtual", "Only if the mirror is bigger"],
            "correct": 1,
            "reason": "The rays only appear to meet behind the mirror.",
        },
    ],
    "life-nutrition": QUESTIONS["life-processes"][:2],
    "life-respiration": [
        QUESTIONS["life-processes"][2],
        {
            "id": "respiration-oxygen",
            "prompt": "Which process uses oxygen to release energy from food?",
            "options": ["Aerobic respiration", "Breathing alone", "Photosynthesis"],
            "correct": 0,
            "reason": "Aerobic respiration uses oxygen in the breakdown of food inside cells.",
        },
    ],
}

ACTIVITIES = {
    "reactions-signs": {
        "formulas": ["Mg", "O₂", "MgO"],
        "atoms": [{"Mg": 1}, {"O": 2}, {"Mg": 1, "O": 1}],
        "hint": "Oxygen comes in pairs. Match the oxygen atoms, then count magnesium.",
    },
    "reactions-balance": {
        "formulas": ["H₂", "O₂", "H₂O"],
        "atoms": [{"H": 2}, {"O": 2}, {"H": 2, "O": 1}],
        "hint": "Start with oxygen, then count hydrogen. Change coefficients only.",
    },
    "reactions-types": {
        "formulas": ["CaO", "H₂O", "Ca(OH)₂"],
        "atoms": [{"Ca": 1, "O": 1}, {"H": 2, "O": 1}, {"Ca": 1, "O": 2, "H": 2}],
        "hint": "This combination may already balance. Count each element on both sides.",
    },
}

KEY_TERMS = {
    "reactions-signs": ["new substance", "observation", "physical change"],
    "reactions-balance": ["conservation of atoms", "coefficient", "unchanged formula"],
    "reactions-types": ["reactant", "product", "combination", "decomposition"],
    "light-reflection": ["normal", "angle of incidence", "angle of reflection"],
    "light-images": ["virtual", "upright", "equal distance"],
    "life-nutrition": ["light energy", "chlorophyll", "carbon dioxide"],
    "life-respiration": ["cells", "energy release", "oxygen"],
}


def exam_notes(topic: dict, language: str):
    # Existing pilot explanations are original editorial content, not official marking schemes.
    notes = {
        "language": "en",
        "status": "draft",
        "question": topic["question"],
        "model_answer": topic["answer"],
        "key_terms": KEY_TERMS[topic["id"]],
        "writing_steps": [
            "Answer the question directly.",
            "Give the scientific reason, using relevant terms.",
            "Add an example, equation or labelled diagram only when the question needs it.",
        ],
        "dont_forget": "Explain the idea; listing keywords alone is not a complete answer.",
        "marking_note": "Draft writing guidance, not an official marking scheme or a guaranteed score.",
    }
    if language == "hi" and topic["id"] == "reactions-signs":
        notes.update(
            {
                "language": "hi",
                "question": "बर्फ का पिघलना भौतिक परिवर्तन क्यों है?",
                "model_answer": "बर्फ पिघलने पर पानी ही रहती है। केवल अवस्था बदलती है; कोई नया पदार्थ नहीं बनता। इसलिए यह भौतिक परिवर्तन है।",
                "key_terms": ["नया पदार्थ", "अवस्था परिवर्तन", "भौतिक परिवर्तन"],
                "writing_steps": [
                    "सीधा उत्तर दें।",
                    "बताएँ कि कोई नया पदार्थ नहीं बनता।",
                    "पदार्थ और उसकी अवस्था में अंतर स्पष्ट करें।",
                ],
                "dont_forget": "केवल अवस्था बदलना रासायनिक परिवर्तन का प्रमाण नहीं है।",
            }
        )
    return notes
