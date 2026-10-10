import { useState, type FormEvent } from 'react';
import { post } from './api';

export default function ReflectionAnswer({
  lessonId,
  initialAnswer,
}: {
  lessonId: string;
  initialAnswer: string;
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [savedAnswer, setSavedAnswer] = useState(initialAnswer);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const result = await post<{ answer: string }>(`/lessons/${lessonId}/reflection`, { answer });
      setAnswer(result.answer);
      setSavedAnswer(result.answer);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save your answer. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="reflection-answer" onSubmit={(event) => void save(event)}>
      <label htmlFor="reflection-answer">Your answer, in your own words</label>
      <textarea
        id="reflection-answer"
        value={answer}
        onChange={(event) => {
          setAnswer(event.target.value);
          setSaved(false);
        }}
        rows={4}
        maxLength={4000}
        required
        disabled={busy}
        aria-describedby="reflection-help"
      />
      <p id="reflection-help">
        Save up to 4,000 characters and come back to revise them. This answer isn’t graded.
      </p>
      <button
        className="button primary"
        disabled={busy || !answer.trim() || answer.trim() === savedAnswer}
      >
        {busy ? 'Saving answer…' : 'Save my answer'}
      </button>
      {saved && <p role="status">Your answer is saved.</p>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </form>
  );
}
