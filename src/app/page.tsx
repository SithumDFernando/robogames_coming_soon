'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Terminal, 
  ExternalLink, 
  Radio, 
  Cpu, 
  Sparkles, 
  Send, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const InstagramIcon = ({ size = 13 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface LogItem {
  text: string;
  type: 'white' | 'yellow' | 'green' | 'amber' | 'gray' | 'red';
}

const INITIAL_LOGS: LogItem[] = [
  { text: '[SYSTEM] Initializing robogames.work kernel v2.7.0-rc1...', type: 'gray' },
  { text: '[UOM:CSE] Linking to Department of Computer Science & Engineering node...', type: 'gray' },
  { text: '[ARENA] Webots physics server handshakes: School & University brackets ready.', type: 'yellow' },
  { text: '[BATTLEBOTS] Polycarbonate arena perimeter & radio interlocks armed: 100%.', type: 'green' },
  { text: '[CONFIDENTIAL] Channel state: OC Member Restricted Preview. Public announcement pending.', type: 'amber' },
  { text: '[SIGNAL] Type "help" or "status" to interact with this console.', type: 'yellow' },
];

export default function Home() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [bootPercent, setBootPercent] = useState(18);
  const [mascotQuote, setMascotQuote] = useState('Standby! We are configuring something epic...');
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  // Progressive simulated boot sequence
  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < INITIAL_LOGS.length) {
        const nextLog = INITIAL_LOGS[currentStep];
        setLogs(prev => [...prev, nextLog]);
        setBootPercent(Math.min(96, 25 + currentStep * 14));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  // Auto scroll only the terminal container
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [logs]);

  // Terminal command handler
  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newLogs: LogItem[] = [...logs, { text: `> ${inputVal}`, type: 'white' }];

    switch (cmd) {
      case 'help':
        newLogs.push(
          { text: 'Available diagnostic commands:', type: 'yellow' },
          { text: '  status       - Check system readiness & telemetry', type: 'gray' },
          { text: '  oc           - List Organizing Committee leadership', type: 'gray' },
          { text: '  categories   - Show RoboGames 2027 competition tracks', type: 'gray' },
          { text: '  social       - View official community and social channels', type: 'gray' },
          { text: '  main         - Open official portal (robo.cse.mrt.ac.lk)', type: 'gray' },
          { text: '  clear        - Clear terminal output', type: 'gray' }
        );
        break;
      case 'social':
      case 'instagram':
        newLogs.push(
          { text: 'Official RoboGames Community & Socials:', type: 'yellow' },
          { text: '  Instagram: @robogames__ (instagram.com/robogames__)', type: 'gray' },
          { text: '  WhatsApp Channel: whatsapp.com/channel/0029VbE3zlc7IUYcNUqb9n0S', type: 'gray' },
          { text: '  Main Portal: robo.cse.mrt.ac.lk', type: 'gray' }
        );
        setMascotQuote('Follow our journey on Instagram and WhatsApp!');
        break;
      case 'status':
        newLogs.push(
          { text: 'Status: ALL SYSTEMS NOMINAL (STAGING)', type: 'green' },
          { text: 'Domain: robogames.work (Secured for OC)', type: 'gray' },
          { text: 'Host: University of Moratuwa // CSE Dept', type: 'gray' },
          { text: 'Readiness: 88.4% (Preparing for announcement)', type: 'yellow' }
        );
        setMascotQuote('All circuits nominal! Arena is locked and loaded!');
        break;
      case 'oc':
        newLogs.push(
          { text: 'RoboGames 2027 Organizing Committee:', type: 'yellow' },
          { text: '  Academic Advisor: Dr. Sulochana Sooriyarachchi', type: 'gray' },
          { text: '  Chairperson: Induru Adeesha', type: 'gray' },
          { text: '  Co-Chairperson: Sithum Fernando', type: 'gray' },
          { text: '  Technical Lead: Anuhas Ranasinghe', type: 'gray' },
          { text: '  Design Lead: Dineth Thenuwara', type: 'gray' },
          { text: '  Publicity Lead: Thisath Kariyawasam', type: 'gray' },
          { text: '  Web Lead: Dulranga Dhawanitha', type: 'gray' },
          { text: '  Finance Lead: Kavindu Jayalath', type: 'gray' },
          { text: '  Event Lead: Kaveen Hirumal', type: 'gray' },
          { text: '  Logistic Lead: Sachithra Vithanage', type: 'gray' },
          { text: '  Delegate Lead: Devindi Wickramarathna', type: 'gray' },
          { text: '  Editorial Lead: Sheereen Rizwan', type: 'gray' }
        );
        setMascotQuote('Shoutout to the OC team making this happen!');
        break;
      case 'categories':
        newLogs.push(
          { text: '1. School Track: Webots simulation -> Hardware line-follower final', type: 'gray' },
          { text: '2. University Track: Autonomous pathfinding & strategy final', type: 'gray' },
          { text: '3. Open Combat Track: Knockout BattleBots enclosed arena', type: 'gray' }
        );
        break;
      case 'main':
        window.open('https://robo.cse.mrt.ac.lk/', '_blank');
        newLogs.push({ text: 'Redirecting to official site: robo.cse.mrt.ac.lk...', type: 'green' });
        break;
      case 'clear':
        setLogs([]);
        setInputVal('');
        return;
      default:
        newLogs.push({
          text: `Command not recognized: "${cmd}". Type "help" for a list of commands.`,
          type: 'red',
        });
        break;
    }

    setLogs(newLogs);
    setInputVal('');
  };

  const getLogClass = (type: LogItem['type']) => {
    switch (type) {
      case 'white': return 'log-white';
      case 'yellow': return 'log-yellow';
      case 'green': return 'log-green';
      case 'amber': return 'log-amber';
      case 'red': return 'log-red';
      default: return 'log-gray';
    }
  };

  return (
    <div className="bg-ambient page-container">
      <div className="scanline-layer" />

      {/* Floating Header Navbar */}
      <header className="content-wrapper nav-header">
        <nav className="nav-bar">
          <div className="nav-brand">
            <Image 
              src="/logos/cse.png" 
              alt="Department of Computer Science and Engineering" 
              width={82} 
              height={28} 
              priority
              style={{ width: 'auto', height: '28px' }}
            />
            <div className="brand-divider" />
            <div className="brand-name-group">
              <Image 
                src="/logos/robogames.svg" 
                alt="RoboGames 2027" 
                width={110} 
                height={30} 
                priority
                style={{ width: 'auto', height: '30px' }}
              />
              <span className="domain-tag">.WORK</span>
            </div>
          </div>

          <div className="nav-actions">
            <a
              href="https://robo.cse.mrt.ac.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-portal"
            >
              <span>Main Portal</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="content-wrapper main-layout">
        
        {/* Hero Section */}
        <section className="hero-section">
          <div className="beacon-pill">
            <Radio size={14} color="#25D366" />
            <span>FREQUENCY ESTABLISHED // ROBOGAMES.WORK</span>
          </div>

          <h1 className="hero-title">ROBOGAMES</h1>
          
          <div className="hero-subtitle">
            <span>ARENA BOOT SEQUENCE</span>
            <span className="year-accent">2027</span>
          </div>

          <p className="hero-desc">
            This domain is an official sandbox secured by the RoboGames Organizing Committee. 
            We are configuring internal infrastructure, scoring matrices, and event telemetry for the upcoming season.
          </p>
        </section>

        {/* Center Grid: Terminal + Mascot Sidebar */}
        <section className="grid-main">
          
          {/* Terminal Console Card */}
          <div className="terminal-card">
            <div className="terminal-header">
              <div className="terminal-controls">
                <span className="control-dot dot-red" />
                <span className="control-dot dot-yellow" />
                <span className="control-dot dot-green" />
                <div className="terminal-title">
                  <Terminal size={13} color="#f8d826" />
                  <span>terminal@robogames.work:~</span>
                </div>
              </div>
              <div className="terminal-meta">
                <span>BOOT: {bootPercent}%</span>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${bootPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="terminal-body" ref={terminalBodyRef}>
              <div className="terminal-banner">
                ------------------------------------------------<br />
                &gt; ROBO_SYSTEM BOOT LOADER // MORATUWA ROBOTICS MATRIX<br />
                ------------------------------------------------
              </div>
              {logs.map((log, index) => (
                <div key={index} className={`log-line ${getLogClass(log.type)}`}>
                  {log.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleCommand} className="terminal-form">
              <span className="terminal-prompt">&gt;</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'help', 'status', 'oc', or 'main'..."
                className="terminal-input"
              />
              <button type="submit" className="btn-send" title="Send command">
                <Send size={13} />
              </button>
            </form>
          </div>

          {/* Sidebar Column */}
          <div className="sidebar-col">
            
            {/* Mascot Widget */}
            <div className="mascot-card">
              <div className="mascot-tag">
                <Sparkles size={11} color="#f8d826" />
                <span>MASCOT BOT</span>
              </div>

              <div className="mascot-figure">
                <Image
                  src="/mascots/battlebot_waving.webp"
                  alt="RoboGames BattleBot Mascot"
                  width={160}
                  height={160}
                  priority
                  style={{ width: '160px', height: '160px', objectFit: 'contain' }}
                />
              </div>

              <div className="mascot-bubble">
                &ldquo;{mascotQuote}&rdquo;
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="action-card">
              <div>
                <div className="action-header-tag">
                  <Cpu size={13} />
                  <span>Primary Portal</span>
                </div>
                <h3 className="action-title">RoboGames 2027 Main Web</h3>
                <p className="action-desc">
                  View full competition guidelines, simulation deadlines, and official rulebooks at University of Moratuwa.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="https://robo.cse.mrt.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-action"
                >
                  <span>Go to robo.cse.mrt.ac.lk</span>
                  <ArrowRight size={14} />
                </a>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a
                    href="https://whatsapp.com/channel/0029VbE3zlc7IUYcNUqb9n0S"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp-action"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href="https://www.instagram.com/robogames__?dlrf=YngwdjVqa2JhMmVq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-instagram-action"
                  >
                    <InstagramIcon size={13} />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="content-wrapper">
          <div className="footer-inner">
            
            <div className="footer-org">
              <div className="footer-logos">
                <Image 
                  src="/logos/uom.png" 
                  alt="University of Moratuwa" 
                  width={32} 
                  height={32} 
                  style={{ width: 'auto', height: '32px' }}
                />
                <Image 
                  src="/logos/cse.png" 
                  alt="CSE Department" 
                  width={76} 
                  height={24} 
                  style={{ width: 'auto', height: '24px' }}
                />
              </div>
              <div className="footer-org-text">
                <strong>Department of Computer Science &amp; Engineering</strong>
                <span>University of Moratuwa, Sri Lanka</span>
              </div>
            </div>

            <div className="footer-partners">
              <div className="partner-item">
                <Image 
                  src="/logos/iesl.svg" 
                  alt="IESL" 
                  width={30} 
                  height={26} 
                  style={{ width: 'auto', height: '26px' }}
                />
                <span>IESL</span>
              </div>
              <div className="partner-sep" />
              <div className="partner-item">
                <Image 
                  src="/logos/slt.svg" 
                  alt="SLT Mobitel" 
                  width={64} 
                  height={22} 
                  style={{ width: 'auto', height: '22px' }}
                />
                <span>POWERED BY</span>
              </div>
            </div>

            <div className="footer-copy">
              <div>robogames.work &bull; &copy; 2027 RoboGames</div>
              <div style={{ color: '#444450', marginTop: '2px' }}>ALL RIGHTS RESERVED // OC SANDBOX</div>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
