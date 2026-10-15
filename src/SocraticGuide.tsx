import { useState } from 'react';
import { post, type SocraticProgress } from './api';

export default function SocraticGuide({
  lessonId,
  progress,
  busy,
  connected,
  explain,
  onChange,
}: {
  lessonId: string;
  progress: SocraticProgress;
  busy: boolean;
  connected: boolean;
  explain: () => void;
  onChange: (value: SocraticProgress) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  async function check() {
    if (answer === null) return;
    setSaving(true);
    setError('');
    try {
      const result = await post<{ correct: boolean; feedback: string; socratic: SocraticProgress }>(
        `/lessons/${lessonId}/checkpoint`,
        { phase: progress.phase, answer },
      );
      onChange(result.socratic);
      setAnswer(null);
      setFeedback(result.feedback);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <section className="socratic-guide" aria-label="Guided understanding">
      <h3>
        {progress.complete ? progress.label : `Step ${progress.phase + 1} of 4 · ${progress.label}`}
      </h3>
      <ol>
        {progress.phases.map((phase, i) => (
          <li key={phase} aria-current={i === progress.phase ? 'step' : undefined}>
            {i < progress.phase ? '✓ ' : ''}
            {phase}
          </li>
        ))}
      </ol>
      <p>
        Explain → check → continue. If a check is incorrect, we stay here and try another
        explanation. Passing these short checks records practice, not mastery.
      </p>
      {!progress.complete && (
        <>
          <button
            className="button secondary"
            disabled={busy || saving || !connected}
            onClick={() => {
              setFeedback('');
              explain();
            }}
          >
            {busy ? 'Preparing your explanation…' : 'Explain this step'}
          </button>
          {progress.question && (
            <fieldset disabled={!progress.ready || busy || saving}>
              <legend>{progress.question}</legend>
              {progress.options.map((option, i) => (
                <label className="socratic-option" key={option}>
                  <input
                    type="radio"
                    name={`checkpoint-${lessonId}-${progress.phase}`}
                    checked={answer === i}
                    onChange={() => setAnswer(i)}
                  />
                  {option}
                </label>
              ))}
              <button
                className="button secondary"
                disabled={answer === null}
                onClick={() => void check()}
              >
                {saving ? 'Checking…' : 'Check understanding'}
              </button>
            </fieldset>
          )}
          {!progress.ready && (
            <p>
              Read the tutor's explanation first, then try the check. These pilot check options are
              in English; the tutor explains them in your teaching language.
            </p>
          )}
        </>
      )}
      {feedback && <p role="status">{feedback}</p>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </section>
  );
}
