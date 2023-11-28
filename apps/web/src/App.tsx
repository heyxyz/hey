import Providers from '@components/Common/Providers';
import Loading from '@components/Shared/Loading';
import * as React from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Bookmarks = React.lazy(() => import('./pages/bookmarks'));
const GroupHandler = React.lazy(() => import('./pages/g/[slug]'));
const Homepage = React.lazy(() => import('./pages/index'));
const Mod = React.lazy(() => import('./pages/mod'));
const NewProfile = React.lazy(() => import('./pages/new/profile'));
const NFTHandler = React.lazy(
  () => import('./pages/nft/[chain]/[address]/[token]')
);
const Notifications = React.lazy(() => import('./pages/notifications'));
const PostsHandler = React.lazy(() => import('./pages/posts/[id]'));
const Privacy = React.lazy(() => import('./pages/privacy'));
const Pro = React.lazy(() => import('./pages/pro'));
const Search = React.lazy(() => import('./pages/search'));
const SettingsAccount = React.lazy(() => import('./pages/settings/account'));
const SettingsActions = React.lazy(() => import('./pages/settings/actions'));
const SettingsAllowance = React.lazy(
  () => import('./pages/settings/allowance')
);
const SettingsBlocked = React.lazy(() => import('./pages/settings/blocked'));
const SettingsCleanup = React.lazy(() => import('./pages/settings/cleanup'));
const SettingsDanger = React.lazy(() => import('./pages/settings/danger'));
const SettingsExport = React.lazy(() => import('./pages/settings/export'));
const SettingsHandles = React.lazy(() => import('./pages/settings/handles'));
const Settings = React.lazy(() => import('./pages/settings/index'));
const SettingsInterests = React.lazy(
  () => import('./pages/settings/interests')
);
const SettingsManager = React.lazy(() => import('./pages/settings/manager'));
const SettingsPreferences = React.lazy(
  () => import('./pages/settings/preferences')
);
const SettingsSessions = React.lazy(() => import('./pages/settings/sessions'));
const Terms = React.lazy(() => import('./pages/terms'));
const Thanks = React.lazy(() => import('./pages/thanks'));
const UserHandler = React.lazy(() => import('./pages/u/[handle]'));
const Explore = React.lazy(() => import('./pages/explore'));

function Layout() {
  return <Outlet />;
}

export default function App() {
  return (
    <React.Suspense fallback={<Loading />}>
      <Providers>
        <Routes>
          <Route path="/" element={<Layout />}>
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
            <Route path="u/:handle" element={<UserHandler />} />
          </Route>
        </Routes>
      </Providers>
    </React.Suspense>
  );
}
