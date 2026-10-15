import { useEffect, useState } from 'react';
import { api, post } from './api';

const names: Record<string, string> = {
  step_by_step: 'Step by step',
  worked_example: 'Worked example',
  short_explanation: 'Short explanation',
};
type Memory = {
  enabled: boolean;
  styles: { topic_id: string; style: string; helpful: number; unhelpful: number }[];
};

export default function AdaptiveTutoring() {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');
    api<Memory>('/me/adaptation')
      .then((value) => {
        if (active) setMemory(value);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  async function change(enabled: boolean) {
    const previous = memory;
    if (memory) setMemory({ ...memory, enabled });
    setBusy(true);
    setError('');
    setNotice('');
    try {
      setMemory(
        await api<Memory>('/me/adaptation', { method: 'PUT', body: JSON.stringify({ enabled }) }),
      );
      setNotice(
        enabled
          ? 'Adaptive tutoring enabled for your account.'
          : 'Adaptive tutoring is off. Saved feedback is not being used.',
      );
    } catch (e) {
      setMemory(previous);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel adaptation-panel">
      <h2>Adaptive tutoring</h2>
      <p>
        Let the tutor try explanation styles based on what you say helps, separately for each topic.
        This is an experimental preference policy, not a diagnosis of how you learn.
      </p>
      {!memory && !error && <p role="status">Loading explanation preferences…</p>}
      {memory && (
        <>
          <label className="adaptation-option">
            <input
              type="checkbox"
              checked={memory.enabled}
              disabled={busy}
              onChange={(e) => void change(e.target.checked)}
            />
            Remember which explanations help me
          </label>
          <p>
            Feedback stays with your account. It does not retrain the shared AI, change quiz marks
            or override teacher requests for more support.
          </p>
          <p>
            Turning this off stops using and collecting feedback. Forgetting removes its saved
            ratings and preferences.
          </p>
          <ul>
            {memory.styles.map((row) => (
              <li key={`${row.topic_id}-${row.style}`}>
                {row.topic_id} · {names[row.style] ?? row.style}: {row.helpful} helpful,{' '}
                {row.unhelpful} requests for another approach
              </li>
            ))}
          </ul>
          <button
            className="button secondary"
            disabled={busy || (!memory.enabled && memory.styles.length === 0)}
            onClick={async () => {
              setBusy(true);
              setError('');
              setNotice('');
              try {
                setMemory(await api<Memory>('/me/adaptation', { method: 'DELETE' }));
                setNotice(
                  'Explanation preferences forgotten. Adaptive tutoring is off. Your lessons and quizzes are kept.',
                );
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Forget explanation preferences
          </button>
        </>
      )}
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="text-button" onClick={() => setRetry((value) => value + 1)}>
            Reload explanation preferences
          </button>
        </div>
      )}
      {(busy || notice) && <p role="status">{busy ? 'Saving explanation preferences…' : notice}</p>}
    </section>
  );
}

export function TutorFeedback({
  lessonId,
  turnIndex,
  style,
  initial,
}: {
  lessonId: string;
  turnIndex: number;
  style: string;
  initial?: boolean;
}) {
  const [rating, setRating] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function send(helpful: boolean) {
    setBusy(true);
    setError('');
    try {
      const result = await post<{ helpful: boolean }>(`/lessons/${lessonId}/tutor-feedback`, {
        turn_index: turnIndex,
        helpful,
      });
      setRating(result.helpful);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="tutor-feedback">
      <p>Explanation style: {names[style] ?? style}</p>
      {typeof rating === 'boolean' ? (
        <p role="status">
          {rating
            ? 'Saved: this explanation helped.'
            : 'Saved: try a different approach next time.'}
        </p>
      ) : (
        <fieldset disabled={busy}>
          <legend>Did this explanation help?</legend>
          <button className="text-button" onClick={() => void send(true)}>
            This explanation helped
          </button>
          <button className="text-button" onClick={() => void send(false)}>
            Try a different approach
          </button>
        </fieldset>
      )}
      {busy && <p role="status">Saving your feedback…</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
