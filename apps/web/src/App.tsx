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
    <Providers>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <React.Suspense fallback={<Loading />}>
                <Homepage />
              </React.Suspense>
            }
          />
          <Route
            path="bookmarks"
            element={
              <React.Suspense fallback={<Loading />}>
                <Bookmarks />
              </React.Suspense>
            }
          />
          <Route
            path="explore"
            element={
              <React.Suspense fallback={<Loading />}>
                <Explore />
              </React.Suspense>
            }
          />
          <Route
            path="mod"
            element={
              <React.Suspense fallback={<Loading />}>
                <Mod />
              </React.Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <React.Suspense fallback={<Loading />}>
                <Notifications />
              </React.Suspense>
            }
          />
          <Route
            path="privacy"
            element={
              <React.Suspense fallback={<Loading />}>
                <Privacy />
              </React.Suspense>
            }
          />
          <Route
            path="pro"
            element={
              <React.Suspense fallback={<Loading />}>
                <Pro />
              </React.Suspense>
            }
          />
          <Route
            path="search"
            element={
              <React.Suspense fallback={<Loading />}>
                <Search />
              </React.Suspense>
            }
          />
          <Route
            path="terms"
            element={
              <React.Suspense fallback={<Loading />}>
                <Terms />
              </React.Suspense>
            }
          />
          <Route
            path="thanks"
            element={
              <React.Suspense fallback={<Loading />}>
                <Thanks />
              </React.Suspense>
            }
          />
          <Route
            path="g/:slug"
            element={
              <React.Suspense fallback={<Loading />}>
                <GroupHandler />
              </React.Suspense>
            }
          />
          <Route
            path="new/profile"
            element={
              <React.Suspense fallback={<Loading />}>
                <NewProfile />
              </React.Suspense>
            }
          />
          <Route
            path="nft/:chain/:address/:token"
            element={
              <React.Suspense fallback={<Loading />}>
                <NFTHandler />
              </React.Suspense>
            }
          />
          <Route
            path="posts/:id"
            element={
              <React.Suspense fallback={<Loading />}>
                <PostsHandler />
              </React.Suspense>
            }
          />
          <Route
            path="profile/:id"
            element={
              <React.Suspense fallback={<Loading />}>
                <UserHandler />
              </React.Suspense>
            }
          />
          <Route path="settings" element={<Layout />}>
            <Route
              index
              element={
                <React.Suspense fallback={<Loading />}>
                  <Settings />
                </React.Suspense>
              }
            />
            <Route
              path="account"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsAccount />
                </React.Suspense>
              }
            />
            <Route
              path="actions"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsActions />
                </React.Suspense>
              }
            />
            <Route
              path="allowance"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsAllowance />
                </React.Suspense>
              }
            />
            <Route
              path="blocked"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsBlocked />
                </React.Suspense>
              }
            />
            <Route
              path="cleanup"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsCleanup />
                </React.Suspense>
              }
            />
            <Route
              path="danger"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsDanger />
                </React.Suspense>
              }
            />
            <Route
              path="export"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsExport />
                </React.Suspense>
              }
            />
            <Route
              path="handles"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsHandles />
                </React.Suspense>
              }
            />
            <Route
              path="interests"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsInterests />
                </React.Suspense>
              }
            />
            <Route
              path="manager"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsManager />
                </React.Suspense>
              }
            />
            <Route
              path="preferences"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsPreferences />
                </React.Suspense>
              }
            />
            <Route
              path="sessions"
              element={
                <React.Suspense fallback={<Loading />}>
                  <SettingsSessions />
                </React.Suspense>
              }
            />
          </Route>
          <Route
            path="u/:handle"
            element={
              <React.Suspense fallback={<Loading />}>
                <UserHandler />
              </React.Suspense>
            }
          />
        </Route>
      </Routes>
    </Providers>
  );
}
