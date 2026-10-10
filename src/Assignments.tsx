import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, post, type Curriculum, type User } from './api';

type Practice = {
  started: boolean;
  notes_completed: boolean;
  activity_required: boolean;
  activity_completed: boolean;
  recall_submitted: boolean;
  score: number | null;
  total: number;
  practice_complete: boolean;
};
type Assignment = {
  id: string;
  classroom_id: string;
  classroom_name: string;
  topic_id: string;
  topic_title: string;
  subject: string;
  study_date: string;
  instructions: string;
  progress?: Practice;
  students?: { id: string; name: string; progress: Practice }[];
};
export function todayInIndia() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)!.value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}
function PracticeStatus({ progress }: { progress: Practice }) {
  return (
    <div className="assignment-progress">
      <strong>
        {progress.practice_complete
          ? 'Practice complete'
          : progress.started
            ? 'In progress'
            : 'Not started'}
      </strong>
      <span>Notes checklist: {progress.notes_completed ? 'complete' : 'pending'}</span>
      {progress.activity_required && (
        <span>Equation practice: {progress.activity_completed ? 'complete' : 'pending'}</span>
      )}
      <span>
        Recall: {progress.recall_submitted ? `${progress.score} / ${progress.total}` : 'pending'}
      </span>
    </div>
  );
}

export function AssignmentBoard({
  user,
  classroomId,
  revision = 0,
}: {
  user: User;
  classroomId?: string;
  revision?: number;
}) {
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  const [notice, setNotice] = useState('');
  const teacher = user.role === 'teacher';
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api<Assignment[]>('/assignments')
      .then((data) => {
        if (active)
          setItems(data.filter((item) => !classroomId || item.classroom_id === classroomId));
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
  const today = todayInIndia();
  return (
    <section
      className="assignment-board"
      aria-label={classroomId ? 'Classroom study tasks' : 'Assigned study'}
    >
      <div className="section-heading">
        <h2>{teacher ? 'Class study progress' : 'Your assigned study'}</h2>
        <button
          className="text-button"
          disabled={loading || busy}
          onClick={() => setRetry((value) => value + 1)}
        >
          Refresh study progress
        </button>
      </div>
      <p>
        Progress uses saved topic practice, including earlier work. A completed checklist and quiz
        do not confirm mastery.
      </p>
      <p role="status">{loading ? 'Loading study tasks…' : notice}</p>
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="text-button" onClick={() => setRetry((value) => value + 1)}>
            Retry study tasks
          </button>
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <p>
          {teacher
            ? 'No active study tasks. Assign a topic from Classrooms.'
            : 'No study tasks yet. Your teacher’s assignments will appear here.'}
        </p>
      )}
      {!loading &&
        items.map((item) => (
          <article className="panel assignment-card" key={item.id}>
            <p className="eyebrow">
              {item.classroom_name} · {item.subject}
            </p>
            <h3>{item.topic_title}</h3>
            <p>
              Study date: <time dateTime={item.study_date}>{item.study_date}</time> ·{' '}
              {item.study_date === today
                ? 'Today'
                : item.study_date > today
                  ? 'Upcoming'
                  : 'Earlier task'}
            </p>
            {item.instructions && <p className="assignment-instructions">{item.instructions}</p>}
            {teacher ? (
              <>
                <p>
                  {item.students?.filter((student) => student.progress.practice_complete).length ??
                    0}{' '}
                  / {item.students?.length ?? 0} students finished practice
                </p>
                {!item.students?.length && <p>No students enrolled yet.</p>}
                <ul className="assignment-students">
                  {item.students?.map((student) => (
                    <li key={student.id}>
                      <strong>{student.name}</strong>
                      <PracticeStatus progress={student.progress} />
                    </li>
                  ))}
                </ul>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true);
                    setError('');
                    setNotice('');
                    try {
                      await api(`/assignments/${item.id}`, { method: 'DELETE' });
                      setItems((previous) => previous.filter((row) => row.id !== item.id));
                      setNotice('Study task withdrawn. Saved learning progress is kept.');
                    } catch (e) {
                      setError((e as Error).message);
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Withdraw study task
                </button>
              </>
            ) : (
              <>
                {item.progress && <PracticeStatus progress={item.progress} />}
                <Link className="button secondary" to={`/lesson/${item.topic_id}`}>
                  {item.progress?.started ? 'Continue assigned topic' : 'Start assigned topic'}
                </Link>
              </>
            )}
          </article>
        ))}
    </section>
  );
}

export function AssignmentForm({
  classroomId,
  curriculum,
  onSaved,
}: {
  classroomId: string;
  curriculum: Curriculum;
  onSaved: () => void;
}) {
  const [topicId, setTopicId] = useState('');
  const [studyDate, setStudyDate] = useState(todayInIndia());
  const [instructions, setInstructions] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const prefix = `assignment-${classroomId}`;
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await post(`/classrooms/${classroomId}/assignments`, {
        topic_id: topicId,
        study_date: studyDate,
        instructions,
      });
      setNotice('Study task shared with your classroom.');
      setInstructions('');
      onSaved();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="classroom-form assignment-form">
      <h3>Assign a topic</h3>
      <p>Only the seven available draft pilot lessons can be assigned for now.</p>
      <form onSubmit={submit}>
        <label htmlFor={`${prefix}-topic`}>Topic to study</label>
        <select
          id={`${prefix}-topic`}
          required
          value={topicId}
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
        <label htmlFor={`${prefix}-date`}>Study date (India time)</label>
        <input
          type="date"
          id={`${prefix}-date`}
          required
          value={studyDate}
          onChange={(e) => setStudyDate(e.target.value)}
        />
        <label htmlFor={`${prefix}-instructions`}>Instructions (optional)</label>
        <textarea
          id={`${prefix}-instructions`}
          rows={3}
          maxLength={1000}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button className="button" disabled={busy || !topicId || !studyDate}>
          {busy ? 'Sharing…' : 'Share study task'}
        </button>
      </form>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p role="status">{notice}</p>
    </div>
  );
}
