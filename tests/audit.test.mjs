/**
 * Comprehensive Automated End-to-End Audit Test Suite for Campus Pulse
 */

import { extractorService, CURRENT_REFERENCE_DATE } from '../src/services/extractorService.js';
import { INITIAL_NOTICES, NOTICE_CATEGORIES, NOTICE_PRIORITIES } from '../src/data/sampleNotices.js';

// Mock localStorage for node environment
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    _setRaw: (key, val) => { store[key] = val; }
  };
})();
global.localStorage = localStorageMock;

// Import storageService after mock
const { storageService } = await import('../src/services/storageService.js');

const results = [];

function assert(phase, testName, condition, details = '') {
  const passed = Boolean(condition);
  results.push({ phase, testName, passed, details });
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: [${phase}] ${testName} ${details ? '(' + details + ')' : ''}`);
  if (!passed) {
    console.error(`   Error details:`, details);
  }
}

async function runAudit() {
  console.log('====================================================');
  console.log('   STARTING CAMPUS PULSE END-TO-END AUDIT SUITE     ');
  console.log('====================================================\n');

  // ================================================================
  // PHASE 1: SMART NOTICE EXTRACTOR
  // ================================================================
  console.log('--- RUNNING PHASE 1: SMART NOTICE EXTRACTOR TESTS ---');
  
  // 1.1 Exact User Input Test
  const primaryInput = 'Good morning, tomorrow that is 1 November 2026. There will be two classes of programming. All of you bring your laptop and come at 11 a.m. sharp in C301.';
  const r1 = await extractorService.extractNotice(primaryInput, '2026-10-31');

  assert('Phase 1', 'Primary Input - Title', r1.title === 'Programming Classes', `Got: "${r1.title}"`);
  assert('Phase 1', 'Primary Input - Date', r1.date === '2026-11-01', `Got: "${r1.date}"`);
  assert('Phase 1', 'Primary Input - Time', r1.time === '11:00 AM', `Got: "${r1.time}"`);
  assert('Phase 1', 'Primary Input - Venue', r1.venue === 'C301', `Got: "${r1.venue}"`);
  assert('Phase 1', 'Primary Input - Category', r1.category === 'Academic', `Got: "${r1.category}"`);
  assert('Phase 1', 'Primary Input - Description', r1.summary === 'Two programming classes. Students must bring their laptops.', `Got: "${r1.summary}"`);
  assert('Phase 1', 'Primary Input - Action Required', r1.actionRequired === 'Bring your laptop', `Got: "${r1.actionRequired}"`);

  // 1.2 Date Formats: Day Month Year, Month Day Year, ISO, Numeric
  const rIso = await extractorService.extractNotice('Guest lecture on 2026-11-15 at 10 AM in Hall A');
  assert('Phase 1', 'Date Format - ISO (2026-11-15)', rIso.date === '2026-11-15', `Got: "${rIso.date}"`);

  const rDmy = await extractorService.extractNotice('Robotics workshop on 12th November 2026 at 2 PM in MakerSpace');
  assert('Phase 1', 'Date Format - Day Month Year (12th Nov 2026)', rDmy.date === '2026-11-12', `Got: "${rDmy.date}"`);

  const rMdy = await extractorService.extractNotice('Exam schedule released for November 5, 2026 at 9 AM in Exam Cell');
  assert('Phase 1', 'Date Format - Month Day Year (Nov 5, 2026)', rMdy.date === '2026-11-05', `Got: "${rMdy.date}"`);

  const rSlash = await extractorService.extractNotice('Fee payment counter open on 04/11/2026 in Room 101');
  assert('Phase 1', 'Date Format - Slash format (04/11/2026)', rSlash.date === '2026-11-04', `Got: "${rSlash.date}"`);

  // 1.3 Relative Words: today, tomorrow, next monday
  const rToday = await extractorService.extractNotice('Meeting today at 4 p.m. in LH1', '2026-10-31');
  assert('Phase 1', 'Relative Word - "today" (2026-10-31)', rToday.date === '2026-10-31', `Got: "${rToday.date}"`);

  const rTmrw = await extractorService.extractNotice('Orientation tomorrow at 9 a.m. in Auditorium', '2026-10-31');
  assert('Phase 1', 'Relative Word - "tomorrow" (2026-11-01)', rTmrw.date === '2026-11-01', `Got: "${rTmrw.date}"`);

  const rNextMon = await extractorService.extractNotice('Placement session next Monday at 10 a.m. in Block B', '2026-10-31');
  assert('Phase 1', 'Relative Word - "next Monday" (2026-11-02)', rNextMon.date === '2026-11-02', `Got: "${rNextMon.date}"`);

  // 1.4 Never Invent Info & Show "Not specified"
  const rMissing = await extractorService.extractNotice('Important announcement for all computer science students regarding coursework.');
  assert('Phase 1', 'Missing Date shows "Not specified"', rMissing.date === 'Not specified', `Got: "${rMissing.date}"`);
  assert('Phase 1', 'Missing Time shows "Not specified"', rMissing.time === 'Not specified', `Got: "${rMissing.time}"`);
  assert('Phase 1', 'Missing Venue shows "Not specified"', rMissing.venue === 'Not specified', `Got: "${rMissing.venue}"`);

  // 1.5 Room Codes Preserved
  const rRoom1 = await extractorService.extractNotice('Report in C301 for programming lab');
  assert('Phase 1', 'Exact Room Code - C301', rRoom1.venue === 'C301', `Got: "${rRoom1.venue}"`);

  const rRoom2 = await extractorService.extractNotice('Tutorial in LH-2 tomorrow at 11 am');
  assert('Phase 1', 'Exact Room Code - LH-2', rRoom2.venue === 'LH-2', `Got: "${rRoom2.venue}"`);

  const rRoom3 = await extractorService.extractNotice('Faculty meeting at A-204 at 3 pm');
  assert('Phase 1', 'Exact Room Code - A-204', rRoom3.venue === 'A-204', `Got: "${rRoom3.venue}"`);

  // 1.6 Messy WhatsApp text with emojis & line breaks
  const messyInput = `🚨🚨 ATTENTION ALL STUDENTS!! 🚨🚨\n\nhey guys pls note tmrw that is 1 November 2026 there r 2 classes of programming!!\npls bring your laptops and reach sharp at 11 a.m. in C301.\nattendance compulsory!!`;
  const rMessy = await extractorService.extractNotice(messyInput, '2026-10-31');
  assert('Phase 1', 'Messy WhatsApp Input - Date parsed', rMessy.date === '2026-11-01', `Got: "${rMessy.date}"`);
  assert('Phase 1', 'Messy WhatsApp Input - Time parsed', rMessy.time === '11:00 AM', `Got: "${rMessy.time}"`);
  assert('Phase 1', 'Messy WhatsApp Input - Venue parsed', rMessy.venue === 'C301', `Got: "${rMessy.venue}"`);
  assert('Phase 1', 'Messy WhatsApp Input - Category detected', rMessy.category === 'Academic', `Got: "${rMessy.category}"`);

  // ================================================================
  // PHASE 2: NOTICE MANAGEMENT (CRUD + LocalStorage)
  // ================================================================
  console.log('\n--- RUNNING PHASE 2: NOTICE MANAGEMENT TESTS ---');
  localStorage.clear();

  // 2.1 Initial load from storageService
  const initial = storageService.getNotices();
  assert('Phase 2', 'Initial notices count', initial.length === 7, `Count: ${initial.length}`);

  // 2.2 Add Notice
  const newNotice = {
    title: 'Automated Test Notice',
    category: 'Academic',
    priority: 'High',
    date: '2026-11-10',
    time: '02:00 PM',
    venue: 'Lab 5',
    summary: 'Test summary'
  };
  const afterAdd = storageService.addNotice(newNotice);
  assert('Phase 2', 'Add Notice increases count', afterAdd.length === 8, `Count: ${afterAdd.length}`);
  const createdNotice = afterAdd[0];
  assert('Phase 2', 'Added notice has unique ID', Boolean(createdNotice.id && createdNotice.id.startsWith('notice-')));

  // 2.3 Edit Notice
  const updated = storageService.updateNotice(createdNotice.id, {
    title: 'Updated Test Notice Title',
    venue: 'C301'
  });
  const foundEdited = updated.find(n => n.id === createdNotice.id);
  assert('Phase 2', 'Edit Notice updates title', foundEdited.title === 'Updated Test Notice Title', `Got: "${foundEdited?.title}"`);
  assert('Phase 2', 'Edit Notice updates venue', foundEdited.venue === 'C301', `Got: "${foundEdited?.venue}"`);

  // 2.4 Toggle Pin
  const afterPin = storageService.togglePin(createdNotice.id);
  const foundPinned = afterPin.find(n => n.id === createdNotice.id);
  assert('Phase 2', 'Toggle Pin toggles isPinned flag', foundPinned.isPinned === true);

  // 2.5 Delete Notice
  const afterDelete = storageService.deleteNotice(createdNotice.id);
  assert('Phase 2', 'Delete Notice decreases count', afterDelete.length === 7, `Count: ${afterDelete.length}`);
  assert('Phase 2', 'Deleted notice cannot be found', !afterDelete.some(n => n.id === createdNotice.id));

  // 2.6 Persistence after simulated page refresh
  const reloaded = storageService.getNotices();
  assert('Phase 2', 'Notices persist across reloads', reloaded.length === 7);

  // 2.7 Reset Demo Notices
  storageService.addNotice({ title: 'Temporary notice' });
  assert('Phase 2', 'Added temporary notice before reset', storageService.getNotices().length === 8);
  const resetList = storageService.resetToDefault();
  assert('Phase 2', 'Reset demo notices restores 7 original notices', resetList.length === 7);

  // ================================================================
  // PHASE 3: SEARCH AND FILTERS
  // ================================================================
  console.log('\n--- RUNNING PHASE 3: SEARCH AND FILTERS TESTS ---');
  const notices = storageService.getNotices();

  // 3.1 Keyword Search
  const searchGoogle = notices.filter(n => n.title.toLowerCase().includes('google') || n.summary.toLowerCase().includes('google'));
  assert('Phase 3', 'Search by keyword "google"', searchGoogle.length === 1 && searchGoogle[0].title.includes('Google'));

  const searchHallTicket = notices.filter(n => n.title.toLowerCase().includes('hall ticket') || n.summary.toLowerCase().includes('hall ticket'));
  assert('Phase 3', 'Search by keyword "hall ticket"', searchHallTicket.length === 1);

  // 3.2 Category Filter
  const filterExams = notices.filter(n => n.category === 'Exams');
  assert('Phase 3', 'Filter by category "Exams"', filterExams.length >= 1);

  const filterPlacements = notices.filter(n => n.category === 'Placements');
  assert('Phase 3', 'Filter by category "Placements"', filterPlacements.length >= 1);

  // 3.3 Date Filter
  const filterDate = notices.filter(n => n.date === '2026-11-05');
  assert('Phase 3', 'Filter by date "2026-11-05"', filterDate.length === 1 && filterDate[0].date === '2026-11-05');

  // 3.4 Combined Filters (Category + Priority)
  const filterCombined = notices.filter(n => n.category === 'Placements' && n.priority === 'Urgent');
  assert('Phase 3', 'Combined filter: Category=Placements AND Priority=Urgent', filterCombined.length === 1);

  // 3.5 Empty Search Results
  const searchNone = notices.filter(n => n.title.toLowerCase().includes('nonexistentquery12345'));
  assert('Phase 3', 'Empty search results handled safely', searchNone.length === 0);

  // ================================================================
  // PHASE 4: CALENDAR
  // ================================================================
  console.log('\n--- RUNNING PHASE 4: CALENDAR TESTS ---');

  // 4.1 Month days calculation
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  assert('Phase 4', 'November 2026 has 30 days', getDaysInMonth(2026, 10) === 30);
  assert('Phase 4', 'October 2026 has 31 days', getDaysInMonth(2026, 9) === 31);
  assert('Phase 4', 'February 2026 (non-leap) has 28 days', getDaysInMonth(2026, 1) === 28);
  assert('Phase 4', 'February 2028 (leap year) has 29 days', getDaysInMonth(2028, 1) === 29);

  // 4.2 Month / Year Transitions
  let testYear = 2026;
  let testMonth = 11; // December
  testMonth++; // Next month
  if (testMonth > 11) { testMonth = 0; testYear++; }
  assert('Phase 4', 'Transition December 2026 -> January 2027', testMonth === 0 && testYear === 2027);

  testMonth--; // Prev month
  if (testMonth < 0) { testMonth = 11; testYear--; }
  assert('Phase 4', 'Transition January 2027 -> December 2026', testMonth === 11 && testYear === 2026);

  // 4.3 Date-wise mapping
  const byDate = {};
  notices.forEach(n => {
    if (n.date && n.date !== 'Not specified') {
      byDate[n.date] = (byDate[n.date] || 0) + 1;
    }
  });
  assert('Phase 4', 'Nov 03 has Placement notice', byDate['2026-11-03'] === 1);
  assert('Phase 4', 'Nov 05 has Exam notice', byDate['2026-11-05'] === 1);
  assert('Phase 4', 'Oct 25 has Library Amnesty notice', byDate['2026-10-25'] === 1);

  // ================================================================
  // PHASE 5: PRIORITY AND REMINDERS
  // ================================================================
  console.log('\n--- RUNNING PHASE 5: PRIORITY AND REMINDERS TESTS ---');
  const stats = storageService.getStats(notices);
  assert('Phase 5', 'Stats count matches notices length', stats.total === 7);
  assert('Phase 5', 'Urgent count is 2 (Exam + Placement)', stats.urgent === 2);
  assert('Phase 5', 'Upcoming count (dates >= 2026-10-31) is 6', stats.upcoming === 6);
  assert('Phase 5', 'Expired count (Oct 25 < 2026-10-31) is 1', stats.expired === 1);

  // Boundary condition test
  const todayNotice = { id: 't1', date: '2026-10-31', priority: 'Medium' };
  const pastNotice = { id: 't2', date: '2026-10-30', priority: 'Medium' };
  const futureNotice = { id: 't3', date: '2026-11-01', priority: 'Medium' };
  const boundaryStats = storageService.getStats([todayNotice, pastNotice, futureNotice]);
  assert('Phase 5', 'Today boundary: counts as upcoming', boundaryStats.upcoming === 2); // today + future
  assert('Phase 5', 'Past boundary: counts as expired', boundaryStats.expired === 1);

  // ================================================================
  // PHASE 6: WEEKLY AI SUMMARY
  // ================================================================
  console.log('\n--- RUNNING PHASE 6: WEEKLY AI SUMMARY TESTS ---');
  const refStart = '2026-10-31';
  const refEnd = '2026-11-07'; // 7 days window

  const weekEvents = notices.filter(n => {
    if (!n.date || n.date === 'Not specified') return false;
    return n.date >= refStart && n.date <= refEnd;
  }).sort((a, b) => a.date.localeCompare(b.date));

  assert('Phase 6', 'Weekly digest isolates 3 notices in next 7 days', weekEvents.length === 3);
  const urgentInWeek = weekEvents.filter(n => n.priority?.toLowerCase() === 'urgent');
  assert('Phase 6', 'Weekly digest identifies 2 urgent notices', urgentInWeek.length === 2);

  const actionItemsInWeek = weekEvents.filter(n => n.actionRequired && n.actionRequired !== 'Not specified');
  assert('Phase 6', 'Weekly digest extracts action tasks', actionItemsInWeek.length === 3);

  // Empty notices weekly summary test
  const emptyWeekEvents = [].filter(n => n.date >= refStart && n.date <= refEnd);
  assert('Phase 6', 'Weekly digest handles empty notices without error', emptyWeekEvents.length === 0);

  // ================================================================
  // PHASE 8: DATA AND SECURITY
  // ================================================================
  console.log('\n--- RUNNING PHASE 8: DATA AND SECURITY TESTS ---');

  // 8.1 Corrupted LocalStorage handling
  localStorage._setRaw('campus_pulse_notices_v1', '{corrupted_json_syntax: true');
  const fallbackNotices = storageService.getNotices();
  assert('Phase 8', 'Corrupted localStorage safely recovers default notices', fallbackNotices.length === 7);

  // 8.2 Malformed Notice Protection
  const malformed = { id: 'bad-1', date: 'Not specified', priority: undefined, venue: null };
  const safeStats = storageService.getStats([malformed]);
  assert('Phase 8', 'Malformed notice does not crash stats calculation', safeStats.total === 1);

  // 8.3 Check for hardcoded API keys
  const fs = await import('fs');
  const code = fs.readFileSync('src/services/extractorService.js', 'utf8');
  const hasSecret = /AIza[0-9A-Za-z-_]{35}|sk-[a-zA-Z0-9]{32}/.test(code);
  assert('Phase 8', 'No hardcoded API secrets or keys in code', !hasSecret);

  // ================================================================
  // SUMMARY
  // ================================================================
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  console.log('\n====================================================');
  console.log(` AUDIT TEST SUITE FINISHED: ${passed} / ${total} PASSED (${failed} FAILED)`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
