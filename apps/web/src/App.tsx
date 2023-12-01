import { Outlet, Route, Routes } from 'react-router-dom';

import Providers from '@/components/Common/Providers';
import Custom404 from '@/pages/404';

import Bookmarks from './pages/bookmarks';
import Explore from './pages/explore';
import GroupHandler from './pages/g/[slug]';
import Homepage from './pages/index';
import Mod from './pages/mod';
import NewProfile from './pages/new/profile';
import NFTHandler from './pages/nft/[chain]/[address]/[token]';
import Notifications from './pages/notifications';
import PostsHandler from './pages/posts/[id]';
import Privacy from './pages/privacy';
import Pro from './pages/pro';
import Search from './pages/search';
import SettingsAccount from './pages/settings/account';
import SettingsActions from './pages/settings/actions';
import SettingsAllowance from './pages/settings/allowance';
import SettingsBlocked from './pages/settings/blocked';
import SettingsCleanup from './pages/settings/cleanup';
import SettingsDanger from './pages/settings/danger';
import SettingsExport from './pages/settings/export';
import SettingsHandles from './pages/settings/handles';
import Settings from './pages/settings/index';
import SettingsInterests from './pages/settings/interests';
import SettingsManager from './pages/settings/manager';
import SettingsPreferences from './pages/settings/preferences';
import SettingsSessions from './pages/settings/sessions';
import Terms from './pages/terms';
import Thanks from './pages/thanks';
import UserHandler from './pages/u/[handle]';

function Layout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Providers>
      <Routes>
        <Route errorElement={<Custom404 />} path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="explore" element={<Explore />} />
          <Route path="mod" element={<Mod />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="pro" element={<Pro />} />
          <Route path="search" element={<Search />} />
          <Route path="terms" element={<Terms />} />
          <Route path="thanks" element={<Thanks />} />
          <Route path="g/:slug" element={<GroupHandler />} />
          <Route path="new/profile" element={<NewProfile />} />
          <Route path="nft/:chain/:address/:token" element={<NFTHandler />} />
          <Route path="posts/:id" element={<PostsHandler />} />
          <Route path="profile/:id" element={<UserHandler />} />
          <Route path="u/:handle" element={<UserHandler />} />
          <Route path="settings" element={<Layout />}>
            <Route index element={<Settings />} />
            <Route path="account" element={<SettingsAccount />} />
            <Route path="actions" element={<SettingsActions />} />
            <Route path="allowance" element={<SettingsAllowance />} />
            <Route path="blocked" element={<SettingsBlocked />} />
            <Route path="cleanup" element={<SettingsCleanup />} />
            <Route path="danger" element={<SettingsDanger />} />
            <Route path="export" element={<SettingsExport />} />
            <Route path="handles" element={<SettingsHandles />} />
            <Route path="interests" element={<SettingsInterests />} />
            <Route path="manager" element={<SettingsManager />} />
            <Route path="preferences" element={<SettingsPreferences />} />
            <Route path="sessions" element={<SettingsSessions />} />
          </Route>
          <Route path="*" element={<Custom404 />} />
        </Route>
      </Routes>
    </Providers>
  );
}
