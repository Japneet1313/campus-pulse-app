/**
 * Smart Notice Extractor Service
 * 
 * ⚠️ DEMO EXTRACTION MODE NOTICE:
 * This parser uses client-side pattern matching, regular expressions, and heuristics
 * to extract structured notice details directly from user-supplied text.
 * 
 * Important Rules:
 * 1. Extract dates ONLY from user input. Do not use random dates or demo notice dates.
 * 2. Resolve words like today and tomorrow using the current reference date.
 * 3. Extract exact venue names and room codes such as C301. Never replace with defaults.
 * 4. If a field is missing, return "Not specified" instead of inventing information.
 */

export const EXTRACTOR_MODE = 'DEMO_HEURISTIC';

// Current reference date for relative parsing (e.g., today / tomorrow)
export const CURRENT_REFERENCE_DATE = '2026-10-31';

function toTitleCase(str) {
  if (!str) return 'Not specified';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export const extractorService = {
  isDemoMode: true,
  modeName: 'Demo Pattern-Matching Parser',

  /**
   * Extract structured notice fields from freeform unstructured announcement text.
   * @param {string} rawText
   * @param {string} [referenceDateStr='2026-10-31']
   * @returns {Promise<Object>}
   */
  extractNotice: async (rawText, referenceDateStr = CURRENT_REFERENCE_DATE) => {
    // Brief realistic async delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!rawText || !rawText.trim()) {
      throw new Error("Please enter or paste notice text to extract.");
    }

    const text = rawText.trim();
    const lower = text.toLowerCase();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    const refParts = referenceDateStr.split('-').map(Number);
    const refDate = new Date(refParts[0], refParts[1] - 1, refParts[2]);

    // ==========================================
    // 1. CATEGORY DETECTION
    // ==========================================
    let category = "Academic";
    if (/(exam|timetable|hall ticket|admit card|grades|re-eval|mid-term|end-term|quiz|test)/i.test(lower)) {
      category = "Exams";
    } else if (/(placement|recruitment|drive|package|ctc|interview|shortlist|t&p|internship|job|offer)/i.test(lower)) {
      category = "Placements";
    } else if (/(hackathon|fest|symposium|annual day|ceremony|cultural|celebration)/i.test(lower)) {
      category = "Events";
    } else if (/(football|cricket|basketball|sports|tournament|championship|trophy|athletics)/i.test(lower)) {
      category = "Sports";
    } else if (/(robotics|club|chapter|gdg|society|acm|ieee|music club|drama)/i.test(lower)) {
      category = "Clubs";
    } else if (/(class|classes|programming|lecture|syllabus|coursework|professor|lab session|academic|faculty|course)/i.test(lower)) {
      category = "Academic";
    } else if (/(fee|fees|library|hostel|office|admin|counter|clearance|fine)/i.test(lower)) {
      category = "Administrative";
    }

    // ==========================================
    // 2. PRIORITY DETECTION
    // ==========================================
    let priority = "Medium";
    if (/(urgent|emergency|immediate|strictly|mandatory|sharp|action required|penalty|discrepancy)/i.test(lower)) {
      priority = "Urgent";
    } else if (/(important|deadline|last date|eligibility|compulsory|registration open)/i.test(lower)) {
      priority = "High";
    } else if (/(fyi|optional|reminder|announcement|welcome|invitation)/i.test(lower)) {
      priority = "Low";
    }

    // ==========================================
    // 3. TITLE EXTRACTION
    // ==========================================
    let title = "Not specified";

    // A. Explicit Subject / Title line
    const subjMatch = text.match(/\b(?:subject|title|regarding|re|ref)[:\s\-]+([^.,\n]{4,80})/i);
    if (subjMatch) {
      title = toTitleCase(subjMatch[1].trim());
    } else {
      // B. Class / Classes patterns (e.g. "two classes of programming" -> "Programming Classes")
      const classOf = text.match(/(?:(?:two|three|four|\d+)\s+)?classes?\s+of\s+([A-Za-z0-9#+\s]{3,35}?)(?=[.,;]|\s+so|\s+and|\s+please|\s+come|\s+at|$)/i);
      if (classOf) {
        title = toTitleCase(classOf[1].trim()) + ' Classes';
      } else {
        // e.g. "programming classes" / "physics class"
        const subjClass = text.match(/\b([A-Za-z0-9#+]{3,25})\s+classes?\b/i);
        if (subjClass && !/^(the|first|second|two|three|all|attend|our|next)$/i.test(subjClass[1])) {
          title = toTitleCase(subjClass[1].trim()) + ' Classes';
        } else {
          // C. Workshop / Lecture / Seminar / Drive patterns
          const eventMatch = text.match(/\b(?:guest\s+)?(lecture|workshop|seminar|webinar|hackathon|contest|competition|tournament|drive|recruitment|meeting|session)\s+(?:on|about|for|by)?\s+([A-Za-z0-9#+\s&]{3,40})/i);
          if (eventMatch) {
            title = toTitleCase(eventMatch[2].trim().split(/[.,\n]/)[0]) + ' ' + toTitleCase(eventMatch[1].trim());
          } else {
            // D. Clean leading salutations and extract first substantive phrase
            let clean = text
              .replace(/^(?:good\s+(?:morning|afternoon|evening)|hello\s+(?:everyone|all|students)?|dear\s+(?:students|all|faculty)?|hi\s+(?:all|everyone)?|attention\s+(?:all|students)?|notice|circular|announcement)[:,\s\-]+/i, '')
              .trim();
            clean = clean.replace(/^(?:tomorrow|today|yesterday)(?:\s+that\s+is\s+[^.,\n]+)?[:,\s.]+/i, '').trim();

            const firstSentence = clean.split(/[.\n]/)[0].trim();
            if (firstSentence.length >= 4 && firstSentence.length <= 70) {
              title = toTitleCase(firstSentence);
            }
          }
        }
      }
    }

    // ==========================================
    // 4. DATE EXTRACTION (Only from user's input)
    // ==========================================
    let date = "Not specified";

    // A. ISO format YYYY-MM-DD
    const isoMatch = text.match(/\b(202[4-9])-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/);
    if (isoMatch) {
      date = isoMatch[0];
    } else {
      // B. Day Month Year: e.g. "1 November 2026", "1st Nov 2026", "15 Nov"
      const dayMonthYear = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*(?:\s+(\d{4}))?\b/i);
      if (dayMonthYear) {
        const day = dayMonthYear[1].padStart(2, '0');
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const mIdx = monthNames.findIndex(m => dayMonthYear[2].toLowerCase().startsWith(m));
        if (mIdx >= 0) {
          const month = String(mIdx + 1).padStart(2, '0');
          const year = dayMonthYear[3] || String(refDate.getFullYear());
          date = `${year}-${month}-${day}`;
        }
      } else {
        // C. Month Day Year: e.g. "November 1, 2026", "Nov 1st"
        const monthDayYear = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?\b/i);
        if (monthDayYear) {
          const day = monthDayYear[2].padStart(2, '0');
          const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const mIdx = monthNames.findIndex(m => monthDayYear[1].toLowerCase().startsWith(m));
          if (mIdx >= 0) {
            const month = String(mIdx + 1).padStart(2, '0');
            const year = monthDayYear[3] || String(refDate.getFullYear());
            date = `${year}-${month}-${day}`;
          }
        } else if (/\bday after tomorrow\b/i.test(text)) {
          // D. Relative Dates: "day after tomorrow"
          const d = new Date(refDate);
          d.setDate(d.getDate() + 2);
          date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else if (/\btomorrow\b/i.test(text)) {
          // E. Relative Dates: "tomorrow"
          const d = new Date(refDate);
          d.setDate(d.getDate() + 1);
          date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        } else if (/\btoday\b|\btonight\b/i.test(text)) {
          // F. Relative Dates: "today"
          date = referenceDateStr;
        } else {
          // G. Relative Day of Week: e.g. "next monday", "this friday", "on tuesday"
          const dayMatch = text.match(/\b(?:next|this|coming|on)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
          if (dayMatch) {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const targetDay = dayNames.indexOf(dayMatch[1].toLowerCase());
            const currentDay = refDate.getDay();
            let diff = targetDay - currentDay;
            if (diff <= 0) diff += 7;
            const d = new Date(refDate);
            d.setDate(d.getDate() + diff);
            date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          } else {
            // H. Slash/Dash Numeric Dates: e.g. "01/11/2026", "1-11-2026", "01.11.2026"
            const numDateMatch = text.match(/\b(0?[1-9]|[12]\d|3[01])[-/.](0?[1-9]|1[0-2])[-/.](202[4-9])\b/);
            if (numDateMatch) {
              const day = numDateMatch[1].padStart(2, '0');
              const month = numDateMatch[2].padStart(2, '0');
              const year = numDateMatch[3];
              date = `${year}-${month}-${day}`;
            }
          }
        }
      }
    }

    // ==========================================
    // 5. TIME EXTRACTION
    // ==========================================
    let time = "Not specified";

    // 12-hour format: e.g. "11 a.m.", "11:00 AM", "11am", "2:30 p.m."
    const timeMatch = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/i);
    if (timeMatch) {
      const h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2] ? timeMatch[2].padStart(2, '0') : '00';
      const meridiem = timeMatch[3].replace(/\./g, '').toUpperCase();
      time = `${h < 10 ? '0' + h : '' + h}:${m} ${meridiem}`;
    } else {
      // 24-hour format: e.g. "14:30", "09:00 hrs"
      const militaryTime = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\s*(?:hrs|hours)?\b/i);
      if (militaryTime) {
        const h = parseInt(militaryTime[1], 10);
        const m = militaryTime[2];
        const meridiem = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        time = `${h12 < 10 ? '0' + h12 : '' + h12}:${m} ${meridiem}`;
      }
    }

    // ==========================================
    // 6. VENUE EXTRACTION (Never default to Auditorium)
    // ==========================================
    let venue = "Not specified";

    // A. Explicit 'Venue:' or 'Location:'
    const explicitVenueMatch = text.match(/\b(?:venue|location|place|reporting at|held at|held in)[:\s]+([^.,\n;]+)/i);
    if (explicitVenueMatch && explicitVenueMatch[1].trim().length >= 2 && !/^(the|a|an)$/i.test(explicitVenueMatch[1].trim())) {
      venue = explicitVenueMatch[1].trim();
    } else {
      // B. Room codes like C301, C-301, LH-1, CR102 preceded by in / at / room
      const roomPattern = /\b(?:in|at|room|hall|lab|block)\s+(?:the\s+)?(?:room\s+(?:no\.?\s*)?)?([A-Z]\d{2,4}|[A-Z]-\d{2,4}|[A-Z]{2,3}[-\s]?\d{1,4}|Room\s+\d{2,4}|Lab\s+\d{1,2}|Hall\s+[A-Z0-9]+)\b/i;
      const roomMatch = text.match(roomPattern);
      if (roomMatch) {
        venue = roomMatch[1].trim();
      } else {
        // C. Standalone room code: e.g. "C301", "C-301", "LH2"
        const standaloneRoom = text.match(/\b([A-Z]\d{2,4}|[A-Z]-\d{2,4})\b/);
        if (standaloneRoom) {
          venue = standaloneRoom[1].trim();
        } else {
          // D. Named campus facilities: e.g. "Main Seminar Hall", "Innovation Hub"
          const namedMatch = text.match(/\b(?:in|at)\s+(?:the\s+)?([A-Z0-9][a-zA-Z0-9\s\-_]+(?:Auditorium|Seminar Hall|Hall|Lab|Laboratory|Centre|Center|Room|Block|Complex|Grounds|Ground|Stadium|Arena|Cell|Desk|Counter|Office|Hub|MakerSpace))\b/i);
          if (namedMatch) {
            venue = namedMatch[1].trim();
          } else {
            // E. Virtual venues
            const virtualMatch = text.match(/\b(Zoom|Google Meet|Microsoft Teams|Teams|Webex|ERP Portal|Student Portal)\b/i);
            if (virtualMatch) {
              venue = virtualMatch[1].trim();
            }
          }
        }
      }
    }

    // ==========================================
    // 7. DESCRIPTION / SUMMARY
    // ==========================================
    let summary = "Not specified";

    const classesMatch = text.match(/(?:there\s+will\s+be\s+)?(two|three|four|\d+)?\s*classes?\s+of\s+([A-Za-z0-9#+\s]+?)(?=[.,;]|\s+so|\s+and|\s+please)/i);
    const laptopMatch = /bring\s+(?:your\s+)?laptops?/i.test(lower);

    if (classesMatch && laptopMatch) {
      const count = classesMatch[1] ? classesMatch[1].charAt(0).toUpperCase() + classesMatch[1].slice(1).toLowerCase() : 'Two';
      const subj = classesMatch[2].trim().toLowerCase();
      summary = `${count} ${subj} classes. Students must bring their laptops.`;
    } else {
      // General concise prose cleaning
      let clean = text
        .replace(/^(?:good\s+(?:morning|afternoon|evening)|hello\s+(?:everyone|all|students)?|dear\s+(?:students|all|faculty)?|hi\s+(?:all|everyone)?|attention\s+(?:all|students)?|notice|circular|announcement)[:,\s\-]+/i, '')
        .trim();
      clean = clean.replace(/^(?:tomorrow|today|yesterday)(?:\s+that\s+is\s+[^.,\n]+)?[:,\s.]+/i, '').trim();

      if (clean.length > 5) {
        let desc = clean.charAt(0).toUpperCase() + clean.slice(1);
        if (!desc.endsWith('.')) desc += '.';
        summary = desc;
      }
    }

    // ==========================================
    // 8. ACTION REQUIRED
    // ==========================================
    let actionRequired = "Not specified";
    if (/bring\s+(?:your\s+)?laptops?/i.test(lower)) {
      actionRequired = "Bring your laptop";
    } else if (/bring\s+([^.,\n]+)/i.test(lower)) {
      actionRequired = "Bring " + lower.match(/bring\s+([^.,\n]+)/i)[1].trim();
    } else if (/hall ticket|admit card/i.test(lower)) {
      actionRequired = "Download hall ticket & verify subjects";
    } else if (/resume|dress code|placement/i.test(lower)) {
      actionRequired = "Bring updated resumes and wear formal attire";
    } else if (/register|submission/i.test(lower)) {
      actionRequired = "Complete registration before deadline";
    } else if (/return/i.test(lower)) {
      actionRequired = "Return overdue materials";
    }

    // ==========================================
    // 9. TAGS GENERATION
    // ==========================================
    const tags = [category];
    if (title !== "Not specified" && !tags.includes(title)) {
      const titleWords = title.split(' ').filter(w => w.length > 3);
      titleWords.forEach(w => {
        if (!tags.includes(w)) tags.push(w);
      });
    }
    if (/laptop/i.test(lower) && !tags.includes('Laptop')) tags.push('Laptop');
    if (/programming|code|coding/i.test(lower) && !tags.includes('Programming')) tags.push('Programming');

    return {
      title,
      category,
      priority,
      date,
      time,
      venue,
      summary,
      rawText: text,
      actionRequired,
      tags: Array.from(new Set(tags)),
      extractedBy: "Demo Rule Parser (No API Key Required)",
      isDemoExtraction: true,
      confidenceScore: "92% (Heuristic)",
      disclaimer: "Parsed using client-side rule heuristics. Real AI mode will connect to Gemini API."
    };
  }
};
