# Draft local teaching benchmark

Run: 2026-10-15T06:36:50.070246+00:00
Model: `scortiq-socratic-v1`
Suite SHA-256: `5e3ef7d59fbaecc13fa12bb325adafd3a943082d1754c9496508201746b9164c`
Completed case requests: 8/42.

App accepted 5/8 replies. Factual grades: **not assessed; human review pending**.

Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.

| Language | Accepted | Language signal | One question mark |
|---|---:|---:|---:|
| en | 3/3 | 3 | 3 |
| hi | 0/3 | 0 | 0 |
| hinglish | 2/2 | 2 | 1 |

## Replies for review

### pilot-v1-melting-en
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice is a physical change because the substance (water) remains the same, just changing from solid to liquid. No new substances are formed. What part of this explanation helps you answer the question?


```

### pilot-v1-melting-hi
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-melting-hinglish
Why is melting ice a physical change? Explain the reason and ask me one guiding question.

Expected: It remains water; no new substance forms.; Only the physical state changes.

Reply (untrusted model output):

```text
Melting ice is a physical change kyunki ice ko water mein kaise banaate hai, is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi naya substance nahi hota hai. Is process mein koi nay
```

### pilot-v1-bubbles-en
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
No, that's not correct. Boiling water produces bubbles, but it's a physical change because the water remains H2O. A chemical reaction produces new substances. Which part of this explanation helps you answer the question?


```

### pilot-v1-bubbles-hi
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```

### pilot-v1-bubbles-hinglish
I think every liquid that bubbles is undergoing a chemical reaction. Is that correct? Explain using boiling water.

Expected: Bubbles alone do not prove a chemical reaction.; Boiling water is a physical state change; it remains water.

Reply (untrusted model output):

```text
Nahi, koi bhi bura bhi chemical reaction nahi hota. Boiling water ke example me, kya hoga agar water ko heat karne par bubbles generate hote hain?

pilot-reactions-signs-v1:0
```

### pilot-v1-water-coefficients-en
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
We balance equations by changing coefficients, not subscripts. In H2 + O2 → H2O, we need 2 H2O to match 2 O atoms from O2. This gives 4 H atoms on both sides. Which part helps you see the atom count match in this explanation?
```

### pilot-v1-water-coefficients-hi
Balance H2 + O2 -> H2O and explain how the atoms match without changing formulas.

Expected: 2H2 + O2 -> 2H2O.; Both sides have four hydrogen atoms and two oxygen atoms; change coefficients only.

Reply (untrusted model output):

```text
The tutor could not respond reliably. Your lesson is saved; try again shortly.
```
