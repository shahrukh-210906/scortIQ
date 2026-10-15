# Draft local teaching benchmark

Run: 2026-10-15T07:13:57.363164+00:00
Model: `qwen3-8b-light-tuned-bilingual`
Suite SHA-256: `5e3ef7d59fbaecc13fa12bb325adafd3a943082d1754c9496508201746b9164c`
Completed case requests: 42/42.

App accepted 41/42 replies. Factual grades: **not assessed; human review pending**.

Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.

| Language | Accepted | Language signal | One question mark |
|---|---:|---:|---:|
| en | 13/14 | 13 | 1 |
| hi | 14/14 | 14 | 10 |
| hinglish | 14/14 | 12 | 8 |

## Replies for review

### pilot-v1-melting-en
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice is a physical change because it involves a change in state (solid to liquid) without forming new substances. The chemical composition remains H₂O throughout. A guiding question: What happens to the molecules of ice when it melts?
```

### pilot-v1-melting-hi
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
बर्फ का पिघलना भौतिक परिवर्तन है क्योंकि इसमें बर्फ के अणुओं की संरचना बदलती है, लेकिन नया पदार्थ नहीं बनता। यह घटना ऊष्मा के कारण होती है और पदार्थ की संरचना में कोई अपरिवर्तन नहीं होता। आपको यह जानकारी कैसे उपयोगी लगती है?
```

### pilot-v1-melting-hinglish
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Barf ka pighalna physical change kyun hai? Woh paani hi rehti hai; koi naya substance nahi banta। यह प्रक्रिया में कोई नया सामग्री बनते हुए नहीं, केवल अवस्था परिवर्तन होता है।
```

### pilot-v1-bubbles-en
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Your idea is close, but not entirely accurate. Bubbling can happen in both physical and chemical changes. For example, boiling water produces bubbles, but it's just water changing state, not forming new substances. This is a physical change because no new substance is created.
```

### pilot-v1-bubbles-hi
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
आपके विचार में सभी तरल पदार्थों के बुलबुला उत्पन्न होने पर रासायनिक अभिक्रिया होती है, लेकिन यह सही नहीं है। पानी के उबलने पर भी बुलबुला बनते हैं, लेकिन यह एक भौतिक परिवर्तन है। आपको समझ में आया कि बुलबुला उत्पन्न होना रासायनिक अभिक्रिया के संकेत नहीं हो सकता? कृपय: बर्फ के पिघलने के बारे में भी सोचें।
```

### pilot-v1-bubbles-hinglish
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Chemical reactions produce new substances, but bubbling alone isn't proof. Boiling water also bubbles, yet it's just a physical change because the substance remains water. So, your idea is not fully correct.
```

### pilot-v1-water-coefficients-en
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
To balance H₂ + O₂ → H₂O, we adjust coefficients: 2H₂ + O₂ → 2H₂O. Both sides have 4 hydrogen atoms (2×2) and 2 oxygen atoms (1×2). Subscripts in formulas like H₂O must stay unchanged because they define the substance’s identity. Changing them would alter the compound, such as turning water into hydrogen peroxide.
```

### pilot-v1-water-coefficients-hi
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
रासायनिक समीकरण को संतुलित करने के लिए, हमें पहले सूत्र के आगे के गुणांक बदलना होता है। H₂ + O₂ → H₂O में, हम 2H₂ + O₂ → 2H₂O लिख सकते हैं। दोनों ओर चार हाइड्रोजन परमाणु और दो ऑक्सीजन परमाणु हैं। क्या आप समझते हैं कि सूत्र के भीतर के अधोलिखित अंक बदलने से क्या होता है?
```

### pilot-v1-water-coefficients-hinglish
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
Chemical reaction mein atoms conserve hote hain, isliye formula ke andar subscripts mat badalna chahiye. 2H₂ + O₂ → 2H₂O mein dono taraf 4 hydrogen aur 2 oxygen atoms hote hain. Kya aap samajh gaye ki coefficients kaise balance karte hain?
```

### pilot-v1-subscripts-en
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
No, you cannot replace H₂O with H₂O₂ to balance the equation because they are different substances. H₂O is water, while H₂O₂ is hydrogen peroxide. Changing subscripts alters the chemical identity of the compound, which is not allowed when balancing equations. You must only adjust coefficients in front of formulas.
```

### pilot-v1-subscripts-hi
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
हाँ, आप H₂O को H₂O₂ से बदलकर पानी बनाना नहीं सम्भव है। इसके लिए सूत्र के अंक बदलना गलत होगा, क्योंकि H₂O₂ हाइड्रोजन परॉक्साइड है, जो पानी नहीं है। समीकरण के लिए आपको अणुओं के गुणांक बदलना चाहिए, न कि अंक।
```

### pilot-v1-subscripts-hinglish
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
Water formation balance karne ke liye H₂O ko H₂O₂ nahi badal sakte, kyunki subscript badalne se substance badal jata hai. H₂O₂ hydrogen peroxide hai, jo water nahi hota hai. Equation balance karte samay formula ke andar subscripts mat badalo, sirf coefficients badalke kar lena chahiye.
```

### pilot-v1-one-reactant-en
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
This describes a decomposition reaction, where a single reactant splits into two or more products. The key pattern is one starting material producing multiple end products. Let me know if you need examples!
```

### pilot-v1-one-reactant-hi
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
एक अभिकारक से कई उत्पाद बनने वाली अभिक्रिया को विघटन अभिक्रिया कहते हैं। इसमें एक अभिकारक टूटकर दो या अधिक उत्पाद बनते हैं। आप विघटन अभिक्रिया के एक उदाहरण बता सकते हैं?
```

### pilot-v1-one-reactant-hinglish
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
Ek reactant se multiple products banne wali reaction decomposition reaction hote hai, jaise ki CaO + H₂O → Ca(OH)₂ combination reaction hai, lekin ek reactant tootkar products bane wali decomposition hoti hai. Kya aap samajh gaye ki kis type ke reaction mein ek reactant se multiple products bante hain?
```

### pilot-v1-lime-water-en
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
CaO + H₂O → Ca(OH)₂ is a combination reaction, not decomposition. In this reaction, two reactants (CaO and H₂O) combine to form one product (Ca(OH)₂). Decomposition reactions involve breaking down a single reactant into multiple products. Let me know if you need more examples!
```

### pilot-v1-lime-water-hi
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
CaO + H₂O → Ca(OH)₂ एक संयोजन अभिक्रिया है, क्योंकि दो अभिकारक (CaO और H₂O) एक उत्पाद (Ca(OH)₂) बनाते हैं। विघटन अभिक्रिया में एक अभिकारक से कई उत्पाद बनते हैं, जैसे कि AB → A + B। आपकी समझ पर चर्चा करें: यह अभिक्रिया विघटन या संयोजन है?
```

### pilot-v1-lime-water-hinglish
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
CaO + H₂O → Ca(OH)₂ combination reaction hai, kyunki do reactants se ek product banta hai. Decomposition mein sirf ek reactant tootkar multiple products banate hain. Tumne kya samajh liya? Kya decomposition aur combination mein fark samajh paye?
```

### pilot-v1-normal-angle-en
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
The angle of reflection equals the angle of incidence, both measured from the normal. Since the incident ray is 30° to the normal, the reflected ray will also be 30° to the normal. This follows the law of reflection.
```

### pilot-v1-normal-angle-hi
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
परावर्तन के नियम के अनुसार, आपतन कोण और परावर्तन कोण बराबर होते हैं। इसलिए, 30° का आपतन कोण होने पर परावर्तन कोण भी 30° होगा। आप यह समझेंगे कि अभिलंब से मापे गए कोण कैसे बराबर होते हैं? क्या आप इस नियम की पुष्टि कर सकते हैं?
```

### pilot-v1-normal-angle-hinglish
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
Ray normal se 30° aaye toh reflection ka angle bhi 30° hoga, kyunki incidence aur reflection angle barabar hote hain. Normal surface ke perpendicular line hai. Aapko yeh samajhne ki wajah kya hai?
```

### pilot-v1-surface-angle-en
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
The angle of incidence is measured from the normal, not the surface. Since the normal is perpendicular to the surface, you subtract the given angle (20°) from 90°. This gives 70° as the angle of incidence. Let me know if you need further clarification.
```

### pilot-v1-surface-angle-hi
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
आपका कहना गलत है। आपतन कोण अभिलंब से मापा जाता है, न कि दर्पण सतह से। यदि किरण दर्पण से 20° का कोण बनाती है, तो अभिलंब से कोण 90° - 20° = 70° होता है। इसलिए आपतन कोण 70° है।
```

### pilot-v1-surface-angle-hinglish
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
Tumne bola ki 20° hai, lekin sahi nahi. Normal se measure hota hai aur normal surface ke perpendicular hai. Surface se 20° toh normal se 90-20=70° hoga. Isliye angle of incidence 70° hoga.
```

### pilot-v1-mirror-distance-en
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
The image of an object 2 m in front of a plane mirror appears 2 m behind the mirror. It is also upright because plane mirrors form virtual images that are upright.
```

### pilot-v1-mirror-distance-hi
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
समतल दर्पण में वस्तु का प्रतिबिंब दर्पण के पीछे उतनी दूरी पर होता है जितनी दूरी पर वस,तु दर्पण के सामने होती है। इसलिए 2 मीटर पर रखी वस्तु का प्रतिबिंब दर्पण के पीछे 2 मीटर पर होगा। समतल दर्पण के प्रतिबिंब सदैव सीधा होता है।
```

### pilot-v1-mirror-distance-hinglish
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
Object plane mirror ke saamne 2 m par ho toh image mirror ke peeche 2 m par hogi. Image upright hota hai kyunki plane mirror virtual aur upright image banata hai.
```

### pilot-v1-screen-en
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
Your observation is insightful! A plane mirror creates a virtual image, which appears to come from behind the mirror. However, this image cannot be projected onto a screen because the light rays don't actually converge there. The image you see is formed by reflected rays that seem to originate from behind the mirror.
```

### pilot-v1-screen-hi
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
समतल दर्पण के आभासी प्रतिबिंब को पर्दे पर प्राप्त नहीं किया जा सकता। इसके वास्तविक प्रतिबिंब के विपरीत, आभासी प्रतिबिंब केवल दृष्टि द्वारा देखा जा सकता है। यह अस्तित्व में नहीं होता, लेकिन किरणों के प्रतीत आगमन के कारण दिखाई देता है। आपके अनुभव के बारे में आपके विचार क्या हैं?
```

### pilot-v1-screen-hinglish
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
Kya plane mirror ka virtual image screen par project kar sakte hain? Nahi, rays sirf image ki jagah se aati hui lagti hain. Aapko dekhne wala light hai, lekin image nahi. Kya aap samajh gaye ke virtual image kaise hoti hai?
```

### pilot-v1-chlorophyll-en
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Chlorophyll is a green pigment in plants that absorbs light energy, which is essential for photosynthesis. During this process, chlorophyll captures sunlight and converts it into chemical energy used to produce carbohydrates from carbon dioxide and water. This energy also helps release oxygen as a byproduct.
```

### pilot-v1-chlorophyll-hi
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
क्लोरोफिल प्रकाशसंश्लेषण के दौरान प्रकाश ऊर्जा को अवशोषित करता है। यह ऊर्जा पौधों के लिए कार्बन डाइऑक्साइड और पानी से कार्बोहाइड्रेट बनाने में मदद करता है। आप क्लोरोफिल के बिना प्रकाशसंश्लेषण कैसे होगी, इसके बारे में सोच सकते हैं?
```

### pilot-v1-chlorophyll-hinglish
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Chlorophyll ka role light energy absorb karna hai jo plants ke photosynthesis mein use hota hai. Woh carbon dioxide aur water se carbohydrates banane ke liye zaroori hai, aur process mein oxygen release hoti hai. Kya chlorophyll ke bezzab photosynthesis ho sakti hai?
```

### pilot-v1-gas-direction-en
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-gas-direction-hi
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
प्रकाशसंश्लेषण के दौरान हरे पौधे कार्बन डाइऑक्साइड (CO₂) ग्रहण करते हैं और ऑक्सीजन (O₂) छोड़ते हैं। पत्तियाँ रंध्रों से CO₂ लेती हैं, जबकि जड़ें पानी अवशोषित करती हैं। क्लोरोफिल प्रकाश ऊर्जा को अवशोषित करता है। आप यह समझेंगे कि ऑक्सीजन के रिहाई की दिशा क्या होती है?
```

### pilot-v1-gas-direction-hinglish
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
Photosynthesis mein green plants carbon dioxide leti hain aur oxygen release karte hain. Chlorophyll light energy absorb karta hai jo process ke liye zaroori hai. Kya aap samajh sakte hain ki gas ka direction kaise hota hai?
```

### pilot-v1-cell-energy-en
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Cellular respiration is the process by which cells break down food to release energy. Breathing is the exchange of air in the lungs. They are different because respiration happens inside cells and uses oxygen to produce energy, while breathing is about moving air in and out of the body.
```

### pilot-v1-cell-energy-hi
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
कोशिकीय श्वसन एक रासायनिक प्रक्रिया है जहाँ कोशिकाएँ भोजन के अपघटन से ऊर्जा मुक्त करती हैं। वायवीय श्वसन में ऑक्सीजन का उपयोग होता है। श्वास लेना हवा के आदान-प्रदान की प्रक्रिया है, जबकि कोशिकीय श्वसन ऊर्जा मुक्त करता है। इनमें क्या अंतर है? (पाठ स्रोत: पैरा 2)
```

### pilot-v1-cell-energy-hinglish
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Cellular respiration is the process where cells break down food to release energy, as explained in passage 0. Breathing is just moving air in and out of your body, mentioned in passage 2. So they're different! Kya wo dono same hote hai ya alag-alag?
```

### pilot-v1-faster-breathing-en
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Breathing moves air in and out of your body, but cellular respiration happens inside cells to release energy from food. During exercise, breathing speeds up to supply more oxygen for respiration.
```

### pilot-v1-faster-breathing-hi
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
श्वास लेना हवा के प्रवाह की प्रक्रिया है, जबकि कोशिकीय श्वसन कोशिकाओं में ऊर्जा उत्पन्न करने की रासायनिक प्रक्रिया है। व्यायाम के समय, श्वास दर बढ़ती है ताकि ऑक्सीजन में अधिक प्रवेश हो सके। क्या आप जानते हैं कि श्वास लेने के बिना कोशिकीय श्वसन कैसे हो सकता है?
```

### pilot-v1-faster-breathing-hinglish
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Breathing hawa ko body ke andar-bahar le jana hai, jo cellular respiration se alag hai. Cellular respiration cells mein food se energy release karta hai. Exercise mein muscles ko zyada energy chahiye, isliye breathing aur heart rate badhte hain. Kya breathing aur cellular respiration ek hi process hain?
```
