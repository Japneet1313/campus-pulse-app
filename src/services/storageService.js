import { INITIAL_NOTICES } from '../data/sampleNotices.js';

const STORAGE_KEY = 'campus_pulse_notices_v1';
const TODAY_DATE = '2026-10-31';

export const storageService = {
  getNotices: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTICES));
        return INITIAL_NOTICES;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Failed to load notices from localStorage:', err);
      return INITIAL_NOTICES;
    }
  },

  saveNotices: (notices) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    } catch (err) {
      console.error('Failed to save notices to localStorage:', err);
    }
  },

  addNotice: (notice) => {
    const notices = storageService.getNotices();
    const newNotice = {
      ...notice,
      id: `notice-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isPinned: notice.isPinned || false,
      isRead: false
    };
    const updated = [newNotice, ...notices];
    storageService.saveNotices(updated);
    return updated;
  },

  updateNotice: (id, patch) => {
    const notices = storageService.getNotices();
    const updated = notices.map(item => item.id === id ? { ...item, ...patch } : item);
    storageService.saveNotices(updated);
    return updated;
  },

  deleteNotice: (id) => {
    const notices = storageService.getNotices();
    const updated = notices.filter(item => item.id !== id);
    storageService.saveNotices(updated);
    return updated;
  },

  togglePin: (id) => {
    const notices = storageService.getNotices();
    const updated = notices.map(item => item.id === id ? { ...item, isPinned: !item.isPinned } : item);
    storageService.saveNotices(updated);
    return updated;
  },

  toggleRead: (id) => {
    const notices = storageService.getNotices();
    const updated = notices.map(item => item.id === id ? { ...item, isRead: !item.isRead } : item);
    storageService.saveNotices(updated);
    return updated;
  },

  resetToDefault: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTICES));
    return INITIAL_NOTICES;
  },

  getStats: (notices) => {
    const total = notices.length;
    let urgent = 0;
    let upcoming = 0;
    let expired = 0;

    notices.forEach(n => {
      if (n.priority?.toLowerCase() === 'urgent') {
        urgent++;
      }
      if (n.date && n.date !== 'Not specified') {
        if (n.date >= TODAY_DATE) {
          upcoming++;
        } else {
          expired++;
        }
      }
    });

    return { total, urgent, upcoming, expired, todayDate: TODAY_DATE };
  }
};
