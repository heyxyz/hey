import Homepage from './pages/index';
import Explore from './pages/explore';
import Bookmarks from './pages/bookmarks';
import Mod from './pages/mod';
import Notifications from './pages/notifications';
import Privacy from './pages/privacy';
import Pro from './pages/pro';
import Search from './pages/search';
import Terms from './pages/terms';
import Thanks from './pages/thanks';
import UserHandler from './pages/u/[handle]';
import Providers from '@components/Common/Providers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
          <Route path="/u/:handle" element={<UserHandler />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
}

export default App;
