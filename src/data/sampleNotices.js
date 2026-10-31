/**
 * Realistic college sample notices for Campus Pulse
 * Current local date reference: Late Oct / Early Nov 2026
 */

export const INITIAL_NOTICES = [
  {
    id: "notice-001",
    title: "End-Semester Theory Examination Timetable & Hall Tickets",
    category: "Exams",
    priority: "Urgent",
    date: "2026-11-05",
    time: "09:30 AM",
    venue: "Main Examination Cell & Student Portal",
    summary: "Final timetable for odd-semester examinations (B.Tech, M.Tech, MCA) is now published. Students must download hall tickets and report any subject clashes by Nov 03.",
    rawText: "ATTENTION ALL STUDENTS: The controller of examinations has released the End-Semester Examination timetable for November 2026. Hall tickets can be downloaded from the university portal starting Monday. Hall tickets will only be generated for candidates with >75% attendance. Any discrepancy or schedule clash must be reported to the Examination Cell (Admin Block, Room 204) before 03 Nov 2026.",
    isPinned: true,
    isRead: false,
    extractedBy: "System Default",
    actionRequired: "Download hall ticket & verify subject codes",
    tags: ["Exam", "Hall Ticket", "Attendance", "Controller of Exams"],
    createdAt: "2026-10-30T10:00:00Z"
  },
  {
    id: "notice-002",
    title: "Google & TCS Campus Placement Recruitment Drive - 2027 Batch",
    category: "Placements",
    priority: "Urgent",
    date: "2026-11-03",
    time: "10:00 AM",
    venue: "Main Auditorium & Online Assessment Lab",
    summary: "Pre-placement talk and Round 1 Online Coding Assessment for eligible final and pre-final year students (CSE, IT, ECE with CGPA >= 7.5).",
    rawText: "TRAINING & PLACEMENT CELL NOTICE: Google Cloud and TCS Digital campus drive is scheduled for 3rd November 2026 at 10:00 AM in the Main Auditorium. Eligibility: B.Tech CSE/IT/ECE with CGPA 7.5 and no active backlogs. Mandatory dress code: Formal college attire. Bring 3 copies of updated resume, college ID, and laptops with full charge for the technical test.",
    isPinned: true,
    isRead: false,
    extractedBy: "System Default",
    actionRequired: "Carry resume copies & laptop with charger",
    tags: ["Placement", "Jobs", "Coding", "T&P Cell"],
    createdAt: "2026-10-29T14:30:00Z"
  },
  {
    id: "notice-003",
    title: "HackPulse 2026: 36-Hour National Level Hackathon Registrations",
    category: "Events",
    priority: "High",
    date: "2026-11-12",
    time: "08:00 AM",
    venue: "University Innovation & Incubation Centre",
    summary: "Annual flagship hackathon with tracks in AI/ML, Web3, FinTech, and IoT. Cash pool of $10,000 + internship opportunities with sponsor startups.",
    rawText: "Calling all developers and innovators! HackPulse 2026 is here on 12-13 November 2026 at the Innovation Centre. Teams of 2 to 4 members can register online. Free food, swag packs, mentor sessions from industry leaders, and 24x7 high-speed fiber access. Deadline for abstract submission is Nov 08.",
    isPinned: false,
    isRead: true,
    extractedBy: "System Default",
    actionRequired: "Form a team and submit hackathon abstract",
    tags: ["Hackathon", "Innovation", "Coding", "Cash Prize"],
    createdAt: "2026-10-28T16:00:00Z"
  },
  {
    id: "notice-004",
    title: "Guest Lecture: Frontier LLM Architectures by Dr. Elena Vance (MIT)",
    category: "Academic",
    priority: "Medium",
    date: "2026-11-08",
    time: "02:30 PM",
    venue: "Ramanujan Seminar Hall (Block C)",
    summary: "Distinguished seminar on autonomous agentic systems and multi-modal neural reasoning models followed by Q&A with research scholars.",
    rawText: "Department of Computer Science & Engineering cordially invites students and faculty for an invited guest lecture on 'Frontier LLM Architectures and Scalable Alignment' by Dr. Elena Vance, Visiting Researcher at MIT CSAIL. Date: 8th November 2026, 2:30 PM, Ramanujan Seminar Hall.",
    isPinned: false,
    isRead: true,
    extractedBy: "System Default",
    actionRequired: "Arrive 15 minutes before the talk",
    tags: ["AI", "Guest Lecture", "CSE", "Research"],
    createdAt: "2026-10-27T11:20:00Z"
  },
  {
    id: "notice-005",
    title: "Inter-Department Football & Basketball Tournament 2026",
    category: "Sports",
    priority: "Medium",
    date: "2026-11-15",
    time: "04:00 PM",
    venue: "University Sports Arena & Stadium",
    summary: "Annual Chancellor's Sports Cup kicks off with football league matches and 3x3 basketball playoffs. Department jerseys will be distributed.",
    rawText: "SPORTS COUNCIL CIRCULAR: Annual Chancellor Trophy 2026 will commence on November 15th at the Sports Complex. Team captain registration is open until Nov 10th with the Sports Director. All students are encouraged to attend and cheer for their branch.",
    isPinned: false,
    isRead: false,
    extractedBy: "System Default",
    actionRequired: "Captain registrations due by Nov 10",
    tags: ["Sports", "Football", "Basketball", "Tournament"],
    createdAt: "2026-10-26T09:00:00Z"
  },
  {
    id: "notice-006",
    title: "Library Book Amnesty & Overdue Fine Exemption Window",
    category: "Administrative",
    priority: "Low",
    date: "2026-10-25",
    time: "05:00 PM",
    venue: "Central Library Ground Floor Desk",
    summary: "Return overdue library books without paying late penalty fines during the semester amnesty week ending Oct 25.",
    rawText: "Central Library Notification: All students with overdue books issued prior to September 2026 can return them at the circulation counter with 100% fine waiver until October 25th, 5:00 PM. No questions asked. Clearance slips will be provided immediately.",
    isPinned: false,
    isRead: true,
    extractedBy: "System Default",
    actionRequired: "Return outstanding library books",
    tags: ["Library", "Amnesty", "Books", "Admin"],
    createdAt: "2026-10-20T08:00:00Z"
  },
  {
    id: "notice-007",
    title: "Robotics Club: Hands-on Autonomous Drone Building Workshop",
    category: "Clubs",
    priority: "Medium",
    date: "2026-11-07",
    time: "01:00 PM",
    venue: "MakerSpace Lab, Mechanical Block (Ground Floor)",
    summary: "Learn flight controllers, brushless motor soldering, and computer vision PID tuning. Hardware kits provided for 4-person groups.",
    rawText: "Robotics Club 'AeroPulse' is hosting a beginner-to-intermediate workshop on Quadcopter design and ROS2 flight dynamics on November 7th. Workshop seats limited to 40 participants on a first-come, first-served basis.",
    isPinned: false,
    isRead: false,
    extractedBy: "System Default",
    actionRequired: "Bring safety goggles and USB-C data cable",
    tags: ["Robotics", "Workshop", "MakerSpace", "Drones"],
    createdAt: "2026-10-25T13:45:00Z"
  }
];

export const NOTICE_CATEGORIES = [
  "All",
  "Academic",
  "Exams",
  "Placements",
  "Events",
  "Sports",
  "Clubs",
  "Administrative"
];

export const NOTICE_PRIORITIES = ["All", "Urgent", "High", "Medium", "Low"];
