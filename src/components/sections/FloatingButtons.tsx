import { SiteSettings } from '@/lib/data';

export function FloatingButtons({ siteSettings }: { siteSettings: SiteSettings }) {

  return (
    <>
      {/* Messenger */}
      <a
        href={siteSettings.messengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        style={{
          bottom: '100px',
          background: 'linear-gradient(135deg, #0068FF, #0056D2)',
          boxShadow: '0 0 20px rgba(0,104,255,0.4)',
          color: '#4B9FFF',
          textDecoration: 'none',
        }}
      >
        <span className="pulse-ring" />
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
          <path d="M24 7C14.611 7 7 14.165 7 23C7 27.89 9.177 32.267 12.714 35.234V41L18.302 38.003C20.095 38.495 22.01 38.762 24 38.762C33.389 38.762 41 31.597 41 22.762C41 13.927 33.389 7 24 7Z" fill="white"/>
          <path d="M10.5 27L18.5 18.5L22.5 23L27.5 18.5L35.5 27L27.5 22.5L22.5 27L18.5 22.5L10.5 27Z" fill="#0068FF"/>
        </svg>
      </a>

      {/* Zalo */}
      <a
        href={siteSettings.zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        style={{
          bottom: '30px',
          background: 'linear-gradient(135deg, #00FF88, #00cc66)',
          boxShadow: '0 0 20px rgba(0,255,136,0.4)',
          color: '#00FF88',
          textDecoration: 'none',
          animationDelay: '1s',
        }}
      >
        <span className="pulse-ring" />
        <span style={{ fontSize: '0.85rem', color: '#000', fontWeight: 900, fontFamily: 'Arial' }}>Za</span>
      </a>
    </>
  );
}
