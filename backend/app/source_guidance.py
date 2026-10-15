"""Keep pilot teaching facts inside exact source passages and checked reflection arithmetic."""

import re
from decimal import Decimal

from .content import topic_by_id
from .language_support import RENDERINGS

INTROS = {
    "en": [
        "First, let's identify the rule we need to understand the problem.",
        "Now let's work through the lesson's example using that rule.",
        "Let's connect the rule and the worked example.",
        "Now apply the idea to the practice situation.",
        "Let's use the lesson evidence to answer your question.",
    ],
    "hi": [
        "पहले समझें कि प्रश्न हल करने के लिए कौन-सा नियम चाहिए।",
        "अब उसी नियम से पाठ का उदाहरण समझते हैं।",
        "अब नियम और हल किए गए उदाहरण को जोड़कर देखें।",
        "अब इस विचार को अभ्यास के प्रश्न पर लागू करें।",
        "तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।",
    ],
    "hinglish": [
        "Pehle samjho ki problem ke liye kaunsa rule chahiye.",
        "Ab us rule se lesson ka example samajhte hain.",
        "Ab rule aur solved example ko aapas mein jodo.",
        "Ab is idea ko practice situation mein lagao.",
        "Chalo tumhare question ko lesson ki information se samajhte hain.",
    ],
}
QUESTIONS = {
    "en": "Which part of this explanation helps you answer the understanding check?",
    "hi": "इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?",
    "hinglish": "Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?",
}
FOLLOWUP = {
    "en": "How would you explain this idea in your own words?",
    "hi": "तुम इस विचार को अपने शब्दों में कैसे समझाओगे?",
    "hinglish": "Tum is idea ko apne words mein kaise samjhaoge?",
}
RETRY = {
    "en": "Let's slow down and try a different way. We will stay on this step.",
    "hi": "थोड़ा धीरे चलें और दूसरे तरीके से समझें। अभी इसी चरण पर रहेंगे।",
    "hinglish": "Thoda dheere chalte hain aur doosre tareeke se samajhte hain. Abhi isi step par rahenge.",
}
PROBLEMS = {
    "en": {
        "reactions-signs": "Magnesium burns in oxygen and a new white solid is observed. We want to decide what shows that a chemical change occurred. First focus on whether a new substance formed, rather than treating every visible change as proof.",
        "reactions-balance": "We want to balance H₂ + O₂ → H₂O without changing the substances. First identify and count hydrogen and oxygen atoms on both sides. The formulas must stay the same; we will work out the coefficients in the next step.",
        "reactions-types": "Consider CaO + H₂O → Ca(OH)₂. Our problem is to classify the reaction. First compare the pattern of reactants and products, rather than guessing from the names of the chemicals.",
        "light-reflection": "A ray arrives at 30° to the normal. We want to find its reflection angle. First identify the reference line: the normal is perpendicular to the surface, and the angle is measured from that line.",
        "light-images": "An object is 2 m in front of a plane mirror. We want to locate its image. First identify the given object-to-mirror distance and distinguish positions in front of and behind the mirror.",
        "life-nutrition": "A green plant makes food using light energy. We want to understand where its raw materials and energy come from. This food-making process is photosynthesis; first identify what the process is trying to do.",
        "life-respiration": "During exercise, breathing and heart rate usually increase. We want to connect this observation to the muscles' energy needs. First distinguish air moving in and out from food releasing usable energy inside cells.",
    },
    "hi": {
        "reactions-signs": "मैग्नीशियम ऑक्सीजन में जलता है और नया सफेद ठोस दिखता है। हमें समझना है कि रासायनिक परिवर्तन होने का संकेत क्या है। पहले यह देखें कि नया पदार्थ बना है या नहीं; हर दिखाई देने वाला बदलाव अपने-आप प्रमाण नहीं होता।",
        "reactions-balance": "हमें H₂ + O₂ → H₂O को पदार्थ बदले बिना संतुलित करना है। पहले दोनों ओर हाइड्रोजन और ऑक्सीजन के परमाणु पहचानकर गिनें। सूत्र वही रखने हैं; गुणांक अगले चरण में निकालेंगे।",
        "reactions-types": "CaO + H₂O → Ca(OH)₂ को देखें। हमें अभिक्रिया का प्रकार पहचानना है। पहले अभिकारकों और उत्पादों का पैटर्न देखें; केवल पदार्थों के नाम से अनुमान न लगाएँ।",
        "light-reflection": "किरण अभिलंब से 30° पर आ रही है। हमें परावर्तन कोण ज्ञात करना है। पहले संदर्भ रेखा पहचानें: अभिलंब सतह के लंबवत होता है और कोण इसी रेखा से मापा जाता है।",
        "light-images": "वस्तु समतल दर्पण के सामने 2 m पर है। हमें प्रतिबिंब का स्थान ज्ञात करना है। पहले वस्तु और दर्पण के बीच दी गई दूरी पहचानें, और सामने तथा पीछे की स्थितियों में अंतर समझें।",
        "life-nutrition": "हरा पौधा प्रकाश ऊर्जा से भोजन बनाता है। हमें समझना है कि उसके कच्चे पदार्थ और ऊर्जा कहाँ से आते हैं। भोजन बनाने की यह प्रक्रिया प्रकाशसंश्लेषण है; पहले प्रक्रिया का उद्देश्य पहचानें।",
        "life-respiration": "व्यायाम के समय श्वास दर और हृदय गति सामान्यतः बढ़ती हैं। हमें इसे मांसपेशियों की ऊर्जा की जरूरत से जोड़ना है। पहले हवा के अंदर-बाहर जाने और कोशिकाओं के भोजन से ऊर्जा निकलने में अंतर समझें।",
    },
    "hinglish": {
        "reactions-signs": "Magnesium oxygen mein jalta hai aur naya white solid dikhta hai. Humein samajhna hai ki chemical change ka sign kya hai. Pehle dekho ki naya substance bana ya nahi; har visible change apne-aap proof nahi hota.",
        "reactions-balance": "Humein H₂ + O₂ → H₂O ko substances badle bina balance karna hai. Pehle dono taraf hydrogen aur oxygen atoms pehchano aur gino. Formulas same rahenge; coefficients agle step mein nikaalenge.",
        "reactions-types": "CaO + H₂O → Ca(OH)₂ ko dekho. Humein reaction ka type pehchanna hai. Pehle reactants aur products ka pattern compare karo; sirf chemical names se guess mat karo.",
        "light-reflection": "Ray normal se 30° par aa rahi hai. Humein reflection angle nikaalna hai. Pehle reference line pehchano: normal surface ke perpendicular hota hai aur angle isi line se naapte hain.",
        "light-images": "Object plane mirror ke saamne 2 m par hai. Humein image ki position nikaalni hai. Pehle object-to-mirror distance pehchano aur saamne aur peeche wali positions ka farq samjho.",
        "life-nutrition": "Green plant light energy se food banata hai. Humein samajhna hai ki raw materials aur energy kahan se aate hain. Is food-making process ko photosynthesis kehte hain; pehle iska goal pehchano.",
        "life-respiration": "Exercise mein breathing aur heart rate aam taur par badhte hain. Humein is baat ko muscles ki energy need se jodna hai. Pehle hawa ke andar-bahar jaane aur cells mein food se energy nikalne ka farq samjho.",
    },
}


def reflection_measurement(question):
    number = r"(\d+(?:\.\d+)?)"
    degree = r"\s*(?:degrees?|°|डिग्री)"
    for reference, patterns in [
        (
            "surface",
            [
                number
                + degree
                + r"\s+(?:with|to|from)\s+(?:the\s+)?(?:mirror\s+)?(?:surface|satah)",
                r"(?:सतह|satah)\s*(?:से|se)\s*" + number + degree,
            ],
        ),
        (
            "normal",
            [
                number + degree + r"\s+(?:with|to|from)\s+(?:the\s+)?normal",
                r"(?:अभिलंब|अभिलम्ब|normal)\s*(?:से|se)\s*" + number + degree,
            ],
        ),
    ]:
        for pattern in patterns:
            match = re.search(pattern, question, re.I)
            if match:
                given = Decimal(match.group(1))
                if 0 <= given <= 90:
                    return reference, given
    return None


def source_guidance(
    topic_id, language, evidence, phase, style, question, last_wrong=None, preferred_ids=()
):
    found = topic_by_id(topic_id)
    if not found or language not in INTROS:
        return None
    _, topic = found
    originals = [topic["explanation"], topic["example"], topic["question"] + " " + topic["answer"]]
    sources = []
    for index, original in enumerate(originals):
        source = next(
            (
                s
                for s in evidence
                if s["id"] == f"pilot-{topic_id}-v1:{index}" and s.get("excerpt") == original
            ),
            None,
        )
        if source is None:
            return None
        sources.append(source)
    text = originals if language == "en" else RENDERINGS[language][topic_id]
    if phase == 0:
        prefix = RETRY[language] if last_wrong is not None else INTROS[language][0]
        body = PROBLEMS[language][topic_id]
        if last_wrong is not None:
            body += "\n\n" + text[0]
        return prefix + "\n\n" + body + "\n\n" + QUESTIONS[language], sources[:2], "source_guided"
    measurement = (
        reflection_measurement(question) if topic_id == "light-reflection" and phase >= 1 else None
    )
    if measurement:
        reference, given = measurement
        result = 90 - given if reference == "surface" else given
        g, answer = format(given.normalize(), "f"), format(result.normalize(), "f")
        equation = f"90° − {g}° = {answer}°" if reference == "surface" else f"i = {g}°"
        reply = {
            "en": f"The given {g}° is measured from the {'mirror surface' if reference == 'surface' else 'normal'}. Incidence and reflection angles are measured from the normal, which is perpendicular to the surface. So {equation}, and the reflection angle is {answer}°. Which line is the reference for these two angles?",
            "hi": f"दिया गया {g}° कोण {'दर्पण की सतह' if reference == 'surface' else 'अभिलंब'} से मापा गया है। आपतन और परावर्तन कोण अभिलंब से मापते हैं, जो सतह के लंबवत होता है। इसलिए {equation} और परावर्तन कोण भी {answer}° है। इन दोनों कोणों को किस रेखा से मापना चाहिए?",
            "hinglish": f"Diya gaya {g}° angle {'mirror surface' if reference == 'surface' else 'normal'} se measure hua hai. Incidence aur reflection angles normal se naapte hain, jo surface ke perpendicular hota hai. Isliye {equation} aur reflection angle bhi {answer}° hai. Dono angles ke liye reference line kaunsi hogi?",
        }[language]
        return reply, [sources[0]], "checked_calculation"
    indices = {0: [0], 1: [0, 1], 2: [0, 1], 3: [2], 4: [0, 1, 2]}[phase]
    if last_wrong is not None and phase < 3:
        indices = [0, 1, 2] if phase == 2 else [0, 1]
    if phase == 4 and preferred_ids:
        indices.sort(key=lambda index: (sources[index]["id"] not in preferred_ids, index))
    if style == "short_explanation" and phase in {0, 2}:
        indices = [indices[0]]
    elif style == "worked_example" and 1 in indices:
        indices = [1, *[index for index in indices if index != 1]]
    pieces = [text[index].replace("?", ":") for index in indices]
    if style == "step_by_step":
        pieces = [f"{index + 1}. {piece}" for index, piece in enumerate(pieces)]
    prefix = RETRY[language] if last_wrong is not None else INTROS[language][phase]
    reply = (
        prefix
        + "\n\n"
        + "\n\n".join(pieces)
        + "\n\n"
        + (FOLLOWUP[language] if phase == 4 else QUESTIONS[language])
    )
    return reply, [sources[index] for index in indices], "source_guided"
