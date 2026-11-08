import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7657E8 0%, #9B82F3 100%)',
          borderRadius: '40px',
        }}
      >
        <svg
          width="116"
          height="116"
          viewBox="0 0 32 32"
          fill="none"
        >
          {/* TalkNow Speech Bubble */}
          <path
            d="M25 18a2 2 0 0 1-2 2H11l-5 4V8a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2z"
            fill="#FFFFFF"
          />
          {/* Voice frequency bars */}
          <line x1="12" y1="11.5" x2="12" y2="16.5" stroke="#7657E8" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="9.5" x2="16" y2="18.5" stroke="#7657E8" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="20" y1="12" x2="20" y2="16" stroke="#7657E8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
