import React, { useState, useEffect } from 'react';
import { Search, Bot, User, Send, BellRing, Sparkles, FolderArchive, MessageCircle, FileText, Clock } from 'lucide-react';

export default function DoctorMessages({ onNavigate, selectedId, patients = [], setPatients, onSelectId, triggerToast, threads = [], setThreads }) {
  const [activeThreadId, setActiveThreadId] = useState('MSG101');

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'archived'
  
  // Simulation handoff state
  const [hasEscalatedSession, setHasEscalatedSession] = useState(true);
  const [isEscalatedSessionActive, setIsEscalatedSessionActive] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(120);
  const [escalatedThreadId, setEscalatedThreadId] = useState(null);

  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    if (selectedId) {
      if (selectedId.startsWith('MSG') && threads.some(t => t.id === selectedId)) {
        setActiveThreadId(selectedId);
      } else if (selectedId.startsWith('P')) {
        const patient = patients.find(p => p.id === selectedId);
        if (patient) {
          const matchedThread = threads.find(t => t.name.toLowerCase() === patient.name.toLowerCase());
          if (matchedThread) {
            setActiveThreadId(matchedThread.id);
          }
        }
      }
    }
  }, [selectedId, threads, patients]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Session timer ticker
  useEffect(() => {
    let timer;
    if (isEscalatedSessionActive) {
      timer = setInterval(() => {
        setSessionTimeLeft(prev => {
          if (prev <= 1) {
            setIsEscalatedSessionActive(false);
            setHasEscalatedSession(true);
            setEscalatedThreadId(null);
            triggerToast('Phiên tư vấn chuyên sâu đã hết hạn (giới hạn demo 2 phút).', 'info');
            return 120;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setEscalatedThreadId(null);
      setSessionTimeLeft(120);
    }
    return () => clearInterval(timer);
  }, [isEscalatedSessionActive]);

  // Handoff Live Session trigger
  const handleAcceptHandoff = () => {
    setHasEscalatedSession(false);
    setIsEscalatedSessionActive(true);
    setEscalatedThreadId(activeThreadId);
    triggerToast('Đã kết nối phiên live chat tư vấn chuyên sâu!', 'success');
    
    // Add new chat thread or insert into current Nguyễn Minh Anh messages
    const handoffMessages = [
      { sender: 'system', text: 'Bệnh nhân sốt cao 39 độ kèm ho khan kéo dài 2 ngày, có dấu hiệu mệt mỏi ăn uống kém. Đã thanh toán phí tư vấn chuyên sâu (150,000đ) để kết nối trực tiếp với Bác sĩ.', time: '08:11' },
      { sender: 'patient', text: 'Chào bác sĩ Huy, em sốt cao và mệt quá, em đã uống Paracetamol nhưng hết thuốc lại sốt lại. Em muốn hỏi bác sĩ có cần nhập viện gấp không ạ?', time: '08:12' }
    ];

    setThreads(threads.map(t => {
      if (t.id === 'MSG101') {
        return {
          ...t,
          unread: false,
          messages: [...t.messages, ...handoffMessages]
        };
      }
      return t;
    }));
    setActiveThreadId('MSG101');
  };

  // Chat reply simulation
  const handleSendMsg = () => {
    if (!messageText.trim()) return;
    
    const timeNow = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const doctorMsg = { sender: 'doctor', text: messageText, time: timeNow };
    
    // Update local thread messages
    const updatedThreads = threads.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          lastMsg: messageText,
          time: timeNow,
          messages: [...t.messages, doctorMsg]
        };
      }
      return t;
    });
    setThreads(updatedThreads);
    setMessageText('');

    // Trigger simulated patient reply after 1.5s
    setTimeout(() => {
      const patientReplies = {
        'MSG101': 'Dạ vâng thưa bác sĩ, em sẽ đo nhiệt độ lại. Em cũng cảm thấy hơi rùng mình lạnh nữa. Để em sắp xếp đặt lịch hẹn khám trực tiếp với bác sĩ ạ.',
        'MSG102': 'Vâng, em uống sữa xong là buồn nôn luôn ạ. Em cảm giác bụng tức cứng khó chịu lắm.',
        'MSG103': 'Dạ vâng, mắt em còn ra dử màu xanh nhạt nữa ạ. Em có nên nhỏ nước muối sinh lý không bác sĩ?',
        'MSG104': 'Vâng ạ, em bị rát họng khoảng 4 ngày nay, ngạt mũi nhiều về đêm làm không ngủ ngon được.',
        'MSG105': 'Em chưa chụp X-quang khớp gối bao giờ bác sĩ ạ. Bác sĩ cho em hỏi phòng khám mình có chụp luôn không?',
        'MSG106': 'Dạ em có đo huyết áp ở nhà thì thấy khoảng 110/70, tức là bình thường phải không bác sĩ?'
      };

      const replyText = patientReplies[activeThreadId] || 'Cảm ơn tư vấn của bác sĩ ạ. Tôi sẽ làm theo hướng dẫn.';
      const patientMsg = { sender: 'patient', text: replyText, time: timeNow };

      setThreads(prevThreads => prevThreads.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMsg: replyText,
            messages: [...t.messages, patientMsg]
          };
        }
        return t;
      }));
      triggerToast('Tin nhắn mới từ bệnh nhân', 'info');
    }, 1500);
  };

  // Filters
  const filteredThreads = threads.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'unread') return matchSearch && t.unread;
    if (activeTab === 'archived') return matchSearch && t.id === 'MSG106'; // mock archive
    return matchSearch;
  });

  return (
    <div className="animate-fade-in">
      
      {/* Top Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Danh sách tin nhắn</h2>
      </div>

      {/* Live escalation request notification bar */}
      {hasEscalatedSession && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#eff6ff', 
          border: '1px solid #bfdbfe', 
          borderRadius: '8px', 
          padding: '12px 16px', 
          marginBottom: '16px',
          animation: 'pulseGlow 2.5s infinite' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'var(--primary)', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BellRing size={16} style={{ margin: '0 auto' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                Yêu cầu Tư vấn chuyên sâu (Trả phí)
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Bệnh nhân <strong>Nguyễn Minh Anh</strong> đã chuyển từ Chatbot AI sang Yêu cầu kết nối trực tiếp Bác sĩ Dương Gia Huy.
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleAcceptHandoff}
            className="btn btn-primary"
            style={{ 
              padding: '6px 14px', 
              fontSize: '0.8rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontWeight: 600,
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' 
            }}
          >
            <Sparkles size={14} /> Chấp nhận tư vấn
          </button>
        </div>
      )}

      {/* Layout Grid columns: Chat Lists vs Chat Room */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', height: '560px', alignItems: 'stretch' }}>
        
        {/* LEFT COLUMN: Queue threads */}
        <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '6px', gap: '2px' }}>
            <button
              onClick={() => setActiveTab('all')}
              className="filter-select"
              style={{ 
                flexGrow: 1, 
                border: 'none', 
                padding: '6px 0', 
                fontSize: '0.75rem', 
                fontWeight: activeTab === 'all' ? 700 : 500,
                backgroundColor: activeTab === 'all' ? '#fff' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className="filter-select"
              style={{ 
                flexGrow: 1, 
                border: 'none', 
                padding: '6px 0', 
                fontSize: '0.75rem', 
                fontWeight: activeTab === 'unread' ? 700 : 500,
                backgroundColor: activeTab === 'unread' ? '#fff' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Chưa xem
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className="filter-select"
              style={{ 
                flexGrow: 1, 
                border: 'none', 
                padding: '6px 0', 
                fontSize: '0.75rem', 
                fontWeight: activeTab === 'archived' ? 700 : 500,
                backgroundColor: activeTab === 'archived' ? '#fff' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Lưu trữ
            </button>
          </div>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 10px', backgroundColor: '#f8fafc' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm hội thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '100%' }}
            />
          </div>

          {/* List items queue */}
          <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {filteredThreads.map((t) => {
              const isSelected = t.id === activeThreadId;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveThreadId(t.id);
                    // Mark as read
                    setThreads(threads.map(th => th.id === t.id ? { ...th, unread: false } : th));
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#f0f9ff' : 'transparent',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    position: 'relative',
                    transition: 'all 0.15s'
                  }}
                >
                  {/* Status dot */}
                  {t.unread && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                  )}

                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--text-muted)' }}>
                    <User size={16} style={{ margin: '0 auto' }} />
                  </div>

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: t.unread || isSelected ? 700 : 500, color: 'var(--text-dark)' }}>
                        {t.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                      {t.lastMsg}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Chat Room Mock ChatGPT */}
        <div className="chatgpt-mockup-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div className="chatgpt-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={14} style={{ margin: '0 auto' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{activeThread.name}</span>
                <span style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  Đang hoạt động trực tuyến
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                const nameToFind = activeThread.name;
                const existing = patients.find(p => p.name.toLowerCase() === nameToFind.toLowerCase());
                let targetId;
                if (existing) {
                  targetId = existing.id;
                } else {
                  targetId = `P${Date.now()}`;
                  const newPatient = {
                    id: targetId,
                    name: nameToFind,
                    dob: '2000-08-25',
                    gender: 'Nữ',
                    phone: '0912345678',
                    email: `${nameToFind.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
                    address: 'Hải Châu, Đà Nẵng',
                    insurance: 'DN4012030192',
                    medicalHistory: []
                  };
                  setPatients([...patients, newPatient]);
                }
                onSelectId(targetId);
                onNavigate('doctor-patient-details');
                triggerToast(`Đang điều hướng tới hồ sơ bệnh án của ${nameToFind}...`, 'info');
              }}
              className="btn btn-outline"
              style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--border-color)', color: 'var(--primary)' }}
            >
              <FileText size={12} /> Bệnh án chi tiết
            </button>
          </div>

          {isEscalatedSessionActive && activeThreadId === escalatedThreadId && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#fffbeb',
              borderBottom: '1px solid #fef3c7',
              color: '#b45309',
              fontSize: '0.8rem',
              fontWeight: '500',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                <span>
                  Thời hạn phiên tư vấn chuyên sâu: <strong>24 giờ</strong> (Còn lại: 23 giờ 59 phút, Demo tự động kết thúc sau: <strong>{Math.floor(sessionTimeLeft / 60).toString().padStart(2, '0')}:{ (sessionTimeLeft % 60).toString().padStart(2, '0') }</strong>)
                </span>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="chatgpt-messages-area" style={{ flexGrow: 1, padding: '16px', overflowY: 'auto' }}>
            {activeThread.messages.map((msg, index) => {
              const isDoc = msg.sender === 'doctor';
              const isBot = msg.sender === 'bot';
              const isSystem = msg.sender === 'system';

              if (isSystem) {
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      margin: '20px 0',
                      width: '100%',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                      <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-color)', borderStyle: 'dashed' }}></div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Chuyển giao cho Bác sĩ
                      </span>
                      <div style={{ flexGrow: 1, height: '1px', backgroundColor: 'var(--border-color)', borderStyle: 'dashed' }}></div>
                    </div>
                    <div style={{
                      backgroundColor: '#fffbeb',
                      border: '1px solid #fef3c7',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      fontSize: '0.78rem',
                      color: '#b45309',
                      lineHeight: 1.45,
                      maxWidth: '85%',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <strong>📌 Tóm tắt hội thoại Chatbot:</strong> {msg.text}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`chatgpt-message-row ${isDoc ? 'patient' : 'bot'}`}
                  style={{ 
                    justifyContent: isDoc ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    gap: '12px',
                    maxWidth: '90%',
                    alignSelf: isDoc ? 'flex-end' : 'flex-start'
                  }}
                >
                  {!isDoc && (
                    <div className="chatgpt-avatar-circle" style={{ backgroundColor: isBot ? '#e0f2fe' : '#e2e8f0', color: isBot ? '#0369a1' : 'var(--text-muted)' }}>
                      {isBot ? <Bot size={14} /> : <User size={14} />}
                    </div>
                  )}
                  <div 
                    className="chatgpt-bubble"
                    style={{
                      backgroundColor: isDoc ? 'var(--primary)' : '#f1f5f9',
                      color: isDoc ? '#fff' : 'var(--text-dark)',
                      borderRadius: isDoc ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.8rem',
                      lineHeight: 1.45
                    }}
                  >
                    {isBot && <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', fontSize: '0.75rem', marginBottom: '2px' }}>AI Chatbot</span>}
                    {msg.text}
                    <div style={{ textAlign: 'right', fontSize: '0.6rem', opacity: 0.7, marginTop: '4px' }}>
                      {msg.time}
                    </div>
                  </div>
                  {isDoc && (
                    <div className="chatgpt-avatar-circle" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="chatgpt-input-bar-container" style={{ padding: '12px', borderTop: '1px solid var(--border-color)', backgroundColor: '#fff' }}>
            <div className="chatgpt-input-bar">
              <input
                type="text"
                placeholder="Nhập nội dung tư vấn..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMsg();
                }}
                style={{ fontSize: '0.82rem' }}
              />
              <button
                className="chatgpt-send-btn"
                onClick={handleSendMsg}
                style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
