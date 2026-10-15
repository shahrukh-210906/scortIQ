# Draft local teaching benchmark

Run: 2026-10-15T07:19:00.282511+00:00
Model: `qwen3-8b-base-bilingual`
Suite SHA-256: `5e3ef7d59fbaecc13fa12bb325adafd3a943082d1754c9496508201746b9164c`
Completed case requests: 42/42.

App accepted 42/42 replies. Factual grades: **not assessed; human review pending**.

Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.

| Language | Accepted | Language signal | One question mark |
|---|---:|---:|---:|
| en | 14/14 | 14 | 1 |
| hi | 14/14 | 14 | 9 |
| hinglish | 14/14 | 14 | 7 |

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
बर्फ का पिघलना भौतिक परिवर्तन है क्योंकि इसमें बर्फ के अणुओं की संरचना बदलती है, लेकिन नया पदार्थ नहीं बनता। यह घटना ऊष्मा के कारण होती है और पदार्थ की संरचना में कोई अपरिवर्तन नहीं होता। आपको एक सवाल पूछता हूं: भौतिक परिवर्तन में क्या होता है?
```

### pilot-v1-melting-hinglish
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Barf ka pighalna physical change kyun hai? Woh paani hi rehti hai; koi naya substance nahi banta. Yeh sirf aurak ki aawaj hoti hai, par naye substances nahi banate. Kya aap samajhte hain ke chemical reaction mein kya hota hai?
```

### pilot-v1-bubbles-en
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Your idea is close, but not entirely accurate. Bubbling can happen in both physical and chemical changes. For example, boiling water produces bubbles, but it's just water changing state, not forming new substances. This shows that a clue alone isn't enough to confirm a chemical reaction.
```

### pilot-v1-bubbles-hi
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
रासायनिक अभिक्रिया के संकेत हो सकते हैं, लेकिन केवल बुलबुले दिखना पर्याप्त प्रमाण नहीं है। पानी उबलने पर भी बुलबुले बनते हैं, लेकिन वह एक भौतिक परिवर्तन है। क्या आप बता सकते हैं कि रासायनिक अभिक्रिया में कौन-सी चीज बदल जाती है?
```

### pilot-v1-bubbles-hinglish
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Chemical reactions produce new substances, but bubbling alone isn't enough. Boiling water also bubbles but remains H₂O. Check if something new forms. Kya patakha paani mein koi naya substance banta hai?
```

### pilot-v1-water-coefficients-en
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
To balance H₂ + O₂ → H₂O, we adjust coefficients: 2H₂ + O₂ → 2H₂O. Both sides have 4 hydrogen atoms (2×2) and 2 oxygen atoms (1×2). Subscripts in formulas like H₂O must stay unchanged because they define the substance.
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
हम जल (H₂O) के निर्माण को संतुलित करने में H₂O को H₂O₂ के साथ बदलना नहीं चाहए। इसके पीछे कारण यह है कि सूत्र के भीतर के अंक बदलने से पदार्थ बदल जाता है। H₂O₂ हाइड्रोजन परॉक्साइड है, जो पानी नहीं है।
```

### pilot-v1-subscripts-hinglish
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
Water formation balance karne ke liye H₂O ko H₂O₂ nahi badal sakte, kyunki subscript badalne se substance badal jata hai. H₂O₂ hydrogen peroxide hai, jo water nahi hota hai. Equation balance karte waqt formula ke andar subscripts mat badalo, sirf coefficients badalenge.
```

### pilot-v1-one-reactant-en
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
This describes a decomposition reaction, where a single reactant splits into two or more products. The key pattern is one starting substance forming multiple new substances.
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
Ek reactant se multiple products banne wali reaction decomposition reaction hote hai, jaise CaCO₃ → CaO + CO₂. Kya aap samajh gaye ki yeh kis type ka reaction hai?
```

### pilot-v1-lime-water-en
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
CaO + H₂O → Ca(OH)₂ is a combination reaction, not decomposition. In this reaction, two reactants (CaO and H₂O) combine to form one product (Ca(OH)₂). Decomposition involves breaking down a single reactant into multiple products. Let me know if you need further clarification.
```

### pilot-v1-lime-water-hi
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
CaO + H₂O → Ca(OH)₂ एक संयोजन अभिक्रिया है, क्योंकि दो अभिकारक (CaO और H₂O) एक उत्पाद (Ca(OH)₂) बनाते हैं। विघटन अभिक्रिया में एक अभिकारक से कई उत्पाद बनते हैं, जैसे कि AB → A + B। आपकी सोच गलत है, क्योंकि पानी के शामिल होने से अभिक्रिया का प्रकार बदल नहीं जाता। आपको अभिक्रिया में उत्पादों की संख्या और अभिकारकों की संख्या पर ध्यान देना चाहिए।
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
परावर्तन के नियम के अनुसार, आपतन कोण और परावर्तन कोण बराबर होते हैं। इसलिए, 30° का आपतन कोण होने पर परावर्तन कोण भी 30° होगा। यह समझें कि अभिलंब से मापे गए कोण ही आपतन और पराव रो कोण होते हैं।
```

### pilot-v1-normal-angle-hinglish
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
Ray normal se 30° aaye toh reflection ka angle bhi 30° hoga, kyunki incidence aur reflection angle barabar hote hain. Normal surface ke perpendicular line hai. Iska matlab, ray jo 30° se aayega, uski reflected ray bhi 30° se chalte hain.
```

### pilot-v1-surface-angle-en
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
The angle of incidence is not measured from the mirror surface but from the normal, which is perpendicular to the surface. Since the ray makes 20° with the surface, the angle between the ray and the normal is 90° - 20° = 70°. So your answer is incorrect; the correct angle of incidence is 70°.
```

### pilot-v1-surface-angle-hi
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
आपका कहना सही नहीं है। आपतन कोण अभिलंब से मापा जाता है, जो सतह के लंबवत होता है। यदि किरण 20° सतह से बनाती है, तो आपतन कोण 70° होगा।
```

### pilot-v1-surface-angle-hinglish
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
Tumne kaha ki incidence angle 20° hai, lekin sahi nahi. Normal surface ke perpendicular hota hai aur angle of incidence normal se measure hota hai. Mirror surface se 20° ho toh normal se 90° - 20° = 70° hoga. Isliye angle of incidence 70° hai.
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
समतल दर्पण में वस्तु का प्रतिबिंब दर्पण के पीछे उतनी दूरी पर दिखाई देता है जितनी दूरी पर वसतु दर्पण के सामने होती है। इसलिए, 2 मीटर पहले रखी गई वस्तु का प्रतिबिंब दर्पण के पीछे 2 मीटर पर होगा। समतल दर्पण में प्रतिबिंब सदैव सीधा होता है।
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
Your observation is insightful, but the image in a plane mirror cannot be projected onto a screen. This is because the virtual image appears to come from behind the mirror, not from actual light rays converging there. The image you see is formed by reflected rays that only seem to originate from behind the mirror.
```

### pilot-v1-screen-hi
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
समतल दर्पण के आभासी प्रतिबिंब को पर्दे पर प्राप्त नहीं किया जा सकता। इसके वास्तविक प्रतिबिंब के विपरीत, आभासी प्रतिबिंब केवल दृष्टि द्वारा देखा जा सकता है। यह आपके आंखों में उस प्रतिबिंब की छवि बनती है, लेकिन वास्तव में इसका कोई अस्तित्व नहीं होता। आपके समझ में यह बात आ गई कि प्रतिबिंब केवल दृष्टि द्वारा देखा जा सकता है, न कि पर्दे पर?
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
Chlorophyll is a green pigment in plants that absorbs light energy, which is essential for photosynthesis. During this process, chlorophyll captures sunlight and converts it into chemical energy used to produce carbohydrates from carbon dioxide and water. This absorbed light also helps release oxygen as a byproduct.
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
Chlorophyll ka role light energy absorb karna hai jo plants photosynthesis ke liye use karte hain. Woh carbon dioxide aur water se carbohydrates banane mein madad karta hai aur oxygen release hoti hai. Kya chlorophyll ki absence mein photosynthesis ho sakti hai?
```

### pilot-v1-gas-direction-en
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
No, during photosynthesis, green plants take in carbon dioxide and release oxygen. This process uses light energy to make carbohydrates from carbon dioxide and water, with chlorophyll absorbing the light. A leaf takes in carbon dioxide through stomata, while roots absorb water needed for this process. The released oxygen is a byproduct.
```

### pilot-v1-gas-direction-hi
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
प्रकाशसंश्लेषण के दौरान हरे पौधे कार्बन डाइऑक्साइड ग्रहण करते हैं और ऑक्सीजन उत्सर्जित करते हैं। पत्ती रंध्रों से कार्बन डाइऑक्साइड लेती है, जबकि ऑक्सीजन पत्तियों से बाहर निकलती है। क्लोरोफिल प्रकाश ऊर्जा को अवशोषित करता है। आप क्लोरोफिल के कार्य के बारे में और जानना चाहेंगे?
```

### pilot-v1-gas-direction-hinglish
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
Photosynthesis mein green plants carbon dioxide leti hain aur oxygen release karte hain. Chlorophyll light energy absorb karta hai jo process ke liye zaroori hai. Kya aap samajh gaye ki gas ka direction kaise hota hai?
```

### pilot-v1-cell-energy-en
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Cellular respiration is the process by which cells break down food to release energy. Breathing is the exchange of air in the lungs. They are different because one involves chemical reactions inside cells, while the other is about moving air.
```

### pilot-v1-cell-energy-hi
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
कोशिकीय श्वसन एक रासायनिक प्रक्रिया है जहाँ कोशिकाएँ भोजन के अपघटन से ऊर्जा मुक्त करती हैं। वायवीय श्वसन में ऑक्सीजन का उपयोग होता है। श्वास लेना हवा के आदान-प्रदान की प्रक्रिया है, जबकि कोशिकीय श्वसन ऊर्जा मुक्त करता है। इन दोनों में क्या अंतर है?
```

### pilot-v1-cell-energy-hinglish
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Cellular respiration is the process where cells break down food to release energy, while breathing is just moving air in and out of your body. Breathing helps get oxygen to cells for respiration, but they are not the same thing. Kya cellular respiration mein kis chemical process ke through energy release hota hai?
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
श्वास लेना हवा के प्रवाह की प्रक्रिया है, जबकि कोशिकीय श्वसन कोशिकाओं में ऊर्जा मुक्त करती है। व्यायाम के समय आपकी मांसपेशियों को अधिक ऊर्जा की आवश्यकता होती है, इसलिए आप तेजी से श्वास लेते हैं। क्या आप जानते हैं कि श्वास लेना और कोशिकीय श्वसन में कौन सा अंतर है?
```

### pilot-v1-faster-breathing-hinglish
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Breathing hawa ko body ke andar-bahar le jana hai, jo cellular respiration se alag hai. Exercise mein muscles zyada energy chahiye, isliye breathing aur heart rate badhte hain. Kya breathing aur cellular respiration ek process hain? Nahi, breathing air exchange karti hai; cellular res, food se energy release karta hai.
```
