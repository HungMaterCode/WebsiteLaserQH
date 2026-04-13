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
          bottom: 'clamp(80px, 15vh, 100px)',
          background: 'linear-gradient(135deg, #00B2FF, #006AFF, #9B33FF, #D633FF, #FF548F)',
          boxShadow: '0 10px 25px rgba(0, 178, 255, 0.3)',
          color: '#fff',
          textDecoration: 'none',
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span className="pulse-ring" style={{ borderColor: '#FF548F' }} />
        <svg 
          width="32" 
          height="32" 
          viewBox="0 0 28 28" 
          fill="white" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 2C7.373 2 2 6.941 2 13.04c0 3.473 1.733 6.574 4.453 8.527V26l4.246-2.333c1.066.296 2.197.453 3.301.453 6.627 0 12-4.941 12-11.04C26 6.941 20.627 2 14 2zm1.606 14.974l-3.076-3.28-5.996 3.28 6.59-6.994 3.076 3.28 5.996-3.28-6.59 6.994z" />
        </svg>
      </a>

      {/* Zalo */}
      <a
        href={siteSettings.zaloLink}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-btn"
        style={{
          bottom: 'clamp(20px, 5vh, 30px)',
          background: 'linear-gradient(135deg, #00FF88, #00cc66)',
          boxShadow: '0 0 20px rgba(0,255,136,0.4)',
          color: '#00FF88',
          textDecoration: 'none',
          animationDelay: '1s',
          zIndex: 30,
        }}
      >
        <span className="pulse-ring" />
        <span style={{ fontSize: '0.85rem', color: '#000', fontWeight: 900, fontFamily: 'Arial' }}>Za</span>
      </a>
    </>
  );
}
