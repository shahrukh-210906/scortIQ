import { useEffect, useState, type FormEvent } from 'react';
import { api, post, type JourneyContent, type Quiz, type Result } from './api';

export function ExamNotes({
  notes,
  requestedLanguage,
}: {
  notes: JourneyContent['notes'];
  requestedLanguage: string;
}) {
  return (
    <section className="exam-notes">
      <h2>Write it clearly in an exam</h2>
      <p className="source-note">
        Draft guidance · educator review pending · {notes.language === 'hi' ? 'Hindi' : 'English'}
      </p>
      {notes.language !== requestedLanguage && (
        <p role="status">
          Hindi notes are not available for this topic yet. Showing the English draft.
        </p>
      )}
      <h3>Practise this question</h3>
      <p lang={notes.language}>{notes.question}</p>
      <h3>One way to write your answer</h3>
      <p lang={notes.language}>{notes.model_answer}</p>
      <h3>Important terms</h3>
      <ul lang={notes.language}>
        {notes.key_terms.map((term) => (
          <li key={term}>{term}</li>
        ))}
      </ul>
      <h3>Build your answer</h3>
      <ol lang={notes.language}>
        {notes.writing_steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <h3>Don’t forget</h3>
      <p lang={notes.language}>{notes.dont_forget}</p>
      <p className="source-note">{notes.marking_note}</p>
    </section>
  );
}

export function EquationActivity({
  lessonId,
  activity,
  completed,
  onCompleted,
}: {
  lessonId: string;
  activity: NonNullable<JourneyContent['activity']>;
  completed: boolean;
  onCompleted: () => void;
}) {
  const [coefficients, setCoefficients] = useState([1, 1, 1]);
  const [hint, setHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    correct: boolean;
    message: string;
    counts: { element: string; left: number; right: number }[];
  } | null>(null);
  async function check(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const checked = await post<NonNullable<typeof result>>(`/lessons/${lessonId}/activity`, {
        coefficients,
      });
      setResult(checked);
      if (checked.correct) onCompleted();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel topic-practice">
      <h2>Balance the reaction</h2>
      <p>Keep every formula unchanged. Use the smallest positive whole-number coefficients.</p>
      <p className="equation-display">
        {activity.formulas[0]} + {activity.formulas[1]} → {activity.formulas[2]}
      </p>
      {completed && (
        <p className="success">
          You’ve balanced this activity before. Practise again whenever you like.
        </p>
      )}
      <form onSubmit={(event) => void check(event)}>
        <div className="coefficient-inputs">
          {activity.formulas.map((formula, index) => (
            <label key={formula}>
              Coefficient for {formula}
              <input
                type="number"
                min={1}
                max={20}
                step={1}
                required
                disabled={busy}
                value={Number.isNaN(coefficients[index]) ? '' : coefficients[index]}
                onChange={(event) => {
                  setResult(null);
                  setCoefficients((current) =>
                    current.map((value, i) => (i === index ? event.target.valueAsNumber : value)),
                  );
                }}
              />
            </label>
          ))}
        </div>
        <button className="button primary" disabled={busy}>
          {busy ? 'Checking…' : 'Check atom counts'}
        </button>
      </form>
      <button
        className="text-button"
        aria-expanded={hint}
        onClick={() => setHint((value) => !value)}
      >
        {hint ? 'Hide hint' : 'Show a hint'}
      </button>
      {hint && <p>{activity.hint}</p>}
      {result && (
        <div>
          <p role="status">{result.message}</p>
          <table>
            <caption>Atoms on each side</caption>
            <thead>
              <tr>
                <th>Element</th>
                <th>Reactants</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {result.counts.map((row) => (
                <tr key={row.element}>
                  <th>{row.element}</th>
                  <td>{row.left}</td>
                  <td>{row.right}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}

export function TopicRecall({ lessonId }: { lessonId: string }) {
  const [quiz, setQuiz] = useState<Pick<Quiz, 'id' | 'questions'> | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    void api<{ result: Result | null }>(`/lessons/${lessonId}/recall`)
      .then((data) => {
        if (active) setResult(data.result);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [lessonId]);
  async function start() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      setQuiz(await post(`/lessons/${lessonId}/recall`));
      setAnswers({});
      setResult(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!quiz || busy) return;
    setBusy(true);
    setError('');
    try {
      setResult(await post(`/recall/${quiz.id}/submit`, { answers }));
      setQuiz(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="panel topic-practice">
      <h2>Recall this topic</h2>
      <p>A short quiz on this concept. English draft questions · educator review pending.</p>
      {result && (
        <div>
          <p role="status">
            Your latest topic score: {result.score} / {result.total}
          </p>
          {result.review.map((item) => (
            <article className="recall-review" key={item.id}>
              <h3>{item.prompt}</h3>
              <p>
                {item.is_correct ? 'Correct' : 'Revisit this idea'} · {item.correct_answer}
              </p>
              <p>{item.reason}</p>
            </article>
          ))}
        </div>
      )}
      {!quiz && (
        <button className="button primary" disabled={busy} onClick={() => void start()}>
          {busy ? 'Loading…' : result ? 'Try topic recall again' : 'Start topic recall'}
        </button>
      )}
      {quiz && (
        <form onSubmit={(event) => void submit(event)}>
          {quiz.questions.map((question) => (
            <fieldset className="recall-question" key={question.id}>
              <legend>{question.prompt}</legend>
              {question.options.map((option, index) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === index}
                    onChange={() => setAnswers((current) => ({ ...current, [question.id]: index }))}
                    disabled={busy}
                    required
                  />
                  {option}
                </label>
              ))}
            </fieldset>
          ))}
          <button
            className="button primary"
            disabled={busy || Object.keys(answers).length !== quiz.questions.length}
          >
            {busy ? 'Submitting…' : 'Submit topic recall'}
          </button>
        </form>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
