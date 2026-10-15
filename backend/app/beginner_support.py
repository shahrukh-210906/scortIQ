"""Original draft prerequisite facts for conversational pilot teaching."""

import re

from .chemistry_support import CHEMISTRY_HELP, checked_water_count, chemistry_focus

REFLECTION_HELP = {
    "corner_retry": {
        "en": "Let's try a different example. Put a book on a table and lift its front cover until it stands straight up while the back cover stays flat. The covers now make an L shape: that is the square turn called 90 degrees. Lines in those two directions are perpendicular. Which cover is standing up: the front or the back?",
        "hinglish": "Chalo doosra example lete hain. Book table par rakho aur sirf front cover seedha khada karo; back cover table par rehne do. Dono covers L shape banayenge: isi turn ko 90 degrees bolte hain. In dono directions ki lines perpendicular hoti hain. Kaunsa cover khada hai: front ya back?",
        "hi": "चलो दूसरा उदाहरण लेते हैं। किताब मेज़ पर रखो और केवल आगे का कवर सीधा खड़ा करो; पीछे का कवर मेज़ पर रहने दो। दोनों कवर L आकार बनाएँगे: इसी मोड़ को 90 डिग्री कहते हैं। इन दोनों दिशाओं की रेखाएँ लंबवत होती हैं। कौन-सा कवर खड़ा है: आगे का या पीछे का?",
    },
    "intro": {
        "en": "No problem, we can start from zero. A torch gives out light, which helps you see things. When that light hits a mirror and bounces back, we call it reflection. If torch light hits a mirror, does the light just stop there, or bounce back?",
        "hinglish": "Koi baat nahi, bilkul shuru se samajhte hain. Torch se light nikalti hai, jisse cheezein dikhti hain. Wahi light mirror se takra kar wapas aati hai; isko reflection kehte hain. Mirror par torch ki light pade toh woh wahin rukegi ya wapas aayegi?",
        "hi": "कोई बात नहीं, शुरुआत से समझते हैं। टॉर्च से प्रकाश निकलता है जिससे चीज़ें दिखती हैं। यह प्रकाश दर्पण से टकराकर वापस आता है; इसे परावर्तन कहते हैं। टॉर्च का प्रकाश दर्पण पर पड़े तो वहीं रुकेगा या वापस आएगा?",
    },
    "ray": {
        "en": "A ray is an arrow line we DRAW to show which way light travels. Think of a torch beam: we draw an arrow pointing away from the torch to show its direction. The drawn ray is not a solid stick you can pick up. Would that arrow point away from the torch or towards it?",
        "hinglish": "Ray koi pakadne wali stick nahi hai. Light kis taraf ja rahi hai, yeh dikhane ke liye hum paper par arrow wali line banate hain; use ray bolte hain. Torch se light bahar nikalti hai. Uska arrow torch se bahar ki taraf banega ya torch ke andar ki taraf?",
        "hi": "किरण कोई पकड़ने वाली छड़ी नहीं है। प्रकाश किस ओर जा रहा है, यह दिखाने के लिए हम कागज़ पर तीर वाली रेखा बनाते हैं; उसे किरण कहते हैं। टॉर्च से प्रकाश बाहर जाता है। उसका तीर टॉर्च से बाहर की ओर होगा या अंदर की ओर?",
    },
    "normal": {
        "en": "Here, normal does not mean ordinary. Imagine the mirror lying flat like a tabletop, with a pencil standing straight up where the light hits. The normal is a pretend guide line in that pencil's direction; the pencil is only an example. Is our guide line along the tabletop or standing up from it?",
        "hinglish": "Yahan normal ka matlab aam ya ordinary nahi hai. Socho mirror table ki tarah leta hua hai aur light lagne wali jagah ek pencil seedhi khadi hai. Pencil ki direction mein jo imaginary guide line sochte hain, wahi normal hai; asli pencil rakhna zaroori nahi. Yeh line table par leti hai ya seedhi khadi hai?",
        "hi": "यहाँ अभिलंब या normal का मतलब साधारण नहीं है। सोचो दर्पण मेज़ की तरह सपाट रखा है और प्रकाश लगने वाली जगह एक पेंसिल सीधी खड़ी है। पेंसिल की दिशा में सोची गई काल्पनिक रेखा अभिलंब है; सच में पेंसिल रखना ज़रूरी नहीं। यह रेखा मेज़ पर लेटी है या सीधी खड़ी है?",
    },
    "corner": {
        "en": "Look at the corner of a notebook: one edge runs across and the other goes up, making an L shape. Lines meeting like that are called perpendicular. That square corner measures 90 degrees; degrees are just a way to describe a turn. Can you find an L-shaped corner on a notebook or a door?",
        "hinglish": "Notebook ka kona dekho: ek edge aadi hai aur doosri usse seedhi upar jaati hai, jaise L shape. Aise milne wali lines ko perpendicular kehte hain. Is kone ki turn ko 90 degrees bolte hain; abhi bas L shape yaad rakho. Notebook ya darwaze par aisa kona dhoondh sakte ho?",
        "hi": "कॉपी का कोना देखो: एक किनारा आड़ा है और दूसरा उससे सीधा ऊपर जाता है, जैसे L आकार। ऐसे मिलने वाली रेखाएँ लंबवत कहलाती हैं। इस कोने के मोड़ को 90 डिग्री कहते हैं; अभी बस L आकार याद रखो। कॉपी या दरवाज़े पर ऐसा कोना ढूँढ़ सकते हो?",
    },
    "surface": {
        "en": "It's an easy mix-up. We measure these light angles from the imaginary line standing straight out of the mirror, called the normal, rather than along the mirror's face. Think of a flat tabletop and an upright pencil: use the pencil's direction as the starting line. Which is our starting line: the tabletop or the upright pencil?",
        "hinglish": "Yeh confusion ho sakta hai. Angle mirror ki surface se nahi, usse seedhi bahar nikalti imaginary line se naapte hain; us line ko normal bolte hain. Flat table par seedhi khadi pencil socho: pencil ki direction hamari starting line hai. Angle ke liye starting line table hogi ya khadi pencil?",
        "hi": "यह भ्रम हो सकता है। ये कोण दर्पण की सतह से नहीं, उससे सीधे बाहर निकलती काल्पनिक रेखा से मापते हैं; उसे अभिलंब कहते हैं। सपाट मेज़ पर सीधी खड़ी पेंसिल सोचो: पेंसिल की दिशा हमारी शुरुआती रेखा है। कोण की शुरुआती रेखा मेज़ होगी या खड़ी पेंसिल?",
    },
}


def reflection_focus(question, history=()):
    def explicit(text):
        text = text.lower()
        if "surface" in text and any(w in text for w in ("measur", "angle", "naap")):
            return "surface"
        if any(w in text for w in ("perpendicular", "90", "लंबवत", "degree", "डिग्री")):
            return "corner"
        if re.search(r"\brays?\b|किरण", text):
            return "ray"
        if "normal" in text or "अभिलंब" in text:
            return "normal"
        return None

    selected = explicit(question)
    if selected:
        return selected
    if any(
        w in question.lower() for w in ("confus", "still", "samajh", "समझ", "example", "उदाहरण")
    ):
        for message in reversed(history):
            if message["role"] == "user" and (selected := explicit(message["content"])):
                return "corner_retry" if selected == "corner" else selected
    return "intro"


FACTS = {
    "light-reflection": "Light lets us see things; a torch is a familiar light source. Reflection means light bounces back from a surface, such as a mirror. A ray is a line with an arrow that we draw to show which way light travels; it is a diagram, not a solid stick to touch. The mirror surface is its flat face. Normal here does not mean ordinary: it is a made-up guide line drawn straight out of the mirror where light hits. If the mirror were a flat tabletop, the normal would stand straight up from that spot like an upright pencil. Perpendicular means two lines meet like the upright and flat edges of a square corner, a right angle of 90 degrees. An angle describes how far one direction turns away from another. Incident means arriving; reflected means bouncing away. Both reflection angles are measured from the normal, not from the mirror surface. Do not introduce all these terms at once.",
    "light-images": "A mirror is a smooth reflecting surface. A plane mirror is flat. An object is the real thing in front of it, such as your face. An image is what you see in the mirror. Upright means it does not look upside down. Virtual means the reflected light appears to come from behind the mirror but does not really meet there; this image cannot be caught on a screen. Image distance behind the mirror equals object distance in front.",
    "reactions-signs": "A substance is a kind of material, such as water or oxygen. A chemical reaction changes starting substances into new substances. Melting ice changes water's state but does not make a new substance. Magnesium is a metal; burning it in oxygen forms magnesium oxide, a new white solid. A bubble is a pocket of gas; bubbles alone do not prove a reaction, since boiling water also bubbles.",
    "reactions-balance": "An atom is a tiny unit of an element; elements are kinds of atoms, such as hydrogen and oxygen. A molecule is atoms joined together. H means hydrogen, O means oxygen. H₂O means two hydrogen atoms joined with one oxygen atom in each water molecule. The arrow means starting substances change into products. Left and right mean before and after the reaction. A small number in a formula counts atoms within one molecule. A big number before a formula counts how many of that entire group there are. Balancing keeps each kind of atom's count equal on both sides; it does not change a substance's formula. Count one element at a time before calculating coefficients.",
    "reactions-types": "Reactants are starting substances on the left of the reaction arrow. Products are substances formed, on the right. Combination means substances join to make one product. Decomposition means one starting compound breaks into simpler substances. A chemical formula is a short way to show which elements a substance contains. Compare how many substances enter and leave before learning the names of reaction types.",
    "life-nutrition": "Food supplies materials and energy for living things. Green plants make food using light energy; this is photosynthesis. Leaves take in carbon dioxide, a gas from air. Roots take in water. Chlorophyll is the green material that absorbs light. Glucose is a simple sugar the plant makes. Oxygen is released. The plant does not absorb ready-made food from sunlight or soil.",
    "life-respiration": "Cells are tiny living units that make up our body. Muscles need usable energy to move. Breathing moves air into and out of lungs. Cellular respiration releases usable energy from food inside cells; it is different from breathing. Oxygen supports aerobic respiration. During exercise muscles need more energy, so breathing and heart rate usually increase to support oxygen delivery and carbon dioxide removal.",
}


def prerequisite_source(topic_id, question="", history=()):
    if topic_id not in FACTS:
        return []
    help_text = (
        REFLECTION_HELP
        if topic_id == "light-reflection"
        else CHEMISTRY_HELP
        if topic_id == "reactions-balance"
        else None
    )
    focus = (
        reflection_focus(question, history)
        if topic_id == "light-reflection"
        else chemistry_focus(question, history)
        if topic_id == "reactions-balance"
        else None
    )
    return [
        {
            "id": f"pilot-prerequisites-{topic_id}-v1:{focus or '0'}",
            "title": "Everyday meanings — original pilot teaching notes",
            "version": "v1",
            "review_status": "draft",
            "reviewer": "",
            "rights": "Original authored pilot notes; educator review pending.",
            "excerpt": help_text[focus]["en"] if help_text else FACTS[topic_id],
        }
    ]


def beginner_fallback(topic_id, language, question, history, evidence):
    if (
        topic_id not in {"light-reflection", "reactions-balance"}
        or language not in REFLECTION_HELP["intro"]
    ):
        return None
    help_text = REFLECTION_HELP if topic_id == "light-reflection" else CHEMISTRY_HELP
    focus = (
        reflection_focus(question, history)
        if topic_id == "light-reflection"
        else chemistry_focus(question, history)
    )
    source = next(
        (
            s
            for s in evidence
            if s["id"] == f"pilot-prerequisites-{topic_id}-v1:{focus}"
            and s["excerpt"] == help_text[focus]["en"]
        ),
        None,
    )
    if not source:
        return None
    if topic_id == "reactions-balance" and focus == "coefficient":
        calculated = checked_water_count(question, language)
        if calculated:
            return calculated, [source], "checked_calculation"
    return help_text[focus][language], [source], "source_guided"


def conversational_check(topic_id, language, question, history, reply, evidence, phase):
    """Keep the beginner's check concrete and reject observed unsupported digressions.

    These are narrow regression guards, not a general factual-accuracy guarantee.
    """
    if topic_id not in {"light-reflection", "reactions-balance"} or phase != 0:
        return reply
    fallback = beginner_fallback(topic_id, language, question, history, evidence)
    if not fallback:
        return reply
    if (
        language == "hinglish"
        and len(
            re.findall(
                r"\b(hai|hain|ka|ki|ke|nahi|ek|tum|aap|socho|kar|se|matlab|bolte|wali|yeh|isse)\b",
                reply.lower(),
            )
        )
        < 3
    ):
        raise ValueError("Reply did not follow the teaching language")
    if language == "hi" and len(re.findall(r"[\u0900-\u097f]", reply)) < 6:
        raise ValueError("Reply did not follow the teaching language")
    if topic_id == "reactions-balance":
        # A computed count takes precedence; ordinary replies keep their natural
        # question unless absent. Citation and repetition checks still apply.
        if fallback[2] == "checked_calculation":
            return fallback[0]
        focus = chemistry_focus(question, history)
        if focus == "formula" and re.match(r"\s*(yes\b|haan\b|ha\b|हाँ|हां|you can\b)", reply, re.I):
            raise ValueError("Contradictory advice about changing formulas")
        if focus == "intro" and re.search(
            r"2\s*H[₂2]\s*\+\s*O[₂2]|coefficient|stoichiometr", reply, re.I
        ):
            raise ValueError("Skipped beginner prerequisites")
        sentences = [s for s in re.split(r"(?<=[.!?।])\s+", reply.strip()) if "?" not in s]
        body = " ".join(sentences)
        anchors = {
            "intro": (r"H[₂2]O|water|paani|पानी",),
            "atom": (r"hydrogen|हाइड्रोजन", r"oxygen|ऑक्सीजन"),
            "molecule": (r"water|paani|पानी|H[₂2]O", r"hydrogen|हाइड्रोजन|\bH\b"),
            "symbols": (r"\bH\b", r"\bO\b"),
            "subscript": (r"H[₂2]O", r"oxygen|ऑक्सीजन|\bO\b"),
            "coefficient": (r"H[₂2]O", r"whole|entire|poore|poora|पूरे|पूरा"),
            "count_retry": (r"\[H H O\]\s*\[H H O\]",),
            "formula": (r"H[₂2]O", r"before|front|aage|AAGE|आगे"),
            "sides": (r"left|बाईं", r"right|दाईं"),
        }
        if not body or any(not re.search(pattern, body, re.I) for pattern in anchors[focus]):
            raise ValueError("Chemistry check did not match the explanation")
        return body + "\n\n" + re.split(r"(?<=[.!।])\s+", fallback[0])[-1]
    focus = reflection_focus(question, history)
    if focus == "intro" and re.search(
        r"\b(image|wall|eyes|incidence|normal|degrees?)\b|प्रतिबिंब|दीवार|अभिलंब|आपतन", reply, re.I
    ):
        raise ValueError("Unsupported beginner digression")
    if re.search(r"(point|meeting)\s+(is\s+)?called\s+(a\s+)?perpendicular", reply, re.I):
        raise ValueError("Incorrect perpendicular definition")
    sentences = [s for s in re.split(r"(?<=[.!?।])\s+", reply.strip()) if "?" not in s]
    if not sentences:
        raise ValueError("No explanation before understanding check")
    body = " ".join(sentences)
    # The check must refer to an example the learner actually just heard.
    anchors = {
        "intro": (r"torch|टॉर्च", r"mirror|दर्पण"),
        "ray": (r"torch|टॉर्च", r"arrow|तीर"),
        "normal": (r"pencil|पेंसिल", r"table|मेज़"),
        "corner": (r"notebook|door|copy|कॉपी|दरवाज़",),
        "corner_retry": (r"front|आगे", r"back|पीछे", r"cover|कवर"),
        "surface": (r"pencil|पेंसिल", r"table|मेज़"),
    }
    if any(not re.search(pattern, body, re.I) for pattern in anchors[focus]):
        raise ValueError("Understanding check did not match the explanation")
    check = re.split(r"(?<=[.!।])\s+", fallback[0])[-1]
    return body + "\n\n" + check


DIALOGUE_INSTRUCTION = (
    " Converse like a patient, encouraging older sibling, never patronising or pretending to be human. "
    "Respond to the student's LATEST actual question before returning to the lesson. "
    "If they ask what a word means, define ONLY that word in everyday language with one concrete example. "
    "Never define an unfamiliar term using another unexplained technical term. "
    "If they know nothing, begin with a familiar experience, not an equation, numeric angle or list of definitions. "
    "If they are confused, change the example or break the idea into a smaller piece; do not repeat the previous paragraph. "
    "Correct a specific misconception gently and explain why. Use the conversation history to remember what they do not understand. "
    "Give a useful explanation, then ask ONE tiny, concrete question about that explanation. "
    "Do not ask generic questions like 'Which part helps answer the understanding check?'. "
    "Do not push the checkpoint while they are asking about prerequisite words. "
    "Their yes or claim of understanding never authorizes skipping the saved checkpoint. "
    "Use 2-4 short sentences, ideally under 80 words. Avoid habitual greetings, repeated praise and addressing them as bro every turn. "
    "In Hinglish, use natural Roman Hindi rather than formal English with a Hindi word added. "
    "The saved teaching phase is the outer lesson boundary; prerequisite clarification is allowed within that phase."
)
