import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import ContentFeedback from './ContentFeedback';
import BookmarkButton from './BookmarkButton';
import ReflectionAnswer from './ReflectionAnswer';
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Atom,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Leaf,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  api,
  post,
  ApiError,
  type Chapter,
  type Config,
  type Curriculum,
  type Lesson,
  type Progress,
  type Quiz,
  type Result,
  type Topic,
  type User,
  type SourceRef,
} from './api';
import { EmailSignIn } from './EmailSignIn';

type State = {
  user: User;
  config: Config;
  curriculum: Curriculum;
  progress: Progress;
  refresh: () => Promise<void>;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
};
const LearningContext = createContext<State | null>(null);
function useLearning() {
  const value = useContext(LearningContext);
  if (!value) throw new Error('Missing learning context');
  return value;
}
const subjectIcons: Record<string, LucideIcon> = {
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Leaf,
};
const emptyProgress: Progress = {
  attempts: [],
  started_topics: [],
  completed_steps_by_topic: {},
  bookmarked_topics: [],
};
function ErrorNotice({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div className="error" role="alert">
      <p>{message}</p>
      {retry && (
        <button className="text-button" onClick={retry}>
          Try again <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
function Loading() {
  return (
    <div className="loading" role="status">
      <span className="spinner" /> Opening your learning space…
    </div>
  );
}
function Brand() {
  return (
    <Link to="/" className="brand" aria-label="ScortIQ home">
      <span className="brand-mark">
        <GraduationCap size={24} />
      </span>
      scort<span>IQ</span>
      <span className="brand-dot" />
    </Link>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const bootGeneration = useRef(0);
  const navigate = useNavigate();
  async function load() {
    const generation = ++bootGeneration.current;
    setLoading(true);
    setError('');
    try {
      const [configuration, content] = await Promise.all([
        api<Config>('/config'),
        api<Curriculum>('/curriculum'),
      ]);
      if (generation !== bootGeneration.current) return;
      setConfig(configuration);
      setCurriculum(content);
      try {
        const profile = await api<User>('/me');
        const savedProgress = await api<Progress>('/progress');
        if (generation !== bootGeneration.current) return;
        setUser(profile);
        setProgress(savedProgress);
      } catch (e) {
        if (generation !== bootGeneration.current) return;
        if (e instanceof ApiError && e.status === 401) {
          setUser(null);
          setProgress(emptyProgress);
        } else throw e;
      }
    } catch (e) {
      if (generation === bootGeneration.current) setError((e as Error).message);
    } finally {
      if (generation === bootGeneration.current) setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    return () => {
      bootGeneration.current++;
    };
  }, []);
  async function refresh() {
    setProgress(await api<Progress>('/progress'));
  }
  async function logout() {
    await post('/auth/logout');
    bootGeneration.current++;
    setUser(null);
    setProgress(emptyProgress);
    navigate('/');
  }
  if (loading)
    return (
      <div className="startup">
        <Brand />
        <Loading />
      </div>
    );
  if (error || !config || !curriculum)
    return (
      <div className="startup">
        <Brand />
        <h1>Let’s get you connected.</h1>
        <ErrorNotice
          message={error || 'Your learning space is unavailable.'}
          retry={() => void load()}
        />
      </div>
    );
  if (!user)
    return (
      <Welcome
        config={config}
        onSignedIn={async () => {
          await load();
          navigate('/');
        }}
        onStart={async (name) => {
          const profile = await post<User>('/auth/local', { name });
          bootGeneration.current++;
          setUser(profile);
          setProgress(emptyProgress);
          navigate('/');
        }}
      />
    );
  return (
    <LearningContext.Provider
      value={{ user, config, curriculum, progress, refresh, setUser, logout }}
    >
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Library />} />
          <Route path="/chapter/:chapterId" element={<ChapterPage />} />
          <Route path="/lesson/:topicId" element={<TopicRoute />} />
          <Route path="/quiz/:chapterId" element={<QuizRoute />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </LearningContext.Provider>
  );
}

function Welcome({
  config,
  onStart,
  onSignedIn,
}: {
  config: Config;
  onStart: (name: string) => Promise<void>;
  onSignedIn: () => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await onStart(name.trim());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="welcome">
      <header>
        <Brand />
        <span className="pill">A fresh start for curious minds</span>
      </header>
      <main className="welcome-grid">
        <div>
          <p className="eyebrow">
            <span className="tiny-dot" /> UNDERSTANDING COMES FIRST
          </p>
          <h1>
            Big questions.
            <br />
            Small steps.
            <br />
            <em>Real understanding.</em>
          </h1>
          <p className="welcome-description">
            Your own space to explore science, work through the tricky bits, and learn at your pace.
          </p>
          <div className="welcome-points">
            <span>
              <CheckCircle2 size={18} /> Class 10 science
            </span>
            <span>
              <CheckCircle2 size={18} /> Guided lessons
            </span>
            <span>
              <CheckCircle2 size={18} /> Practice with purpose
            </span>
          </div>
        </div>
        <section className="onboarding">
          <div className="icon-tile mint">
            <BookOpen size={28} />
          </div>
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h2>Make room for a little discovery.</h2>
          <p>
            {config.email_signin
              ? 'Sign in with your email to save your learning and return on any device.'
              : 'Start with a name. Choose a concept. See where your curiosity takes you.'}
          </p>
          {config.email_signin && <EmailSignIn onSignedIn={onSignedIn} />}
          {config.local_profiles ? (
            <form onSubmit={submit}>
              <label htmlFor="name">What should we call you?</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                maxLength={80}
                required
                autoComplete="given-name"
              />
              <button className="button primary" disabled={busy || !name.trim()}>
                {busy ? 'Opening your space…' : 'Start learning'}
                <ArrowRight size={18} />
              </button>
              <p className="form-note">
                Local development profile · saved in this browser session. To use verified sign-in,
                sign out first. Local progress stays separate from your email account.
              </p>
            </form>
          ) : !config.email_signin ? (
            <p className="error">
              Verified sign-in must be connected before this environment can accept students.
            </p>
          ) : null}
          {error && <ErrorNotice message={error} />}
          <div className="pilot-note">
            <ShieldCheck size={18} />
            <span>Early pilot · lesson content is pending educator review.</span>
          </div>
        </section>
      </main>
      <footer>
        Built for understanding, one concept at a time.<span>ScortIQ · Class 10 pilot</span>
      </footer>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { user, logout, config } = useLearning();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    document.querySelector('main')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const links = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/learn', label: 'My learning', icon: BookOpen },
    { to: '/progress', label: 'My progress', icon: TrendingUp },
  ];
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {open && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-button mobile-only"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <p className="sidebar-label">YOUR LEARNING SPACE</p>
        <nav aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              <Icon size={20} />
              {label}
              <ChevronRight size={15} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="little-spark">
            <Sparkles size={19} />
          </span>
          <h3>Curiosity is a good habit.</h3>
          <p>One small discovery today can make tomorrow a little clearer.</p>
          <Link to="/learn">
            Find your next concept <ArrowRight size={16} />
          </Link>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="/settings">
            <Settings size={19} />
            Settings
          </NavLink>
          <button
            onClick={async () => {
              try {
                await logout();
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            <LogOut size={19} />
            Leave learning space
          </button>
          {error && <p role="alert">{error}</p>}
          <div className="profile">
            <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <div>
              <strong>{user.name}</strong>
              <small>Class 10 · Science</small>
            </div>
            <span className="profile-indicator" />
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-only"
              aria-label="Open navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
            <span>Learning, at your pace.</span>
          </div>
          <div className="topbar-right">
            <span className="class-tag">
              <GraduationCap size={16} />
              Class 10
            </span>
            <span className="vertical-line" />
            <span className="environment-tag">
              {user.verified ? 'Verified account' : config.local_profiles ? 'Local pilot' : 'Pilot'}
            </span>
            <span className="avatar small" aria-label={user.name}>
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>A little progress, every day.</span>
          <span>ScortIQ · Science pilot</span>
        </footer>
      </div>
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: Chapter }) {
  const { progress } = useLearning();
  const Icon = subjectIcons[chapter.subject];
  const started = chapter.topics.filter((t) => progress.started_topics.includes(t.id)).length;
  return (
    <Link to={`/chapter/${chapter.id}`} className="chapter-card">
      <div className={`chapter-art ${chapter.color}`}>
        <span className="art-ring ring-one" />
        <span className="art-ring ring-two" />
        <Icon size={55} strokeWidth={1.25} />
        <span className="subject-tag">{chapter.subject}</span>
      </div>
      <div className="chapter-body">
        <div className="chapter-meta">
          <span>{chapter.topics.length} concepts</span>
          <span>
            <Clock3 size={13} />
            {chapter.minutes} min
          </span>
        </div>
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
        <div className="chapter-card-bottom">
          <span>
            {started ? `${started} of ${chapter.topics.length} explored` : 'Start something new'}
          </span>
          <span className="round-arrow">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Dashboard() {
  const { user, curriculum, progress } = useLearning();
  const total = curriculum.chapters.reduce((sum, c) => sum + c.topics.length, 0);
  const latest = progress.attempts[0];
  const recentTopic = curriculum.chapters
    .flatMap((c) => c.topics)
    .find((t) => t.id === progress.started_topics.at(-1));
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">A GOOD DAY TO LEARN SOMETHING</p>
          <h1>
            Hello, {user.name.split(' ')[0]}.{' '}
            <span className="heading-spark">
              <Sparkles size={27} />
            </span>
          </h1>
          <p>You don’t have to know it all. Just take the next step.</p>
        </div>
        <span className="date-label">
          {new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'long',
            timeZone: 'Asia/Kolkata',
          }).format(new Date())}
        </span>
      </div>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-badge">
            <span className="tiny-dot" /> YOUR CURIOSITY STARTS HERE
          </span>
          <h2>
            Less memorising.
            <br />
            <em>More “oh, I get it.”</em>
          </h2>
          <p>
            Explore a concept, connect the dots, and put your understanding into practice. You set
            the pace.
          </p>
          <Link
            className="button cream"
            to={recentTopic ? `/lesson/${recentTopic.id}` : '/chapter/chemical-reactions'}
          >
            {recentTopic ? 'Continue learning' : 'Explore your first chapter'}
            <ArrowRight size={18} />
          </Link>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />
          <div className="orbit orbit-c" />
          <div className="orbital-core">
            <Atom size={75} strokeWidth={1} />
          </div>
          <span className="floating-card float-one">
            <FlaskConical size={20} /> A little reaction
          </span>
          <span className="floating-card float-two">
            <Leaf size={20} /> A big discovery
          </span>
          <span className="orbit-dot dot-one" />
          <span className="orbit-dot dot-two" />
          <span className="hero-star">✧</span>
        </div>
      </section>
      <section className="stats-grid" aria-label="Your learning summary">
        <Stat
          icon={BookOpen}
          value={`${progress.started_topics.length} / ${total}`}
          label="Concepts explored"
          detail="A start is worth celebrating"
        />
        <Stat
          icon={CheckCircle2}
          value={String(progress.attempts.length)}
          label="Practice quizzes finished"
          detail="Understanding, put into practice"
        />
        <Stat
          icon={TrendingUp}
          value={latest ? `${latest.score} / ${latest.total}` : '—'}
          label="Latest practice score"
          detail={latest ? 'Your latest submitted quiz' : 'Take a quiz to see your first score'}
        />
      </section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">FOLLOW YOUR CURIOSITY</p>
          <h2>Your next discovery</h2>
        </div>
        <Link className="text-link" to="/learn">
          All chapters <ArrowRight size={17} />
        </Link>
      </div>
      <div className="chapters-grid">
        {curriculum.chapters.map((c) => (
          <ChapterCard key={c.id} chapter={c} />
        ))}
      </div>
      <section className="learning-tip">
        <div className="icon-tile peach">
          <MessageCircle size={23} />
        </div>
        <div>
          <h3>A question is a great place to start.</h3>
          <p>
            Try explaining a concept in your own words. The parts that feel tricky are the parts
            worth exploring.
          </p>
        </div>
        <Link to="/progress">
          See your progress <ArrowUpRight size={18} />
        </Link>
      </section>
    </>
  );
}
function Stat({
  icon: Icon,
  value,
  label,
  detail,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span className="stat-icon">
          <Icon size={20} />
        </span>
        <span className="stat-value">{value}</span>
      </div>
      <h3>{label}</h3>
      <p>{detail}</p>
    </div>
  );
}

function Library() {
  const { curriculum, progress, refresh } = useLearning();
  const reviewTopics = (progress.bookmarked_topics ?? []).flatMap((id) =>
    curriculum.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.id === id)
        .map((topic) => ({ ...topic, chapterTitle: chapter.title })),
    ),
  );
  const [filter, setFilter] = useState('All subjects');
  const [query, setQuery] = useState('');
  const chapters = curriculum.chapters.filter(
    (c) =>
      (filter === 'All subjects' || c.subject === filter) &&
      `${c.title} ${c.description} ${c.topics.map((t) => t.title).join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageTitle
        eyebrow="MAKE A LITTLE ROOM FOR DISCOVERY"
        title="Your learning library"
        description="Pick a chapter. Follow a question. Build your understanding."
      />
      <section className="panel review-queue" aria-labelledby="review-queue-title">
        <h2 id="review-queue-title">Saved for review</h2>
        <p>
          Revisit the ideas you want to spend more time with. Remove them whenever you’re ready.
        </p>
        {reviewTopics.length ? (
          <ul>
            {reviewTopics.map((topic) => (
              <li key={topic.id}>
                <div>
                  <Link to={`/lesson/${topic.id}`}>{topic.title}</Link>
                  <p>{topic.chapterTitle}</p>
                </div>
                <BookmarkButton topicId={topic.id} saved refresh={refresh} />
              </li>
            ))}
          </ul>
        ) : (
          <p>
            Nothing saved yet. Open a lesson and choose “Save for review” to add a concept here.
          </p>
        )}
      </section>
      <div className="library-tools">
        <div className="filter-tabs" role="group" aria-label="Filter by subject">
          {['All subjects', 'Physics', 'Chemistry', 'Biology'].map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              className={filter === f ? 'selected' : ''}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <label className="search-label">
          <span className="sr-only">Search chapters and concepts</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a chapter or concept…"
          />
        </label>
      </div>
      <div className="chapters-grid">
        {chapters.map((c) => (
          <ChapterCard key={c.id} chapter={c} />
        ))}
      </div>
      {!chapters.length && (
        <EmptyState
          title="No chapters found"
          description="Try another subject or a different search."
        />
      )}
      <div className="content-note">
        <ShieldCheck size={18} />
        <p>
          This is a small Class 10 pilot. These original lesson notes are awaiting educator review;
          wider curriculum coverage is still to come.
        </p>
      </div>
    </>
  );
}
function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
function Back({ to, label }: { to: string; label: string }) {
  return (
    <Link className="back-link" to={to}>
      <ChevronLeft size={17} />
      {label}
    </Link>
  );
}
function ChapterPage() {
  const { chapterId } = useParams();
  const { curriculum, progress } = useLearning();
  const chapter = curriculum.chapters.find((c) => c.id === chapterId);
  if (!chapter) return <NotFound />;
  const Icon = subjectIcons[chapter.subject];
  return (
    <>
      <Back to="/learn" label="Learning library" />
      <div className="chapter-header">
        <div className={`icon-tile large ${chapter.color}`}>
          <Icon size={36} />
        </div>
        <div>
          <p className="eyebrow">CLASS 10 · {chapter.subject.toUpperCase()}</p>
          <h1>{chapter.title}</h1>
          <p>{chapter.description}</p>
        </div>
      </div>
      <div className="chapter-layout">
        <section className="panel">
          <div className="panel-heading">
            <h2>One concept at a time</h2>
            <span className="pill">{chapter.topics.length} concepts</span>
          </div>
          <div className="topic-list">
            {chapter.topics.map((t, i) => (
              <Link to={`/lesson/${t.id}`} key={t.id}>
                <span className="topic-number">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{t.title}</h3>
                  <p>
                    {progress.started_topics.includes(t.id)
                      ? 'Opened before · pick up where you left off'
                      : 'Read, reflect, and work through an example'}
                  </p>
                </div>
                <ChevronRight size={20} />
              </Link>
            ))}
          </div>
        </section>
        <aside className="practice-panel">
          <div className="icon-tile mint">
            <CheckCircle2 size={27} />
          </div>
          <p className="eyebrow">PUT IT INTO PRACTICE</p>
          <h2>
            See what’s
            <br />
            making sense.
          </h2>
          <p>Three quick questions. A little feedback. A clearer idea of what to explore next.</p>
          <Link className="button primary" to={`/quiz/${chapter.id}`}>
            Take the practice quiz <ArrowRight size={18} />
          </Link>
          <span className="practice-note">Your score is saved after submission.</span>
        </aside>
      </div>
    </>
  );
}

function TopicRoute() {
  const { topicId } = useParams();
  return <LessonPage key={topicId} />;
}
function QuizRoute() {
  const { chapterId } = useParams();
  return <QuizPage key={chapterId} />;
}
const lessonSteps = [
  { id: 'read', label: 'Read the idea' },
  { id: 'example', label: 'Explore the example' },
  { id: 'reflect', label: 'Reflect' },
];

function LessonProgress({ completed }: { completed: string[] }) {
  return (
    <section className="lesson-progress" aria-label="Lesson checklist">
      <div className="lesson-progress-heading">
        <div>
          <p className="eyebrow">YOUR LESSON JOURNEY</p>
          <h2>
            {completed.length === 3
              ? 'You’ve worked through the lesson.'
              : 'A little clearer, one step at a time.'}
          </h2>
        </div>
        <span>{completed.length} / 3 steps</span>
      </div>
      <progress aria-label="Lesson steps completed" value={completed.length} max={3} />
      <ol>
        {lessonSteps.map((step, index) => (
          <li key={step.id} className={completed.includes(step.id) ? 'done' : ''}>
            <span>{completed.includes(step.id) ? <Check size={14} /> : index + 1}</span>
            {step.label}
          </li>
        ))}
      </ol>
      <p className="lesson-progress-note">
        Your checklist is saved. The practice quiz helps check your understanding.
      </p>
    </section>
  );
}

function SourceList({ sources }: { sources: SourceRef[] }) {
  return (
    <details className="source-list">
      <summary>Learning sources ({sources.length})</summary>
      {sources.map((source) => (
        <div key={source.id}>
          <strong>{source.title}</strong>
          <p>
            {source.version} ·{' '}
            {source.review_status === 'reviewed'
              ? 'Educator reviewed'
              : 'Pilot draft · review pending'}
          </p>
          {source.excerpt && <blockquote>{source.excerpt}</blockquote>}
          <small>{source.rights}</small>
        </div>
      ))}
    </details>
  );
}

function LessonPage() {
  const { topicId } = useParams();
  const { config, progress, refresh } = useLearning();
  const [topic, setTopic] = useState<
    | (Topic & {
        chapter_id: string;
        chapter_title: string;
        source: string;
        answer: string;
        sources: SourceRef[];
      })
    | null
  >(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState('');
  const [answerVisible, setAnswerVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [turnError, setTurnError] = useState('');
  const [savingStep, setSavingStep] = useState(false);
  const [stepError, setStepError] = useState('');
  const requestGeneration = useRef(0);
  async function load() {
    const generation = ++requestGeneration.current;
    setError('');
    setTopic(null);
    setLesson(null);
    setAnswerVisible(false);
    try {
      const content = await api<
        Topic & {
          chapter_id: string;
          chapter_title: string;
          source: string;
          answer: string;
          sources: SourceRef[];
        }
      >(`/topics/${topicId}`);
      if (generation !== requestGeneration.current) return;
      setTopic(content);
      const session = await post<Lesson>(`/lessons/${topicId}`);
      if (generation !== requestGeneration.current) return;
      setLesson(session);
      await refresh();
    } catch (e) {
      if (generation === requestGeneration.current) setError((e as Error).message);
    }
  }
  useEffect(() => {
    void load();
    return () => {
      requestGeneration.current++;
    };
  }, [topicId]);
  async function send(e: FormEvent) {
    e.preventDefault();
    if (!lesson) return;
    setSending(true);
    setTurnError('');
    try {
      const result = await post<{ messages: Lesson['messages'] }>(`/lessons/${lesson.id}/turn`, {
        message,
      });
      setLesson((current) => (current ? { ...current, messages: result.messages } : null));
      setMessage('');
    } catch (e) {
      setTurnError((e as Error).message);
    } finally {
      setSending(false);
    }
  }
  async function completeStep(step: string) {
    if (!lesson) return;
    setSavingStep(true);
    setStepError('');
    try {
      setLesson(await post<Lesson>(`/lessons/${lesson.id}/steps`, { step }));
      await refresh();
    } catch (e) {
      setStepError((e as Error).message);
    } finally {
      setSavingStep(false);
    }
  }
  if (error) return <ErrorNotice message={error} retry={() => void load()} />;
  if (!topic || !lesson) return <Loading />;
  return (
    <>
      <Back to={`/chapter/${topic.chapter_id}`} label={topic.chapter_title} />
      <PageTitle
        eyebrow="A SMALL STEP TOWARDS UNDERSTANDING"
        title={topic.title}
        description="Read the idea, make a connection, then try explaining it yourself."
      />
      <LessonProgress completed={lesson.completed_steps} />
      <BookmarkButton
        topicId={topicId!}
        saved={(progress.bookmarked_topics ?? []).includes(topicId!)}
        refresh={refresh}
      />
      {stepError && <ErrorNotice message={stepError} />}
      <div className="lesson-layout">
        <article className="panel lesson-content">
          <span className="pill">
            <BookOpen size={14} /> The core idea
          </span>
          <h2>Let’s connect the dots.</h2>
          <p className="explanation">{topic.explanation}</p>
          <button
            className="lesson-step-button"
            disabled={savingStep || lesson.completed_steps.includes('read')}
            onClick={() => void completeStep('read')}
          >
            {lesson.completed_steps.includes('read') ? (
              <>
                <CheckCircle2 size={17} />
                Idea read
              </>
            ) : (
              'I’ve read the idea'
            )}
          </button>
          <section className="example-box">
            <p className="eyebrow">SEE IT IN ACTION</p>
            <p>{topic.example}</p>
            <button
              className="lesson-step-button"
              disabled={
                savingStep ||
                !lesson.completed_steps.includes('read') ||
                lesson.completed_steps.includes('example')
              }
              onClick={() => void completeStep('example')}
            >
              {lesson.completed_steps.includes('example') ? (
                <>
                  <CheckCircle2 size={17} />
                  Example explored
                </>
              ) : (
                'I’ve worked through the example'
              )}
            </button>
          </section>
          <section className="reflection">
            <p className="eyebrow">PAUSE & THINK</p>
            <h3>{topic.question}</h3>
            <p>Try answering in your own words before opening the explanation.</p>
            <ReflectionAnswer
              key={lesson.id}
              lessonId={lesson.id}
              initialAnswer={lesson.reflection}
            />
            <button
              className="text-button"
              aria-expanded={answerVisible}
              onClick={() => setAnswerVisible((v) => !v)}
            >
              {answerVisible ? 'Hide explanation' : 'Show explanation'}
              <Plus size={16} />
            </button>
            {answerVisible && <p className="revealed-answer">{topic.answer}</p>}
            <button
              className="lesson-step-button"
              disabled={
                savingStep ||
                !lesson.completed_steps.includes('example') ||
                lesson.completed_steps.includes('reflect')
              }
              onClick={() => void completeStep('reflect')}
            >
              {lesson.completed_steps.includes('reflect') ? (
                <>
                  <CheckCircle2 size={17} />
                  Reflection complete
                </>
              ) : (
                'I’ve reflected on the question'
              )}
            </button>
          </section>
          <p className="source-note">{topic.source}</p>
          <SourceList sources={topic.sources} />
          <ContentFeedback topicId={topicId!} />
          <Link className="button primary" to={`/quiz/${topic.chapter_id}`}>
            Check your understanding <ArrowRight size={17} />
          </Link>
        </article>
        <aside className="panel tutor-panel">
          <div className="panel-heading">
            <div className="tutor-title">
              <span className="stat-icon">
                <Sparkles size={19} />
              </span>
              <h2>Your study companion</h2>
            </div>
            <span
              className={`status-dot ${config.inference_configured ? 'connected' : ''}`}
              aria-label={config.inference_configured ? 'Connected' : 'Not connected'}
            />
          </div>
          <div className="chat-messages" aria-live="polite">
            {!lesson.messages.length && (
              <div className="chat-intro">
                <MessageCircle size={30} />
                <h3>
                  {config.inference_configured
                    ? 'Ask the next question.'
                    : 'AI tutoring is on its way.'}
                </h3>
                <p>
                  {config.inference_configured
                    ? 'Share what you think, or ask about the part that feels unclear.'
                    : 'The Hugging Face model hasn’t been connected yet. Your lesson and practice quiz are ready to explore.'}
                </p>
              </div>
            )}
            {lesson.messages.map((m, i) => (
              <div className={`chat-message ${m.role}`} key={i}>
                <small>{m.role === 'user' ? 'You' : 'ScortIQ'}</small>
                <p>{m.content}</p>
                {m.sources && <SourceList sources={m.sources} />}
              </div>
            ))}
            {sending && <p role="status">Thinking through your question…</p>}
          </div>
          {turnError && <ErrorNotice message={turnError} />}
          <form className="chat-form" onSubmit={send}>
            <label htmlFor="chat-input" className="sr-only">
              Your question or answer
            </label>
            <textarea
              id="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                config.inference_configured ? 'What are you wondering?' : 'Tutor connection pending'
              }
              maxLength={2000}
              disabled={!config.inference_configured || sending}
              rows={2}
            />
            <button
              className="icon-button send-button"
              aria-label="Send message"
              disabled={!config.inference_configured || sending || savingStep || !message.trim()}
            >
              <Send size={18} />
            </button>
          </form>
          <p className="tutor-footnote">
            AI responses can be mistaken. Check important details against your learning material.
          </p>
        </aside>
      </div>
    </>
  );
}

function QuizPage() {
  const { chapterId } = useParams();
  const { curriculum, refresh } = useLearning();
  const chapter = curriculum.chapters.find((c) => c.id === chapterId);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function start() {
    setBusy(true);
    setError('');
    setResult(null);
    setAnswers({});
    try {
      setQuiz(await post<Quiz>(`/quizzes/${chapterId}`));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!quiz) return;
    setBusy(true);
    setError('');
    try {
      const graded = await post<Result>(`/attempts/${quiz.id}/submit`, { answers });
      setResult(graded);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!chapter) return <NotFound />;
  return (
    <>
      <Back to={`/chapter/${chapter.id}`} label={chapter.title} />
      <PageTitle
        eyebrow="PRACTICE, NOT PERFECTION"
        title={result ? 'A little clearer, a little further.' : `${chapter.title}: quick check`}
        description={
          result
            ? 'Your result is saved. Let’s look at the ideas behind each answer.'
            : 'A few questions to help you see what’s making sense.'
        }
      />
      {error && <ErrorNotice message={error} />}
      <div className="quiz-container">
        {result ? (
          <>
            <div className="result-banner">
              <span className="icon-tile mint">
                <CheckCircle2 size={30} />
              </span>
              <div>
                <p className="eyebrow">PRACTICE COMPLETE</p>
                <h2>
                  {result.score} <span>of {result.total} correct</span>
                </h2>
                <p>
                  {result.score === result.total
                    ? 'Nice work. Try explaining one of these ideas to someone else.'
                    : 'The tricky parts are useful clues. Review the explanations and try again when you’re ready.'}
                </p>
              </div>
            </div>
            {result.review.map((r, i) => (
              <article className="panel review-card" key={r.id}>
                <span className={`result-label ${r.is_correct ? 'correct' : 'review'}`}>
                  {r.is_correct ? 'Correct' : 'Worth another look'}
                </span>
                <h3>
                  {i + 1}. {r.prompt}
                </h3>
                <p>
                  <strong>{r.correct_answer}</strong>
                </p>
                <p>{r.reason}</p>
              </article>
            ))}
            <div className="quiz-actions">
              <Link className="button primary" to="/progress">
                View your progress <ArrowRight size={17} />
              </Link>
              <button className="button secondary" onClick={() => void start()} disabled={busy}>
                Practise again
              </button>
            </div>
          </>
        ) : quiz ? (
          <form onSubmit={submit}>
            <div className="quiz-status">
              <span>
                {Object.keys(answers).length} of {quiz.questions.length} answered
              </span>
              <span>No timer. Take your time.</span>
            </div>
            {quiz.questions.map((q, i) => (
              <fieldset className="panel question-card" key={q.id}>
                <legend>
                  <span className="eyebrow">QUESTION {String(i + 1).padStart(2, '0')}</span>
                  <span className="question-prompt">{q.prompt}</span>
                </legend>
                <div className="answer-options">
                  {q.options.map((option, index) => (
                    <label className={answers[q.id] === index ? 'chosen' : ''} key={index}>
                      <input
                        type="radio"
                        name={q.id}
                        value={index}
                        checked={answers[q.id] === index}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: index }))}
                        disabled={busy}
                      />
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span>{option}</span>
                      {answers[q.id] === index && <Check size={18} />}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <button
              className="button primary"
              disabled={busy || Object.keys(answers).length !== quiz.questions.length}
            >
              {busy ? 'Saving your answers…' : 'Submit & see feedback'}
              <ArrowRight size={18} />
            </button>
            <p className="form-note">
              Your answers are graded on the server. Leaving before submission won’t record a score.
            </p>
          </form>
        ) : (
          <section className="panel quiz-start">
            <div className="icon-tile mint">
              <CheckCircle2 size={34} />
            </div>
            <h2>A check-in with your understanding.</h2>
            <p>
              Three multiple-choice questions, followed by explanations. You can revisit your
              lessons whenever you like.
            </p>
            <button className="button primary" onClick={() => void start()} disabled={busy}>
              {busy ? 'Preparing your quiz…' : 'Start practice'}
              <ArrowRight size={18} />
            </button>
          </section>
        )}
      </div>
    </>
  );
}

function ProgressPage() {
  const { curriculum, progress } = useLearning();
  const total = curriculum.chapters.reduce((s, c) => s + c.topics.length, 0);
  return (
    <>
      <PageTitle
        eyebrow="YOUR EFFORT, MADE VISIBLE"
        title="Every step counts."
        description="A record of what you’ve explored and practised. No invented streaks, no pressure."
      />
      <section className="stats-grid">
        <Stat
          icon={BookOpen}
          value={`${progress.started_topics.length} / ${total}`}
          label="Concepts explored"
          detail="Opening a lesson is a first step"
        />
        <Stat
          icon={CheckCircle2}
          value={String(progress.attempts.length)}
          label="Quizzes submitted"
          detail="Only completed submissions count"
        />
        <Stat
          icon={TrendingUp}
          value={
            progress.attempts.length
              ? `${Math.round((progress.attempts.reduce((s, a) => s + a.score / a.total, 0) / progress.attempts.length) * 100)}%`
              : '—'
          }
          label="Average practice score"
          detail="Across your submitted quizzes"
        />
      </section>
      <section className="panel">
        <div className="panel-heading">
          <h2>Your chapter journey</h2>
          <span className="pill">Class 10 science</span>
        </div>
        {curriculum.chapters.map((c) => {
          const count = c.topics.filter((t) => progress.started_topics.includes(t.id)).length;
          const latest = progress.attempts.find((a) => a.chapter_id === c.id);
          const Icon = subjectIcons[c.subject];
          return (
            <div className="progress-row" key={c.id}>
              <span className={`icon-tile ${c.color}`}>
                <Icon size={23} />
              </span>
              <div className="progress-detail">
                <h3>
                  <Link to={`/chapter/${c.id}`}>{c.title}</Link>
                </h3>
                <p>
                  {count} of {c.topics.length} concepts explored ·{' '}
                  {latest
                    ? `Latest quiz: ${latest.score}/${latest.total}`
                    : 'No quiz submitted yet'}
                </p>
                <progress
                  value={count}
                  max={c.topics.length}
                  aria-label={`${c.title}: concepts explored`}
                />
              </div>
              <Link className="text-link" to={`/chapter/${c.id}`}>
                Explore <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </section>
      <div className="section-heading">
        <h2>Your practice history</h2>
      </div>
      {progress.attempts.length ? (
        <div className="panel history-list">
          {progress.attempts.map((a) => (
            <div key={a.id}>
              <span>
                <strong>{curriculum.chapters.find((c) => c.id === a.chapter_id)?.title}</strong>
                <small>
                  {new Intl.DateTimeFormat('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata',
                  }).format(new Date(a.created_at * 1000))}
                </small>
              </span>
              <span className="score-pill">
                {a.score} / {a.total}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Your first result is waiting."
          description="Finish a chapter quiz and your result will appear here."
          action={
            <Link className="button secondary" to="/learn">
              Find a chapter <ArrowRight size={16} />
            </Link>
          }
        />
      )}
      <p className="source-note">
        Explored concepts and quiz scores are learning evidence, not a guarantee of mastery.
      </p>
    </>
  );
}
function SettingsPage() {
  const { user, setUser, config } = useLearning();
  const [name, setName] = useState(user.name);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSaved(false);
    setError('');
    try {
      setUser(await api<User>('/me', { method: 'PATCH', body: JSON.stringify({ name }) }));
      setSaved(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        eyebrow="MAKE THIS SPACE YOURS"
        title="Your preferences"
        description="Keep the little details up to date."
      />
      <section className="panel settings-panel">
        <h2>Your learning profile</h2>
        <form onSubmit={submit}>
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            required
            maxLength={80}
          />
          <button className="button primary" disabled={busy || !name.trim()}>
            {busy ? 'Saving…' : 'Save changes'}
            <Check size={17} />
          </button>
          {saved && (
            <p className="success" role="status">
              Your name has been updated.
            </p>
          )}
          {error && <ErrorNotice message={error} />}
        </form>
        <hr />
        <h3>About this pilot</h3>
        <p>Class 10 · Science · English</p>
        <p>
          {user.verified
            ? 'Your account uses verified email sign-in. Sign in with the same email to recover your learning.'
            : 'This is a local development profile, not a verified student account.'}{' '}
          Hindi/Hinglish support and wider curriculum coverage will follow educator and model
          evaluation.
        </p>
        <p>
          AI tutor:{' '}
          {config.inference_configured
            ? 'endpoint configured; responses still require evaluation'
            : 'not connected yet'}
          . Content: pending educator review.
        </p>
      </section>
    </>
  );
}
function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <BookOpen size={28} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
function NotFound() {
  return (
    <EmptyState
      title="This page isn’t in your learning library."
      description="Let’s head back to your overview."
      action={
        <Link className="button primary" to="/">
          Back to overview <ArrowRight size={17} />
        </Link>
      }
    />
  );
}
