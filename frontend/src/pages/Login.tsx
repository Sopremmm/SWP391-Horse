import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HorseRaceCartoon from '../assets/images/RunningHorse.jpg';
import './Login.css';

type JwtResponse = {
  token: string;
  type?: string;
  id: number;
  email: string;
  fullName: string;
  roles: string[];
};

const UserIcon = () => (
  <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
    <path
      d="M6.67 6.67a3.21 3.21 0 0 1-2.36-.98 3.21 3.21 0 0 1-.98-2.36c0-.92.33-1.7.98-2.35A3.21 3.21 0 0 1 6.67 0c.91 0 1.7.33 2.35.98.65.65.98 1.43.98 2.35 0 .92-.33 1.7-.98 2.36a3.21 3.21 0 0 1-2.35.98ZM0 13.33V11c0-.47.12-.91.36-1.3.25-.4.57-.7.97-.91a12.23 12.23 0 0 1 10.67 0c.4.21.73.51.97.91.24.39.36.83.36 1.3v2.33H0Zm1.67-1.66h10V11c0-.15-.04-.29-.12-.42a.82.82 0 0 0-.3-.29 10.3 10.3 0 0 0-9.17 0 .82.82 0 0 0-.3.29.82.82 0 0 0-.11.42v.67ZM6.67 5c.46 0 .85-.16 1.17-.49.33-.32.5-.72.5-1.18s-.17-.85-.5-1.17a1.6 1.6 0 0 0-1.17-.49c-.46 0-.86.16-1.18.49A1.6 1.6 0 0 0 5 3.33c0 .46.16.86.49 1.18.32.33.72.49 1.18.49Z"
      fill="currentColor"
    />
  </svg>
);

const EyeIcon = () => (
  <svg width="19" height="13" viewBox="0 0 19 13" fill="none" aria-hidden="true">
    <path
      d="M9.17 10a3.62 3.62 0 0 0 3.75-3.75A3.62 3.62 0 0 0 9.17 2.5a3.62 3.62 0 0 0-3.75 3.75A3.62 3.62 0 0 0 9.17 10Zm0-1.5a2.17 2.17 0 0 1-2.25-2.25A2.17 2.17 0 0 1 9.17 4a2.17 2.17 0 0 1 2.25 2.25A2.17 2.17 0 0 1 9.17 8.5Zm0 4a10.09 10.09 0 0 1-5.54-1.7A9.15 9.15 0 0 1 0 6.25a9.15 9.15 0 0 1 3.63-4.55A10.09 10.09 0 0 1 9.17 0c2.03 0 3.88.57 5.54 1.7a9.15 9.15 0 0 1 3.62 4.55 9.15 9.15 0 0 1-3.62 4.55 10.09 10.09 0 0 1-5.54 1.7Zm0-1.67c1.57 0 3.01-.41 4.32-1.24a8.2 8.2 0 0 0 3.01-3.34 8.2 8.2 0 0 0-3.01-3.34 8.02 8.02 0 0 0-4.32-1.24c-1.57 0-3.01.41-4.32 1.24a8.2 8.2 0 0 0-3.02 3.34 8.2 8.2 0 0 0 3.02 3.34 8.02 8.02 0 0 0 4.32 1.24Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M9.13 6.75H0v-1.5h9.13l-4.2-4.2L6 0l6 6-6 6-1.07-1.05 4.2-4.2Z" fill="currentColor" />
  </svg>
);

const CreateIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
    <path
      d="M1.5 12a1.45 1.45 0 0 1-1.06-.44A1.45 1.45 0 0 1 0 10.5c0-.41.15-.77.44-1.06.29-.29.65-.44 1.06-.44.41 0 .77.15 1.06.44.29.29.44.65.44 1.06 0 .41-.15.77-.44 1.06-.29.29-.65.44-1.06.44Zm0-4.5a1.45 1.45 0 0 1-1.06-.44A1.45 1.45 0 0 1 0 6c0-.41.15-.77.44-1.06.29-.29.65-.44 1.06-.44.41 0 .77.15 1.06.44.29.29.44.65.44 1.06 0 .41-.15.77-.44 1.06-.29.29-.65.44-1.06.44ZM6 7.5a1.45 1.45 0 0 1-1.06-.44A1.45 1.45 0 0 1 4.5 6c0-.41.15-.77.44-1.06.29-.29.65-.44 1.06-.44.41 0 .77.15 1.06.44.29.29.44.65.44 1.06 0 .41-.15.77-.44 1.06-.29.29-.65.44-1.06.44Zm.75 4.5V9.69l4.14-4.12c.23-.22.49-.32.79-.32.15 0 .29.03.43.08.14.06.26.14.38.26l.69.69c.1.11.18.24.24.38.05.13.08.27.08.41 0 .14-.03.28-.08.42-.05.15-.13.28-.24.39L9.06 12H6.75Zm1.13-1.13h.71l2.27-2.28-.69-.69-2.29 2.26v.71Z"
      fill="currentColor"
    />
  </svg>
);

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const resolveLandingRoute = (roles: string[] | null | undefined) => {
    const normalized = (roles ?? []).map((role) => role.trim().toUpperCase());
    const has = (role: string) => normalized.includes(role) || normalized.includes(`ROLE_${role}`);

    if (has('ADMIN')) return '/admin';
    if (has('JOCKEY')) return '/Jockey/Home';
    if (has('HORSE_OWNER')) return '/HorseOwnerHome';
    return '/Homepage';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError('');

    try {
      const apiBaseUrl = (process.env.REACT_APP_API_BASE_URL ?? '').trim();
      const endpoint = apiBaseUrl ? `${apiBaseUrl}/api/auth/signin` : '/api/auth/signin';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      if (!res.ok) {
        let message = 'Dang nhap that bai. Vui long thu lai.';
        try {
          const contentType = res.headers.get('content-type') ?? '';
          if (contentType.includes('application/json')) {
            const data = (await res.json()) as { message?: unknown };
            if (typeof data?.message === 'string' && data.message.trim()) {
              message = data.message.trim();
            }
          } else {
            const text = (await res.text()).trim();
            if (text) message = text;
          }
        } catch {
          // ignore parse errors
        }

        if (message.toLowerCase().includes('invalid email or password')) {
          setError('Email hoac mat khau khong dung.');
        } else {
          setError(message);
        }
        return;
      }

      const json = (await res.json()) as JwtResponse;
      if (!json?.token) {
        setError('Dang nhap that bai. Vui long thu lai.');
        return;
      }

      window.localStorage.setItem('token', json.token);
      window.localStorage.setItem('roles', JSON.stringify(json.roles ?? []));
      window.localStorage.setItem('userId', String(json.id));
      window.localStorage.setItem('email', json.email ?? '');
      window.localStorage.setItem('fullName', json.fullName ?? '');

      navigate(resolveLandingRoute(json.roles), { replace: true });
    } catch {
      setError('Khong the ket noi server. Vui long thu lai.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-page__main" aria-labelledby="login-title">
        <div className="login-page__image-panel" aria-hidden="true">
          <img src={HorseRaceCartoon} alt="" />
        </div>

        <section className="login-page__container">
          <Link className="login-page__brand" to="/Homepage">
            <h1 id="login-title">Heritage Racing</h1>
            <span>Precision in Pedigree</span>
          </Link>

          <div className="login-page__card">
            <div className="login-page__intro">
              <h2>Welcome Back</h2>
              <p>Sign in to manage your prestigious stable.</p>
            </div>

            <form className="login-page__form" onSubmit={handleSubmit} aria-busy={submitting}>
              <label className="login-page__field">
                <span>Email</span>
                <div className="login-page__input-wrap">
                  <input
                    type="email"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                  <UserIcon />
                </div>
              </label>

              <label className="login-page__field">
                <span className="login-page__field-row">
                  <span>Password</span>
                  <a href="#forgot-password">Forgot Password?</a>
                </span>
                <div className="login-page__input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    className="login-page__password-toggle"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    <EyeIcon />
                  </button>
                </div>
              </label>

              <button className="login-page__submit" type="submit">
                {submitting ? 'Signing In...' : 'Sign In'}
                <ArrowIcon />
              </button>

              {error ? <p className="login-page__error" role="alert">{error}</p> : null}
            </form>

            <div className="login-page__alternate">
              <p>New to the heritage stable?</p>
              <Link to="/register">
                Create an Account
                <CreateIcon />
              </Link>
            </div>
          </div>

          <nav className="login-page__meta" aria-label="Login support links">
            <a href="#privacy">Privacy Policy</a>
            <span>-</span>
            <a href="#terms">Terms of Service</a>
            <span>-</span>
            <a href="#concierge">Contact Concierge</a>
          </nav>
        </section>
      </main>

      <footer className="login-page__footer">
        <p>(c) 2024 Heritage Racing. Precision in Pedigree.</p>
      </footer>
    </div>
  );
};

export default Login;
