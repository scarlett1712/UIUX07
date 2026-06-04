import React, { useState, useEffect } from 'react';
import { Search, Bot, User, Send, BellRing, Sparkles, FolderArchive, MessageCircle, FileText, Clock, PhoneCall, Video, Check } from 'lucide-react';

export default function DoctorMessages({ 
  onNavigate, 
  selectedId, 
  patients = [], 
  setPatients, 
  onSelectId, 
  triggerToast, 
  threads = [], 
  setThreads,
  activeThreadId = 'MSG101',
  setActiveThreadId,
  isEscalatedSessionActive,
  setIsEscalatedSessionActive,
  sessionTimeLeft,
  setSessionTimeLeft,
  setPatientConversations,
  activePatientConvId
}) {
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', 'archived'
  
  // Simulation handoff state
  const [hasEscalatedSession, setHasEscalatedSession] = useState(true);
  const [escalatedThreadId, setEscalatedThreadId] = useState(null);

  // Call simulation states
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('video');
  const [callState, setCallState] = useState('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    let timer;
    if (showCallModal && callState === 'connected') {
      let secs = 0;
      timer = setInterval(() => {
        secs++;
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        setCallDuration(`${m}:${s}`);
      }, 1000);
    } else {
      setCallDuration('00:00');
    }
    return () => clearInterval(timer);
  }, [showCallModal, callState]);

  const handleStartCall = (type) => {
    setCallType(type);
    setCallState('connecting');
    setShowCallModal(true);
    setTimeout(() => {
      setCallState('connected');
    }, 2500);
  };

  useEffect(() => {
    if (selectedId) {
      if (selectedId.startsWith('MSG') && threads.some(t => t.id === selectedId)) {
        setActiveThreadId(selectedId);
        onSelectId(null);
      } else if (selectedId.startsWith('P')) {
        const patient = patients.find(p => p.id === selectedId);
        if (patient) {
          const matchedThread = threads.find(t => t.name.toLowerCase() === patient.name.toLowerCase());
          if (matchedThread) {
            setActiveThreadId(matchedThread.id);
          }
        }
        onSelectId(null);
      }
    }
  }, [selectedId, threads, patients, onSelectId]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Hoisted timer controls: sync hasEscalatedSession or escalatedThreadId when session is active
  useEffect(() => {
    if (isEscalatedSessionActive) {
      setHasEscalatedSession(false);
      setEscalatedThreadId('MSG101');
    } else {
      setEscalatedThreadId(null);
    }
  }, [isEscalatedSessionActive]);

  // Handoff Live Session trigger
  const handleAcceptHandoff = () => {
    setHasEscalatedSession(false);
    setIsEscalatedSessionActive(true);
    setSessionTimeLeft(120);
    setEscalatedThreadId(activeThreadId);
    triggerToast('Đã kết nối phiên live chat tư vấn chuyên sâu!', 'success');
    
    // Add new chat thread or insert into current Nguyễn Minh Anh messages
    const handoffMessages = [
      { sender: 'system', text: 'Bệnh nhân sốt cao 39 độ kèm ho khan kéo dài 2 ngày, có dấu hiệu mệt mỏi ăn uống kém. Đã thanh toán phí tư vấn chuyên sâu (150,000đ) để kết nối trực tiếp với Bác sĩ.', time: '08:11' },
      { sender: 'patient', text: 'Chào bác sĩ Huy, em sốt cao và mệt quá, em đã uống Paracetamol nhưng hết thuốc lại sốt lại. Em muốn hỏi bác sĩ có cần nhập viện gấp không ạ?', time: '08:12' }
    ];

    setThreads(threads.map(t => {
      if (t.id === 'MSG101') {
        const hasHandoff = t.messages.some(m => m.sender === 'system');
        const nextMessages = hasHandoff ? t.messages : [...t.messages, ...handoffMessages];
        return {
          ...t,
          unread: false,
          accepted: true,
          isLocked: false,
          messages: nextMessages
        };
      }
      return t;
    }));
    setActiveThreadId('MSG101');

    // Sync to patient side
    if (setPatientConversations) {
      setPatientConversations(prevConvs => prevConvs.map(c => {
        if (c.id === 'PCONV001') {
          return {
            ...c,
            activeDoctorConsult: true,
            isLocked: false,
            messages: [
              ...c.messages,
              { sender: 'doctor', text: 'Xin chào bạn Giang, tôi là Bác sĩ Dương Gia Huy - chuyên khoa Nội tổng quát. Tôi đã đọc qua bảng tóm tắt triệu chứng của bạn từ Trợ lý AI. Chúng ta có thể nhắn tin hoặc thực hiện Cuộc gọi Video ngay bây giờ để tôi tư vấn cụ thể.', time: 'Vừa xong' }
            ]
          };
        }
        return c;
      }));
    }
  };

  const handleAcceptThread = (threadId) => {
    if (threadId === 'MSG101') {
      handleAcceptHandoff();
    } else {
      setThreads(threads.map(t => t.id === threadId ? { ...t, accepted: true } : t));
      triggerToast('Đã chấp nhận yêu cầu tư vấn cho bệnh nhân!', 'success');
    }
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

    // Sync to patient's conversations in real-time!
    if (setPatientConversations) {
      setPatientConversations(prevConvs => prevConvs.map(c => {
        if (c.id === 'PCONV001') {
          return {
            ...c,
            messages: [...c.messages, doctorMsg]
          };
        }
        return c;
      }));
    }

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

      // Sync simulated patient reply to patient side as well!
      if (setPatientConversations) {
        setPatientConversations(prevConvs => prevConvs.map(c => {
          if (c.id === 'PCONV001') {
            return {
              ...c,
              messages: [...c.messages, patientMsg]
            };
          }
          return c;
        }));
      }
    }, 1500);
  };

  // Filters
  const filteredThreads = threads.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'unread') return matchSearch && t.unread && !t.archived;
    if (activeTab === 'archived') return matchSearch && t.archived;
    return matchSearch && !t.archived;
  });

  const getChatbotSummary = (threadId) => {
    switch (threadId) {
      case 'MSG101':
        return {
          symptoms: 'Sốt cao (~39°C), mệt mỏi, đau đầu, đau họng, ho nhẹ',
          diagnosis: 'Nghi nhiễm cúm A/B hoặc virus đường hô hấp'
        };
      case 'MSG103':
        return {
          symptoms: 'Mắt trái đỏ và sưng húp lên sau khi ngủ dậy, có dử mắt màu xanh',
          diagnosis: 'Nghi viêm kết mạc cấp (đau mắt đỏ)'
        };
      case 'MSG104':
        return {
          symptoms: 'Nghẹt mũi, rát họng kéo dài, uống thuốc cảm thường không đỡ',
          diagnosis: 'Nghi viêm mũi dị ứng hoặc viêm họng hạt'
        };
      case 'MSG105':
        return {
          symptoms: 'Đau khớp gối khi vận động hoặc đi lại nhiều',
          diagnosis: 'Nghi thoái hóa khớp gối hoặc chấn thương sụn khớp'
        };
      case 'MSG106':
        return {
          symptoms: 'Hoa mắt, chóng mặt lúc thức dậy buổi sáng',
          diagnosis: 'Nghi rối loạn tiền đình hoặc thiếu máu não'
        };
      default:
        return {
          symptoms: 'Đau bụng thượng vị, đầy hơi, buồn nôn',
          diagnosis: 'Theo dõi viêm dạ dày cấp'
        };
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Danh sách tin nhắn</h2>
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
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '320px 1fr 300px', 
        gap: '20px', 
        height: hasEscalatedSession ? 'calc(100vh - var(--header-height) - 140px)' : 'calc(100vh - var(--header-height) - 60px)', 
        alignItems: 'stretch' 
      }}>
        
        {/* LEFT COLUMN: Queue threads */}
        <div className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden', margin: 0, height: '100%' }}>
          
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
          <div className="filters-bar" style={{ padding: '6px 12px', marginBottom: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <div className="filter-group" style={{ width: '100%' }}>
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm hội thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ width: '100%', padding: '6px 10px', border: 'none' }}
              />
            </div>
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

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  setThreads(threads.map(t => t.id === activeThread.id ? { ...t, archived: !t.archived } : t));
                  triggerToast(activeThread.archived ? 'Đã bỏ lưu trữ hội thoại' : 'Đã lưu trữ hội thoại thành công!', 'success');
                }}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title={activeThread.archived ? "Bỏ lưu trữ" : "Lưu trữ hội thoại"}
              >
                <FolderArchive size={14} style={{ color: activeThread.archived ? 'var(--primary)' : 'var(--text-muted)' }} />
              </button>

              <button 
                onClick={() => {
                  if (!activeThread.accepted) {
                    triggerToast('Vui lòng chấp nhận tư vấn trước khi thực hiện cuộc gọi!', 'warning');
                    return;
                  }
                  handleStartCall('voice');
                  triggerToast('Đang kết nối cuộc gọi thoại tới bệnh nhân...', 'info');
                }}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: !activeThread.accepted ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !activeThread.accepted ? 0.5 : 1 }}
                title="Gọi thoại"
                disabled={!activeThread.accepted}
              >
                <PhoneCall size={14} style={{ color: 'var(--primary)' }} />
              </button>
              <button 
                onClick={() => {
                  if (!activeThread.accepted) {
                    triggerToast('Vui lòng chấp nhận tư vấn trước khi thực hiện cuộc gọi!', 'warning');
                    return;
                  }
                  handleStartCall('video');
                  triggerToast('Đang kết nối cuộc gọi Video tới bệnh nhân...', 'info');
                }}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: !activeThread.accepted ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: !activeThread.accepted ? 0.5 : 1 }}
                title="Gọi Video"
                disabled={!activeThread.accepted}
              >
                <Video size={14} style={{ color: '#10b981' }} />
              </button>
            </div>
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
                  {isDoc && (
                    <div className="chatgpt-avatar-circle" style={{ backgroundColor: 'var(--primary)', color: '#fff' }}>
                      <User size={14} />
                    </div>
                  )}
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
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Message input / Accept Consultation Button */}
          {activeThread.isLocked ? (
            <div style={{ 
              padding: '16px', 
              borderTop: '1px solid var(--border-color)', 
              backgroundColor: '#f1f5f9', 
              textAlign: 'center', 
              color: 'var(--text-muted)', 
              fontWeight: '600',
              fontSize: '0.82rem'
            }}>
              🔒 Phiên tư vấn chuyên sâu đã kết thúc (Demo 2 phút). Cuộc trò chuyện đã bị khóa.
            </div>
          ) : activeThread.accepted ? (
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
          ) : (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: '#fff', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => handleAcceptThread(activeThread.id)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '10px 24px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Check size={16} /> Chấp nhận tư vấn
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Patient Basic Info & Chatbot Summary */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, height: '100%', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
            Thông tin cơ bản
          </h3>

          {(() => {
            const nameToFind = activeThread.name;
            const patient = patients.find(p => p.name.toLowerCase() === nameToFind.toLowerCase()) || {
              dob: '25-08-2000',
              gender: 'Nữ',
              phone: '0912345678',
              email: `${nameToFind.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
              address: 'Hải Châu, Đà Nẵng',
              notes: 'Không có tiền sử dị ứng thuốc hay bệnh nền nghiêm trọng.'
            };

            return (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>Họ và tên</span>
                    <strong style={{ color: 'var(--text-dark)' }}>{nameToFind}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>Ngày sinh</span>
                    <strong style={{ color: 'var(--text-dark)' }}>{patient.dob}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>Giới tính</span>
                    <strong style={{ color: 'var(--text-dark)' }}>{patient.gender}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>Số điện thoại</span>
                    <strong style={{ color: 'var(--text-dark)' }}>{patient.phone}</strong>
                  </div>
                  {patient.notes && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.7rem', fontWeight: 500 }}>Ghi chú lâm sàng</span>
                      <span style={{ color: 'var(--text-dark)', fontSize: '0.75rem', lineHeight: '1.3', display: 'block' }}>{patient.notes}</span>
                    </div>
                  )}
                </div>

                {/* Chatbot Synthesis Summary Box */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  boxShadow: 'var(--shadow-sm)',
                  marginTop: '4px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Bot size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-dark)' }}>Tổng hợp từ Chatbot AI</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                    <div>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Triệu chứng lâm sàng:</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', lineHeight: '1.3' }}>{getChatbotSummary(activeThread.id).symptoms}</span>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Chẩn đoán AI sơ bộ:</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block', lineHeight: '1.3' }}>{getChatbotSummary(activeThread.id).diagnosis}</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Record Button */}
                <button 
                  onClick={() => {
                    let targetId = patient.id;
                    if (!targetId) {
                      const existing = patients.find(p => p.name.toLowerCase() === nameToFind.toLowerCase());
                      if (existing) {
                        targetId = existing.id;
                      } else {
                        targetId = `P${Date.now()}`;
                        const newPatient = {
                          id: targetId,
                          name: nameToFind,
                          dob: patient.dob,
                          gender: patient.gender,
                          phone: patient.phone,
                          email: patient.email,
                          address: patient.address,
                          insurance: 'DN4012030192',
                          medicalHistory: []
                        };
                        setPatients([...patients, newPatient]);
                      }
                    }
                    onSelectId(targetId);
                    onNavigate('doctor-patient-details');
                    triggerToast(`Đang điều hướng tới hồ sơ bệnh án của ${nameToFind}...`, 'info');
                  }}
                  className="btn btn-primary"
                  style={{ 
                    marginTop: 'auto', 
                    padding: '10px 12px', 
                    fontSize: '0.8rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '6px',
                    fontWeight: '700',
                    width: '100%' 
                  }}
                >
                  <FileText size={14} /> Hồ sơ chi tiết
                </button>
              </>
            );
          })()}
        </div>

      </div>

      {/* SIMULATED VIDEO/VOICE CALL MODAL FOR DOCTOR */}
      {showCallModal && (
        <div 
          onClick={() => setShowCallModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            color: '#fff',
            padding: '20px'
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{
            width: '100%',
            maxWidth: '640px',
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            height: '480px',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                Cuộc gọi {callType === 'video' ? 'Video' : 'Thoại'} tư vấn bệnh nhân
              </span>
              <span style={{ fontSize: '0.85rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981', 
                  display: 'inline-block',
                  animation: 'pulseGlow 1.5s infinite'
                }} />
                Thời gian: {callDuration}
              </span>
            </div>

            {/* Call Body */}
            <div style={{ flexGrow: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
              {callState === 'connecting' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', animation: 'pulseGlow 2s infinite' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    backgroundColor: callType === 'video' ? '#059669' : '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.6)',
                    position: 'relative'
                  }}>
                    {callType === 'video' ? (
                      <Video size={40} color="#fff" />
                    ) : (
                      <PhoneCall size={40} color="#fff" />
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>{activeThread.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                      Đang kết nối cuộc gọi {callType === 'video' ? 'Video' : 'Thoại'}...
                    </span>
                  </div>
                </div>
              ) : (
                // Connected State
                callType === 'video' ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {/* Muted overlay badge */}
                    {isMuted && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.85)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '600',
                        zIndex: 10,
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                        Đã tắt tiếng mic của bạn
                      </div>
                    )}

                    {/* Patient feed */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 100 100" width="100" height="100">
                        <circle cx="50" cy="50" r="50" fill="#fbcfe8" />
                        <circle cx="50" cy="40" r="20" fill="#db2777" />
                        <path d="M20,80 C20,60 80,60 80,80" fill="#db2777" />
                      </svg>
                      <span style={{ marginTop: '12px', fontSize: '1rem', fontWeight: '700' }}>{activeThread.name}</span>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Đang chia sẻ video tư vấn...</span>
                    </div>

                    {/* Doctor Preview */}
                    <div style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      width: '120px',
                      height: '90px',
                      backgroundColor: '#334155',
                      borderRadius: '8px',
                      border: '2px solid rgba(255,255,255,0.2)',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-lg)'
                    }}>
                      {isCamOff ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10l-2.33-1.75-2.33-1.75"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Cam tắt</span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 100 100" width="32" height="32">
                            <circle cx="50" cy="50" r="50" fill="#38bdf8" />
                            <circle cx="50" cy="40" r="20" fill="#0369a1" />
                            <path d="M20,80 C20,60 80,60 80,80" fill="#0369a1" />
                          </svg>
                          <span style={{ fontSize: '0.65rem', color: '#fff', marginTop: '2px' }}>Bạn (Bs. Huy)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', position: 'relative', width: '100%', height: '100%', justifyContent: 'center' }}>
                    {/* Muted overlay badge */}
                    {isMuted && (
                      <div style={{
                        position: 'absolute',
                        top: '16px',
                        left: '16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.85)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '600',
                        zIndex: 10,
                        boxShadow: 'var(--shadow-md)'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                        Đã tắt tiếng mic của bạn
                      </div>
                    )}
                    
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      backgroundColor: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #475569',
                      boxShadow: '0 0 16px rgba(56, 189, 248, 0.4)'
                    }}>
                      <svg viewBox="0 0 100 100" width="70" height="70">
                        <circle cx="50" cy="50" r="50" fill="#fbcfe8" />
                        <circle cx="50" cy="40" r="20" fill="#db2777" />
                        <path d="M20,80 C20,60 80,60 80,80" fill="#db2777" />
                      </svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>{activeThread.name}</h4>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Đang kết nối thoại...</span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Controls */}
            <div style={{
              padding: '20px',
              backgroundColor: '#0f172a',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '24px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              {/* Mic toggle */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  triggerToast(isMuted ? 'Đã bật Micro' : 'Đã tắt Micro', 'info');
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isMuted ? '#ef4444' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                )}
              </button>

              {/* Cam toggle */}
              {callType === 'video' && (
                <button
                  onClick={() => {
                    setIsCamOff(!isCamOff);
                    triggerToast(isCamOff ? 'Đã bật Camera' : 'Đã tắt Camera', 'info');
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: isCamOff ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  {isCamOff ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10l-2.33-1.75-2.33-1.75"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  )}
                </button>
              )}

              {/* End Call */}
              <button
                onClick={() => {
                  setShowCallModal(false);
                  triggerToast('Cuộc gọi đã kết thúc', 'info');
                }}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
