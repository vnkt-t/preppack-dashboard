import React, { useState,  useEffect, createContext, useContext, useCallback } from 'react';
import './styles.css'

// Create a context for user data (replacing FirebaseContext)
const UserContext = createContext(null);

// Custom hook to use user context
const useUser = () => useContext(UserContext);

function ConfirmationModal({ message, onConfirm, onCancel, isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Confirm Action</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition duration-150 ease-in-out"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

function ErrorReportingModal({ errorMessage, onClose, isOpen }) {
    const [reportText, setReportText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleSubmitReport = () => {
        console.log("Error Report Submitted:", { originalError: errorMessage, userReport: reportText });
        setIsSubmitted(true);
        setTimeout(() => {
            onClose();
            setIsSubmitted(false);
            setReportText('');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Error Occurred!</h3>
                {isSubmitted ? (
                    <p className="text-green-600 dark:text-green-400 text-center text-lg">Report Submitted! Thank you.</p>
                ) : (
                    <>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Something went wrong. Please describe what you were doing when this error occurred.
                        </p>
                        <textarea
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4 min-h-[100px]"
                            placeholder="e.g., 'I was trying to sync Classroom data and it showed an error.'"
                            value={reportText}
                            onChange={(e) => setReportText(e.target.value)}
                        ></textarea>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Error Details: <span className="font-mono break-words">{errorMessage}</span>
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleSubmitReport}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-150 ease-in-out"
                            >
                                Submit Report
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Renamed original App logic to MainDashboardApp
function MainDashboardApp() {
  const [userProfile, setUserProfile] = useState({
    displayName: 'Student',
    darkMode: false,
    accentColor: '#3498DB'
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalOnConfirm, setModalOnConfirm] = useState(() => () => {});
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Apply dark mode class to body based on user profile settings
    if (userProfile) {
      if (userProfile.darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      // Also apply accent color dynamically
      document.documentElement.style.setProperty('--color-blue', userProfile.accentColor || '#3498DB');
      document.documentElement.style.setProperty('--color-dark-blue', userProfile.accentColor ? darkenColor(userProfile.accentColor, 10) : '#2980b9');
    }
  }, [userProfile]);

  // Helper to darken color for hover states
  const darkenColor = (hex, percent) => {
    let f=parseInt(hex.slice(1),16);
    let t=percent<0?0:255;
    let p=percent<0?percent*-1:percent;
    let R=f>>16;
    let G=(f>>8)&0x00FF;
    let B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  const showConfirmation = (message, onConfirmCallback) => {
    setModalMessage(message);
    setModalOnConfirm(() => {
      return () => {
        onConfirmCallback();
        setIsModalOpen(false);
      };
    });
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    showConfirmation("Are you sure you want to sign out?", async () => {
      console.log("User signed out (simulated).");
      setAuthError(null);
    });
  };

  const handleSyncGoogleClassroom = () => {
      setAuthError("Google Classroom sync requires backend integration.");
  };

  return (
    <>
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 12V22" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M7 4.5L17 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 14.5L17 19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            PrepPack
          </div>
          <nav>
            <a href="#" className={currentPage === 'dashboard' ? 'active-link' : ''} onClick={() => setCurrentPage('dashboard')}>
              Dashboard
            </a>
              <a href="#" className={currentPage === 'calendar' ? 'active-link' : ''} onClick={() => setCurrentPage('calendar')}>
                Calendar
              </a>
            <a href="#" className={currentPage === 'add-task' ? 'active-link' : ''} onClick={() => setCurrentPage('add-task')}>
              Add Task
            </a>
            <a href="#" className={currentPage === 'plan' ? 'active-link' : ''} onClick={() => setCurrentPage('plan')}>
              Study Plan
            </a>
            <a href="#" className={currentPage === 'gpa-calculator' ? 'active-link' : ''} onClick={() => setCurrentPage('gpa-calculator')}>
              GPA Calculator
            </a>
            <a href="#" className={currentPage === 'settings' ? 'active-link' : ''} onClick={() => setCurrentPage('settings')}>
              Settings
            </a>
          </nav>

          <div className="mt-auto w-full pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">User: Demo</p>
            <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors duration-200 mt-4"
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main">
          {/* Header */}
          <header className="header-top">
            <div className="search-bar">
              <input type="text" placeholder="Search for anything..." />
              <span className="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19.5 21L21 19.5L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                </svg>
              </span>
            </div>
            <div className="date-time">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span><br/>
              <span className="text-2xl text-gray-500 dark:text-gray-400">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </header>

          {/* Page Specific Headers */}
          {currentPage === 'dashboard' && (
            <div className="page-header">
              <span className="welcome-message">
                Hello, {userProfile?.displayName || 'Student'}! Make it a <span className="productive-text">productive</span> day.
              </span>
            </div>
          )}
          {currentPage === 'calendar' && (
            <div className="page-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Calendar Overview
              <button className="date-picker-trigger">Select Date</button>
            </div>
          )}
          {currentPage === 'add-task' && (
            <div className="page-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add New Task / Habit
            </div>
          )}
          {currentPage === 'plan' && (
            <div className="page-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 16L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Study Plan
            </div>
          )}
          {currentPage === 'gpa-calculator' && (
            <div className="page-header">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                GPA Calculator
            </div>
          )}
          {currentPage === 'settings' && (
            <div className="page-header">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V3M12 21V18M18 12H21M3 12H6M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Settings
            </div>
          )}

          {/* Dashboard Page */}
          {currentPage === 'dashboard' && (
            <div id="dashboard-content">
                <div className="productivity-section">
                    <strong>Your Productivity Progress</strong>
                    <p>85.7% of tasks completed this week, keep up the great work!</p>
                    <div className="progress-bar">
                        <div className="progress-bar-inner" style={{ width: '85.7%' }}></div>
                    </div>
                </div>

                <div className="grid-container">
                    <div className="box task-list">
                        <h3>Today's Tasks</h3>
                        <ul>
                            <li>
                                <span className="checkbox checked">✔</span>
                                <span className="task-text">Finish Math Homework</span>
                                <span className="due-date">Due: 5 PM</span>
                                <a href="#" className="open-link">Open</a>
                            </li>
                            <li>
                                <span className="checkbox"></span>
                                <span className="task-text">Study for Physics Exam</span>
                                <span className="due-date">Due: Tomorrow</span>
                                <a href="#" className="open-link">Open</a>
                            </li>
                            <li>
                                <span className="checkbox"></span>
                                <span className="task-text">Read "To Kill a Mockingbird" Chapter 10</span>
                                <span className="due-date">Due: Fri</span>
                                <a href="#" className="open-link">Open</a>
                            </li>
                        </ul>
                        <div className="ai-suggestion">
                            <span className="checkbox"></span>
                            <span>AI Suggestion: Review Calculus concepts from last week.</span>
                        </div>
                    </div>

                    <div className="box pomodoro">
                        <h3>Pomodoro Timer</h3>
                        <div className="pomodoro-timer">
                            <svg viewBox="0 0 180 180">
                                <circle cx="90" cy="90" r="80" className="pomodoro-bg"></circle>
                                <circle cx="90" cy="90" r="80" className="pomodoro-fg"
                                        style={{ strokeDashoffset: `calc(502.65 - (25 / 25 * 502.65))`, stroke: 'var(--color-red)' }}
                                ></circle>
                            </svg>
                            <div className="pomodoro-time-text">25:00</div>
                        </div>
                        <div className="pomodoro-dots">
                            <span className="dot study active" style={{backgroundColor: 'var(--color-red)'}}></span>
                            <span className="dot break" style={{backgroundColor: 'var(--color-blue)'}}></span>
                            <span className="dot long-break" style={{backgroundColor: 'var(--color-orange)'}}></span>
                        </div>
                        <p>Focus on your studies with timed intervals.</p>
                        <button>Start Timer</button>
                    </div>

                    <div className="box upcoming-assessments">
                        <h3>Upcoming Assessments</h3>
                        <div className="assessment-grid">
                            <div className="assessment-card success">
                                <div className="date">Jul 10</div>
                                <div className="title">History Quiz</div>
                                <div className="status">Passed</div>
                            </div>
                            <div className="assessment-card fail">
                                <div className="date">Aug 01</div>
                                <div className="title">Chemistry Midterm</div>
                                <div className="status">Failed</div>
                            </div>
                            <div className="assessment-card">
                                <div className="date">Sep 15</div>
                                <div className="title">English Essay</div>
                                <div className="status">Pending</div>
                            </div>
                            <div className="assessment-card">
                                <div id="math-final-card">
                                    <div className="date">Oct 05</div>
                                    <div className="title">Math Final</div>
                                    <div className="status">Pending</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="box habit-tracker">
                        <h3>Habit Tracker</h3>
                        <table className="habit-table">
                            <thead>
                                <tr>
                                    <th>Habit</th>
                                    <th>Mon</th>
                                    <th>Tue</th>
                                    <th>Wed</th>
                                    <th>Thu</th>
                                    <th>Fri</th>
                                    <th>Sat</th>
                                    <th>Sun</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Meditate 10min</td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                </tr>
                                <tr>
                                    <td>Exercise</td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                </tr>
                                <tr>
                                    <td>Read Book</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell checked">✔</td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                    <td className="checkbox-cell"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="box gpa">
                        <h3>Current GPA</h3>
                        <div className="gpa-circle">
                            <svg viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" className="gpa-bg"></circle>
                                <circle cx="60" cy="60" r="50" className="gpa-fg"
                                        style={{ strokeDashoffset: `calc(314.16 - (3.75 / 4.0 * 314.16))` }}
                                ></circle>
                            </svg>
                            <div className="gpa-value">3.75</div>
                        </div>
                        <p>Based on your last semester's courses.</p>
                    </div>

                    <div className="box notes-section">
                        <h3>Quick Notes
                            <span className="edit-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13M18.5 2.5C18.8978 2.10217 19.4391 1.89506 20 1.89506C20.5609 1.89506 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1049 3.43913 22.1049 4C22.1049 4.56087 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </h3>
                        <p>Remember to submit the scholarship application by Friday. Also, research internship opportunities for summer 2026. Schedule a meeting with Professor Lee next week.</p>
                    </div>
                </div>
                <button
                    onClick={handleSyncGoogleClassroom}
                    className="add-button self-center mt-8 bg-purple-600 hover:bg-purple-700 transition duration-200"
                >
                    Sync Google Classroom Data
                </button>
            </div>
          )}

          {/* Calendar Page */}
          {currentPage === 'calendar' && (
            <div className="calendar-page">
                <div className="calendar-grid">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="calendar-day-name">{day}</div>
                    ))}
                    {[...Array(2)].map((_, i) => (
                        <div key={`inactive-${i}`} className="calendar-day-cell inactive"></div>
                    ))}
                    {[...Array(30)].map((_, i) => {
                        const day = i + 1;
                        const isToday = day === 21;
                        const progress = (day * 3) % 100;
                        let progressBarClass = 'green';
                        if (progress < 40) progressBarClass = 'red';
                        else if (progress < 70) progressBarClass = 'yellow';

                        return (
                            <div key={`day-${day}`} className={`calendar-day-cell ${isToday ? 'today' : ''}`}>
                                <span className="day-number">{day}</span>
                                <div className="progress-bar-small">
                                    <div className={`progress-bar-small-inner ${progressBarClass}`} style={{ width: `${progress}%` }}></div>
                                </div>
                                {day % 3 === 0 && <span className="event-text">Project Due</span>}
                                {day % 5 === 0 && <span className="event-text">Exam Study</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
          )}

          {/* Add Task Page */}
          {currentPage === 'add-task' && (
            <div className="add-task-page">
                <div className="add-task-card box">
                    <h3 className="card-title">Add New Task</h3>
                    <div className="input-group">
                        <label htmlFor="taskName">Task Name</label>
                        <input type="text" id="taskName" placeholder="e.g., Complete Calculus Assignment" />
                    </div>
                    <div className="input-group-grid">
                        <div className="input-group">
                            <label htmlFor="taskCategory">Category</label>
                            <select id="taskCategory">
                                <option value="">Select Category</option>
                                <option value="Academics">Academics</option>
                                <option value="Personal">Personal</option>
                                <option value="Work">Work</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="taskPriority">Priority</label>
                            <select id="taskPriority">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label htmlFor="taskDueDate">Due Date</label>
                            <input type="date" id="taskDueDate" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="taskDueTime">Due Time</label>
                            <input type="time" id="taskDueTime" />
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="taskDescription">Description (Optional)</label>
                        <textarea id="taskDescription" placeholder="Add more details about this task..."></textarea>
                    </div>
                    <button className="add-button">Add Task</button>
                </div>

                <div className="add-category-card box">
                    <h3 className="card-title">Add New Habit</h3>
                    <div className="input-group">
                        <label htmlFor="habitName">Habit Name</label>
                        <input type="text" id="habitName" placeholder="e.g., Daily Reading" />
                    </div>
                    <div className="input-group">
                        <label>Repeat Days</label>
                        <div className="repeat-days-selector">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <span key={index} className="day-dot">{day}</span>
                            ))}
                        </div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="habitGoal">Goal (e.g., 30 mins)</label>
                        <input type="text" id="habitGoal" placeholder="e.g., 30 mins, 5 pages" />
                    </div>
                    <button className="add-button">Add Habit</button>
                </div>
            </div>
          )}

          {/* Study Plan Page */}
          {currentPage === 'plan' && (
            <div className="plan-page">
                <div className="plan-summary-grid">
                    <div className="plan-summary-item progress-summary box">
                        <div className="label">Tasks Completed</div>
                        <div className="value">75%</div>
                    </div>
                    <div className="plan-summary-item time-summary box">
                        <div className="label">Study Time This Week</div>
                        <div className="value">12h 30m</div>
                    </div>
                    <div className="plan-summary-item exams-summary box">
                        <div className="label">Upcoming Exams</div>
                        <div className="value">3</div>
                    </div>
                </div>

                <div className="scheduled-tasks-list">
                    <h3>Today's Study Plan</h3>
                    <div className="scheduled-task-card box">
                        <span className="time-slot">09:00 AM</span>
                        <div className="task-details">
                            <div className="task-name">Calculus Review</div>
                            <div className="tags">
                                <span className="tag priority-high">High Priority</span>
                                <span className="tag custom-task">Academics</span>
                            </div>
                        </div>
                        <span className="task-checkbox"></span>
                    </div>
                    <div className="scheduled-task-card box">
                        <span className="time-slot">10:30 AM</span>
                        <div className="task-details">
                            <div className="task-name">Break</div>
                            <div className="tags">
                                <span className="tag custom-task">Personal</span>
                            </div>
                        </div>
                        <span className="task-checkbox checked">✔</span>
                    </div>
                    <div className="scheduled-task-card box">
                        <span className="time-slot">11:00 AM</span>
                        <div className="task-details">
                            <div className="task-name">Physics Homework</div>
                            <div className="tags">
                                <span className="tag priority-medium">Medium Priority</span>
                                <span className="tag custom-task">Academics</span>
                            </div>
                        </div>
                        <span className="task-checkbox"></span>
                    </div>
                    <div className="scheduled-task-card box">
                        <span className="time-slot">02:00 PM</span>
                        <div className="task-details">
                            <div className="task-name">English Essay Outline</div>
                            <div className="tags">
                                <span className="tag priority-high">High Priority</span>
                                <span className="tag custom-task">Academics</span>
                            </div>
                        </div>
                        <span className="task-checkbox"></span>
                    </div>
                </div>
            </div>
          )}

          {/* GPA Calculator Page */}
          {currentPage === 'gpa-calculator' && (
            <div className="gpa-calculator-page">
                <div className="gpa-calculator-section box">
                    <h3 className="card-title">Add Course Grades</h3>
                    <div className="input-group">
                        <label htmlFor="courseName">Course Name</label>
                        <input type="text" id="courseName" placeholder="e.g., Advanced Algebra" />
                    </div>
                    <div className="input-group-grid">
                        <div className="input-group">
                            <label htmlFor="courseCredits">Credits</label>
                            <input type="number" id="courseCredits" placeholder="e.g., 3" min="0.5" step="0.5" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="courseGrade">Grade (4.0 Scale)</label>
                            <input type="number" id="courseGrade" placeholder="e.g., 3.7" min="0" max="4" step="0.01" />
                        </div>
                    </div>
                    <button className="add-button">Add Course</button>

                    <table className="course-list">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Credits</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                            <tbody>
                                <tr>
                                    <td>Biology I</td>
                                    <td>4</td>
                                    <td>3.5</td>
                                    <td><button className="remove-btn">Remove</button></td>
                                </tr>
                                <tr>
                                    <td>Introduction to Psychology</td>
                                    <td>3</td>
                                    <td>4.0</td>
                                    <td><button className="remove-btn">Remove</button></td>
                                </tr>
                                <tr>
                                    <td>College Writing</td>
                                    <td>3</td>
                                    <td>3.0</td>
                                    <td><button className="remove-btn">Remove</button></td>
                                </tr>
                            </tbody>
                    </table>

                    <div className="gpa-result">
                        <span>Calculated GPA:</span> 3.58
                    </div>
                </div>
            </div>
          )}

          {/* Settings Page */}
          {currentPage === 'settings' && (
            <div className="settings-page">
                <div className="settings-section box">
                    <h3 className="card-title">User Settings</h3>
                    <div className="setting-item">
                        <label htmlFor="darkModeToggle">Dark Mode</label>
                        <label className="switch">
                            <input
                                type="checkbox"
                                id="darkModeToggle"
                                checked={userProfile?.darkMode || false}
                                onChange={(e) => {
                                    setUserProfile(prev => ({ ...prev, darkMode: e.target.checked }));
                                    console.log("Dark mode updated to:", e.target.checked);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="setting-item">
                        <label htmlFor="accentColorPicker">Accent Color</label>
                        <input
                            type="color"
                            id="accentColorPicker"
                            value={userProfile?.accentColor || '#3498DB'}
                            onChange={(e) => {
                                setUserProfile(prev => ({ ...prev, accentColor: e.target.value }));
                                document.documentElement.style.setProperty('--color-blue', e.target.value);
                                document.documentElement.style.setProperty('--color-dark-blue', darkenColor(e.target.value, 10));
                                                               console.log("Accent color updated to:", e.target.value);
                            }}
                        />
                    </div>
                    <div className="setting-item">
                        <label htmlFor="displayName">Display Name</label>
                        <input
                            type="text"
                            id="displayName"
                            value={userProfile?.displayName || 'Student'}
                            onChange={(e) => {
                                setUserProfile(prev => ({ ...prev, displayName: e.target.value }));
                                console.log("Display name updated to:", e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="settings-section box">
                    <h3 className="card-title">Data Management</h3>
                    <div className="setting-item">
                        <button className="export-btn">Export Data</button>
                    </div>
                    <div className="setting-item">
                        <button className="import-btn">Import Data</button>
                    </div>
                    <div className="setting-item">
                        <button 
                            className="reset-btn"
                            onClick={() => showConfirmation(
                                "This will reset all your settings to defaults. Continue?",
                                () => {
                                    setUserProfile({
                                        displayName: 'Student',
                                        darkMode: false,
                                        accentColor: '#3498DB'
                                    });
                                    console.log("Settings reset to defaults");
                                }
                            )}
                        >
                            Reset to Defaults
                        </button>
                    </div>
                </div>

                <div className="settings-section box">
                    <h3 className="card-title">About</h3>
                    <div className="about-content">
                        <p><strong>PrepPack Student Dashboard</strong></p>
                        <p>Version 1.0.0</p>
                        <p>© 2023 PrepPack Team</p>
                        <div className="social-links">
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">GitHub</a>
                            <a href="#" className="social-link">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <ConfirmationModal
          message={modalMessage}
          onConfirm={modalOnConfirm}
          onCancel={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
      />
      <ErrorReportingModal
          errorMessage={authError}
          onClose={() => setAuthError(null)}
          isOpen={!!authError}
      />
    </>
  );
}

// App wrapper component
function App() {
  return (
    <UserContext.Provider value={{}}>
      <MainDashboardApp />
    </UserContext.Provider>
  );
}

export default App;