/**
 * React Component for QA Tester Interface
 * Enhanced UI with real-time updates and better UX
 */

import React, { useState, useEffect } from 'react';
import './QATester.css';

const QATester = () => {
  const [projectName, setProjectName] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedGoals, setSelectedGoals] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000/api');

  const automationGoals = {
    'Browser Navigation & URL Validation': {
      description: 'Ensure successful navigation and URL consistency across redirects.',
      icon: 'fa-route'
    },
    'Page Element & Content Integrity': {
      description: 'Verify presence, visibility, and correctness of key UI elements and text.',
      icon: 'fa-cubes'
    },
    'Performance Metrics & Load Times': {
      description: 'Assess page load performance, rendering speed, and resource efficiency.',
      icon: 'fa-tachometer-alt'
    },
    'Accessibility Conformance (WCAG)': {
      description: 'Identify violations against Web Content Accessibility Guidelines.',
      icon: 'fa-universal-access'
    },
    'Form Interaction & Data Submission': {
      description: 'Simulate user input, form submission, and validate responses.',
      icon: 'fa-keyboard'
    },
    'Screenshot & Visual Regression': {
      description: 'Capture page state for visual comparison and regression analysis.',
      icon: 'fa-camera'
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const handleGoalToggle = (goal) => {
    setSelectedGoals(prev => ({
      ...prev,
      [goal]: !prev[goal]
    }));
  };

  const runAutomation = async () => {
    if (!projectName || !targetUrl) {
      alert('Please fill in all required fields');
      return;
    }

    const activeGoals = Object.keys(selectedGoals).filter(key => selectedGoals[key]);
    if (activeGoals.length === 0) {
      alert('Please select at least one automation goal');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    addLog(`Initializing project: ${projectName}`, 'info');
    addLog(`Target URL: ${targetUrl}`, 'info');
    addLog('Selected goals: ' + activeGoals.join(', '), 'info');
    addLog('Executing automation...', 'default');

    try {
      const response = await fetch(`${backendUrl}/qa_project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_name: projectName,
          target_url: targetUrl,
          selected_goals: selectedGoals,
          selenium_options: { headless: true, windowSize: '1920,1080' }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      addLog('Automation completed successfully!', 'success');
      addLog('Test Results Summary:', 'info');
      
      if (result.report && result.report.report_summary) {
        Object.entries(result.report.report_summary).forEach(([key, value]) => {
          addLog(`${key}: ${value}`, 'default');
        });
      }

      if (result.report && result.report.recommendations) {
        addLog('Recommendations:', 'warning');
        result.report.recommendations.forEach(rec => {
          addLog(`- ${rec}`, 'default');
        });
      }

      loadHistory();
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
      addLog('Please ensure the backend is running', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${backendUrl}/qa_history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  return (
    <div className="qa-tester-container">
      <header className="qa-header">
        <h1>
          <i className="fas fa-robot"></i> AI QA Testing Platform
        </h1>
        <p>Automated testing with Playwright, Selenium & Gemini AI</p>
      </header>

      <div className="qa-main">
        <section className="qa-form">
          <h2>Create New Test Project</h2>
          
          <div className="form-group">
            <label htmlFor="projectName">
              <i className="fas fa-folder"></i> Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Homepage Validation Test"
              disabled={isRunning}
            />
          </div>

          <div className="form-group">
            <label htmlFor="targetUrl">
              <i className="fas fa-globe"></i> Target URL
            </label>
            <input
              type="url"
              id="targetUrl"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://dpengeneering.site"
              disabled={isRunning}
            />
          </div>

          <h3>Select Test Goals</h3>
          <div className="goals-grid">
            {Object.entries(automationGoals).map(([goal, data]) => (
              <label key={goal} className="goal-item">
                <input
                  type="checkbox"
                  checked={selectedGoals[goal] || false}
                  onChange={() => handleGoalToggle(goal)}
                  disabled={isRunning}
                />
                <div className="goal-content">
                  <i className={`fas ${data.icon}`}></i>
                  <strong>{goal}</strong>
                  <p>{data.description}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={runAutomation}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Running Tests...
              </>
            ) : (
              <>
                <i className="fas fa-play"></i> Start Automation
              </>
            )}
          </button>
        </section>

        <section className="qa-console">
          <h2>
            <i className="fas fa-terminal"></i> Test Console
          </h2>
          <div className="console-output">
            {logs.length === 0 ? (
              <p className="console-placeholder">
                Console output will appear here...
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry log-${log.type}`}>
                  <span className="log-time">[{log.timestamp}]</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="qa-history">
          <h2>
            <i className="fas fa-history"></i> Test History
            <button className="btn-refresh" onClick={loadHistory}>
              <i className="fas fa-sync"></i> Refresh
            </button>
          </h2>
          <div className="history-list">
            {history.length === 0 ? (
              <p className="history-placeholder">No test history yet</p>
            ) : (
              history.map((project, index) => (
                <div key={index} className="history-item">
                  <h3>{project.project_name}</h3>
                  <p className="history-url">
                    <i className="fas fa-link"></i> {project.target_url}
                  </p>
                  <p className="history-date">
                    <i className="fas fa-clock"></i>{' '}
                    {new Date(project.timestamp).toLocaleString()}
                  </p>
                  <span className={`status-badge status-${project.qa_status.toLowerCase()}`}>
                    {project.qa_status}
                  </span>
                  {project.report_summary && (
                    <details className="history-details">
                      <summary>View Details</summary>
                      <div className="report-content">
                        {typeof project.report_summary === 'string' ? (
                          <p>{project.report_summary}</p>
                        ) : (
                          Object.entries(project.report_summary).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {value}
                            </div>
                          ))
                        )}
                      </div>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default QATester;
