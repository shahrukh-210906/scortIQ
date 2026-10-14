# Local baseline observations — 15 October 2026

Runtime: installed Ollama 0.40.3, existing `llama3.1:latest`, RTX 4060 Laptop GPU (about 8 GB), 16 GB RAM. The app uses original draft pilot sources and its normal grounded tutor endpoint. These are manual development observations, not an educator-reviewed benchmark.

The app's five final trial requests returned HTTP 200 with valid reply JSON and passage IDs from the retrieved evidence. Warm first-topic requests took roughly 1.3–1.6 seconds. Initial loading was substantially slower. No paid inference provider was used, no model was downloaded and no training was run.

| Trial | Observation |
|---|---|
| Melting ice, English | Correctly said water remains the same substance; omitted the requested guiding question. |
| Melting ice, Hindi | Used Devanagari, but translated physical change as bodily change and described remaining in the same form. Terminology and explanation need correction. |
| Melting ice, Hinglish | Mixed Roman Hindi and English and identified that no new substance forms. Teaching depth was limited. |
| Reflection, Hindi | Incorrectly answered 20° for a ray 20° from the mirror surface. The draft source says 70°, because the normal is perpendicular to the surface. Also used Roman Hindi instead of the requested Devanagari. |
| Balancing water formation, Hinglish | Asked a guided question in mixed language without explaining coefficients. Requires evaluation of whether this is a useful hint for the student's request. |

Earlier smoke checks returned English for all three teaching languages. The server policy was made more explicit about the JSON reply language while preserving equations, units, grounding and source IDs. The final checks show that this helps but does not ensure factual correctness or reliable language adherence.

Decision: use this connection for local experimentation only. Do not label the model educator-approved or use it to issue subjective exam marks. Build a frozen benchmark spanning the seven pilot topics and three languages, compare candidate base models with the same evidence, then decide whether fine-tuning improves the measured weaknesses. Correct citations alone are not a factual-support check.
