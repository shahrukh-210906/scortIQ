import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, post, ApiError, type Curriculum, type User } from './api';

type Exam = {
  id: string;
  topic_id: string;
  topic_title: string;
  exam_language: 'en' | 'hi';
  question_language: 'en' | 'hi';
  question: string;
  answer: string;
  revision: number;
  created_at: number;
  submitted_at: number | null;
  content_status: string;
  version: string;
  review?: {
    model_answer: string;
    key_terms: string[];
    writing_steps: string[];
    dont_forget: string;
    marking_note: string;
  };
};
type RecentExam = Pick<
  Exam,
  'id' | 'topic_title' | 'exam_language' | 'created_at' | 'submitted_at'
>;
const languageName = (value: string) => (value === 'hi' ? 'Hindi' : 'English');

export default function WritingPractice({
  user,
  curriculum,
}: {
  user: User;
  curriculum: Curriculum;
}) {
  const [topicId, setTopicId] = useState('');
  const [recent, setRecent] = useState<RecentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api<RecentExam[]>('/writing/exams')
      .then((data) => {
        if (active) setRecent(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  async function start(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const exam = await post<Exam>('/writing/exams', { topic_id: topicId });
      navigate(`/writing/${exam.id}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="writing-page">
      <p className="eyebrow">Practise explaining what you know</p>
      <h1>Written practice exams</h1>
      <p>
        Start anytime. Write one topic answer, save your draft and compare your submitted work with
        draft exam-writing guidance.
      </p>
      <section className="panel classroom-form">
        <h2>Start a written exam</h2>
        <p>
          Answer language: {languageName(user.exam_language)}. Change it in{' '}
          <Link className="text-link" to="/settings">
            Settings
          </Link>{' '}
          before starting.
        </p>
        <p>
          This pilot offers seven draft topic questions. There are no official marks, reviewed
          rubrics or AI grading yet.
        </p>
        <form onSubmit={start}>
          <label htmlFor="writing-topic">Written exam topic</label>
          <select
            id="writing-topic"
            required
            value={topicId}
            disabled={busy}
            onChange={(e) => setTopicId(e.target.value)}
          >
            <option value="">Choose an available topic</option>
            {curriculum.chapters.map((chapter) => (
              <optgroup key={chapter.id} label={`${chapter.subject} · ${chapter.title}`}>
                {chapter.topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button className="button primary" disabled={busy || !topicId}>
            {busy ? 'Opening exam…' : 'Start written exam'}
          </button>
        </form>
      </section>
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="text-button" onClick={() => setRetry((value) => value + 1)}>
            Reload written exams
          </button>
        </div>
      )}
      <section className="panel">
        <h2>Your recent written exams</h2>
        {loading && <p role="status">Loading saved exams…</p>}
        {!loading && recent.length === 0 && (
          <p>No written exams yet. Choose a topic to try your first answer.</p>
        )}
        <ul className="writing-history">
          {recent.map((exam) => (
            <li key={exam.id}>
              <div>
                <h3>{exam.topic_title}</h3>
                <p>
                  {exam.submitted_at ? 'Submitted' : 'Draft'} · {languageName(exam.exam_language)} ·
                  Started{' '}
                  {new Date(exam.created_at * 1000).toLocaleDateString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                  })}
                </p>
              </div>
              <Link className="button secondary" to={`/writing/${exam.id}`}>
                {exam.submitted_at ? 'Review written answer' : 'Resume written draft'}
              </Link>
            </li>
          ))}
        </ul>
        <p>Your latest 20 exams are shown.</p>
      </section>
    </div>
  );
}

export function WritingExamRoute() {
  const { examId } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setExam(null);
    setError('');
    api<Exam>(`/writing/exams/${examId}`)
      .then((data) => {
        if (active) setExam(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [examId, retry]);
  if (error)
    return (
      <div className="error" role="alert">
        <p>{error}</p>
        <button className="text-button" onClick={() => setRetry((value) => value + 1)}>
          Retry written exam
        </button>
        <Link className="text-link" to="/writing">
          Back to written exams
        </Link>
      </div>
    );
  if (!exam) return <p role="status">Opening written exam…</p>;
  return <WritingEditor key={exam.id} initial={exam} />;
}

function readDraft(id: string): { answer: string; revision: number } | null {
  try {
    const value = JSON.parse(localStorage.getItem(`scortiq-writing-${id}`) ?? 'null');
    return value &&
      typeof value.answer === 'string' &&
      value.answer.length <= 12000 &&
      Number.isInteger(value.revision) &&
      value.revision >= 0
      ? value
      : null;
  } catch {
    return null;
  }
}
function WritingEditor({ initial }: { initial: Exam }) {
  const [backup] = useState(() => (initial.submitted_at ? null : readDraft(initial.id)));
  const [exam, setExam] = useState(initial);
  const [answer, setAnswer] = useState(backup?.answer ?? initial.answer);
  const [conflict, setConflict] = useState(
    !!backup && backup.revision !== initial.revision && backup.answer !== initial.answer,
  );
  const [error, setError] = useState(
    backup && backup.revision !== initial.revision && backup.answer !== initial.answer
      ? 'Your browser draft differs from the saved answer in another window. Your text is kept below; copy it before loading the saved answer.'
      : '',
  );
  const [backupError, setBackupError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const answerRef = useRef(answer);
  const revisionRef = useRef(
    backup && backup.answer !== initial.answer ? backup.revision : initial.revision,
  );
  const storageKey = `scortiq-writing-${initial.id}`;
  function keepBackup(text: string, revision: number) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answer: text, revision }));
      setBackupError('');
    } catch {
      setBackupError(
        'Browser backup is unavailable. Keep this page open until your answer is saved.',
      );
    }
  }
  function clearBackup() {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* Server persistence remains available. */
    }
  }
  useEffect(() => {
    if (exam.submitted_at || answer === exam.answer) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [answer, exam.answer, exam.submitted_at]);
  useEffect(() => {
    if (exam.submitted_at || saving || submitting || error || conflict || answer === exam.answer)
      return;
    const timer = window.setTimeout(async () => {
      setSaving(true);
      try {
        const saved = await api<Exam>(`/writing/exams/${exam.id}/answer`, {
          method: 'PUT',
          body: JSON.stringify({ answer, revision: exam.revision }),
        });
        setExam(saved);
        revisionRef.current = saved.revision;
        if (answerRef.current === saved.answer) clearBackup();
        else keepBackup(answerRef.current, saved.revision);
      } catch (e) {
        setError((e as Error).message);
        setConflict(e instanceof ApiError && e.status === 409);
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [
    answer,
    exam.id,
    exam.answer,
    exam.revision,
    exam.submitted_at,
    saving,
    submitting,
    error,
    conflict,
  ]);
  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      const saved = await post<Exam>(`/writing/exams/${exam.id}/submit`, {
        answer,
        revision: exam.revision,
      });
      setExam(saved);
      clearBackup();
    } catch (e) {
      setError((e as Error).message);
      setConflict(e instanceof ApiError && e.status === 409);
    } finally {
      setSubmitting(false);
    }
  }
  async function loadSaved() {
    setSaving(true);
    try {
      const saved = await api<Exam>(`/writing/exams/${exam.id}`);
      setExam(saved);
      setAnswer(saved.answer);
      answerRef.current = saved.answer;
      revisionRef.current = saved.revision;
      clearBackup();
      setError('');
      setConflict(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="writing-page">
      <Link className="text-link" to="/writing">
        Back to written exams
      </Link>
      <p className="eyebrow">Draft Class 10 written practice</p>
      <h1>{exam.topic_title}</h1>
      <p>
        Write your answer in {languageName(exam.exam_language)}. This language is saved for this
        attempt.
      </p>
      {exam.question_language !== exam.exam_language && (
        <p>
          This draft question and guidance are available in English; you can still answer in Hindi.
        </p>
      )}
      <section className="panel writing-answer">
        <h2>Written question</h2>
        <p className="written-question" lang={exam.question_language}>
          {exam.question}
        </p>
        <label htmlFor="written-answer">Your written answer</label>
        <textarea
          id="written-answer"
          rows={10}
          maxLength={12000}
          lang={exam.exam_language}
          readOnly={!!exam.submitted_at}
          disabled={submitting}
          value={answer}
          onChange={(e) => {
            answerRef.current = e.target.value;
            setAnswer(e.target.value);
            keepBackup(e.target.value, revisionRef.current);
          }}
        />
        <p role="status" aria-atomic="true">
          {exam.submitted_at
            ? 'Written answer submitted. This attempt is now read-only.'
            : saving
              ? 'Saving written answer…'
              : error
                ? 'Answer not saved. Your draft is kept in this page.'
                : answer === exam.answer
                  ? 'Written answer saved.'
                  : 'Unsaved changes — autosaving shortly.'}
        </p>
        <p>{answer.length} / 12,000 characters</p>
        {backupError && (
          <p className="error" role="alert">
            {backupError}
          </p>
        )}
        {error && (
          <div className="error" role="alert">
            <p>{error}</p>
            {conflict ? (
              <button
                className="button secondary"
                disabled={saving}
                onClick={() => void loadSaved()}
              >
                Load saved answer
              </button>
            ) : (
              <button className="button secondary" onClick={() => setError('')}>
                Retry saving answer
              </button>
            )}
          </div>
        )}
        {!exam.submitted_at && (
          <>
            <p>Submission locks this attempt. You can start a new one later to practise again.</p>
            <button
              className="button primary"
              disabled={
                saving ||
                submitting ||
                !!error ||
                conflict ||
                answer !== exam.answer ||
                !answer.trim()
              }
              onClick={() => void submit()}
            >
              {submitting ? 'Submitting…' : 'Submit written answer'}
            </button>
          </>
        )}
      </section>
      {exam.review && (
        <section className="panel writing-review">
          <p className="eyebrow">Self-review · draft guidance</p>
          <h2>Review your written answer</h2>
          <p>No marks or AI feedback have been issued.</p>
          <h3>Example answer</h3>
          <p lang={exam.question_language}>{exam.review.model_answer}</p>
          <h3>Terms to consider</h3>
          <p>{exam.review.key_terms.join(' · ')}</p>
          <h3>Check your writing</h3>
          <ul>
            {exam.review.writing_steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p>{exam.review.dont_forget}</p>
          <p>{exam.review.marking_note}</p>
        </section>
      )}
    </div>
  );
}
