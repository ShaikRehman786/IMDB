import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <span className="footer-logo-text">
            <span className="footer-movie">MOVIE</span>
            <span className="footer-zone">ZONE</span>
          </span>
        </div>
        <p className="footer-tagline">Built with ❤️ for cinema lovers</p>
        <span className="footer-copyright">© 2025</span>
      </div>
    </footer>
  );
};

export default Footer;
