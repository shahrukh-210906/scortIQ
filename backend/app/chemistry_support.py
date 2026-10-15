"""Original draft chemistry prerequisites; counting is arithmetic, not a model guess."""

import re

CHEMISTRY_HELP = {
    "intro": {
        "en": "Let's start with water, something you already know. Scientists write H₂O as a short name showing what one water molecule is made of; we will unpack that slowly. Before balancing anything, we just need to learn how to read and count these little groups. Have you seen H₂O written for water before?",
        "hinglish": "Chalo paani se shuru karte hain, jo tum pehle se jaante ho. Scientists H₂O likhkar dikhate hain ki paani ka ek molecule kin atoms se bana hai; in words ko dheere-dheere samjhenge. Abhi equation solve nahi karni, pehle in groups ko padhna aur ginna seekhenge. Paani ke liye H₂O pehle dekha hai?",
        "hi": "चलो पानी से शुरू करते हैं, जिसे तुम पहले से जानते हो। वैज्ञानिक H₂O लिखकर दिखाते हैं कि पानी का एक अणु किन परमाणुओं से बना है; इन शब्दों को धीरे-धीरे समझेंगे। अभी समीकरण हल नहीं करना, पहले इन समूहों को पढ़ना और गिनना सीखेंगे। पानी के लिए H₂O पहले देखा है?",
    },
    "atom": {
        "en": "An atom is a tiny unit of a chemical element, far too small to see with just your eyes. Hydrogen and oxygen are two different elements, so a hydrogen atom and an oxygen atom are different kinds. In a drawing we can use different coloured dots to tell those kinds apart; atoms are not actually coloured toy balls. Would a hydrogen dot and an oxygen dot represent the same kind or different kinds?",
        "hinglish": "Atom kisi element ki bahut chhoti unit hai, jo sirf aankhon se nahi dikhti. Hydrogen aur oxygen alag elements hain, isliye unke atoms bhi alag kinds ke hain. Drawing mein alag coloured dots se unhe pehchaan sakte hain; asli atoms coloured toy balls nahi hain. Hydrogen aur oxygen ke dots same kind dikhayenge ya alag kinds?",
        "hi": "परमाणु किसी तत्व की बहुत छोटी इकाई है, जो केवल आँखों से नहीं दिखती। हाइड्रोजन और ऑक्सीजन अलग तत्व हैं, इसलिए उनके परमाणु भी अलग तरह के हैं। चित्र में अलग रंग के बिंदुओं से उन्हें पहचान सकते हैं; असली परमाणु रंगीन खिलौने की गेंदें नहीं हैं। हाइड्रोजन और ऑक्सीजन के बिंदु एक तरह के होंगे या अलग तरह के?",
    },
    "molecule": {
        "en": "A molecule is a group of atoms joined together. One water molecule contains two hydrogen atoms joined with one oxygen atom. We can draw those as one group of three dots; the drawing helps us count, but a molecule is much smaller than a drawing. In one water group, how many hydrogen atoms are there?",
        "hinglish": "Molecule atoms ka juda hua group hota hai. Paani ke ek molecule mein do hydrogen atoms aur ek oxygen atom jude hote hain. Drawing mein teen dots ka ek group bana sakte hain; asli molecule drawing se bahut chhota hota hai. Paani ke ek group mein hydrogen ke kitne atoms hain?",
        "hi": "अणु जुड़े हुए परमाणुओं का समूह है। पानी के एक अणु में दो हाइड्रोजन परमाणु और एक ऑक्सीजन परमाणु जुड़े होते हैं। चित्र में तीन बिंदुओं का एक समूह बना सकते हैं; असली अणु चित्र से बहुत छोटा होता है। पानी के एक समूह में हाइड्रोजन के कितने परमाणु हैं?",
    },
    "symbols": {
        "en": "H is the chemical symbol for hydrogen, and O is the symbol for oxygen. A symbol is a short label, not a number. Just as a name tag identifies a person, these letters identify the kind of element. Which letter stands for oxygen: H or O?",
        "hinglish": "H hydrogen ka chemical symbol hai aur O oxygen ka. Symbol ek chhota label hai, number nahi. Jaise name tag se naam pehchaante hain, in letters se element ki kind pehchaante hain. Oxygen ke liye kaunsa letter hai: H ya O?",
        "hi": "H हाइड्रोजन का रासायनिक चिह्न है और O ऑक्सीजन का। चिह्न छोटा नाम है, संख्या नहीं। जैसे नाम की पर्ची से किसी को पहचानते हैं, इन अक्षरों से तत्व की पहचान होती है। ऑक्सीजन के लिए कौन-सा अक्षर है: H या O?",
    },
    "subscript": {
        "en": "In H₂O, the little 2 belongs to H: it means two hydrogen atoms in each water molecule. There is no little number after O, so that means one oxygen atom. Think of one water group as H, H and O. In that one group, is the oxygen count one or two?",
        "hinglish": "H₂O mein chhota 2 sirf H ke saath hai: paani ke ek molecule mein do hydrogen atoms hain. O ke baad chhota number nahi hai, toh oxygen ka count ek hai. Ek water group ko H, H aur O samjho. Is ek group mein oxygen ek hai ya do?",
        "hi": "H₂O में छोटा 2 केवल H के साथ है: पानी के एक अणु में दो हाइड्रोजन परमाणु हैं। O के बाद छोटी संख्या नहीं है, तो ऑक्सीजन की गिनती एक है। पानी के एक समूह को H, H और O समझो। इस एक समूह में ऑक्सीजन एक है या दो?",
    },
    "coefficient": {
        "en": "The big number BEFORE a formula counts whole groups. In 2H₂O there are two water molecules, and each still has two H atoms and one O atom. Count the groups as H,H,O and H,H,O: altogether four H atoms and two O atoms. Does the big 2 multiply only H, or the entire H₂O group?",
        "hinglish": "Formula ke AAGE bada number poore groups ginta hai. 2H₂O mein paani ke do molecules hain; har ek mein ab bhi do H atoms aur ek O atom hai. Groups gino: H,H,O aur H,H,O; total chaar H atoms aur do O atoms hue. Bada 2 sirf H ko multiply karta hai ya poore H₂O group ko?",
        "hi": "सूत्र के आगे बड़ी संख्या पूरे समूह गिनती है। 2H₂O में पानी के दो अणु हैं; हर एक में अब भी दो H परमाणु और एक O परमाणु है। समूह गिनो: H,H,O और H,H,O; कुल चार H परमाणु और दो O परमाणु हुए। बड़ा 2 केवल H को गुणा करता है या पूरे H₂O समूह को?",
    },
    "count_retry": {
        "en": "Let's draw it instead of remembering a rule. One water group is [H H O]; two groups are [H H O] [H H O]. First count only the H letters: two in the first box and two in the second, making four. Now count the O letters: how many do you see altogether?",
        "hinglish": "Rule ratne ke bajay drawing dekhte hain. Ek water group [H H O] hai; do groups [H H O] [H H O] hain. Pehle sirf H gino: pehle box mein do aur doosre mein do, total chaar. Ab sirf O gino: dono boxes mein milakar kitne O dikhte hain?",
        "hi": "नियम रटने के बजाय चित्र देखते हैं। पानी का एक समूह [H H O] है; दो समूह [H H O] [H H O] हैं। पहले केवल H गिनो: पहले खाने में दो और दूसरे में दो, कुल चार। अब केवल O गिनो: दोनों खानों में मिलाकर कितने O दिखते हैं?",
    },
    "formula": {
        "en": "We cannot change the little 2 in H₂O just to balance an equation: that changes which substance the formula describes. H₂O is water, while H₂O₂ is a different substance, hydrogen peroxide. To balance, change the big numbers BEFORE formulas, keeping each formula unchanged. Which can we change while balancing: the big front number or the small number inside H₂O?",
        "hinglish": "Equation balance karne ke liye H₂O ka chhota 2 nahi badalte, kyunki formula badalne se substance badal jaata hai. H₂O paani hai, lekin H₂O₂ alag substance hydrogen peroxide hai. Balance karte waqt sirf formulas ke AAGE bade numbers badalte hain. Kya badal sakte hain: aage ka bada number ya H₂O ke andar chhota number?",
        "hi": "समीकरण संतुलित करने के लिए H₂O का छोटा 2 नहीं बदलते, क्योंकि सूत्र बदलने से पदार्थ बदल जाता है। H₂O पानी है, लेकिन H₂O₂ अलग पदार्थ हाइड्रोजन परॉक्साइड है। संतुलित करते समय केवल सूत्रों के आगे बड़ी संख्याएँ बदलते हैं। क्या बदल सकते हैं: आगे की बड़ी संख्या या H₂O के अंदर छोटी संख्या?",
    },
    "sides": {
        "en": "The reaction arrow separates before from after. Substances on its left are what we start with; those on its right are what forms. We count each kind of atom on both sides because atoms are rearranged, not created or lost in this reaction. Which side shows the starting substances: left or right?",
        "hinglish": "Reaction ka arrow pehle aur baad ko alag dikhata hai. Left side par starting substances hain; right side par banne wale substances. Dono taraf har kind ke atoms ginte hain, kyunki is reaction mein atoms rearrange hote hain, bante ya gaayab nahi hote. Starting substances left side par hain ya right par?",
        "hi": "अभिक्रिया का तीर पहले और बाद को अलग दिखाता है। बाईं ओर शुरुआती पदार्थ हैं; दाईं ओर बनने वाले पदार्थ। दोनों ओर हर तरह के परमाणु गिनते हैं, क्योंकि इस अभिक्रिया में परमाणु दोबारा व्यवस्थित होते हैं, बनते या गायब नहीं होते। शुरुआती पदार्थ बाईं ओर हैं या दाईं ओर?",
    },
}


def chemistry_focus(question, history=()):
    def explicit(text):
        text = text.lower().translate(str.maketrans("₀₁₂₃₄₅₆₇₈₉", "0123456789"))
        if any(w in text for w in ("change", "badal", "बदल", "h2o2")):
            return "formula"
        if re.search(r"\d+\s*h2o", text) or any(
            w in text for w in ("coefficient", "big number", "bada", "aage", "आगे", "गुणांक")
        ):
            return "coefficient"
        if any(w in text for w in ("subscript", "small", "little 2", "chhota", "छोट", "h2o")):
            return "subscript"
        if any(w in text for w in ("molecule", "अणु")):
            return "molecule"
        if any(w in text for w in ("atom", "परमाणु")):
            return "atom"
        if any(w in text for w in ("symbol", "letter", "hydrogen", "oxygen", "चिह्न")) or re.search(
            r"\bh\s+(and|aur)\s+o\b", text
        ):
            return "symbols"
        if any(w in text for w in ("arrow", "left", "right", "reactant", "product", "तीर")):
            return "sides"
        return None

    focus = explicit(question)
    if focus:
        return focus
    if any(w in question.lower() for w in ("confus", "still", "samajh", "समझ", "example")):
        for message in reversed(history):
            if message["role"] == "user" and (focus := explicit(message["content"])):
                return "count_retry" if focus in {"coefficient", "subscript"} else focus
    return "intro"


def water_count(question):
    text = question.translate(str.maketrans("₀₁₂₃₄₅₆₇₈₉", "0123456789"))
    found = re.findall(r"(?<![\w.+-])(\d{1,4})\s*H2O(?![\w₂0-9])", text, re.I)
    # Mixed formulas/equations and multiple groups are outside this small counter.
    if len(found) != 1 or any(mark in text for mark in ("+", "=", "→", "->", "−")):
        return None
    remainder = re.sub(r"\d{1,4}\s*H2O(?!\w)", "", text, flags=re.I)
    if re.search(r"\b(?:[A-Z][a-z]?\d|[A-Z][a-z]?(?:[A-Z][a-z]?)+)", remainder):
        return None
    n = int(found[0])
    return n if 1 <= n <= 1000 else None


def checked_water_count(question, language):
    n = water_count(question)
    if n is None:
        return None
    return {
        "en": f"In {n}H₂O there are {n} whole water molecules. Each has 2 H atoms and 1 O atom, so H = {n} × 2 = {2 * n}, and O = {n} × 1 = {n}. The front number multiplies the whole formula. Which count uses the small 2: hydrogen or oxygen?",
        "hinglish": f"{n}H₂O mein paani ke {n} poore molecules hain. Har molecule mein 2 H atoms aur 1 O atom hai, isliye H = {n} × 2 = {2 * n}, aur O = {n} × 1 = {n}. Aage ka number poore formula ko multiply karta hai. Chhota 2 kiski counting mein aata hai: hydrogen ya oxygen?",
        "hi": f"{n}H₂O में पानी के {n} पूरे अणु हैं। हर अणु में 2 H परमाणु और 1 O परमाणु है, इसलिए H = {n} × 2 = {2 * n}, और O = {n} × 1 = {n}। आगे की संख्या पूरे सूत्र को गुणा करती है। छोटा 2 किसकी गिनती में आता है: हाइड्रोजन या ऑक्सीजन?",
    }[language]
