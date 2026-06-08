import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HorseRaceCartoon from '../assets/images/RunningHorse.jpg';
import './Register.css';

type Role = 'horse owner' | 'jockey' | 'spectator';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('horse owner');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  const isPasswordMatched = useMemo(() => {
    if (!password || !confirmPassword) return true;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreeToTerms || !isPasswordMatched) return;

    navigate('/HorseOwnerHome');
  };

  return (
    <div className="register-page">
      <main className="register-page__main" aria-label="Create account">
        <div className="register-page__image-panel" aria-hidden="true">
          <img src={HorseRaceCartoon} alt="" />
        </div>

        <section className="register-page__container">
          <Link className="register-page__brand" to="/Homepage" aria-label="Heritage Racing Home">
            <h1>Heritage Racing</h1>
            <span>Precision in Pedigree</span>
          </Link>

          <div className="register-page__card">
            <div className="register-page__intro">
              <h2>Create Your Pedigree</h2>
              <p>Join the world's most prestigious equine management circle.</p>
            </div>

            <form className="register-page__form" onSubmit={handleSubmit}>
              <div className="register-form-grid">
                <label className="field">
                  <span>FULL NAME</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="e.g. Alistair Sterling"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="field">
                  <span>USERNAME</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="e.g. alistair_racing"
                    autoComplete="username"
                    required
                  />
                </label>

                <label className="field">
                  <span>AGE</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    placeholder="21"
                    min={0}
                    required
                  />
                </label>

                <label className="field">
                  <span>EMAIL ADDRESS</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="e.g. alistair@sterling-estates.com"
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="role-section">
                <div className="role-section__label">SELECT ROLE</div>
                <div className="role-section__toggle" role="group" aria-label="Select role">
                  <button
                    type="button"
                    className={`role-pill ${role === 'horse owner' ? 'is-active' : ''}`}
                    onClick={() => setRole('horse owner')}
                  >
                    Horse Owner
                  </button>
                  <button
                    type="button"
                    className={`role-pill ${role === 'jockey' ? 'is-active' : ''}`}
                    onClick={() => setRole('jockey')}
                  >
                    Jockey
                  </button>
                  <button
                    type="button"
                    className={`role-pill ${role === 'spectator' ? 'is-active' : ''}`}
                    onClick={() => setRole('spectator')}
                  >
                    Spectator
                  </button>
                </div>
              </div>

              <div className="password-grid">
                <label className="field">
                  <span>PASSWORD</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <label className="field">
                  <span>CONFIRM PASSWORD</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="new-password"
                    required
                    aria-invalid={!isPasswordMatched}
                    aria-describedby={!isPasswordMatched ? 'password-error' : undefined}
                  />
                </label>
              </div>

              <label className="terms-row">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(event) => setAgreeToTerms(event.target.checked)}
                />
                <span>
                  I agree to the <a href="#terms">Terms of Service</a> and{' '}
                  <a href="#privacy">Privacy Policy</a>.
                </span>
              </label>

              {!isPasswordMatched ? (
                <div className="form-error" id="password-error">
                  Passwords do not match.
                </div>
              ) : null}

              <button className="cta" type="submit" disabled={!agreeToTerms || !isPasswordMatched}>
                Create Account
              </button>

              <div className="already">
                <span>Already a member? </span>
                <Link to="/login" className="already__link">
                  Log in here
                </Link>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="register-page__footer">
        <div>(c) 2024 Heritage Racing. Precision in Pedigree.</div>
      </footer>
    </div>
  );
};

export default Register;
