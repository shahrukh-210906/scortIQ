# ScortIQ AI without a paid API

Updated 15 October 2026. This guide separates running a model, retrieving teaching material and fine-tuning. They are different jobs.

## What your laptop can do

The current laptop has about 16 GB system RAM, an Intel i7-14700HX and an NVIDIA RTX 4060 Laptop GPU with about 8 GB GPU memory. Ollama is installed, along with `llama3.1:latest` and a larger vision model. Start with the existing text model; this avoids a download or API purchase. GPU memory is shared with other applications, so speed and available capacity vary.

Running this model locally does not require paid API calls. The laptop still needs power and enough memory. A public application serving many simultaneous students needs an appropriate inference host; free local testing does not establish free classroom-scale hosting. Supabase authentication and database hosting do not run or train the tutor model.

The local connection has been tested through the app. All five trial requests returned valid JSON and accepted source IDs, but quality checks found an incorrect Physics answer and weak Hindi terminology. This is an experimental baseline, not an approved teaching model. See [the initial observations](ml/local_baseline_smoke.md). No fine-tuning has been performed.

## Lesson 1: connect a model before training

An existing instruction model already knows how to generate text. We supply the topic material, language preference and teacher support at request time. First measure how well this baseline behaves before deciding whether it needs training.

The app currently connects through these values in ignored `backend/.env`:

```dotenv
HF_ENDPOINT_URL=http://127.0.0.1:11434
HF_TOKEN=local-ollama
HF_MODEL_ID=llama3.1:latest
```

The names come from the original Hugging Face integration, but the development backend can use a compatible local endpoint. `local-ollama` is a placeholder, not a purchased key: the local Ollama endpoint ignores authentication. Do not append `/v1` to this app's base URL; the backend adds `/v1/chat/completions` itself. Keep the existing Supabase settings in the same file.

After a reboot, launch Ollama and warm up the model:

```powershell
ollama run llama3.1:latest
```

Type a short question, then `/bye` to exit the terminal conversation. The initial model load can be slow. The app currently has a 45-second provider timeout, so warming up before opening a lesson helps. Start the app from the project folder:

```powershell
.\scripts\start.ps1
```

If the preview is already running, restart its backend after changing environment values rather than starting another process on the same port. Open a lesson's AI learning stage and ask a question. The server sends source passages and demands a JSON reply with source IDs; invalid responses become recoverable errors rather than fabricated successful replies. Local HTTP is development-only; the production configuration requires HTTPS inference and a managed database.

Reference: [Ollama's local compatible API](https://docs.ollama.com/api/openai-compatibility) and [Windows setup](https://docs.ollama.com/windows).

## Lesson 2: give the tutor a textbook to consult

Retrieval-augmented generation, or RAG, means finding relevant source passages and sending them alongside the student's question. It is like giving a teacher an open book during the lesson. It does not change model weights.

ScortIQ already retrieves versioned passages for the selected topic, supplies them to the tutor and checks that cited IDs belong to those passages. The current passages are original draft pilot notes, not a completed reviewed NCERT corpus. The four-subject chapter/topic catalogue is a planning map, not model training data or full textbook retrieval.

Next build one reviewed topic at a time: prepare material with appropriate rights, record its source/version, obtain educator review, then import it through `backend.import_sources`. Evaluate answers against the passage. Later improve retrieval if it misses useful material. Preserve mathematical symbols, chemical formulas, units and source IDs when teaching in Hindi or Hinglish.

Retrieval and valid citation IDs do not prove every generated claim is correct. Test whether the quoted material actually supports the answer. Current local checks are smoke tests, not educator approval.

## Lesson 3: understand fine-tuning

Fine-tuning teaches an existing model from examples. A good example shows the desired response to a student's question: an accurate explanation, an appropriate hint, a misconception correction, the chosen language and citations from supplied evidence.

For this app, fine-tuning should improve teaching style and response structure. Keep changing textbook facts in the retrieval collection so they can be reviewed and updated separately.

LoRA trains a small set of additional parameters instead of every parameter of the base model. QLoRA uses a quantized base model to reduce memory use. Neither is the same as building a foundation model from scratch. The existing `ml/train.py` is an experimental QLoRA entry point, not a model that has already been trained or validated on this laptop. Reference: [Hugging Face LoRA explanation](https://huggingface.co/docs/peft/main/en/conceptual_guides/lora).

Your 8 GB GPU suggests starting a training experiment with a smaller model, short sequences and a small batch. For example, [Qwen2.5-1.5B-Instruct](https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct) is a smaller instruction model with an Apache 2.0 license. This is a candidate to benchmark, not a promise of memory fit or better tutoring than the installed Llama model. Test the exact training environment and settings before a long run.

Free Colab can be another place to learn GPU training when a GPU is available. Access, duration and capacity are not guaranteed, and it should not be treated as permanent app hosting. See [Colab's resource and usage limits](https://research.google.com/colaboratory/faq.html).

## Lesson 4: prepare teaching examples

Begin with a narrow topic and a modest experimental dataset rather than downloading an entire textbook into a training file. As an initial experiment, aim for a few hundred original, educator-reviewed conversations; this is a planning suggestion, not a proven minimum for quality.

Include English, Hindi and Hinglish examples; questions written in one language with replies requested in another; incomplete student answers; mistakes about units and subscripts; requests outside the provided evidence; teacher support settings; and one guiding question at a time. Training examples must supply their citation evidence so the model learns to use given IDs rather than memorise fixed citations.

Use separate training, validation and final test sets. Group by question family or chapter so paraphrases of the same example do not leak between sets. Validation helps choose settings; the final test measures the chosen model without further tuning on that test.

The current training reader requires each JSONL record to contain:

- `id`: unique example identifier.
- `split_group`: question-family/chapter group used to prevent overlap.
- `source_id`: actual source of the teaching content.
- `license`: verified permission or rights information.
- `reviewer`: the person who reviewed the example.
- `reviewed`: true only after review actually occurred.
- `messages`: system/user/assistant conversation, ending with the desired assistant response.

The assistant message must use the app's response format, for example `{"reply":"...","citations":["a-provided-passage-id"]}`. Metadata strings alone do not establish content rights or review. Keep draft examples unapproved until review is complete. Training does not happen automatically from student conversations or Supabase records.

## Lesson 5: run a small training experiment

After preparing the reviewed datasets, choose the model and pin its exact repository commit. Install `ml/requirements.txt` in a separate training environment so ML package changes do not affect the web backend. CUDA-enabled PyTorch and the quantization packages must work together; the current entry point requires CUDA and bfloat16 support.

First validate the data without loading a model:

```powershell
python ml/train.py --model MODEL_ID --revision MODEL_COMMIT_HASH --train TRAIN.jsonl --validation VALIDATION.jsonl --validate-only
```

Replace those uppercase placeholders with your actual model revision and dataset paths. The files do not exist yet. When validation and the GPU environment pass, run the same command without `--validate-only` to train an adapter. Record the model revision, package versions, dataset versions, settings and evaluation results. An out-of-memory error means the experiment needs smaller settings or another runtime, not an API purchase.

Compare the base model plus retrieval against the fine-tuned version of the same base model plus the same retrieval. Check factual correctness, language, mathematical steps, hint quality, uncertainty and JSON/citation validity. A model that memorises training answers or gains style while losing accuracy should not replace the baseline.

## Lesson 6: use the trained model in the app

The training script saves an adapter, not necessarily a complete Ollama-ready model. Merge/export the adapter with its exact base model using a compatible toolchain, convert/quantize if necessary, then import the supported model into Ollama. Re-evaluate the exported artifact: quantization and deployment can change behavior.

For a prepared GGUF file, a Modelfile would contain:

```text
FROM ./scortiq-tutor.gguf
```

Then:

```powershell
ollama create scortiq-tutor -f Modelfile
ollama run scortiq-tutor
```

These steps require an exported file; no such trained model exists yet. After it passes evaluation, change `HF_MODEL_ID` to `scortiq-tutor` in the backend configuration and restart the backend. Keep the prior model available for rollback. Reference: [Ollama model import](https://docs.ollama.com/import).

The practical order is: local baseline → reviewed topic retrieval → frozen teaching benchmark → reviewed training examples → small fine-tuning experiment → export and re-test → app deployment. Subjective exam grading needs a separate reviewed rubric and evaluation; a working chat model is not an automatic reliable examiner.

## First benchmark is available

The frozen draft benchmark now has 42 cases across the seven Science pilot topics and three teaching languages. [Read the first report](ml/evaluations/llama31-pilot-v1-run1/report.md), [the runner instructions](ml/benchmarks/README.md), or the blank [human review sheet](ml/evaluations/llama31-pilot-v1-run1/human-review.csv). The local model produced 39 app-accepted replies and three rejected requests. Exactly one question mark appeared in only four replies; five Hindi replies missed the basic Devanagari signal. These counts are mechanical indicators, not factual accuracy or fluency grades.

The next step is reviewing the expected facts and model replies, not training on these answers. The training entry point now rejects overlapping benchmark IDs, question families and exact question text. This protects the holdout but cannot detect all paraphrases or mislabeled examples. No fine-tuning has been performed.
