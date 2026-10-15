# Connected local pilot result

Selected: locally trained Gemma 3 4B QLoRA adapter, plus application-controlled Socratic steps and source-guided pilot explanations. This is an experimental development configuration, not educator approval of model outputs.

Training used 120 examples and 17 validation examples across English, Hindi and Hinglish, from the attributed public Dolly/IndicInstruct subset and original tutoring examples. No student chats were used. The broader prepared subset contains 682 training and 71 validation examples. Related source/language families stay in the same split. Shared generic retry wording means validation loss is not an independent teaching-quality test.

Pinned model: `unsloth/gemma-3-4b-it-bnb-4bit`, revision `eb03c885bc2cc913fe792994bc766006f14ad72d`. One epoch, 30 updates, rank 4 language q/v adapters, learning rate 0.00001, completion-only loss, seed 42. Training took 126.49 seconds. Validation loss changed from 4.26284 to 4.20753. This does not establish scientific accuracy. Full parameters and hashes are in `training_metadata.json`.

Raw Gemma adapter inference returned accepted structured responses in 42/42 cases, but inspection found factual errors. Qwen 4B and 8B candidates also made factual or Hindi terminology errors; they were not selected. Their complete and failed protocol runs are retained in adjacent evaluation directories. Initial Gemma base inference failed due to a runtime template incompatibility; the native-template run supersedes it. Acceptance counts are protocol checks, not factual grades.

The final source-guided run accepted **41/42** requests: English 14/14, Hindi 14/14, Hinglish 13/14. One Hinglish request returned a retryable provider error. All results and blank human review sheets remain in `source-guided-pilot/`. The frozen benchmark was excluded from training but used for model selection, so it is not an untouched final test. Human correctness and fluency review is pending.

Because fine-tuning did not reliably fix facts, the final app uses exact versioned lesson passages and authored language renderings for seven pilot topics. Reflection-angle questions use checked arithmetic. UI labels disclose this. These guard improvements must not be attributed to the adapter alone. Pilot source content remains draft; full reviewed CBSE 2026–27 coverage is unfinished.

Saved checkpoint state prevents chat claims or reloads skipping steps. Correct multiple-choice answers are a limited comprehension signal. Private explanation-style feedback is separate adaptive selection, not online neural reinforcement learning.

Verification: 54 backend regression tests passed; the production frontend built successfully. Runtime setup, artifact identity and license links are in `../../LOCAL_TUTOR.md`.
