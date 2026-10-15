# Draft local teaching benchmark

Run: 2026-10-15T05:35:00.301738+00:00
Model: `llama3.1:latest`
Suite SHA-256: `5e3ef7d59fbaecc13fa12bb325adafd3a943082d1754c9496508201746b9164c`
Completed case requests: 42/42.

App accepted 39/42 replies. Factual grades: **not assessed; human review pending**.

Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.

| Language | Accepted | Language signal | One question mark |
|---|---:|---:|---:|
| en | 14/14 | 14 | 0 |
| hi | 14/14 | 9 | 0 |
| hinglish | 11/14 | 11 | 4 |

## Replies for review

### pilot-v1-melting-en
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice is a physical change because it remains water; no new substance forms.
```

### pilot-v1-melting-hi
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice ek bhautik parivartan hai kyunki yeh paani ban jaata hai, naya dravya nahin utpann hota hai.
```

### pilot-v1-melting-hinglish
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice hai ek physical change kyun, kyonki yeh ice pani mein badal jaata hai, lekin koi naya substance nahin banata hai. Iski wajah yeh hai ki ice ke atom pani ke atom mein badal jaate hain, lekin unke gat hain ek hi rehte hain.
```

### pilot-v1-bubbles-en
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
No, that's not correct. Boiling water produces bubbles, but it's a physical change.
```

### pilot-v1-bubbles-hi
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
नहीं, यह सही नहीं है.
```

### pilot-v1-bubbles-hinglish
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Kya hai, bhai? (What's up, buddy?) Bubbles in a liquid don't always mean a chemical reaction. Dekho (look) at boiling water. It produces bubbles, but it's a physical change, na (right?). No new substance forms, it's still water, paani (water). So, bubbles alone are not proof of a chemical reaction.
```

### pilot-v1-water-coefficients-en
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
To balance the equation H2 + O2 -> H2O, we need to make sure the number of atoms of each element is the same on both sides of the equation. Let's start by looking at the hydrogen atoms. We have 2 hydrogen atoms on the left side (H2) and 2 hydrogen atoms on the right side (H2O). The number of hydrogen atoms is already balanced.
```

### pilot-v1-water-coefficients-hi
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
H2 + O2 -> 2H2O, kyunki dono taraf 2 hydrogen atoms aur 2 oxygen atoms hain.
```

### pilot-v1-water-coefficients-hinglish
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
Kyun, humein H2 + O2 -> H2O ka sambalans karna hai. Kaise humein iska sambalans karna hai?
```

### pilot-v1-subscripts-en
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
No, you cannot balance water formation by replacing H2O with H2O2.
```

### pilot-v1-subscripts-hi
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
नहीं, आप पानी के गठन को संतुलित करने के लिए H2O को H2O2 में बदल नहीं सकते हैं।
```

### pilot-v1-subscripts-hinglish
Can I balance water formation by replacing H2O with H2O2? Explain why or why not.

Expected: No; changing subscripts changes the substance.; H2O2 is hydrogen peroxide; use coefficients instead.

Reply (untrusted model output):

```text
Nahin, kyun ki H2O2 hydrogen peroxide hai, jo water nahin hai.
```

### pilot-v1-one-reactant-en
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
A decomposition reaction has one reactant breaking into multiple products.
```

### pilot-v1-one-reactant-hi
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
एक प्रतिक्रिया जिसमें एक प्रतिक्रियक कई उत्पादों में टूट जाता है, वह विखंडन प्रतिक्रिया है।
```

### pilot-v1-one-reactant-hinglish
What type of reaction has one reactant breaking into multiple products? Explain the pattern.

Expected: Decomposition.; One reactant breaks into two or more products.

Reply (untrusted model output):

```text
Kya hai yeh reaction type? Hota hai yeh decomposition reaction.
```

### pilot-v1-lime-water-en
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
No, that's not correct.
```

### pilot-v1-lime-water-hi
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
नहीं, यह एक संयोजन प्रतिक्रिया है।
```

### pilot-v1-lime-water-hinglish
I think CaO + H2O -> Ca(OH)2 is decomposition because water is involved. Am I right? Explain.

Expected: It is combination, not decomposition.; Two reactants combine into one product.

Reply (untrusted model output):

```text
Kyun nahin, yeh combination reaction hai. Dekho, ek hi product ban raha hai, Ca(OH)2.
```

### pilot-v1-normal-angle-en
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
The angle of reflection is 30 degrees. This is because the angle of incidence equals the angle of reflection, as stated in the laws of reflection.
```

### pilot-v1-normal-angle-hi
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
Pratibimba ki kshamta ka niyam hai ki pratikiran kee koon hai aakarshak kee koon.
```

### pilot-v1-normal-angle-hinglish
A light ray arrives at 30 degrees to the normal. What is its angle of reflection, and why?

Expected: 30 degrees.; Incidence and reflection angles are equal and measured from the normal.

Reply (untrusted model output):

```text
Kyun, angle of reflection hoga 30 degree, kyonki angle of incidence aur angle of reflection ek hi hota hai.
```

### pilot-v1-surface-angle-en
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
No, that's not correct.
```

### pilot-v1-surface-angle-hi
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
नहीं, यह सही नहीं है।
```

### pilot-v1-surface-angle-hinglish
A light ray makes 20 degrees with the mirror surface. I say its angle of incidence is 20 degrees. Is that right? Explain the calculation.

Expected: The angle of incidence is 70 degrees, not 20 degrees.; The normal is perpendicular to the surface, so 90 - 20 = 70.

Reply (untrusted model output):

```text
Kya aapko pata hai kaise angle of incidence ka calculation hota hai?
```

### pilot-v1-mirror-distance-en
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
The image is 2 metres behind the mirror, and it is upright.
```

### pilot-v1-mirror-distance-hi
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
Aapke prateek ka pratibimba 2 metre peeche hai, aur yeh uddharak hai.
```

### pilot-v1-mirror-distance-hinglish
An object is 2 metres in front of a plane mirror. Where is its image, and is it upright?

Expected: 2 metres behind the mirror.; The image is virtual, upright and the same size as the object.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-screen-en
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
Not exactly. The rays of light from the object only appear to come from behind the mirror, but they don't actually exist there. This means you can't project the virtual image onto a screen.
```

### pilot-v1-screen-hi
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
नहीं, यह सही नहीं है।
```

### pilot-v1-screen-hinglish
I think a plane mirror image can be caught on a screen because I can see it. Is this correct? Explain.

Expected: No; a plane mirror forms a virtual image.; Rays only appear to meet behind the mirror rather than actually meeting there.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-chlorophyll-en
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Chlorophyll absorbs the light energy used in photosynthesis.
```

### pilot-v1-chlorophyll-hi
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
च्लोरोफिल का कार्य है कि वह प्रकाश ऊर्जा को अवशोषित करता है और फिर इस ऊर्जा का उपयोग श्वसन प्रक्रिया में किया जाता है।
```

### pilot-v1-chlorophyll-hinglish
What does chlorophyll do during photosynthesis? Explain its role rather than only naming it.

Expected: Chlorophyll absorbs light energy.; This energy is used to make carbohydrates from carbon dioxide and water.

Reply (untrusted model output):

```text
Chlorophyll ka kaam photosynthesis mein kya hota hai?
```

### pilot-v1-gas-direction-en
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
No, green plants do not take in oxygen and release carbon dioxide during photosynthesis.
```

### pilot-v1-gas-direction-hi
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
चलो देखें कि फोटोसिंथेसिस में क्या होता है।
```

### pilot-v1-gas-direction-hinglish
During photosynthesis, do green plants take in oxygen and release carbon dioxide? Explain the correct gas direction for photosynthesis.

Expected: Photosynthesis uses carbon dioxide and releases oxygen.; Light energy and water are involved in carbohydrate production.

Reply (untrusted model output):

```text
Photosynthesis mein, green plants oxygen nahi lete hain aur carbon dioxide nahi dete hain. Kyun? Kaise photosynthesis hota hai?
```

### pilot-v1-cell-energy-en
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
Cellular respiration is a chemical process inside cells that breaks down food to release usable energy. It's different from breathing, which is the exchange of air in and out of the body.
```

### pilot-v1-cell-energy-hi
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
cellular respiration hai, jo khaane kee avashyaktaa kee urja ko uthaataa hai. Yah prakriya keval cellon mein hoti hai. Haalanki, pranaaamanaa (breathing) kee prakriya se alag hai, jahaan hamaare shareer kee aaspaas kee aavaz kee pranaaamanaa hoti hai.
```

### pilot-v1-cell-energy-hinglish
What is cellular respiration, and how is it different from breathing?

Expected: Respiration breaks down food inside cells to release usable energy.; Breathing moves air into and out of the body.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-faster-breathing-en
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
No, breathing faster is not cellular respiration. Cellular respiration is a chemical process inside cells that releases energy from food.
```

### pilot-v1-faster-breathing-hi
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
नहीं, श्वसन और कोशिकीय श्वसन अलग-अलग प्रक्रियाएं हैं।
```

### pilot-v1-faster-breathing-hinglish
If I breathe faster, is the movement of air itself cellular respiration? Explain the distinction during exercise.

Expected: No; air movement is breathing, not the chemical process of respiration.; Muscles need more energy during exercise; cellular respiration releases energy from food.

Reply (untrusted model output):

```text
Nahin, hamaare shareer mein aane wala oxygen aur nikalne wala carbon dioxide, yehi hai breathing. Cellular respiration hai yeh process jismein hume energy milti hai, jo ki food se hoti hai.
```
