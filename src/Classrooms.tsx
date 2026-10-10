import { useEffect, useState, type FormEvent } from 'react';
import { api, post, type User, type Curriculum } from './api';
import { AssignmentBoard, AssignmentForm } from './Assignments';
import TeacherSupport from './TeacherSupport';

type Classroom = {
  id: string;
  name: string;
  teacher_name: string;
  code_expires: number;
  students?: { id: string; name: string }[];
  join_code?: string;
};

export default function Classrooms({ user, curriculum }: { user: User; curriculum: Curriculum }) {
  const teacher = user.role === 'teacher';
  const [rooms, setRooms] = useState<Classroom[]>([]);
  const [value, setValue] = useState('');
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [assignmentRevision, setAssignmentRevision] = useState(0);
  async function load() {
    setRooms(await api<Classroom[]>('/classrooms'));
  }
  useEffect(() => {
    let active = true;
    api<Classroom[]>('/classrooms')
      .then((data) => {
        if (active) setRooms(data);
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
  }, []);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void run(async () => {
      const room = await post<Classroom>(
        teacher ? '/classrooms' : '/classrooms/join',
        teacher ? { name: value.trim() } : { code: value.trim() },
      );
      if (room.join_code) setCodes((previous) => ({ ...previous, [room.id]: room.join_code! }));
      setValue('');
      setNotice(
        teacher
          ? 'Classroom created. Share its code with your students.'
          : 'You joined the classroom.',
      );
    });
  }
  return (
    <div className="classrooms-page">
      <p className="eyebrow">{teacher ? 'Teacher workspace' : 'Learn with your class'}</p>
      <h1>Classrooms</h1>
      <p>
        {teacher
          ? 'Create a Class 10 classroom and invite students.'
          : 'Ask your teacher for a classroom code to join your class.'}
      </p>
      <section className="panel classroom-form">
        <h2>{teacher ? 'Create a classroom' : 'Join a classroom'}</h2>
        <form onSubmit={submit}>
          <label htmlFor="classroom-value">{teacher ? 'Classroom name' : 'Classroom code'}</label>
          <input
            id="classroom-value"
            required
            maxLength={teacher ? 80 : 12}
            minLength={teacher ? 1 : 12}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
          <button className="button" disabled={busy || loading || !value.trim()}>
            {busy ? 'Saving…' : teacher ? 'Create classroom' : 'Join classroom'}
          </button>
        </form>
        {teacher && (
          <p>
            Join codes last seven days. Replacing a code immediately disables the previous code.
          </p>
        )}
      </section>
      {error && (
        <div className="error" role="alert">
          <p>{error}</p>
          <button className="text-button" disabled={busy} onClick={() => void run(async () => {})}>
            Try again
          </button>
        </div>
      )}
      <p role="status">{loading ? 'Loading classrooms…' : notice}</p>
      {!loading && rooms.length === 0 && <p>No classrooms yet.</p>}
      {rooms.map((room) => (
        <section className="panel classroom-card" key={room.id}>
          <h2>{room.name}</h2>
          <p>Teacher: {room.teacher_name}</p>
          {teacher ? (
            <>
              {codes[room.id] && (
                <p>
                  Join code: <strong className="classroom-code">{codes[room.id]}</strong>
                </p>
              )}
              <p>Code expires: {new Date(room.code_expires * 1000).toLocaleDateString()}</p>
              <button
                className="button secondary"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    const result = await post<{ join_code: string }>(`/classrooms/${room.id}/code`);
                    setCodes((previous) => ({ ...previous, [room.id]: result.join_code }));
                    setNotice('New code ready. The previous code no longer works.');
                  })
                }
              >
                Replace join code
              </button>
              <h3>Students ({room.students?.length ?? 0})</h3>
              {!room.students?.length && <p>Share your code to invite the first student.</p>}
              <ul className="classroom-roster">
                {room.students?.map((student) => (
                  <li key={student.id}>
                    <span>{student.name}</span>
                    <button
                      className="text-button"
                      disabled={busy}
                      aria-label={`Remove ${student.name}`}
                      onClick={() =>
                        void run(async () => {
                          await api(`/classrooms/${room.id}/members/${student.id}`, {
                            method: 'DELETE',
                          });
                          setNotice(
                            'Student removed. Their learning progress is saved. Replace the code to prevent rejoining with the old code.',
                          );
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <button
              className="button secondary"
              disabled={busy}
              onClick={() =>
                void run(async () => {
                  await post(`/classrooms/${room.id}/leave`);
                  setNotice('You left the classroom. Your learning progress is saved.');
                })
              }
            >
              Leave classroom
            </button>
          )}
          {teacher && (
            <TeacherSupport
              classroomId={room.id}
              students={room.students ?? []}
              curriculum={curriculum}
            />
          )}
          {teacher && (
            <AssignmentForm
              classroomId={room.id}
              curriculum={curriculum}
              onSaved={() => setAssignmentRevision((value) => value + 1)}
            />
          )}
          <AssignmentBoard user={user} classroomId={room.id} revision={assignmentRevision} />
        </section>
      ))}
    </div>
  );
}
