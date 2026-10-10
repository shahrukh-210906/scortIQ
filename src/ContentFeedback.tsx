import { useState, type FormEvent } from 'react';
import { post } from './api';

export default function ContentFeedback({ topicId }: { topicId: string }) {
  const [category, setCategory] = useState('confusing');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await post('/feedback', { topic_id: topicId, category, message });
      setSaved(true);
      setMessage('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not save your report. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="content-feedback">
      <summary>Report an issue with this lesson</summary>
      {saved ? (
        <p role="status">
          Your report has been saved for review. Thank you for helping improve this lesson.
        </p>
      ) : (
        <form onSubmit={(event) => void submit(event)}>
          <label htmlFor="feedback-category">What needs attention?</label>
          <select
            id="feedback-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={busy}
          >
            <option value="confusing">The explanation is confusing</option>
            <option value="incorrect">Something seems incorrect</option>
            <option value="other">Another issue</option>
          </select>
          <label htmlFor="feedback-message">Tell us what you noticed</label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            minLength={10}
            maxLength={2000}
            rows={4}
            required
            disabled={busy}
            aria-describedby="feedback-help"
          />
          <p id="feedback-help">
            Use 10–2,000 characters. Please leave out personal or contact details.
          </p>
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          <button className="button primary" disabled={busy || message.trim().length < 10}>
            {busy ? 'Saving report…' : 'Send report'}
          </button>
        </form>
      )}
    </details>
  );
}
