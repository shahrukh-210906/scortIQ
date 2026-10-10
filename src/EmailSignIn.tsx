import { useState, type FormEvent } from 'react';
import { post, type Languages } from './api';

export function EmailSignIn({
  onSignedIn,
  languages,
}: {
  onSignedIn: () => Promise<void>;
  languages?: Languages;
}) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendAt, setResendAt] = useState(0);
  async function send() {
    await post('/auth/email/start', { email: email.trim() });
    setSent(true);
    setCode('');
    setResendAt(Date.now() + 60000);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (sent) {
        await post('/auth/email/verify', { email: email.trim(), code, ...languages });
        await onSignedIn();
      } else await send();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="signin-email">Your email</label>
      <input
        id="signin-email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        value={email}
        readOnly={sent}
        onChange={(e) => setEmail(e.target.value)}
      />
      {sent && (
        <>
          <p role="status">Check your email for a six-digit code. Enter it within 10 minutes.</p>
          <label htmlFor="signin-code">Sign-in code</label>
          <input
            id="signin-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          />
        </>
      )}
      <button className="button primary" disabled={busy}>
        {busy ? 'Please wait…' : sent ? 'Verify and start learning' : 'Send sign-in code'}
      </button>
      {sent && (
        <div className="auth-actions">
          <button
            type="button"
            className="text-button"
            disabled={busy}
            onClick={() => {
              setSent(false);
              setCode('');
              setError('');
            }}
          >
            Use another email
          </button>
          <button
            type="button"
            className="text-button"
            disabled={busy}
            onClick={async () => {
              if (Date.now() < resendAt) {
                setError('Please wait one minute before requesting another code.');
                return;
              }
              setBusy(true);
              setError('');
              try {
                await send();
              } catch (e) {
                setError((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Send a new code
          </button>
        </div>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <p className="form-note">
        New here or recovering access? Use the same email to return to your saved learning. No
        password needed.
      </p>
    </form>
  );
}
