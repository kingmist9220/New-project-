import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import EditPage from './pages/EditPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import AllPages from './pages/AllPages.jsx';
import RecentChanges from './pages/RecentChanges.jsx';
import RandomPage from './pages/RandomPage.jsx';
import CreatePage from './pages/CreatePage.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/wiki/Main_Page" replace />} />
        <Route path="/wiki/:slug" element={<ArticlePage />} />
        <Route path="/wiki/:slug/edit" element={<EditPage />} />
        <Route path="/wiki/:slug/history" element={<HistoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/special/all" element={<AllPages />} />
        <Route path="/special/recent" element={<RecentChanges />} />
        <Route path="/special/random" element={<RandomPage />} />
        <Route path="/special/create" element={<CreatePage />} />
        <Route path="*" element={<Navigate to="/wiki/Main_Page" replace />} />
      </Routes>
    </Layout>
  );
}
