import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

type ProfileDropdownProps = {
  avatarSrc?: string;
};

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ avatarSrc }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    // If you have a real auth provider, hook into it here.
    // For now we just navigate to homepage.
    navigate('/Homepage');
  };

  return (
    <div className="profile-dropdown" onBlur={() => setOpen(false)}>
      <button
        type="button"
        className="profile-dropdown__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {avatarSrc ? (
          <img className="profile-dropdown__avatar" src={avatarSrc} alt="User avatar" />
        ) : (
          <div className="profile-dropdown__avatar profile-dropdown__avatar--placeholder" />
        )}
      </button>

      {open ? (
        <div className="profile-dropdown__menu" role="menu">
          <Link
            className="profile-dropdown__item"
            role="menuitem"
            to="/profile"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            className="profile-dropdown__item"
            role="menuitem"
            to="/horses"
            onClick={() => setOpen(false)}
          >
            My Horses
          </Link>
          <Link
            className="profile-dropdown__item"
            role="menuitem"
            to="/hire-jockey"
            onClick={() => setOpen(false)}
          >
            My Jockey
          </Link>
          <Link
            className="profile-dropdown__item"
            role="menuitem"
            to="/tournament"
            onClick={() => setOpen(false)}
          >
            My Tournament
          </Link>

          <button
            type="button"
            className="profile-dropdown__item profile-dropdown__item--logout"
            role="menuitem"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ProfileDropdown;

