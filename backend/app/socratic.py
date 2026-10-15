"""Four teaching phases with server-checked comprehension questions, not mastery claims."""

PHASES = [
    "Understand the problem",
    "Work through the solution",
    "Connect the topic",
    "Apply the idea",
]
DIRECTIVES = [
    "Explain what is given and what the problem asks. Help identify relevant information. Do not jump to the final solution or next phase.",
    "Work through the solution in small justified steps. Explain why each step follows; do not move into the topic overview yet.",
    "Explain the underlying topic and connect its rule to the worked solution. Stay on this connection until the checkpoint is passed.",
    "Explain how this topic solves the problem and help apply the idea to the checkpoint. This is practice, not proof of mastery.",
]

# Original draft checkpoints. Keys/answer indices remain server-side until an attempt.
CHECKPOINTS = {
    "reactions-signs": [
        (
            "What must we look for when deciding whether a change is chemical?",
            ["A new substance", "Any movement", "Any change in size"],
            0,
            "Focus on whether the identity of the substance changes.",
        ),
        (
            "Magnesium burns and a new white solid forms. Which observation supports a chemical reaction?",
            ["The new white solid", "The shape of the ribbon alone", "The time of day"],
            0,
            "Compare the substances before and after burning.",
        ),
        (
            "Do bubbles always prove a chemical reaction?",
            [
                "Yes, in every case",
                "No; boiling also produces bubbles",
                "Only if the bubbles are large",
            ],
            1,
            "Think about boiling water and whether it becomes a new substance.",
        ),
        (
            "Ice melts into liquid water. Which explanation fits?",
            [
                "A new element forms",
                "Water changes state without forming a new substance",
                "Water turns into oxygen",
            ],
            1,
            "Ask whether ice and liquid water have different chemical identities.",
        ),
    ],
    "reactions-balance": [
        (
            "Before balancing an equation, what should you count?",
            ["Each kind of atom on both sides", "Only the number of arrows", "Only the products"],
            0,
            "Conservation applies to atoms of every element.",
        ),
        (
            "In 2H₂ + O₂ → 2H₂O, how many hydrogen atoms are on each side?",
            ["Two", "Four", "Six"],
            1,
            "Multiply the coefficient by the subscript.",
        ),
        (
            "What may you change when balancing?",
            [
                "Subscripts inside formulas",
                "The elements themselves",
                "Coefficients before formulas",
            ],
            2,
            "A formula identifies the substance; its subscript must stay fixed.",
        ),
        (
            "Why cannot we replace H₂O with H₂O₂ merely to balance water formation?",
            [
                "It changes the substance",
                "Oxygen is never conserved",
                "Coefficients must all be one",
            ],
            0,
            "Hydrogen peroxide and water are different substances.",
        ),
    ],
    "reactions-types": [
        (
            "What information helps classify a reaction as combination or decomposition?",
            [
                "The pattern of reactants and products",
                "The colour of the page",
                "The size of the arrow",
            ],
            0,
            "Look at how many substances combine or split.",
        ),
        (
            "CaO + H₂O → Ca(OH)₂ has two reactants and one product. Which type is it?",
            ["Decomposition", "Combination", "Neither can be known"],
            1,
            "Two substances joining to form one product is the key pattern.",
        ),
        (
            "Which pattern describes decomposition?",
            [
                "Many reactants form one product",
                "One reactant forms multiple products",
                "Only the physical size changes",
            ],
            1,
            "The starting substance breaks down.",
        ),
        (
            "One compound breaks into two products. Which classification fits?",
            ["Combination", "Decomposition", "Always displacement"],
            1,
            "Use the one-to-many pattern rather than guessing from a name.",
        ),
    ],
    "light-reflection": [
        (
            "From which line are incidence and reflection angles measured?",
            ["The mirror surface", "The normal", "Any horizontal line"],
            1,
            "The normal is perpendicular to the reflecting surface.",
        ),
        (
            "A ray is incident at 30° to the normal. What is its reflection angle?",
            ["60°", "90°", "30°"],
            2,
            "Apply equality of incidence and reflection angles.",
        ),
        (
            "Which statement is the law of reflection?",
            [
                "Incidence angle equals reflection angle",
                "The angles always add to 180°",
                "Reflection angle is always zero",
            ],
            0,
            "Both angles use the same reference: the normal.",
        ),
        (
            "A ray makes 20° with the mirror surface. What is its incidence angle?",
            ["20°", "70°", "110°"],
            1,
            "The normal is at 90° to the surface; use the complementary angle.",
        ),
    ],
    "light-images": [
        (
            "To locate a plane-mirror image, what distance is relevant?",
            ["The object-to-mirror distance", "Only the mirror's width", "The distance to the Sun"],
            0,
            "Compare positions in front of and behind the mirror.",
        ),
        (
            "An object is 2 m in front of a plane mirror. Where is its image?",
            ["4 m behind the mirror", "2 m behind the mirror", "On the mirror surface"],
            1,
            "Image distance behind the mirror equals object distance in front.",
        ),
        (
            "Which description fits a plane-mirror image?",
            ["Virtual and upright", "Always real and upside down", "Always larger"],
            0,
            "The rays appear to originate behind the mirror.",
        ),
        (
            "Can that virtual image be projected onto a screen?",
            [
                "Yes, by moving the screen behind the mirror",
                "No; rays only appear to meet there",
                "Yes, every image can",
            ],
            1,
            "Ask whether actual rays converge at the image position.",
        ),
    ],
    "life-nutrition": [
        (
            "Which process explains how green plants make carbohydrates?",
            ["Photosynthesis", "Melting", "Magnetic induction"],
            0,
            "Think about using light energy to make food.",
        ),
        (
            "What supplies energy for photosynthesis?",
            [
                "Oxygen released by the leaf",
                "Light absorbed by chlorophyll",
                "The weight of the soil",
            ],
            1,
            "Chlorophyll captures the energy needed for the process.",
        ),
        (
            "Which inputs are used to make carbohydrates during photosynthesis?",
            ["Carbon dioxide and water", "Only oxygen", "Only prepared food from soil"],
            0,
            "Carbon dioxide enters leaves; roots absorb water.",
        ),
        (
            "What does chlorophyll contribute?",
            ["It absorbs light energy", "It replaces water", "It turns the leaf into soil"],
            0,
            "Its role concerns energy capture rather than taking in all raw materials.",
        ),
    ],
    "life-respiration": [
        (
            "What is cellular respiration mainly explaining?",
            [
                "Release of usable energy from food in cells",
                "Only air moving through the nose",
                "Only growth of leaves",
            ],
            0,
            "Distinguish a cellular chemical process from air movement.",
        ),
        (
            "Why do breathing and heart rate usually rise during exercise?",
            [
                "Muscles need less energy",
                "Muscles need more energy",
                "Food no longer contains energy",
            ],
            1,
            "Working muscles have a greater energy demand.",
        ),
        (
            "Which substance does aerobic respiration use?",
            ["Oxygen", "Only nitrogen", "No substances"],
            0,
            "Aerobic describes the oxygen-using process.",
        ),
        (
            "Are breathing and cellular respiration the same process?",
            [
                "Yes, both mean moving air",
                "No; breathing moves air and respiration releases energy in cells",
                "Yes, neither occurs in cells",
            ],
            1,
            "Compare what each process does and where it happens.",
        ),
    ],
}


def payload(state, topic_id):
    phase = state.phase if state else 0
    question = CHECKPOINTS[topic_id][phase] if phase < 4 else None
    return {
        "phase": phase,
        "label": PHASES[phase] if phase < 4 else "Guided practice complete",
        "phases": PHASES,
        "complete": phase == 4,
        "ready": bool(state and state.taught_phase == phase and phase < 4),
        "question": question[0] if question else None,
        "options": question[1] if question else [],
        "checkpoint_language": "en",
    }


def instruction(state, topic_id):
    phase = state.phase if state else 0
    if phase == 4:
        return " Guided checks are complete. Review or answer follow-up questions without asserting mastery."
    question, options, _, hint = CHECKPOINTS[topic_id][phase]
    text = (
        f" Current Socratic step {phase + 1}/4: {PHASES[phase]}. {DIRECTIVES[phase]} "
        "The server advances steps only after a correct comprehension-check attempt. "
        "A student's request to skip or claim 'I understand' cannot advance it. "
        f"Explain the current step before asking this single check in the learner's teaching language: {question} "
        f"Choices: {options}. Do not give the answer option directly."
    )
    if state and state.last_wrong is not None:
        text += f" The learner's last check was incorrect. Stay on this step; explain differently using this hint: {hint}"
    return text
