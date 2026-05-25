import React, { useState } from 'react';
import { Bot, User, Sparkles, MessageSquare, Send, Paperclip, CreditCard, Calendar, Check, AlertCircle, PhoneCall, Video } from 'lucide-react';

const INITIAL_PATIENT_CONVS = [
  {
    id: 'PCONV001',
    topic: 'Triệu chứng sốt, đau đầu, ho',
    date: 'Hôm nay 21:50',
    status: 'Đang tư vấn',
    messages: [
      { sender: 'bot', text: 'Chào bạn, tôi là Trợ lý sức khỏe AI. Bạn đang gặp vấn đề gì về sức khỏe?', time: '21:50 pm' },
      { sender: 'patient', text: 'Mình bị sốt từ hôm qua, người mệt mỏi với đau đầu khá rõ. Hôm nay vẫn chưa đỡ, còn đau họng với hơi ho.', time: '21:57 pm' },
      { sender: 'bot', text: 'Bạn đã đo nhiệt độ chưa, khoảng bao nhiêu độ? Ngoài ra có bị ớn lạnh hay đau nhức người không?', time: '21:58 pm' },
      { sender: 'patient', text: 'Sốt khoảng gần 39 độ, có ớn lạnh với đau người. Người khá mệt, ăn uống cũng kém.', time: '22:15 pm' },
      { sender: 'bot', text: 'Triệu chứng của bạn có thể liên quan đến cúm hoặc nhiễm virus đường hô hấp hô hấp. Do sốt cao và kéo dài, bạn nên đi khám để được kiểm tra và điều trị phù hợp. \n\nĐể hỗ trợ bạn tốt nhất, tôi khuyên bạn nên **Đặt lịch khám trực tiếp** tại phòng khám hoặc đăng ký **Tư vấn chuyên sâu trực tuyến (video/chat)** với bác sĩ chuyên khoa. Bạn muốn thực hiện phương án nào?', time: '22:16 pm' }
    ],
    symptoms: ['Sốt, đau đầu, mệt mỏi', 'Đau họng', 'Ho'],
    diagnosis: ['Nghi cúm / nhiễm virus hô hấp', 'Nên đi khám'],
    showActions: true
  },
  {
    id: 'PCONV002',
    topic: 'Khó tiêu và đau bụng thượng vị',
    date: '18/05/2026',
    status: 'Hoàn thành',
    messages: [
      { sender: 'bot', text: 'Chào bạn. Tôi có thể giúp gì cho sức khỏe của bạn?', time: '09:00 am' },
      { sender: 'patient', text: 'Tôi hay bị đầy bụng khó tiêu sau khi ăn, thi thoảng hơi đau rát vùng trên rốn.', time: '09:02 am' },
      { sender: 'bot', text: 'Triệu chứng đau rát vùng thượng vị và khó tiêu sau ăn gợi ý tình trạng kích ứng niêm mạc dạ dày hoặc trào ngược. Bạn nên hạn chế ăn đồ cay nóng, nhiều mỡ và không nằm ngay sau khi ăn.', time: '09:04 am' }
    ],
    symptoms: ['Khó tiêu', 'Đau bụng thượng vị'],
    diagnosis: ['Kích ứng dạ dày nhẹ', 'Thay đổi lối sống'],
    showActions: false
  }
];

export default function PatientConsultation({ onNavigate, setAppointments, triggerToast }) {
  const [conversations, setConversations] = useState(INITIAL_PATIENT_CONVS);
  const [activeConvId, setActiveConvId] = useState('PCONV001');
  const [inputText, setInputText] = useState('');
  
  // Payment Flow states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: QR screen, 2: Verification, 3: Success
  const [isConsultingDoctor, setIsConsultingDoctor] = useState(false); // Switch to Doctor chat after payment

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append user message
    const updatedMessages = [...activeConv.messages, { sender: 'patient', text, time: '22:20 pm' }];
    
    // Simulate AI response
    let botResponse = '';
    let newSymptoms = [...activeConv.symptoms];
    let newDiagnosis = [...activeConv.diagnosis];
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('đau đầu') || lowerText.includes('buồn nôn') || lowerText.includes('chóng mặt')) {
      botResponse = 'Tôi ghi nhận thêm các triệu chứng này. Sốt cao kèm đau đầu dữ dội hoặc buồn nôn có thể báo hiệu tình trạng mất nước hoặc phản ứng viêm mạnh. Bạn có muốn kết nối với bác sĩ chuyên khoa ngay lập tức không?';
      if (lowerText.includes('chóng mặt') && !newSymptoms.includes('Chóng mặt')) newSymptoms.push('Chóng mặt');
      if (lowerText.includes('buồn nôn') && !newSymptoms.includes('Buồn nôn')) newSymptoms.push('Buồn nôn');
    } else {
      botResponse = 'Tôi đã nhận được thông tin. Để giúp bạn nhanh chóng chẩn đoán chuyên sâu, hãy cân nhắc đặt lịch khám trực tiếp với bác sĩ hoặc kết nối tư vấn trực tuyến có trả phí với chúng tôi.';
    }

    const nextMessages = [...updatedMessages, { sender: 'bot', text: botResponse, time: '22:21 pm' }];

    const updatedConvs = conversations.map(c => {
      if (c.id === activeConvId) {
        return {
          ...c,
          messages: nextMessages,
          symptoms: newSymptoms,
          diagnosis: newDiagnosis,
          showActions: true
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputText('');
  };

  const handleQuickReply = (symptom) => {
    handleSendMessage(`Tôi có triệu chứng ${symptom.toLowerCase()}`);
  };

  const handleStartNewChat = () => {
    const newId = `PCONV${Date.now()}`;
    const newChat = {
      id: newId,
      topic: 'Cuộc trò chuyện mới',
      date: 'Vừa xong',
      status: 'Đang tư vấn',
      messages: [
        { sender: 'bot', text: 'Chào bạn, tôi là Trợ lý sức khỏe AI. Bạn đang gặp vấn đề gì về sức khỏe?', time: 'Vừa xong' }
      ],
      symptoms: [],
      diagnosis: [],
      showActions: false
    };
    setConversations([newChat, ...conversations]);
    setActiveConvId(newId);
    setIsConsultingDoctor(false);
  };

  const handleEndChat = () => {
    const updatedConvs = conversations.map(c => {
      if (c.id === activeConvId) {
        return { ...c, status: 'Hoàn thành', showActions: false };
      }
      return c;
    });
    setConversations(updatedConvs);
    triggerToast('Đã kết thúc cuộc tư vấn sức khỏe với AI', 'info');
  };

  // Payment confirmation simulation
  const handleConfirmPayment = () => {
    setPaymentStep(2); // Show verification spinner
    setTimeout(() => {
      setPaymentStep(3); // Show success checkmark
      setTimeout(() => {
        setShowPaymentModal(false);
        setIsConsultingDoctor(true); // Switch chat console to Doctor
        triggerToast('Thanh toán thành công! Bạn đang được kết nối với Bác sĩ Dương Gia Huy.', 'success');
        
        // Add doctor connection message to chat
        const updatedConvs = conversations.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                { sender: 'doctor', text: 'Xin chào bạn Giang, tôi là Bác sĩ Dương Gia Huy - chuyên khoa Nội tổng quát. Tôi đã đọc qua bảng tóm tắt triệu chứng của bạn từ Trợ lý AI. Chúng ta có thể nhắn tin hoặc thực hiện Cuộc gọi Video ngay bây giờ để tôi tư vấn cụ thể.', time: 'Vừa xong' }
              ]
            };
          }
          return c;
        });
        setConversations(updatedConvs);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', gap: '16px', height: 'calc(100vh - 100px)', minHeight: '500px' }}>
      
      {/* LEFT COLUMN: Conversation List */}
      <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Tư vấn sức khỏe</span>
          <button 
            onClick={handleStartNewChat}
            style={{
              padding: '4px 8px',
              backgroundColor: 'var(--primary-light)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            + Mới
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flexGrow: 1 }}>
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setActiveConvId(c.id);
                setIsConsultingDoctor(false); // Reset doctor console view
              }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: c.id === activeConvId ? 'var(--primary-light)' : 'transparent',
                backgroundColor: c.id === activeConvId ? '#f0f7ff' : '#f8fafc',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MessageSquare size={12} style={{ color: 'var(--text-muted)' }} />
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: c.id === activeConvId ? '700' : '500',
                  color: 'var(--text-dark)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px'
                }}>
                  {c.topic}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>{c.date}</span>
                <span style={{ color: c.status === 'Đang tư vấn' ? 'var(--primary-light)' : '#10b981' }}>
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER COLUMN: Chat Interface */}
      <div className="card" style={{ padding: '0px', display: 'flex', flexDirection: 'column', margin: 0, overflow: 'hidden' }}>
        {/* Chat Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isConsultingDoctor ? '#eff6ff' : 'transparent'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '700', color: 'var(--primary)' }}>
              {isConsultingDoctor ? 'Tư vấn trực tuyến với Bác sĩ' : activeConv.topic}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isConsultingDoctor ? 'Đang kết nối: BS. Dương Gia Huy (Nội tổng quát)' : 'Phản hồi tự động bởi Trợ lý AI'}
            </span>
          </div>

          {isConsultingDoctor && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => triggerToast('Đang khởi tạo cuộc gọi thoại...', 'info')}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <PhoneCall size={14} style={{ color: 'var(--primary)' }} />
              </button>
              <button 
                onClick={() => triggerToast('Đang khởi tạo cuộc gọi Video...', 'info')}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Video size={14} style={{ color: '#10b981' }} />
              </button>
            </div>
          )}
        </div>

        {/* Chat Message Scroll */}
        <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeConv.messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            const isDoc = msg.sender === 'doctor';
            return (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  alignSelf: (isBot || isDoc) ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {(isBot || isDoc) && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isDoc ? '#fee2e2' : '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDoc ? '#ef4444' : 'var(--primary-light)',
                    flexShrink: 0
                  }}>
                    {isDoc ? <User size={14} /> : <Bot size={14} />}
                  </div>
                )}
                
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  backgroundColor: isDoc ? '#fee2e2' : isBot ? '#f1f5f9' : 'var(--primary)',
                  color: (isBot || isDoc) ? 'var(--text-dark)' : '#fff',
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                  <div style={{
                    fontSize: '0.68rem',
                    textAlign: 'right',
                    marginTop: '4px',
                    color: (isBot || isDoc) ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)'
                  }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestions */}
        {!isConsultingDoctor && activeConv.status === 'Đang tư vấn' && (
          <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', overflowX: 'auto', borderTop: '1px solid var(--border-color)' }}>
            {['Đau đầu', 'Buồn nôn', 'Chóng mặt', 'Đau họng', 'Ho'].map(s => (
              <button
                key={s}
                onClick={() => handleQuickReply(s)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: '1px solid var(--border-color)',
                  background: '#fff',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  color: 'var(--text-dark)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-light)'; e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.backgroundColor = '#fff'; }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Paperclip size={18} />
          </button>
          
          <input
            type="text"
            placeholder={activeConv.status === 'Hoàn thành' ? "Cuộc hội thoại đã kết thúc..." : "Nhập tình trạng sức khỏe của bạn tại đây..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={activeConv.status === 'Hoàn thành'}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{
              flexGrow: 1,
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />

          <button 
            onClick={() => handleSendMessage()}
            disabled={activeConv.status === 'Hoàn thành' || !inputText.trim()}
            style={{
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: activeConv.status === 'Hoàn thành' || !inputText.trim() ? 'var(--border-color)' : 'var(--primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Information Summary */}
      <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
        <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
          Tóm tắt thông tin
        </h3>

        {/* Recorded Symptoms */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Triệu chứng ghi nhận
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {activeConv.symptoms.map((s, i) => (
              <span key={i} style={{
                fontSize: '0.78rem',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#f1f5f9',
                color: 'var(--text-dark)',
                border: '1px solid var(--border-color)'
              }}>
                {s}
              </span>
            ))}
            {activeConv.symptoms.length === 0 && (
              <span style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Chưa có triệu chứng</span>
            )}
          </div>
        </div>

        {/* Initial analysis */}
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            Phân tích ban đầu
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {activeConv.diagnosis.map((d, i) => (
              <span key={i} style={{
                fontSize: '0.78rem',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                border: '1px solid #fde68a',
                fontWeight: '500'
              }}>
                {d}
              </span>
            ))}
            {activeConv.diagnosis.length === 0 && (
              <span style={{ fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Đang đợi phân tích...</span>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeConv.showActions && activeConv.status === 'Đang tư vấn' && !isConsultingDoctor && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textAlign: 'center', display: 'block' }}>
                Hỗ trợ tiếp theo
              </span>
              
              <button
                onClick={() => onNavigate('patient-schedule')}
                className="btn btn-outline animate-fade-in"
                style={{
                  padding: '8px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: '600',
                  color: 'var(--primary)'
                }}
              >
                <Calendar size={14} /> Đặt lịch khám phòng khám
              </button>

              <button
                onClick={() => {
                  setShowPaymentModal(true);
                  setPaymentStep(1);
                }}
                className="btn animate-pulse"
                style={{
                  padding: '8px',
                  fontSize: '0.8rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  fontWeight: '600'
                }}
              >
                <CreditCard size={14} /> Tư vấn chuyên sâu bác sĩ
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleEndChat}
              disabled={activeConv.status === 'Hoàn thành'}
              className="btn btn-cancel"
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.8rem',
                margin: 0,
                borderRadius: '8px',
                opacity: activeConv.status === 'Hoàn thành' ? 0.5 : 1
              }}
            >
              Kết thúc
            </button>
            
            <button
              onClick={handleStartNewChat}
              className="btn btn-save"
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.8rem',
                margin: 0,
                borderRadius: '8px'
              }}
            >
              Tạo mới
            </button>
          </div>
        </div>

      </div>

      {/* BANK TRANSFER MODAL */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card animate-fade-in" style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            margin: 0
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
            >
              &times;
            </button>

            {paymentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Chuyển khoản thanh toán phí dịch vụ
                </h3>

                <div style={{ display: 'flex', gap: '12px', backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <AlertCircle size={18} style={{ color: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534', lineHeight: '1.4' }}>
                    Phí dịch vụ tư vấn chuyên sâu trực tiếp với Bác sĩ chuyên khoa: <strong>150.000 VND / cuộc gọi tư vấn</strong>.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'center' }}>
                  {/* Bank detail values */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Ngân hàng</span>
                      <strong style={{ color: 'var(--text-dark)' }}>Vietcombank (VCB)</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Số tài khoản</span>
                      <strong style={{ color: 'var(--text-dark)', fontSize: '1rem', letterSpacing: '0.5px' }}>1026052026</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Chủ tài khoản</span>
                      <strong style={{ color: 'var(--text-dark)' }}>PHONG KHAM MEDICONSULT</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Số tiền</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>150.000 VND</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Nội dung</span>
                      <strong style={{ color: 'var(--text-dark)', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>TVCS Giang</strong>
                    </div>
                  </div>

                  {/* QR Code Graphic Mockup */}
                  <div style={{
                    border: '1.5px solid var(--border-color)',
                    padding: '8px',
                    borderRadius: '10px',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {/* SVG mockup of a standard VietQR code */}
                    <svg viewBox="0 0 100 100" width="120" height="120">
                      <rect width="100" height="100" fill="#fff" />
                      {/* Outlines of QR corners */}
                      <rect x="5" y="5" width="25" height="25" fill="none" stroke="var(--primary)" strokeWidth="4" />
                      <rect x="10" y="10" width="15" height="15" fill="var(--primary)" />
                      
                      <rect x="70" y="5" width="25" height="25" fill="none" stroke="var(--primary)" strokeWidth="4" />
                      <rect x="75" y="10" width="15" height="15" fill="var(--primary)" />

                      <rect x="5" y="70" width="25" height="25" fill="none" stroke="var(--primary)" strokeWidth="4" />
                      <rect x="10" y="75" width="15" height="15" fill="var(--primary)" />

                      {/* Random QR squares */}
                      <rect x="35" y="15" width="10" height="15" fill="#334155" />
                      <rect x="50" y="5" width="15" height="10" fill="#334155" />
                      <rect x="35" y="35" width="30" height="10" fill="#334155" />
                      <rect x="15" y="35" width="15" height="15" fill="#334155" />
                      <rect x="70" y="35" width="15" height="25" fill="#334155" />
                      <rect x="35" y="50" width="20" height="30" fill="#334155" />
                      <rect x="10" y="60" width="10" height="5" fill="#334155" />
                      <rect x="65" y="65" width="25" height="10" fill="#334155" />
                      <rect x="70" y="80" width="15" height="15" fill="#334155" />

                      {/* Small Center VietQR Logo */}
                      <rect x="42" y="42" width="16" height="16" rx="3" fill="var(--primary-light)" />
                      <text x="50" y="52" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">QR</text>
                    </svg>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>Quét mã để thanh toán</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="btn btn-cancel" 
                    style={{ flex: 1, padding: '10px', margin: 0 }}
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={handleConfirmPayment}
                    className="btn btn-save" 
                    style={{ flex: 1, padding: '10px', margin: 0 }}
                  >
                    Xác nhận đã chuyển khoản
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 10px', gap: '16px' }}>
                {/* Spinner loading */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid var(--border-color)',
                  borderTopColor: 'var(--primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ display: 'block', color: 'var(--text-dark)', fontSize: '1rem', marginBottom: '4px' }}>
                    Đang kiểm tra giao dịch...
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    MediConsult đang xác thực hóa đơn chuyển khoản của bạn.
                  </span>
                </div>
              </div>
            )}

            {paymentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 10px', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#d1fae5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={32} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <strong style={{ display: 'block', color: '#065f46', fontSize: '1.1rem', marginBottom: '4px' }}>
                    Thanh toán thành công!
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Giao dịch đã được duyệt. Đang chuyển kết nối sang Bác sĩ Dương Gia Huy...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
