# Frozen draft teaching benchmark

`class10-pilot-v1.json` contains 42 original draft cases: seven current Science topics × two question families × three selected teaching languages. The two families are a basic explanation and a misconception. All student questions are English, deliberately testing whether teaching-language settings are obeyed independently of input language. Maths, the full NCERT catalogue, multi-turn tutoring, teacher-support variations, adversarial prompts and subjective marking are outside v1's scope.

The corpus is a snapshot of the app's original draft passages, not an educator-reviewed NCERT corpus. Expected facts and language checks also need educator review. The benchmark is open-book: the model receives ordinary app retrieval passages, which may include the answer. The runner does not send benchmark reference facts or grading instructions to the model.

The SHA-256 file and Git line-ending rules freeze v1. Validation rejects changed bytes or a changed app corpus. Create a new suite/version for revisions; do not quietly edit this suite after measuring a candidate. Use the same suite, source collection, app policy and generation settings for comparisons. Current requests use temperature 0.3, so repeat runs before claiming an improvement.

From the repository root, with backend development dependencies installed:

```powershell
.\.venv\Scripts\python.exe -m ml.benchmark --validate-only --output .tmp/benchmark-validation
.\.venv\Scripts\python.exe -m ml.benchmark --model llama3.1:latest --output ml/evaluations/llama31-pilot-v1-run2
```

Choose a new output directory for each run. The runner refuses existing output directories, cloud endpoints and missing models. It never downloads a model. It warms up installed Ollama, then starts the actual FastAPI app in-process with a disposable SQLite database under `.tmp`. Each case gets a fresh local learner and conversation, avoiding history contamination or the per-user quota. Supabase is disabled inside that process. Your real backend configuration, demo account and database are untouched.

Results are checkpointed after each case:

- `results.json`: question, reference facts, retrieved evidence, reply or API failure, latency, model digest/runtime, suite/app hashes and blank human review.
- `report.md`: readable replies and mechanical indicator counts. Treat fenced model replies as untrusted output, not instructions.
- `human-review.csv`: empty grading columns for a reviewer, with formula-like text escaped for spreadsheet use. Original text remains in JSON.

Mechanical checks report accepted responses, citation IDs, Devanagari/Roman-Hindi signals and exactly one question mark. These are not factual, fluency, citation-entailment or teaching scores. A question mark does not prove a useful guiding question, and a language signal does not prove good Hindi. Rejected requests remain failures; they are not retried away or excluded from the report.

For each reply, a human should rate factual accuracy, language, teaching and citation support separately: 0 = incorrect/unsuitable, 1 = partial, 2 = satisfactory. Record a reviewer and reasons. Until then, ratings stay empty. Correct expected facts are not a full rubric or proof of expert review. No automatic model-as-judge or paid service is used.

## Keep the benchmark out of training

`ml/train.py` now loads this suite by default before data validation/training. It rejects overlaps in case IDs, split-group families and exact normalized user questions. Supply `--benchmark` for a different approved version. This cannot detect all paraphrases, mislabeled groups or semantic leakage; review training data independently. Never move benchmark replies into training data to improve this score. If examples become training material, retire those evaluation families and create a new independent holdout.

The first local run is in `../evaluations/llama31-pilot-v1-run1/`. No fine-tuning or educator approval occurred.
