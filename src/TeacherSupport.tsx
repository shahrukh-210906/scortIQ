import { useEffect, useState, type FormEvent } from 'react';
import { api, type Curriculum } from './api';

type Support = { simple_language: boolean; more_detail: boolean; extra_practice: boolean };
type SavedSupport = Support & { student_id: string; topic_id: string };
const defaults: Support = { simple_language: false, more_detail: false, extra_practice: false };
const labels: Record<keyof Support, string> = {
  simple_language: 'Use simpler language',
  more_detail: 'Explain in smaller steps with more detail',
  extra_practice: 'Offer extra guided practice',
};

export default function TeacherSupport({
  classroomId,
  students,
  curriculum,
}: {
  classroomId: string;
  students: { id: string; name: string }[];
  curriculum: Curriculum;
}) {
  const [rows, setRows] = useState<SavedSupport[]>([]);
  const [studentId, setStudentId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [options, setOptions] = useState<Support>(defaults);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    api<SavedSupport[]>(`/classrooms/${classroomId}/support`)
      .then((data) => {
        if (active) setRows(data);
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
  }, [classroomId, retry]);
  useEffect(() => {
    const saved = rows.find((row) => row.student_id === studentId && row.topic_id === topicId);
    setOptions(
      saved
        ? {
            simple_language: saved.simple_language,
            more_detail: saved.more_detail,
            extra_practice: saved.extra_practice,
          }
        : defaults,
    );
  }, [rows, studentId, topicId]);
  const selectedStudent = students.some((student) => student.id === studentId);
  const prefix = `support-${classroomId}`;
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const saved = await api<Support>(
        `/classrooms/${classroomId}/support/${studentId}/${topicId}`,
        { method: 'PUT', body: JSON.stringify(options) },
      );
      setRows((previous) => [
        ...previous.filter((row) => row.student_id !== studentId || row.topic_id !== topicId),
        { ...saved, student_id: studentId, topic_id: topicId },
      ]);
      setNotice('Support saved for this student and topic.');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <details className="teacher-support classroom-form">
      <summary>Personalise topic support</summary>
      <p>
        Choose support for one student and topic. Uncheck all options and save to restore your
        classroom’s default support.
      </p>
      {!students.length ? (
        <p>Invite a student before setting support.</p>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor={`${prefix}-student`}>Student for support</label>
          <select
            id={`${prefix}-student`}
            required
            disabled={busy || loading}
            value={selectedStudent ? studentId : ''}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
          <label htmlFor={`${prefix}-topic`}>Topic for support</label>
          <select
            id={`${prefix}-topic`}
            required
            disabled={busy || loading}
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
          <fieldset disabled={busy || loading || !selectedStudent || !topicId}>
            <legend>Support options</legend>
            {(Object.keys(labels) as (keyof Support)[]).map((field) => (
              <label className="support-option" key={field}>
                <input
                  type="checkbox"
                  checked={options[field]}
                  onChange={(e) =>
                    setOptions((previous) => ({ ...previous, [field]: e.target.checked }))
                  }
                />
                {labels[field]}
              </label>
            ))}
          </fieldset>
          <button
            className="button"
            disabled={busy || loading || !!error || !selectedStudent || !topicId}
          >
            {busy ? 'Saving support…' : 'Save topic support'}
          </button>
        </form>
      )}
      <p role="status">{loading ? 'Loading support settings…' : notice}</p>
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button
            className="text-button"
            disabled={busy}
            onClick={() => setRetry((value) => value + 1)}
          >
            Reload support settings
          </button>
        </div>
      )}
      <p>
        Support guides AI replies when the tutor is connected. Saved notes and quiz marking stay the
        same. Support from your other classrooms can also apply.
      </p>
    </details>
  );
}

export function StudentSupport({ lessonId, connected }: { lessonId: string; connected: boolean }) {
  const [support, setSupport] = useState<Support | null>(null);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setSupport(null);
    setError('');
    api<Support>(`/lessons/${lessonId}/support`)
      .then((data) => {
        if (active) setSupport(data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [lessonId, retry]);
  if (error)
    return (
      <div className="error" role="alert">
        <p>{error}</p>
        <button className="text-button" onClick={() => setRetry((value) => value + 1)}>
          Reload topic support
        </button>
      </div>
    );
  if (!support || !Object.values(support).some(Boolean)) return null;
  return (
    <section className="student-support" aria-label="Teacher support for this topic">
      <h3>Your teacher’s topic support</h3>
      <ul>
        {(Object.keys(labels) as (keyof Support)[])
          .filter((field) => support[field])
          .map((field) => (
            <li key={field}>{labels[field]}</li>
          ))}
      </ul>
      <p>
        {connected
          ? 'These choices guide your next AI reply in your preferred teaching language.'
          : 'These choices will guide AI tutoring when it is connected.'}
      </p>
    </section>
  );
}
