export type User = { id: string; name: string; verified?: boolean };
export type Topic = {
  id: string;
  title: string;
  explanation: string;
  example: string;
  question: string;
};
export type Chapter = {
  id: string;
  title: string;
  subject: string;
  description: string;
  minutes: number;
  color: string;
  topics: Topic[];
};
export type Curriculum = { class_level: number; version: string; chapters: Chapter[] };
export type Progress = {
  started_topics: string[];
  completed_steps_by_topic: Record<string, string[]>;
  attempts: { id: string; chapter_id: string; score: number; total: number; created_at: number }[];
};
export type Config = {
  email_signin: boolean;
  local_profiles: boolean;
  inference_configured: boolean;
  content_status: string;
};
export type SourceRef = {
  id: string;
  title: string;
  version: string;
  review_status: string;
  reviewer: string | null;
  rights: string;
  excerpt?: string;
};
export type Message = { role: 'user' | 'assistant'; content: string; sources?: SourceRef[] };
export type Lesson = {
  id: string;
  topic_id: string;
  messages: Message[];
  completed_steps: string[];
};
export type Quiz = {
  id: string;
  chapter_id: string;
  questions: { id: string; prompt: string; options: string[] }[];
};
export type Result = {
  score: number;
  total: number;
  review: {
    id: string;
    prompt: string;
    correct_answer: string;
    reason: string;
    is_correct: boolean;
  }[];
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 50000);
  try {
    const response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      signal: options.signal ?? controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok)
      throw new ApiError(
        response.status,
        typeof data?.detail === 'string'
          ? data.detail
          : 'We couldn’t complete that request. Please try again.',
      );
    if (!data) throw new Error('The server returned an unexpected response.');
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof Error && error.name === 'AbortError')
      throw new Error('This request took too long. Please try again.');
    throw new Error(
      'We couldn’t reach your learning space. Check that the backend is running and try again.',
    );
  } finally {
    window.clearTimeout(timeout);
  }
}
export const post = <T>(path: string, body: unknown = {}) =>
  api<T>(path, { method: 'POST', body: JSON.stringify(body) });
