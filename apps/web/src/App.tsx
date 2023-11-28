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
    // <Providers>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Homepage />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="bookmarks"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Bookmarks />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="explore"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Explore />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="mod"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Mod />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Notifications />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="privacy"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Privacy />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="pro"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Pro />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="search"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Search />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="terms"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Terms />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="thanks"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <Thanks />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="g/:slug"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <GroupHandler />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="new/profile"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <NewProfile />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="nft/:chain/:address/:token"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <NFTHandler />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="posts/:id"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <PostsHandler />
              </Providers>
            </React.Suspense>
          }
        />
        <Route
          path="profile/:id"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <UserHandler />
              </Providers>
            </React.Suspense>
          }
        />
        <Route path="settings" element={<Layout />}>
          <Route
            index
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <Settings />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="account"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsAccount />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="actions"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsActions />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="allowance"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsAllowance />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="blocked"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsBlocked />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="cleanup"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsCleanup />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="danger"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsDanger />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="export"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsExport />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="handles"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsHandles />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="interests"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsInterests />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="manager"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsManager />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="preferences"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsPreferences />
                </Providers>
              </React.Suspense>
            }
          />
          <Route
            path="sessions"
            element={
              <React.Suspense fallback={<Loading />}>
                <Providers>
                  <SettingsSessions />
                </Providers>
              </React.Suspense>
            }
          />
        </Route>
        <Route
          path="u/:handle"
          element={
            <React.Suspense fallback={<Loading />}>
              <Providers>
                <UserHandler />
              </Providers>
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
    // </Providers>
  );
}
