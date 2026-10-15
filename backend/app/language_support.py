"""Original draft renderings of the immutable pilot evidence, not extra factual sources."""

import json

from .content import topic_by_id

RENDERINGS = {
    "hi": {
        "reactions-signs": [
            "रासायनिक अभिक्रिया में नए पदार्थ बनते हैं। गैस निकलना, रंग बदलना, तापमान बदलना या अवक्षेप बनना इसके संकेत हो सकते हैं। केवल संकेत दिखना हमेशा पर्याप्त प्रमाण नहीं है: पानी उबलने पर भी बुलबुले बनते हैं, लेकिन वह भौतिक परिवर्तन है।",
            "मैग्नीशियम जलने पर ऑक्सीजन से अभिक्रिया करके मैग्नीशियम ऑक्साइड बनाता है। तेज रोशनी और नया सफेद ठोस बनना रासायनिक अभिक्रिया के संकेत हैं।",
            "बर्फ का पिघलना भौतिक परिवर्तन क्यों है? वह पानी ही रहती है; कोई नया पदार्थ नहीं बनता।",
        ],
        "reactions-balance": [
            "रासायनिक अभिक्रिया में परमाणु संरक्षित रहते हैं। समीकरण को संतुलित करने के लिए सूत्रों के आगे के गुणांक बदलते हैं, सूत्र के भीतर के अधोलिखित अंक नहीं। यहाँ atom का अर्थ परमाणु है, molecule का अर्थ अणु है।",
            "2H₂ + O₂ → 2H₂O में दोनों ओर चार हाइड्रोजन परमाणु और दो ऑक्सीजन परमाणु हैं।",
            "पानी बनने का समीकरण संतुलित करने के लिए H₂O को H₂O₂ क्यों नहीं कर सकते? सूत्र के भीतर के अंक बदलने से पदार्थ बदल जाता है। H₂O₂ हाइड्रोजन परॉक्साइड है, पानी नहीं।",
        ],
        "reactions-types": [
            "संयोजन अभिक्रिया में दो या अधिक अभिकारकों से एक उत्पाद बनता है। विघटन अभिक्रिया में एक अभिकारक टूटकर दो या अधिक उत्पाद बनाता है। विस्थापन अभिक्रिया में अधिक अभिक्रियाशील तत्व दूसरे तत्व को विस्थापित करता है।",
            "CaO + H₂O → Ca(OH)₂ एक संयोजन अभिक्रिया है।",
            "एक अभिकारक से कई उत्पाद बनने वाली अभिक्रिया कौन-सी है? विघटन अभिक्रिया।",
        ],
        "light-reflection": [
            "परावर्तन के नियम के अनुसार आपतन कोण और परावर्तन कोण बराबर होते हैं। दोनों कोण अभिलंब से मापे जाते हैं। अभिलंब सतह के लंबवत खींची गई काल्पनिक रेखा है। आपतित किरण, परावर्तित किरण और अभिलंब एक ही तल में होते हैं।",
            "अभिलंब से 30° पर आने वाली किरण परावर्तन के बाद भी अभिलंब से 30° बनाती है।",
            "यदि किरण दर्पण की सतह से 20° बनाती है, तो आपतन कोण कितना है? 70°, क्योंकि अभिलंब सतह से 90° पर होता है।",
        ],
        "light-images": [
            "समतल दर्पण में आभासी, सीधा और वस्तु के बराबर आकार का प्रतिबिंब बनता है। प्रतिबिंब दर्पण के पीछे उतनी दूरी पर दिखता है जितनी दूरी पर वस्तु दर्पण के सामने होती है।",
            "वस्तु समतल दर्पण के सामने 2 m पर हो, तो उसका प्रतिबिंब दर्पण के पीछे 2 m पर होता है।",
            "क्या समतल दर्पण के आभासी प्रतिबिंब को पर्दे पर प्राप्त कर सकते हैं? नहीं। किरणें उस स्थान से आती हुई केवल प्रतीत होती हैं।",
        ],
        "life-nutrition": [
            "प्रकाशसंश्लेषण में हरे पौधे प्रकाश ऊर्जा का उपयोग करके कार्बन डाइऑक्साइड और पानी से कार्बोहाइड्रेट बनाते हैं। क्लोरोफिल प्रकाश ऊर्जा को अवशोषित करता है। इस प्रक्रिया में ऑक्सीजन निकलती है।",
            "पत्ती रंध्रों से कार्बन डाइऑक्साइड लेती है। जड़ें प्रकाशसंश्लेषण के लिए आवश्यक पानी सोखती हैं।",
            "क्लोरोफिल का क्या काम है? वह प्रकाशसंश्लेषण के लिए प्रकाश ऊर्जा को अवशोषित करता है।",
        ],
        "life-respiration": [
            "कोशिकीय श्वसन में कोशिकाएँ भोजन को तोड़कर उपयोगी ऊर्जा मुक्त करती हैं। वायवीय श्वसन में ऑक्सीजन का उपयोग होता है। श्वास लेना हवा को शरीर के अंदर और बाहर ले जाने की प्रक्रिया है; कोशिकीय श्वसन कोशिकाओं के भीतर की रासायनिक प्रक्रिया है।",
            "व्यायाम के समय मांसपेशियों को अधिक ऊर्जा चाहिए, इसलिए श्वास दर और हृदय गति सामान्यतः बढ़ती हैं।",
            "क्या श्वास लेना और कोशिकीय श्वसन एक ही प्रक्रिया हैं? नहीं। श्वास लेने में हवा का आदान-प्रदान होता है; कोशिकीय श्वसन में कोशिकाओं के भोजन से ऊर्जा निकलती है।",
        ],
    },
    "hinglish": {
        "reactions-signs": [
            "Chemical reaction mein naye substances bante hain. Gas nikalna, colour ya temperature badalna, ya precipitate banna clues ho sakte hain. Lekin sirf clue proof nahi hota: ubalte paani mein bhi bubbles aate hain, par woh physical change hai.",
            "Magnesium jalne par oxygen se react karke magnesium oxide banata hai. Bright light aur naya white solid chemical reaction ke signs hain.",
            "Barf ka pighalna physical change kyun hai? Woh paani hi rehti hai; koi naya substance nahi banta.",
        ],
        "reactions-balance": [
            "Chemical reaction mein atoms conserve hote hain. Equation balance karne ke liye formulas ke aage coefficients badlo; formula ke andar subscripts mat badlo.",
            "2H₂ + O₂ → 2H₂O mein dono taraf 4 hydrogen atoms aur 2 oxygen atoms hain.",
            "Water formation balance karne ke liye H₂O ko H₂O₂ kyun nahi bana sakte? Subscript badalne se substance badal jata hai: H₂O₂ hydrogen peroxide hai, water nahi.",
        ],
        "reactions-types": [
            "Combination reaction mein do ya zyada reactants se ek product banta hai. Decomposition mein ek reactant tootkar multiple products banata hai. Displacement mein zyada reactive element doosre element ko replace karta hai.",
            "CaO + H₂O → Ca(OH)₂ combination reaction hai.",
            "Ek reactant se multiple products bante hain toh reaction ka type kya hai? Decomposition reaction.",
        ],
        "light-reflection": [
            "Reflection mein angle of incidence aur angle of reflection barabar hote hain. Dono angles normal se measure hote hain. Normal surface ke perpendicular imaginary line hai. Incident ray, reflected ray aur normal ek hi plane mein hote hain.",
            "Ray normal se 30° par aaye toh reflected ray bhi normal se 30° banati hai.",
            "Ray mirror surface se 20° banaye toh incidence angle kya hoga? 70°, kyunki normal surface se 90° par hota hai.",
        ],
        "light-images": [
            "Plane mirror virtual, upright aur object ke same size ka image banata hai. Image mirror ke peeche utni hi door dikhti hai jitna object uske saamne hota hai.",
            "Object plane mirror ke saamne 2 m par ho toh image mirror ke peeche 2 m par hogi.",
            "Kya plane mirror ka virtual image screen par project kar sakte hain? Nahi. Rays sirf image ki jagah se aati hui lagti hain.",
        ],
        "life-nutrition": [
            "Photosynthesis mein green plants light energy use karke carbon dioxide aur water se carbohydrates banate hain. Chlorophyll light energy absorb karta hai aur process mein oxygen release hoti hai.",
            "Leaf stomata se carbon dioxide leti hai. Roots photosynthesis ke liye zaroori water absorb karti hain.",
            "Chlorophyll ka role kya hai? Woh photosynthesis ke liye light energy absorb karta hai.",
        ],
        "life-respiration": [
            "Cellular respiration mein cells food todkar usable energy release karte hain. Aerobic respiration oxygen use karta hai. Breathing hawa ko body ke andar-bahar le jana hai; cellular respiration cells ke andar chemical process hai.",
            "Exercise mein muscles ko zyada energy chahiye, isliye breathing aur heart rate aam taur par badhte hain.",
            "Kya breathing aur cellular respiration ek hi process hain? Nahi. Breathing air exchange karti hai; cellular respiration cells mein food se energy release karta hai.",
        ],
    },
}


def language_support(topic_id, language, evidence):
    translations = RENDERINGS.get(language, {}).get(topic_id)
    if not translations:
        return ""
    _, topic = topic_by_id(topic_id)
    originals = [topic["explanation"], topic["example"], topic["question"] + " " + topic["answer"]]
    renderings = []
    for source in evidence:
        for index, original in enumerate(originals):
            if source["id"] == f"pilot-{topic_id}-v1:{index}" and source.get("excerpt") == original:
                renderings.append(
                    {"source_id": source["id"], "language_rendering": translations[index]}
                )
    return (
        (
            " Faithful draft language renderings of the same cited evidence follow. Use this vocabulary and explain naturally; do not introduce unsupported examples or confuse technical terms: "
            + json.dumps(renderings, ensure_ascii=False)
        )
        if renderings
        else ""
    )
