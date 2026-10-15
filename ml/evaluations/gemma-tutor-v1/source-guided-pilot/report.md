# Draft local teaching benchmark

Run: 2026-10-15T07:48:30.878147+00:00
Model: `gemma3-trained-source-guided-pilot`
Suite SHA-256: `5e3ef7d59fbaecc13fa12bb325adafd3a943082d1754c9496508201746b9164c`
Completed case requests: 42/42.

App accepted 41/42 replies. Factual grades: **not assessed; human review pending**.

Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.

| Language | Accepted | Language signal | One question mark |
|---|---:|---:|---:|
| en | 14/14 | 14 | 14 |
| hi | 14/14 | 14 | 14 |
| hinglish | 13/14 | 13 | 13 |

## Replies for review

### pilot-v1-melting-en
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Why is melting ice a physical change: It remains water; no new substance forms.

A chemical reaction produces new substances. Clues can include a gas being released, a colour change, a temperature change, or a precipitate. A clue alone is not always proof: boiling water also produces bubbles but is a physical change.

When magnesium burns, it reacts with oxygen to form magnesium oxide. The bright light and new white solid are signs of a chemical reaction.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-melting-hi
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

बर्फ का पिघलना भौतिक परिवर्तन क्यों है: वह पानी ही रहती है; कोई नया पदार्थ नहीं बनता।

रासायनिक अभिक्रिया में नए पदार्थ बनते हैं। गैस निकलना, रंग बदलना, तापमान बदलना या अवक्षेप बनना इसके संकेत हो सकते हैं। केवल संकेत दिखना हमेशा पर्याप्त प्रमाण नहीं है: पानी उबलने पर भी बुलबुले बनते हैं, लेकिन वह भौतिक परिवर्तन है।

मैग्नीशियम जलने पर ऑक्सीजन से अभिक्रिया करके मैग्नीशियम ऑक्साइड बनाता है। तेज रोशनी और नया सफेद ठोस बनना रासायनिक अभिक्रिया के संकेत हैं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-melting-hinglish
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Barf ka pighalna physical change kyun hai: Woh paani hi rehti hai; koi naya substance nahi banta.

Chemical reaction mein naye substances bante hain. Gas nikalna, colour ya temperature badalna, ya precipitate banna clues ho sakte hain. Lekin sirf clue proof nahi hota: ubalte paani mein bhi bubbles aate hain, par woh physical change hai.

Magnesium jalne par oxygen se react karke magnesium oxide banata hai. Bright light aur naya white solid chemical reaction ke signs hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-bubbles-en
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

A chemical reaction produces new substances. Clues can include a gas being released, a colour change, a temperature change, or a precipitate. A clue alone is not always proof: boiling water also produces bubbles but is a physical change.

When magnesium burns, it reacts with oxygen to form magnesium oxide. The bright light and new white solid are signs of a chemical reaction.

Why is melting ice a physical change: It remains water; no new substance forms.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-bubbles-hi
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

रासायनिक अभिक्रिया में नए पदार्थ बनते हैं। गैस निकलना, रंग बदलना, तापमान बदलना या अवक्षेप बनना इसके संकेत हो सकते हैं। केवल संकेत दिखना हमेशा पर्याप्त प्रमाण नहीं है: पानी उबलने पर भी बुलबुले बनते हैं, लेकिन वह भौतिक परिवर्तन है।

मैग्नीशियम जलने पर ऑक्सीजन से अभिक्रिया करके मैग्नीशियम ऑक्साइड बनाता है। तेज रोशनी और नया सफेद ठोस बनना रासायनिक अभिक्रिया के संकेत हैं।

बर्फ का पिघलना भौतिक परिवर्तन क्यों है: वह पानी ही रहती है; कोई नया पदार्थ नहीं बनता।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-bubbles-hinglish
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Chemical reaction mein naye substances bante hain. Gas nikalna, colour ya temperature badalna, ya precipitate banna clues ho sakte hain. Lekin sirf clue proof nahi hota: ubalte paani mein bhi bubbles aate hain, par woh physical change hai.

Magnesium jalne par oxygen se react karke magnesium oxide banata hai. Bright light aur naya white solid chemical reaction ke signs hain.

Barf ka pighalna physical change kyun hai: Woh paani hi rehti hai; koi naya substance nahi banta.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-water-coefficients-en
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

2H₂ + O₂ → 2H₂O. Both sides contain four hydrogen atoms and two oxygen atoms.

Atoms are conserved during a chemical reaction. Balance an equation by changing coefficients in front of formulas, never the subscripts inside a formula.

Why must we not change H₂O to H₂O₂ to balance water formation: Changing subscripts changes the substance: H₂O₂ is hydrogen peroxide.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-water-coefficients-hi
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

2H₂ + O₂ → 2H₂O में दोनों ओर चार हाइड्रोजन परमाणु और दो ऑक्सीजन परमाणु हैं।

रासायनिक अभिक्रिया में परमाणु संरक्षित रहते हैं। समीकरण को संतुलित करने के लिए सूत्रों के आगे के गुणांक बदलते हैं, सूत्र के भीतर के अधोलिखित अंक नहीं। यहाँ atom का अर्थ परमाणु है, molecule का अर्थ अणु है।

पानी बनने का समीकरण संतुलित करने के लिए H₂O को H₂O₂ क्यों नहीं कर सकते: सूत्र के भीतर के अंक बदलने से पदार्थ बदल जाता है। H₂O₂ हाइड्रोजन परॉक्साइड है, पानी नहीं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-water-coefficients-hinglish
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

2H₂ + O₂ → 2H₂O mein dono taraf 4 hydrogen atoms aur 2 oxygen atoms hain.

Chemical reaction mein atoms conserve hote hain. Equation balance karne ke liye formulas ke aage coefficients badlo; formula ke andar subscripts mat badlo.

Water formation balance karne ke liye H₂O ko H₂O₂ kyun nahi bana sakte: Subscript badalne se substance badal jata hai: H₂O₂ hydrogen peroxide hai, water nahi.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-subscripts-en
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Why must we not change H₂O to H₂O₂ to balance water formation: Changing subscripts changes the substance: H₂O₂ is hydrogen peroxide.

Atoms are conserved during a chemical reaction. Balance an equation by changing coefficients in front of formulas, never the subscripts inside a formula.

2H₂ + O₂ → 2H₂O. Both sides contain four hydrogen atoms and two oxygen atoms.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-subscripts-hi
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

पानी बनने का समीकरण संतुलित करने के लिए H₂O को H₂O₂ क्यों नहीं कर सकते: सूत्र के भीतर के अंक बदलने से पदार्थ बदल जाता है। H₂O₂ हाइड्रोजन परॉक्साइड है, पानी नहीं।

रासायनिक अभिक्रिया में परमाणु संरक्षित रहते हैं। समीकरण को संतुलित करने के लिए सूत्रों के आगे के गुणांक बदलते हैं, सूत्र के भीतर के अधोलिखित अंक नहीं। यहाँ atom का अर्थ परमाणु है, molecule का अर्थ अणु है।

2H₂ + O₂ → 2H₂O में दोनों ओर चार हाइड्रोजन परमाणु और दो ऑक्सीजन परमाणु हैं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-subscripts-hinglish
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Water formation balance karne ke liye H₂O ko H₂O₂ kyun nahi bana sakte: Subscript badalne se substance badal jata hai: H₂O₂ hydrogen peroxide hai, water nahi.

Chemical reaction mein atoms conserve hote hain. Equation balance karne ke liye formulas ke aage coefficients badlo; formula ke andar subscripts mat badlo.

2H₂ + O₂ → 2H₂O mein dono taraf 4 hydrogen atoms aur 2 oxygen atoms hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-one-reactant-en
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

CaO + H₂O → Ca(OH)₂ is a combination reaction.

Which type is a reaction with one reactant and multiple products: A decomposition reaction.

In a combination reaction, two or more reactants form one product. In a decomposition reaction, one reactant breaks into two or more products. Displacement reactions involve a more reactive element replacing another.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-one-reactant-hi
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

संयोजन अभिक्रिया में दो या अधिक अभिकारकों से एक उत्पाद बनता है। विघटन अभिक्रिया में एक अभिकारक टूटकर दो या अधिक उत्पाद बनाता है। विस्थापन अभिक्रिया में अधिक अभिक्रियाशील तत्व दूसरे तत्व को विस्थापित करता है।

CaO + H₂O → Ca(OH)₂ एक संयोजन अभिक्रिया है।

एक अभिकारक से कई उत्पाद बनने वाली अभिक्रिया कौन-सी है: विघटन अभिक्रिया।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-one-reactant-hinglish
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Combination reaction mein do ya zyada reactants se ek product banta hai. Decomposition mein ek reactant tootkar multiple products banata hai. Displacement mein zyada reactive element doosre element ko replace karta hai.

CaO + H₂O → Ca(OH)₂ combination reaction hai.

Ek reactant se multiple products bante hain toh reaction ka type kya hai: Decomposition reaction.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-lime-water-en
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Which type is a reaction with one reactant and multiple products: A decomposition reaction.

In a combination reaction, two or more reactants form one product. In a decomposition reaction, one reactant breaks into two or more products. Displacement reactions involve a more reactive element replacing another.

CaO + H₂O → Ca(OH)₂ is a combination reaction.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-lime-water-hi
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

संयोजन अभिक्रिया में दो या अधिक अभिकारकों से एक उत्पाद बनता है। विघटन अभिक्रिया में एक अभिकारक टूटकर दो या अधिक उत्पाद बनाता है। विस्थापन अभिक्रिया में अधिक अभिक्रियाशील तत्व दूसरे तत्व को विस्थापित करता है।

CaO + H₂O → Ca(OH)₂ एक संयोजन अभिक्रिया है।

एक अभिकारक से कई उत्पाद बनने वाली अभिक्रिया कौन-सी है: विघटन अभिक्रिया।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-lime-water-hinglish
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Combination reaction mein do ya zyada reactants se ek product banta hai. Decomposition mein ek reactant tootkar multiple products banata hai. Displacement mein zyada reactive element doosre element ko replace karta hai.

CaO + H₂O → Ca(OH)₂ combination reaction hai.

Ek reactant se multiple products bante hain toh reaction ka type kya hai: Decomposition reaction.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-normal-angle-en
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
The given 30° is measured from the normal. Incidence and reflection angles are measured from the normal, which is perpendicular to the surface. So i = 30°, and the reflection angle is 30°. Which line is the reference for these two angles?
```

### pilot-v1-normal-angle-hi
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
दिया गया 30° कोण अभिलंब से मापा गया है। आपतन और परावर्तन कोण अभिलंब से मापते हैं, जो सतह के लंबवत होता है। इसलिए i = 30° और परावर्तन कोण भी 30° है। इन दोनों कोणों को किस रेखा से मापना चाहिए?
```

### pilot-v1-normal-angle-hinglish
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-surface-angle-en
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
The given 20° is measured from the mirror surface. Incidence and reflection angles are measured from the normal, which is perpendicular to the surface. So 90° − 20° = 70°, and the reflection angle is 70°. Which line is the reference for these two angles?
```

### pilot-v1-surface-angle-hi
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
दिया गया 20° कोण दर्पण की सतह से मापा गया है। आपतन और परावर्तन कोण अभिलंब से मापते हैं, जो सतह के लंबवत होता है। इसलिए 90° − 20° = 70° और परावर्तन कोण भी 70° है। इन दोनों कोणों को किस रेखा से मापना चाहिए?
```

### pilot-v1-surface-angle-hinglish
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
Diya gaya 20° angle mirror surface se measure hua hai. Incidence aur reflection angles normal se naapte hain, jo surface ke perpendicular hota hai. Isliye 90° − 20° = 70° aur reflection angle bhi 70° hai. Dono angles ke liye reference line kaunsi hogi?
```

### pilot-v1-mirror-distance-en
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

A plane mirror forms a virtual, upright image of the same size as the object. The image appears as far behind the mirror as the object is in front.

An object 2 m in front of a plane mirror has its image 2 m behind the mirror.

Can a plane mirror's virtual image be projected onto a screen: No. The rays only appear to come from behind the mirror.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-mirror-distance-hi
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

समतल दर्पण में आभासी, सीधा और वस्तु के बराबर आकार का प्रतिबिंब बनता है। प्रतिबिंब दर्पण के पीछे उतनी दूरी पर दिखता है जितनी दूरी पर वस्तु दर्पण के सामने होती है।

वस्तु समतल दर्पण के सामने 2 m पर हो, तो उसका प्रतिबिंब दर्पण के पीछे 2 m पर होता है।

क्या समतल दर्पण के आभासी प्रतिबिंब को पर्दे पर प्राप्त कर सकते हैं: नहीं। किरणें उस स्थान से आती हुई केवल प्रतीत होती हैं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-mirror-distance-hinglish
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Plane mirror virtual, upright aur object ke same size ka image banata hai. Image mirror ke peeche utni hi door dikhti hai jitna object uske saamne hota hai.

Object plane mirror ke saamne 2 m par ho toh image mirror ke peeche 2 m par hogi.

Kya plane mirror ka virtual image screen par project kar sakte hain: Nahi. Rays sirf image ki jagah se aati hui lagti hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-screen-en
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

A plane mirror forms a virtual, upright image of the same size as the object. The image appears as far behind the mirror as the object is in front.

Can a plane mirror's virtual image be projected onto a screen: No. The rays only appear to come from behind the mirror.

An object 2 m in front of a plane mirror has its image 2 m behind the mirror.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-screen-hi
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

क्या समतल दर्पण के आभासी प्रतिबिंब को पर्दे पर प्राप्त कर सकते हैं: नहीं। किरणें उस स्थान से आती हुई केवल प्रतीत होती हैं।

समतल दर्पण में आभासी, सीधा और वस्तु के बराबर आकार का प्रतिबिंब बनता है। प्रतिबिंब दर्पण के पीछे उतनी दूरी पर दिखता है जितनी दूरी पर वस्तु दर्पण के सामने होती है।

वस्तु समतल दर्पण के सामने 2 m पर हो, तो उसका प्रतिबिंब दर्पण के पीछे 2 m पर होता है।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-screen-hinglish
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Plane mirror virtual, upright aur object ke same size ka image banata hai. Image mirror ke peeche utni hi door dikhti hai jitna object uske saamne hota hai.

Kya plane mirror ka virtual image screen par project kar sakte hain: Nahi. Rays sirf image ki jagah se aati hui lagti hain.

Object plane mirror ke saamne 2 m par ho toh image mirror ke peeche 2 m par hogi.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-chlorophyll-en
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Green plants use light energy to make carbohydrates from carbon dioxide and water during photosynthesis. Chlorophyll absorbs light, and oxygen is released.

What is the role of chlorophyll: It absorbs the light energy used in photosynthesis.

A leaf takes in carbon dioxide through stomata. Roots absorb the water needed for photosynthesis.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-chlorophyll-hi
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

प्रकाशसंश्लेषण में हरे पौधे प्रकाश ऊर्जा का उपयोग करके कार्बन डाइऑक्साइड और पानी से कार्बोहाइड्रेट बनाते हैं। क्लोरोफिल प्रकाश ऊर्जा को अवशोषित करता है। इस प्रक्रिया में ऑक्सीजन निकलती है।

क्लोरोफिल का क्या काम है: वह प्रकाशसंश्लेषण के लिए प्रकाश ऊर्जा को अवशोषित करता है।

पत्ती रंध्रों से कार्बन डाइऑक्साइड लेती है। जड़ें प्रकाशसंश्लेषण के लिए आवश्यक पानी सोखती हैं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-chlorophyll-hinglish
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Photosynthesis mein green plants light energy use karke carbon dioxide aur water se carbohydrates banate hain. Chlorophyll light energy absorb karta hai aur process mein oxygen release hoti hai.

Chlorophyll ka role kya hai: Woh photosynthesis ke liye light energy absorb karta hai.

Leaf stomata se carbon dioxide leti hai. Roots photosynthesis ke liye zaroori water absorb karti hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-gas-direction-en
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Green plants use light energy to make carbohydrates from carbon dioxide and water during photosynthesis. Chlorophyll absorbs light, and oxygen is released.

What is the role of chlorophyll: It absorbs the light energy used in photosynthesis.

A leaf takes in carbon dioxide through stomata. Roots absorb the water needed for photosynthesis.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-gas-direction-hi
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

प्रकाशसंश्लेषण में हरे पौधे प्रकाश ऊर्जा का उपयोग करके कार्बन डाइऑक्साइड और पानी से कार्बोहाइड्रेट बनाते हैं। क्लोरोफिल प्रकाश ऊर्जा को अवशोषित करता है। इस प्रक्रिया में ऑक्सीजन निकलती है।

पत्ती रंध्रों से कार्बन डाइऑक्साइड लेती है। जड़ें प्रकाशसंश्लेषण के लिए आवश्यक पानी सोखती हैं।

क्लोरोफिल का क्या काम है: वह प्रकाशसंश्लेषण के लिए प्रकाश ऊर्जा को अवशोषित करता है।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-gas-direction-hinglish
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Photosynthesis mein green plants light energy use karke carbon dioxide aur water se carbohydrates banate hain. Chlorophyll light energy absorb karta hai aur process mein oxygen release hoti hai.

Chlorophyll ka role kya hai: Woh photosynthesis ke liye light energy absorb karta hai.

Leaf stomata se carbon dioxide leti hai. Roots photosynthesis ke liye zaroori water absorb karti hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-cell-energy-en
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Cells break down food to release usable energy. Aerobic respiration uses oxygen. Breathing moves air into and out of the body; cellular respiration is a chemical process inside cells.

Are breathing and cellular respiration the same process: No. Breathing exchanges air; respiration releases energy from food in cells.

During exercise, muscles need more energy, so breathing and heart rate usually increase.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-cell-energy-hi
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

कोशिकीय श्वसन में कोशिकाएँ भोजन को तोड़कर उपयोगी ऊर्जा मुक्त करती हैं। वायवीय श्वसन में ऑक्सीजन का उपयोग होता है। श्वास लेना हवा को शरीर के अंदर और बाहर ले जाने की प्रक्रिया है; कोशिकीय श्वसन कोशिकाओं के भीतर की रासायनिक प्रक्रिया है।

क्या श्वास लेना और कोशिकीय श्वसन एक ही प्रक्रिया हैं: नहीं। श्वास लेने में हवा का आदान-प्रदान होता है; कोशिकीय श्वसन में कोशिकाओं के भोजन से ऊर्जा निकलती है।

व्यायाम के समय मांसपेशियों को अधिक ऊर्जा चाहिए, इसलिए श्वास दर और हृदय गति सामान्यतः बढ़ती हैं।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-cell-energy-hinglish
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Cellular respiration mein cells food todkar usable energy release karte hain. Aerobic respiration oxygen use karta hai. Breathing hawa ko body ke andar-bahar le jana hai; cellular respiration cells ke andar chemical process hai.

Kya breathing aur cellular respiration ek hi process hain: Nahi. Breathing air exchange karti hai; cellular respiration cells mein food se energy release karta hai.

Exercise mein muscles ko zyada energy chahiye, isliye breathing aur heart rate aam taur par badhte hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```

### pilot-v1-faster-breathing-en
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Let's use the lesson evidence to answer your question.

Cells break down food to release usable energy. Aerobic respiration uses oxygen. Breathing moves air into and out of the body; cellular respiration is a chemical process inside cells.

Are breathing and cellular respiration the same process: No. Breathing exchanges air; respiration releases energy from food in cells.

During exercise, muscles need more energy, so breathing and heart rate usually increase.

Which part of this explanation helps you answer the understanding check?
```

### pilot-v1-faster-breathing-hi
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
तुम्हारे प्रश्न को पाठ की जानकारी से समझते हैं।

कोशिकीय श्वसन में कोशिकाएँ भोजन को तोड़कर उपयोगी ऊर्जा मुक्त करती हैं। वायवीय श्वसन में ऑक्सीजन का उपयोग होता है। श्वास लेना हवा को शरीर के अंदर और बाहर ले जाने की प्रक्रिया है; कोशिकीय श्वसन कोशिकाओं के भीतर की रासायनिक प्रक्रिया है।

व्यायाम के समय मांसपेशियों को अधिक ऊर्जा चाहिए, इसलिए श्वास दर और हृदय गति सामान्यतः बढ़ती हैं।

क्या श्वास लेना और कोशिकीय श्वसन एक ही प्रक्रिया हैं: नहीं। श्वास लेने में हवा का आदान-प्रदान होता है; कोशिकीय श्वसन में कोशिकाओं के भोजन से ऊर्जा निकलती है।

इस व्याख्या के किस भाग से तुम्हें समझ की जाँच वाला प्रश्न हल करने में मदद मिलती है?
```

### pilot-v1-faster-breathing-hinglish
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Chalo tumhare question ko lesson ki information se samajhte hain.

Cellular respiration mein cells food todkar usable energy release karte hain. Aerobic respiration oxygen use karta hai. Breathing hawa ko body ke andar-bahar le jana hai; cellular respiration cells ke andar chemical process hai.

Kya breathing aur cellular respiration ek hi process hain: Nahi. Breathing air exchange karti hai; cellular respiration cells mein food se energy release karta hai.

Exercise mein muscles ko zyada energy chahiye, isliye breathing aur heart rate aam taur par badhte hain.

Is explanation ka kaunsa hissa tumhe understanding check solve karne mein madad karta hai?
```
