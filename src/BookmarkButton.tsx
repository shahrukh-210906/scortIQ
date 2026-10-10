import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { post } from './api';

export default function BookmarkButton({
  topicId,
  saved,
  refresh,
}: {
  topicId: string;
  saved: boolean;
  refresh: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function toggle() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await post(`/bookmarks/${topicId}`, { saved: !saved });
      await refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not update your review queue. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="bookmark-control">
      <button
        className="button secondary"
        aria-pressed={saved}
        disabled={busy}
        onClick={() => void toggle()}
      >
        <Bookmark size={17} aria-hidden="true" />
        {busy ? 'Updating…' : saved ? 'Remove from review' : 'Save for review'}
      </button>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}
