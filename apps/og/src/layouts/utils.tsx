import React from 'react';

const entityMap: { [key: string]: string } = {
  "'": '&#39;',
  '"': '&quot;',
  '/': '&#x2F;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

export function sanitizeHtml(html: string) {
  return String(html)
    .replace(/["&'/<>]/g, (key) => entityMap[key])
    .replace('\\n', '<br />');
}

export const RLogo: React.FC<{
  style?: React.CSSProperties;
  theme?: 'dark' | 'light';
}> = ({ style, theme = 'dark', ...props }) => {
  const rlogo =
    theme === 'dark'
      ? 'https://railway.app/brand/logo-light.svg'
      : 'https://railway.app/brand/logo-dark.svg';

  return (
    <img
      className="rlogo"
      src={rlogo}
      style={{ height: 96, width: 96, ...style }}
      {...props}
    />
  );
};

export const GradientBackground: React.FC<{ theme?: 'dark' | 'light' }> = ({
  theme = 'dark'
}) => {
  if (theme == 'dark') {
    return (
      <div
        style={{ background: `#13111C` }}
        tw="absolute inset-0 flex justify-start items-end w-full h-full"
      >
        <div
          style={{
            background:
              'linear-gradient(327.21deg, rgba(33, 0, 75, 0.35) 3.65%, rgba(60, 0, 136, 0) 40.32%)'
          }}
          tw="absolute inset-0"
        />
        <div
          style={{
            background:
              'linear-gradient(245.93deg, rgba(209, 21, 111, 0.26) 0%, rgba(209, 25, 80, 0) 36.63%)'
          }}
          tw="absolute inset-0"
        />
        <div
          style={{
            background:
              'linear-gradient(147.6deg, rgba(58, 19, 255, 0) 29.79%, rgba(98, 19, 255, 0.1) 85.72%)'
          }}
          tw="absolute inset-0"
        />
      </div>
    );
  }

  return (
    <div
      style={{ background: `#ffffff` }}
      tw="absolute inset-0 flex justify-start items-end w-full h-full"
    >
      <div
        style={{
          background:
            'linear-gradient(71.9deg, rgba(243, 91, 164, 0.3) -15.4%, rgba(209, 25, 80, 0) 46.76%)'
        }}
        tw="absolute inset-0"
      />
      <div
        style={{
          background:
            'linear-gradient(149.36deg, rgba(190, 178, 251, 0) 37.9%, rgba(164, 94, 252, 0.19) 81.22%)'
        }}
        tw="absolute inset-0"
      />
    </div>
  );
};
