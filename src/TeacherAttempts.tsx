import { useEffect, useState, type FormEvent } from 'react';
import { api, type Result } from './api';

type History = {
  student_name: string;
  topic_title: string;
  count: number;
  best_score: number | null;
  latest_score: number | null;
  total_questions: number;
  offset: number;
  page_size: number;
  attempts: (Omit<Result, 'review'> & {
    id: string;
    started_at: number;
    review: (Result['review'][number] & { selected_answer: string })[];
  })[];
};
type AssignedTopic = { classroom_id: string; topic_id: string; topic_title: string };

export default function TeacherAttempts({
  classroomId,
  students,
  revision,
}: {
  classroomId: string;
  students: { id: string; name: string }[];
  revision: number;
}) {
  const [topics, setTopics] = useState<AssignedTopic[]>([]);
  const [studentId, setStudentId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [history, setHistory] = useState<History | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setHistory(null);
    api<AssignedTopic[]>('/assignments')
      .then((data) => {
        if (active)
          setTopics([
            ...new Map(
              data
                .filter((item) => item.classroom_id === classroomId)
                .map((item) => [item.topic_id, item]),
            ).values(),
          ]);
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
  }, [classroomId, revision, retry]);
  const validStudent = students.some((student) => student.id === studentId);
  const validTopic = topics.some((topic) => topic.topic_id === topicId);
  const prefix = `history-${classroomId}`;
  async function review(offset = 0) {
    setBusy(true);
    setError('');
    setHistory(null);
    try {
      setHistory(
        await api<History>(
          `/classrooms/${classroomId}/students/${studentId}/attempts?topic_id=${encodeURIComponent(topicId)}&offset=${offset}`,
        ),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void review();
  }
  return (
    <details className="teacher-attempts classroom-form">
      <summary>Review topic quiz attempts</summary>
      <p>
        Review submitted recall quizzes for current students and active assigned topics. Earlier
        personal practice on the same topic is included.
      </p>
      {loading && <p role="status">Loading assigned topics…</p>}
      {!loading && !students.length && <p>Invite students to review their practice.</p>}
      {!loading && students.length > 0 && topics.length === 0 && !error && (
        <p>Share a topic study task first, then review its quiz attempts here.</p>
      )}
      {!loading && students.length > 0 && topics.length > 0 && (
        <form onSubmit={submit}>
          <label htmlFor={`${prefix}-student`}>Student to review</label>
          <select
            id={`${prefix}-student`}
            required
            disabled={busy}
            value={validStudent ? studentId : ''}
            onChange={(e) => {
              setStudentId(e.target.value);
              setHistory(null);
              setError('');
            }}
          >
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <label htmlFor={`${prefix}-topic`}>Assigned topic to review</label>
          <select
            id={`${prefix}-topic`}
            required
            disabled={busy}
            value={validTopic ? topicId : ''}
            onChange={(e) => {
              setTopicId(e.target.value);
              setHistory(null);
              setError('');
            }}
          >
            <option value="">Choose an assigned topic</option>
            {topics.map((topic) => (
              <option key={topic.topic_id} value={topic.topic_id}>
                {topic.topic_title}
              </option>
            ))}
          </select>
          <button className="button primary" disabled={busy || !validStudent || !validTopic}>
            {busy ? 'Loading attempts…' : 'Review attempts'}
          </button>
        </form>
      )}
      {busy && <p role="status">Loading quiz evidence…</p>}
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button
            className="text-button"
            disabled={busy}
            onClick={() => setRetry((value) => value + 1)}
          >
            Reload review topics
          </button>
        </div>
      )}
      {history && validStudent && validTopic && (
        <section className="attempt-history" aria-label="Student quiz evidence">
          <h3>
            {history.student_name} · {history.topic_title}
          </h3>
          <p>
            {history.count} submitted recall {history.count === 1 ? 'attempt' : 'attempts'}
          </p>
          {history.count > 0 ? (
            <>
              <p>
                Latest: {history.latest_score} / {history.total_questions} · Best:{' '}
                {history.best_score} / {history.total_questions}
              </p>
              <p>
                Showing {Math.min(history.offset + 1, history.count)}–
                {Math.min(history.offset + history.attempts.length, history.count)} of{' '}
                {history.count}, newest first.
              </p>
              {history.attempts.map((attempt) => (
                <details className="attempt-evidence" key={attempt.id}>
                  <summary>
                    Recall score {attempt.score} / {attempt.total} · Started{' '}
                    {new Date(attempt.started_at * 1000).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                    })}{' '}
                    IST
                  </summary>
                  {attempt.review.map((question) => (
                    <article className="question-evidence" key={question.id}>
                      <h4>{question.prompt}</h4>
                      <p>
                        <strong>{question.is_correct ? 'Correct' : 'Needs another look'}</strong>
                      </p>
                      <p>Student chose: {question.selected_answer}</p>
                      <p>Expected answer: {question.correct_answer}</p>
                      <p>{question.reason}</p>
                    </article>
                  ))}
                </details>
              ))}
              <div className="attempt-pagination">
                <button
                  className="button secondary"
                  disabled={busy || history.offset === 0}
                  onClick={() => void review(Math.max(0, history.offset - history.page_size))}
                >
                  Newer attempts
                </button>
                <button
                  className="button secondary"
                  disabled={busy || history.offset + history.page_size >= history.count}
                  onClick={() => void review(history.offset + history.page_size)}
                >
                  Older attempts
                </button>
              </div>
            </>
          ) : (
            <p>No submitted recall quizzes yet. Started and unfinished quizzes are excluded.</p>
          )}
          <p>These draft practice results help plan support; they are not formal exam marks.</p>
        </section>
      )}
    </details>
  );
}
