require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const { User, Course, Class, Assignment, Submission, Exam, Schedule, Finance, OdRequest, Announcement, Grade, Resource, Project, ProjectMember, Achievement, LeetcodeStats, CalendarEvent, LeaveRequest } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (tables recreated)');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // ═══ Users ═══
    const admin = await User.create({
      name: 'Marcus Chen', email: 'admin@eduverse.com', password: hashedPassword,
      role: 'admin', department: 'Administration', isVerified: true
    });

    const teacher = await User.create({
      name: 'Prof. Anderson', email: 'anderson@eduverse.com', password: hashedPassword,
      role: 'teacher', department: 'Physics Dept.', isVerified: true
    });

    const student1 = await User.create({
      name: 'Alex Morgan', email: 'alex@eduverse.com', password: hashedPassword,
      role: 'student', studentId: '4829', department: 'CS Undergrad',
      leetcodeUsername: 'alexmorgan_dev', linkedinUrl: 'https://linkedin.com/in/alexmorgan',
      githubUsername: 'alexmorgan', bio: 'Full-stack developer | Open source enthusiast',
      skills: 'React,Node.js,Python,Machine Learning', semester: 5, section: 'A', batch: '2022-2026',
      phone: '9876543210', parentPhone: '9876543211', isVerified: true
    });

    const student2 = await User.create({
      name: 'Michael Chen', email: 'michael@eduverse.com', password: hashedPassword,
      role: 'student', studentId: '4830', department: 'CS Undergrad',
      leetcodeUsername: 'mchen_lc', linkedinUrl: 'https://linkedin.com/in/michaelchen',
      githubUsername: 'mchendev', bio: 'Competitive programmer | AI researcher',
      skills: 'C++,Python,TensorFlow,Algorithms', semester: 5, section: 'A', batch: '2022-2026',
      phone: '9876543212', parentPhone: '9876543213', isVerified: true
    });

    const student3 = await User.create({
      name: 'Sarah Miller', email: 'sarah@eduverse.com', password: hashedPassword,
      role: 'student', studentId: '4831', department: 'Physics',
      leetcodeUsername: null, linkedinUrl: 'https://linkedin.com/in/sarahmiller',
      githubUsername: 'sarahm', bio: 'Physics enthusiast | Data science learner',
      skills: 'Python,MATLAB,Data Analysis', semester: 3, section: 'B', batch: '2023-2027',
      phone: '9876543214', parentPhone: '9876543215', isVerified: true
    });

    const student4 = await User.create({
      name: 'David Kim', email: 'david@eduverse.com', password: hashedPassword,
      role: 'student', studentId: '4832', department: 'Physics',
      leetcodeUsername: 'dkim99', linkedinUrl: null,
      githubUsername: 'davidkim', bio: 'Hardware hacker | IoT projects',
      skills: 'Arduino,Raspberry Pi,C,Embedded Systems', semester: 5, section: 'A', batch: '2022-2026',
      phone: '9876543216', parentPhone: '9876543217', isVerified: true
    });

    const student5 = await User.create({
      name: 'Emma Watson', email: 'emma@eduverse.com', password: hashedPassword,
      role: 'student', studentId: '4833', department: 'CS Undergrad',
      leetcodeUsername: 'emma_lc', linkedinUrl: 'https://linkedin.com/in/emmawatson',
      githubUsername: 'emmaw', bio: 'UI/UX Designer | Frontend Dev',
      skills: 'Figma,React,CSS,JavaScript', semester: 3, section: 'B', batch: '2023-2027',
      phone: '9876543218', parentPhone: '9876543219', isVerified: true
    });

    const alumni = await User.create({
      name: 'Jane Smith', email: 'jane@eduverse.com', password: hashedPassword,
      role: 'alumni', studentId: '3201', department: 'CS',
      linkedinUrl: 'https://linkedin.com/in/janesmith', bio: 'Software Engineer at Google',
      skills: 'System Design,Java,Go,Distributed Systems', batch: '2019-2023', isVerified: true
    });

    console.log('Users created');

    // ═══ Courses ═══
    const physics101 = await Course.create({ name: 'Physics 101', code: 'PHY101', description: 'Introduction to Physics', semester: 'Fall 2024', credits: 4, teacherId: teacher.id });
    const physics302 = await Course.create({ name: 'Physics 302', code: 'PHY302', description: 'Quantum Mechanics', semester: 'Fall 2024', credits: 3, teacherId: teacher.id });
    const cs101 = await Course.create({ name: 'Computer Science 101', code: 'CS101', description: 'Intro to Computer Science', semester: 'Fall 2024', credits: 4, teacherId: teacher.id });
    console.log('Courses created');

    // ═══ Classes ═══
    const phyClass = await Class.create({ name: 'Physics 101 - Section A', section: 'A', courseId: physics101.id, teacherId: teacher.id, studentCount: 142 });
    const phyClass2 = await Class.create({ name: 'Physics 302 - Section A', section: 'A', courseId: physics302.id, teacherId: teacher.id, studentCount: 35 });
    console.log('Classes created');

    // ═══ Assignments ═══
    const assignment1 = await Assignment.create({ title: 'Mid-Term Lab Report', description: 'Write a lab report on the mid-term experiment', dueDate: new Date(Date.now() - 86400000), courseId: physics101.id, classId: phyClass.id, teacherId: teacher.id, status: 'active', totalMarks: 100 });
    const assignment2 = await Assignment.create({ title: 'Quantum Mechanics Essay', description: 'Write an essay on quantum mechanics principles', dueDate: new Date(Date.now() - 172800000), courseId: physics302.id, classId: phyClass2.id, teacherId: teacher.id, status: 'active', totalMarks: 50 });
    await Assignment.create({ title: 'Weekly Problem Set 4', description: 'Complete problems 1-20 from Chapter 4', dueDate: new Date(), courseId: physics101.id, classId: phyClass.id, teacherId: teacher.id, status: 'draft', totalMarks: 30 });
    console.log('Assignments created');

    // ═══ Submissions ═══
    for (let i = 0; i < 12; i++) {
      await Submission.create({ assignmentId: assignment1.id, studentId: [student1, student2, student3, student4][i % 4].id, status: 'submitted', submittedAt: new Date() });
    }
    for (let i = 0; i < 5; i++) {
      await Submission.create({ assignmentId: assignment2.id, studentId: [student1, student2, student3, student4][i % 4].id, status: 'submitted', submittedAt: new Date() });
    }
    console.log('Submissions created');

    // ═══ Exams ═══
    await Exam.create({ title: 'Physics 101 Midterm', courseId: physics101.id, date: new Date(Date.now() + 604800000), duration: 120, type: 'midterm', totalMarks: 100, venue: 'Hall A' });
    await Exam.create({ title: 'Physics 302 Quiz 3', courseId: physics302.id, date: new Date(Date.now() + 259200000), duration: 30, type: 'quiz', totalMarks: 25, venue: 'Room 201' });
    await Exam.create({ title: 'CS 101 Final', courseId: cs101.id, date: new Date(Date.now() + 2592000000), duration: 180, type: 'final', totalMarks: 100, venue: 'Main Hall' });
    console.log('Exams created');

    // ═══ Schedules ═══
    await Schedule.create({ title: 'Physics 101', day: 'monday', startTime: '09:00', endTime: '10:30', courseId: physics101.id, room: 'Room 101', userId: teacher.id, type: 'lecture' });
    await Schedule.create({ title: 'Physics 302', day: 'tuesday', startTime: '11:00', endTime: '12:30', courseId: physics302.id, room: 'Room 302', userId: teacher.id, type: 'lecture' });
    await Schedule.create({ title: 'Physics Lab', day: 'wednesday', startTime: '14:00', endTime: '16:00', courseId: physics101.id, room: 'Lab 1', userId: teacher.id, type: 'lab' });
    await Schedule.create({ title: 'Office Hours', day: 'thursday', startTime: '10:00', endTime: '12:00', courseId: null, room: 'Office 205', userId: teacher.id, type: 'tutorial' });
    console.log('Schedules created');

    // ═══ Finances ═══
    await Finance.create({ studentId: student1.id, type: 'tuition', description: 'Fall 2024 Tuition', amount: 15000, dueDate: new Date(Date.now() + 2592000000), status: 'pending' });
    await Finance.create({ studentId: student1.id, type: 'scholarship', description: 'Merit Scholarship', amount: -5000, dueDate: null, status: 'paid' });
    console.log('Finances created');

    // ═══ OD Requests ═══
    await OdRequest.create({ studentId: student2.id, reason: 'Sports Meet - 2 days', description: 'Participating in inter-college sports meet', fromDate: new Date(), toDate: new Date(Date.now() + 172800000), status: 'pending' });
    await OdRequest.create({ studentId: student3.id, reason: 'Medical Leave', description: 'Medical appointment', fromDate: new Date(), toDate: new Date(Date.now() + 86400000), status: 'pending' });
    console.log('OD Requests created');

    // ═══ Announcements ═══
    await Announcement.create({ title: 'Welcome to Fall 2024', content: 'Welcome back everyone! Classes begin next Monday.', authorId: admin.id, targetRole: 'all', priority: 'high' });
    await Announcement.create({ title: 'Lab Report Deadline Extended', content: 'The deadline for the mid-term lab report has been extended by 2 days.', authorId: teacher.id, targetRole: 'student', priority: 'normal' });
    console.log('Announcements created');

    // ═══ Grades ═══
    await Grade.create({ studentId: student1.id, courseId: physics101.id, grade: 'A', gradePoints: 4.0, semester: 'Spring 2024' });
    await Grade.create({ studentId: student1.id, courseId: cs101.id, grade: 'A-', gradePoints: 3.7, semester: 'Spring 2024' });
    await Grade.create({ studentId: student2.id, courseId: physics101.id, grade: 'B+', gradePoints: 3.3, semester: 'Spring 2024' });
    console.log('Grades created');

    // ═══ Resources ═══
    await Resource.create({ title: 'Chapter 5 Notes', description: 'Lecture notes for Chapter 5', fileUrl: '/uploads/chapter5.pdf', fileType: 'pdf', courseId: physics101.id, uploadedBy: teacher.id });
    await Resource.create({ title: 'Lab Manual', description: 'Physics lab manual', fileUrl: '/uploads/lab_manual.pdf', fileType: 'pdf', courseId: physics101.id, uploadedBy: teacher.id });
    await Resource.create({ title: 'Python Basics Slides', description: 'Introduction to Python programming', fileUrl: '/uploads/python_basics.pdf', fileType: 'pdf', courseId: cs101.id, uploadedBy: teacher.id });
    console.log('Resources created');

    // ═══ Projects ═══
    const project1 = await Project.create({
      title: 'AI-Powered Study Planner',
      description: 'Build an AI assistant that creates personalized study plans based on a student\'s course load, GPA goals, and learning style.',
      ownerId: student1.id, status: 'recruiting', type: 'hackathon',
      techStack: JSON.stringify(['React', 'Node.js', 'OpenAI API', 'MongoDB']),
      maxMembers: 4, deadline: new Date(Date.now() + 2592000000),
      repoUrl: 'https://github.com/alexmorgan/ai-study-planner'
    });
    await ProjectMember.create({ projectId: project1.id, userId: student1.id, role: 'owner' });
    await ProjectMember.create({ projectId: project1.id, userId: student2.id, role: 'member' });

    const project2 = await Project.create({
      title: 'Smart Campus Navigation',
      description: 'Indoor navigation app using Bluetooth beacons to help students find classrooms, labs, and faculty offices.',
      ownerId: student4.id, status: 'in_progress', type: 'senior_project',
      techStack: JSON.stringify(['React Native', 'Arduino', 'BLE', 'Firebase']),
      maxMembers: 3, deadline: new Date(Date.now() + 5184000000),
      repoUrl: 'https://github.com/davidkim/campus-nav'
    });
    await ProjectMember.create({ projectId: project2.id, userId: student4.id, role: 'owner' });
    await ProjectMember.create({ projectId: project2.id, userId: student5.id, role: 'member' });

    const project3 = await Project.create({
      title: 'LeetCode Study Group Bot',
      description: 'Discord bot that assigns daily LeetCode problems based on difficulty level, tracks progress, and creates leaderboards.',
      ownerId: student2.id, status: 'recruiting', type: 'personal',
      techStack: JSON.stringify(['Python', 'Discord.py', 'LeetCode API', 'PostgreSQL']),
      maxMembers: 5, deadline: null
    });
    await ProjectMember.create({ projectId: project3.id, userId: student2.id, role: 'owner' });

    console.log('Projects created');

    // ═══ Achievements ═══
    await Achievement.create({ userId: student1.id, type: 'hackathon', title: 'Winner - HackTech 2024', description: 'First place in the ML track at HackTech 2024, built an accessibility tool.', issuer: 'HackTech', dateAchieved: new Date('2024-03-15'), proofUrl: 'https://devpost.com/hacktech2024', verified: true });
    await Achievement.create({ userId: student1.id, type: 'certification', title: 'AWS Cloud Practitioner', description: 'AWS Certified Cloud Practitioner certification.', issuer: 'Amazon Web Services', dateAchieved: new Date('2024-06-01'), proofUrl: 'https://aws.amazon.com/verify', verified: true });
    await Achievement.create({ userId: student1.id, type: 'internship', title: 'SDE Intern at Microsoft', description: 'Summer internship working on Azure DevOps team.', issuer: 'Microsoft', dateAchieved: new Date('2024-05-15'), verified: true });
    await Achievement.create({ userId: student2.id, type: 'hackathon', title: 'Runner-up - CodeJam 2024', description: 'Second place in the competitive programming contest.', issuer: 'Google', dateAchieved: new Date('2024-07-20'), verified: true });
    await Achievement.create({ userId: student2.id, type: 'certification', title: 'Meta Frontend Developer', description: 'Professional certificate from Meta.', issuer: 'Meta / Coursera', dateAchieved: new Date('2024-08-10'), verified: true });
    await Achievement.create({ userId: student5.id, type: 'award', title: 'Best UI/UX Design', description: 'Won the best design award at the college design sprint.', issuer: 'College Design Club', dateAchieved: new Date('2024-09-01'), verified: true });

    console.log('Achievements created');

    // ═══ LeetCode Stats (cached) ═══
    await LeetcodeStats.create({ userId: student1.id, username: 'alexmorgan_dev', totalSolved: 312, easySolved: 145, mediumSolved: 132, hardSolved: 35, totalEasy: 800, totalMedium: 1700, totalHard: 750, ranking: 85432, streak: 28, lastFetched: new Date() });
    await LeetcodeStats.create({ userId: student2.id, username: 'mchen_lc', totalSolved: 587, easySolved: 210, mediumSolved: 285, hardSolved: 92, totalEasy: 800, totalMedium: 1700, totalHard: 750, ranking: 25010, streak: 64, lastFetched: new Date() });
    await LeetcodeStats.create({ userId: student4.id, username: 'dkim99', totalSolved: 128, easySolved: 72, mediumSolved: 48, hardSolved: 8, totalEasy: 800, totalMedium: 1700, totalHard: 750, ranking: 195000, streak: 5, lastFetched: new Date() });

    console.log('LeetCode stats created');

    // ═══ Calendar Events ═══
    const today = new Date();
    const nextWeek = new Date(Date.now() + 604800000);
    await CalendarEvent.create({ title: 'Physics 101 Midterm', type: 'exam', startDate: new Date(Date.now() + 604800000), endDate: new Date(Date.now() + 604800000 + 7200000), courseId: physics101.id, createdBy: teacher.id, color: '#ef4444' });
    await CalendarEvent.create({ title: 'Lab Report Deadline', type: 'deadline', startDate: new Date(Date.now() + 259200000), allDay: true, courseId: physics101.id, createdBy: teacher.id, color: '#f59e0b' });
    await CalendarEvent.create({ title: 'Hackathon Registration Opens', type: 'event', startDate: new Date(Date.now() + 432000000), allDay: true, createdBy: admin.id, color: '#8b5cf6' });
    await CalendarEvent.create({ title: 'Tech Club Workshop: Intro to Docker', type: 'club', startDate: new Date(Date.now() + 172800000), endDate: new Date(Date.now() + 172800000 + 5400000), createdBy: admin.id, color: '#06b6d4' });
    await CalendarEvent.create({ title: 'Mid-Semester Break', type: 'holiday', startDate: new Date(Date.now() + 1209600000), endDate: new Date(Date.now() + 1814400000), allDay: true, createdBy: admin.id, color: '#22c55e' });
    await CalendarEvent.create({ title: 'CS101 Assignment Due', type: 'assignment', startDate: new Date(Date.now() + 345600000), allDay: true, courseId: cs101.id, createdBy: teacher.id, color: '#3b82f6' });

    console.log('Calendar events created');

    // ═══ Leave Requests ═══
    await LeaveRequest.create({ studentId: student1.id, type: 'od', reason: 'Hackathon Participation', description: 'Attending HackFest 2025 at IIT Madras', fromDate: new Date(Date.now() + 86400000), toDate: new Date(Date.now() + 259200000), status: 'approved', reviewedBy: teacher.id });
    await LeaveRequest.create({ studentId: student2.id, type: 'gatepass', reason: 'Family Emergency', description: 'Need to visit home urgently', fromDate: new Date(), toDate: new Date(), status: 'pending' });
    await LeaveRequest.create({ studentId: student3.id, type: 'medical', reason: 'Medical Appointment', description: 'Scheduled dental surgery', fromDate: new Date(Date.now() + 432000000), toDate: new Date(Date.now() + 518400000), status: 'pending' });
    await LeaveRequest.create({ studentId: student5.id, type: 'leave', reason: 'Personal Leave', description: 'Family function', fromDate: new Date(Date.now() + 604800000), toDate: new Date(Date.now() + 691200000), status: 'pending' });

    console.log('Leave requests created');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@eduverse.com / password123');
    console.log('Teacher: anderson@eduverse.com / password123');
    console.log('Student: alex@eduverse.com / password123');
    console.log('Alumni: jane@eduverse.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
