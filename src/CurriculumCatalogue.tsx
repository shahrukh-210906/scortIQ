import { useEffect, useState } from 'react';
import { api } from './api';

type Catalogue = {
  subjects: {
    id: string;
    title: string;
    chapters: {
      id: string;
      title: string;
      ncert_chapter_number: number;
      source_url: string;
      topics: { id: string; title: string; availability: string }[];
    }[];
  }[];
};
export default function CurriculumCatalogue() {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [subject, setSubject] = useState('maths');
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');
    void api<Catalogue>('/catalogue')
      .then((data) => {
        if (active) setCatalogue(data);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const selected = catalogue?.subjects.find((item) => item.id === subject);
  const needle = query.trim().toLowerCase();
  const chapters =
    selected?.chapters.filter((chapter) =>
      `${chapter.title} ${chapter.topics.map((topic) => topic.title).join(' ')}`
        .toLowerCase()
        .includes(needle),
    ) ?? [];
  return (
    <section className="curriculum-catalogue" aria-labelledby="catalogue-heading">
      <h2 id="catalogue-heading">Class 10 study map</h2>
      <p>
        NCERT / CBSE 2026–27 · Maths, Chemistry, Biology and Physics. These topics are planned;
        available pilot lessons appear above.
      </p>
      <div className="catalogue-tools">
        <label>
          Study subject
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setQuery('');
            }}
          >
            <option value="maths">Maths</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="physics">Physics</option>
          </select>
        </label>
        <label>
          Search the study map
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chapter or topic"
          />
        </label>
      </div>
      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button className="button secondary" onClick={() => setRetry((value) => value + 1)}>
            Retry study map
          </button>
        </div>
      ) : !catalogue ? (
        <p role="status">Loading the study map…</p>
      ) : (
        <>
          <p>
            {selected?.title}: {selected?.chapters.length} chapters ·{' '}
            {selected?.chapters.reduce((count, chapter) => count + chapter.topics.length, 0)}{' '}
            planned topics
          </p>
          {chapters.map((chapter) => (
            <details className="panel catalogue-chapter" key={chapter.id}>
              <summary>
                {chapter.ncert_chapter_number}. {chapter.title}{' '}
                <span>Planned · {chapter.topics.length} topics</span>
              </summary>
              <ol>
                {chapter.topics.map((topic) => (
                  <li key={topic.id}>
                    {topic.title}
                    <span className="catalogue-status">Lesson not available yet</span>
                  </li>
                ))}
              </ol>
              <a href={chapter.source_url} target="_blank" rel="noreferrer">
                Read the NCERT chapter (opens a new tab)
              </a>
            </details>
          ))}
          {!chapters.length && <p>No matching chapters or topics. Try another search.</p>}
        </>
      )}
    </section>
  );
}
