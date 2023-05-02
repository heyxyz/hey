import Head from 'next/head';
import { useNotificationPersistStore } from 'src/store/notification';

export const Favicon = () => {
  const hasUnreadNotifications = useNotificationPersistStore(
    (state) => state.hasUnreadNotifications
  );

  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/favicon-32x32${
          hasUnreadNotifications ? '-notification' : ''
        }.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/favicon-16x16${
          hasUnreadNotifications ? '-notification' : ''
        }.png`}
      />
    </Head>
  );
};
