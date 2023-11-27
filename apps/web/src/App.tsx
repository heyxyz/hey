import Providers from '@components/Common/Providers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

function App() {
  return (
    <BrowserRouter basename="/">
      <Providers>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/mod" element={<Mod />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/search" element={<Search />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/g/:slug" element={<GroupHandler />} />
          <Route path="/new/profile" element={<NewProfile />} />
          <Route path="/nft/:chain/:address/:token" element={<NFTHandler />} />
          <Route path="/posts/:id" element={<PostsHandler />} />
          <Route path="/profile/:id" element={<UserHandler />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/account" element={<SettingsAccount />} />
          <Route path="/settings/actions" element={<SettingsActions />} />
          <Route path="/settings/allowance" element={<SettingsAllowance />} />
          <Route path="/settings/blocked" element={<SettingsBlocked />} />
          <Route path="/settings/cleanup" element={<SettingsCleanup />} />
          <Route path="/settings/danger" element={<SettingsDanger />} />
          <Route path="/settings/export" element={<SettingsExport />} />
          <Route path="/settings/handles" element={<SettingsHandles />} />
          <Route path="/settings/interests" element={<SettingsInterests />} />
          <Route path="/settings/manager" element={<SettingsManager />} />
          <Route
            path="/settings/preferences"
            element={<SettingsPreferences />}
          />
          <Route path="/settings/sessions" element={<SettingsSessions />} />
          <Route path="/u/:handle" element={<UserHandler />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
