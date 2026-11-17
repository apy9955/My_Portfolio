import { useState, useRef, useEffect, memo, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Terminal as TerminalIcon,
  X,
  Minus,
  Maximize2,
  Trash2,
  CornerDownLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import {
  processTerminalInput,
  type TerminalLine,
  type TerminalResponse,
} from './terminalKnowledge'

interface HistoryEntry {
  id: string
  command?: string
  response: TerminalResponse
  timestamp: string
}

const INITIAL_WELCOME: TerminalResponse = {
  lines: [
    { type: 'header', text: '==================================================================' },
    { type: 'header', text: '   APY TERMINAL (v2.6.4-lts-x86_64) — ASK AMAN' },
    { type: 'header', text: '   [Engine: Verified Portfolio Knowledge Graph & Rule-Based NLP]' },
    { type: 'header', text: '==================================================================' },
    { type: 'info', text: 'Welcome to APY Terminal.' },
    { type: 'info', text: 'Interactive portfolio assistant for Aman Kumar.' },
    { type: 'system', text: 'Ask me anything about my projects, dual-degree education, verified skills, and research interests.' },
    { type: 'system', text: "Type 'help' for available system commands or ask any question directly." },
  ],
  suggestedNext: ['whoami', 'education', 'projects', 'skills', 'leetcode', 'sudo explore'],
}

/**
 * APY Terminal — Ask Aman AI Component
 * Renders floating launcher at bottom-left and interactive Linux terminal popup.
 */
export const ApyTerminal = memo(function ApyTerminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'welcome',
      response: INITIAL_WELCOME,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyPointer, setHistoryPointer] = useState<number>(-1)
  const [isTyping, setIsTyping] = useState(false)

  const outputRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-scroll to bottom of terminal output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [history, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen, isMinimized])

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Add to command history
    setCommandHistory(prev => [...prev, trimmed])
    setHistoryPointer(-1)

    // Handle 'clear' command locally
    if (trimmed.toLowerCase() === 'clear') {
      setHistory([])
      setInputVal('')
      return
    }

    setIsTyping(true)

    // Attempt backend AI query processing with fallback to local engine
    fetch('/api/terminal/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed }),
      signal: AbortSignal.timeout(3000),
    })
      .then(res => res.json())
      .then(data => {
        const responseData = (data?.success && data.response) ? data.response : processTerminalInput(trimmed)
        setHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            command: trimmed,
            response: responseData,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      })
      .catch(() => {
        // Instant local engine fallback
        const res = processTerminalInput(trimmed)
        setHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            command: trimmed,
            response: res,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
      })
      .finally(() => {
        setIsTyping(false)
      })

    setInputVal('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    executeCommand(inputVal)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return
      const nextPointer = historyPointer === -1 ? commandHistory.length - 1 : Math.max(0, historyPointer - 1)
      setHistoryPointer(nextPointer)
      setInputVal(commandHistory[nextPointer] || '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyPointer === -1) return
      const nextPointer = historyPointer + 1
      if (nextPointer >= commandHistory.length) {
        setHistoryPointer(-1)
        setInputVal('')
      } else {
        setHistoryPointer(nextPointer)
        setInputVal(commandHistory[nextPointer] || '')
      }
    }
  }

  return (
    <>
      {/* 1. Floating Terminal Launcher (Fixed at Bottom-Left) */}
      <div className="terminal-launcher-container" style={{ zIndex: 45 }}>
        <button
          type="button"
          className={`terminal-launcher-btn ${isOpen ? 'active' : ''}`}
          onClick={() => {
            setIsOpen(!isOpen)
            setIsMinimized(false)
          }}
          aria-label={isOpen ? 'Close APY Terminal' : 'Open APY Terminal (Ask Aman AI)'}
          aria-expanded={isOpen}
        >
          <div className="terminal-launcher-icon">
            <TerminalIcon size={20} />
          </div>
          <span className="terminal-launcher-tooltip">Ask Aman</span>
          <span className="terminal-online-ring" />
        </button>
      </div>

      {/* 2. Floating Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`terminal-window ${isMinimized ? 'is-minimized' : ''}`}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-label="APY Terminal — Ask Aman AI"
            style={{ zIndex: 50 }}
          >
            {/* Window Header */}
            <header className="terminal-header">
              <div className="terminal-window-dots" aria-hidden="true">
                <button
                  type="button"
                  className="window-dot dot-close"
                  onClick={() => setIsOpen(false)}
                  title="Close Terminal"
                />
                <button
                  type="button"
                  className="window-dot dot-min"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Restore' : 'Minimize'}
                />
                <button
                  type="button"
                  className="window-dot dot-max"
                  onClick={() => setIsMinimized(false)}
                  title="Expand"
                />
              </div>

              <div className="terminal-title-bar">
                <TerminalIcon size={14} className="terminal-header-icon" />
                <span className="terminal-title-text">APY TERMINAL</span>
                <span className="terminal-badge-live">Ask Aman AI</span>
                <span className="terminal-live-beacon" title="Online" />
              </div>

              <div className="terminal-header-actions">
                <button
                  type="button"
                  className="terminal-action-btn"
                  onClick={() => setHistory([])}
                  title="Clear Output Buffer"
                  aria-label="Clear Terminal"
                >
                  <Trash2 size={13} />
                </button>
                <button
                  type="button"
                  className="terminal-action-btn"
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? 'Restore Window' : 'Minimize Window'}
                  aria-label={isMinimized ? 'Restore' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 size={13} /> : <Minus size={13} />}
                </button>
                <button
                  type="button"
                  className="terminal-action-btn close-action"
                  onClick={() => setIsOpen(false)}
                  title="Close Terminal (Esc)"
                  aria-label="Close Terminal"
                >
                  <X size={14} />
                </button>
              </div>
            </header>

            {/* Window Body */}
            {!isMinimized && (
              <div className="terminal-body-wrapper">
                <div className="terminal-scanlines" aria-hidden="true" />

                {/* Output History */}
                <div ref={outputRef} className="terminal-output-area">
                  {history.map(entry => (
                    <div key={entry.id} className="terminal-entry-block">
                      {entry.command && (
                        <div className="terminal-user-command">
                          <span className="term-prompt-user">apy@aman</span>
                          <span className="term-prompt-sep">:</span>
                          <span className="term-prompt-dir">~</span>
                          <span className="term-prompt-char">$</span>
                          <span className="term-command-text">{entry.command}</span>
                        </div>
                      )}

                      <div className="terminal-response-block">
                        {entry.response.lines.map((line, idx) => (
                          <div key={idx} className={`term-line term-line-${line.type}`}>
                            <span>{line.text}</span>
                            {line.link && (
                              line.link.url.startsWith('/') ? (
                                <Link
                                  to={line.link.url}
                                  className="term-link"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {line.link.label} <ExternalLink size={10} />
                                </Link>
                              ) : (
                                <a
                                  href={line.link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="term-link"
                                >
                                  {line.link.label} <ExternalLink size={10} />
                                </a>
                              )
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Suggested Next Action Chips */}
                      {entry.response.suggestedNext && entry.response.suggestedNext.length > 0 && (
                        <div className="terminal-suggested-row">
                          <span className="suggested-label">Suggestions:</span>
                          {entry.response.suggestedNext.map(suggestion => (
                            <button
                              key={suggestion}
                              type="button"
                              className="term-suggestion-chip"
                              onClick={() => executeCommand(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="terminal-typing-line">
                      <span className="term-prompt-user">apy@aman</span>
                      <span className="term-prompt-sep">:</span>
                      <span className="term-prompt-dir">~</span>
                      <span className="term-prompt-char">$</span>
                      <span className="term-typing-indicator">processing query...</span>
                      <span className="term-cursor" />
                    </div>
                  )}
                </div>

                {/* Command Input Bar */}
                <form className="terminal-input-bar" onSubmit={handleSubmit}>
                  <div className="terminal-prompt-label" aria-hidden="true">
                    <span className="term-prompt-user">apy@aman</span>
                    <span className="term-prompt-sep">:</span>
                    <span className="term-prompt-dir">~</span>
                    <span className="term-prompt-char">$</span>
                  </div>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything or enter command (e.g. whoami, projects, help)..."
                    className="terminal-text-input"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    aria-label="Terminal command input"
                  />

                  <button
                    type="submit"
                    className="terminal-submit-btn"
                    disabled={!inputVal.trim()}
                    aria-label="Submit command"
                    title="Press Enter to submit"
                  >
                    <CornerDownLeft size={13} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
})
