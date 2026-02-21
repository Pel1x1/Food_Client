import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import LogoIcon from '@/components/icons/LogoIcon';
import { LuHeart, LuUser, LuMenu, LuX } from 'react-icons/lu';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Recipes', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Favourites', path: '/favourites' },
    { name: 'Cart', path: '/cart' },
    { name: 'AI Recipe', path: '/ai-recipe' },
    { name: 'Profile', path: '/profile' },
  ];

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <LogoIcon width={40} height={40} />
          <span>Food Client</span>
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={classNames(styles.navLink, {
                    [styles.active]: location.pathname === link.path,
                  })}
                  onClick={closeMobile}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.headerActions}>
          <Link to="/favourites" className={styles.actionButton} title="Favourites">
            <LuHeart size={20} />
          </Link>
          <Link to="/profile" className={classNames(styles.actionButton, styles.profileBtn)} title="Profile">
            <LuUser size={20} />
          </Link>
          {/* Бургер внутри actions */}
          <button className={styles.burgerBtn} onClick={toggleMobile} aria-label="Toggle menu">
            {mobileOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenu}>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={classNames(styles.mobileNavLink, {
                      [styles.active]: location.pathname === link.path,
                    })}
                    onClick={closeMobile}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
