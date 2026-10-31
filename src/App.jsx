import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ExtractionModal from './components/ExtractionModal';
import NoticeDetailModal from './components/NoticeDetailModal';
import DashboardView from './views/DashboardView';
import AllNoticesView from './views/AllNoticesView';
import CalendarView from './views/CalendarView';
import AISummaryView from './views/AISummaryView';
import { storageService } from './services/storageService';
import { CheckCircle2, Info, X } from 'lucide-react';

export default function App() {
  const [notices, setNotices] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [detailModalNotice, setDetailModalNotice] = useState(null);
  const [extractionModalData, setExtractionModalData] = useState(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState(null);

  // Load notices from localStorage on mount
  useEffect(() => {
    const loaded = storageService.getNotices();
    setNotices(loaded);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Stats calculation
  const stats = storageService.getStats(notices);

  // Handlers
  const handleNoticeExtracted = (extracted) => {
    setExtractionModalData(extracted);
  };

  const handleEditNotice = (notice) => {
    setExtractionModalData(notice);
  };

  const handleSaveNotice = (formData) => {
    if (formData.id) {
      const updated = storageService.updateNotice(formData.id, formData);
      setNotices(updated);
      setExtractionModalData(null);
      if (detailModalNotice && detailModalNotice.id === formData.id) {
        setDetailModalNotice({ ...detailModalNotice, ...formData });
      }
      showToast('Notice updated successfully!');
    } else {
      const updated = storageService.addNotice(formData);
      setNotices(updated);
      setExtractionModalData(null);
      showToast('Notice successfully published to Campus Pulse!');
    }
  };

  const handleTogglePin = (id) => {
    const updated = storageService.togglePin(id);
    setNotices(updated);
    showToast('Notice pin status updated.');
  };

  const handleToggleRead = (id) => {
    const updated = storageService.toggleRead(id);
    setNotices(updated);
  };

  const handleDeleteNotice = (id) => {
    const updated = storageService.deleteNotice(id);
    setNotices(updated);
    if (detailModalNotice && detailModalNotice.id === id) {
      setDetailModalNotice(null);
    }
    showToast('Notice removed from dashboard.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all notices to default sample college notices?')) {
      const reset = storageService.resetToDefault();
      setNotices(reset);
      showToast('Restored default college circulars.');
    }
  };

  const handleOpenNewNoticeModal = () => {
    // Scroll to extractor if on dashboard, or open demo modal
    if (currentView !== 'dashboard') {
      setCurrentView('dashboard');
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleStatCardClick = (statId) => {
    setCurrentView('all-notices');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-900 to-navy-900 border border-purple-400/40 text-white text-xs sm:text-sm font-medium shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        stats={stats}
        onResetData={handleResetData}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area (offset by sidebar width on md+ screens) */}
      <div className="md:pl-72 flex flex-col flex-1 min-w-0 transition-all">
        {/* Top Sticky Header */}
        <Header
          onMenuToggle={() => setMobileOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentView !== 'all-notices') {
              setCurrentView('all-notices');
            }
          }}
          onOpenNewNotice={handleOpenNewNoticeModal}
          currentView={currentView}
          urgentCount={stats.urgent}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              notices={notices}
              stats={stats}
              onNoticeExtracted={handleNoticeExtracted}
              onViewDetails={(notice) => setDetailModalNotice(notice)}
              onTogglePin={handleTogglePin}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteNotice}
              onEdit={handleEditNotice}
              onNavigateToAll={() => setCurrentView('all-notices')}
              onStatClick={handleStatCardClick}
            />
          )}

          {currentView === 'all-notices' && (
            <AllNoticesView
              notices={notices}
              searchQuery={searchQuery}
              onViewDetails={(notice) => setDetailModalNotice(notice)}
              onTogglePin={handleTogglePin}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteNotice}
              onEdit={handleEditNotice}
              onOpenNewNotice={handleOpenNewNoticeModal}
            />
          )}

          {currentView === 'calendar' && (
            <CalendarView
              notices={notices}
              onViewDetails={(notice) => setDetailModalNotice(notice)}
            />
          )}

          {currentView === 'ai-summary' && (
            <AISummaryView
              notices={notices}
              onViewDetails={(notice) => setDetailModalNotice(notice)}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/10 py-5 px-6 text-center text-xs text-slate-500 bg-navy-950/80">
          <p className="flex items-center justify-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-400">Campus Pulse</span> &bull; Built for College Hackathons &bull; 
            <span className="text-purple-400">Demo Heuristic Mode Active</span>
          </p>
        </footer>
      </div>

      {/* Extraction Review Modal */}
      <ExtractionModal
        extractedData={extractionModalData}
        isOpen={Boolean(extractionModalData)}
        onClose={() => setExtractionModalData(null)}
        onSave={handleSaveNotice}
      />

      {/* Notice Detail Inspection Modal */}
      <NoticeDetailModal
        notice={detailModalNotice}
        isOpen={Boolean(detailModalNotice)}
        onClose={() => setDetailModalNotice(null)}
        onTogglePin={handleTogglePin}
        onDelete={handleDeleteNotice}
        onEdit={handleEditNotice}
      />
    </div>
  );
}
