import React, { useState, useEffect } from 'react';
import { Bot, User, Sparkles, MessageSquare, Send, Paperclip, CreditCard, Calendar, Check, AlertCircle, PhoneCall, Video, Clock, CheckCircle } from 'lucide-react';

export default function PatientConsultation({ 
  onNavigate, 
  setAppointments, 
  triggerToast,
  conversations = [],
  setConversations,
  activeConvId,
  setActiveConvId
}) {
  const [inputText, setInputText] = useState('');
  
  // Payment Flow states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: QR screen, 2: Verification, 3: Success
  const [isConsultingDoctor, setIsConsultingDoctor] = useState(false); // Switch to Doctor chat after payment

  // Simulated call modal state
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('video'); // 'voice' or 'video'
  const [callState, setCallState] = useState('connecting'); // 'connecting' or 'connected'
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  // Auto open a new conversation if none exist
  useEffect(() => {
    if (conversations.length === 0) {
      handleStartNewChat();
    } else {
      // Restore doctor consult status based on active conversation
      const currentActive = conversations.find(c => c.id === activeConvId) || conversations[0];
      if (currentActive) {
        setIsConsultingDoctor(!!currentActive.activeDoctorConsult);
      }
    }
  }, []);

  // Timer simulation for calls
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
    // Transition to connected after 2.5s
    setTimeout(() => {
      setCallState('connected');
    }, 2500);
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Append user message
    const updatedMessages = [...activeConv.messages, { sender: 'patient', text, time: 'Vừa xong' }];
    
    if (isConsultingDoctor) {
      // Direct Patient - Doctor Chat (No AI Bot intervention)
      const updatedConvs = conversations.map(c => {
        if (c.id === activeConvId) {
          return {
            ...c,
            messages: updatedMessages
          };
        }
        return c;
      });
      setConversations(updatedConvs);
      setInputText('');

      // Simulate doctor replying after 1.5 seconds
      setTimeout(() => {
        const doctorReplies = [
          "Chào bạn, tôi đã nhận được tin nhắn. Triệu chứng cúm virus thông thường cần được theo dõi sát sao, bạn nhớ uống nhiều nước ấm nhé.",
          "Nếu bạn bị sốt cao trên 38.5 độ C, bạn hãy uống 1 viên Paracetamol 500mg và chườm ấm nhé. Khoảng cách giữa các lần uống là 4-6 tiếng.",
          "Tôi đang xem qua bệnh sử của bạn. Bạn nên ăn cháo loãng hoặc súp ấm để dễ tiêu hóa và nâng cao sức đề kháng.",
          "Phiên tư vấn chuyên sâu của chúng ta có hiệu lực trong vòng 24h. Bạn cứ theo dõi sức khỏe và nhắn tin cập nhật cho tôi bất kỳ lúc nào nếu thấy mệt mỏi tăng lên nhé."
        ];
        const randomReply = doctorReplies[Math.floor(Math.random() * doctorReplies.length)];
        
        setConversations(prevConvs => prevConvs.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, { sender: 'doctor', text: randomReply, time: 'Vừa xong' }]
            };
          }
          return c;
        }));
      }, 1500);

      return;
    }

    // Simulate AI response
    let botResponse = '';
    let newSymptoms = [...activeConv.symptoms];
    let newDiagnosis = [...activeConv.diagnosis];
    
    const lowerText = text.toLowerCase();
    if (lowerText.includes('đau đầu') || lowerText.includes('buồn nôn') || lowerText.includes('chóng mặt') || lowerText.includes('sốt')) {
      botResponse = 'Tôi ghi nhận thêm các triệu chứng này. Sốt cao kèm mệt mỏi có thể do virus. Bạn có muốn kết nối với bác sĩ chuyên khoa ngay lập tức để tư vấn sâu không?';
      if (lowerText.includes('chóng mặt') && !newSymptoms.includes('Chóng mặt')) newSymptoms.push('Chóng mặt');
      if (lowerText.includes('buồn nôn') && !newSymptoms.includes('Buồn nôn')) newSymptoms.push('Buồn nôn');
      if (lowerText.includes('sốt') && !newSymptoms.includes('Sốt')) newSymptoms.push('Sốt');
      if (!newDiagnosis.includes('Nghi cúm / nhiễm virus')) {
        newDiagnosis.push('Nghi cúm / nhiễm virus');
        newDiagnosis.push('Nên đi khám');
      }
    } else {
      botResponse = 'Tôi đã nhận được thông tin. Để giúp bạn nhanh chóng chẩn đoán chuyên sâu, hãy cân nhắc đặt lịch khám trực tiếp với bác sĩ hoặc kết nối tư vấn trực tuyến có trả phí với chúng tôi.';
    }

    const nextMessages = [...updatedMessages, { sender: 'bot', text: botResponse, time: 'Vừa xong' }];

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
    // Avoid duplicate blank chats, filter out old blank ones
    setConversations([newChat, ...conversations.filter(c => c.messages.length > 1)]);
    setActiveConvId(newId);
    setIsConsultingDoctor(false);
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
        
        // Add doctor connection message to chat and mark activeDoctorConsult as true
        const updatedConvs = conversations.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              activeDoctorConsult: true,
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

  // Home Care Instructions logic based on symptoms
  const getHomeCareInstructions = () => {
    if (!activeConv || !activeConv.symptoms || activeConv.symptoms.length === 0) {
      return [
        "Nghỉ ngơi hợp lý, tránh làm việc quá sức.",
        "Ăn thức ăn mềm, ấm và dễ tiêu như cháo súp.",
        "Uống đủ nước (1.5 - 2 lít nước ấm mỗi ngày)."
      ];
    }
    
    const instructions = [];
    const symptomsText = activeConv.symptoms.join(', ').toLowerCase();
    
    if (symptomsText.includes('sốt')) {
      instructions.push("Uống nước ấm hoặc Oresol để bù nước nhanh chóng.");
      instructions.push("Mặc quần áo thoáng mát, chườm ấm vùng trán, nách, bẹn.");
      instructions.push("Nếu sốt cao trên 38.5°C, uống Paracetamol 500mg cách nhau 4-6h.");
    }
    if (symptomsText.includes('đau đầu') || symptomsText.includes('mệt mỏi')) {
      instructions.push("Nghỉ ngơi tĩnh dưỡng trong phòng tối và yên tĩnh.");
      instructions.push("Tránh nhìn màn hình điện thoại, máy tính hoặc làm việc nặng.");
    }
    if (symptomsText.includes('ho') || symptomsText.includes('đau họng')) {
      instructions.push("Súc họng bằng nước muối sinh lý ấm 2-3 lần mỗi ngày.");
      instructions.push("Sử dụng mật ong gừng chanh ấm hoặc ngậm quất chưng đường phèn.");
    }
    if (symptomsText.includes('đau bụng') || symptomsText.includes('khó tiêu')) {
      instructions.push("Chườm túi ấm lên vùng bụng để giảm bớt cơn đau rát.");
      instructions.push("Kiêng các đồ dầu mỡ, đồ chua cay hoặc sữa chứa lactose.");
    }
    
    if (instructions.length === 0) {
      instructions.push("Nghỉ ngơi đầy đủ, giữ ấm cơ thể.");
      instructions.push("Ăn uống đủ chất dinh dưỡng, uống nước đều đặn.");
    }
    
    return instructions;
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
                setIsConsultingDoctor(!!c.activeDoctorConsult);
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
                  {c.messages[1] ? c.messages[1].text : c.topic}
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
                onClick={() => {
                  handleStartCall('voice');
                  triggerToast('Đang kết nối cuộc gọi thoại...', 'info');
                }}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <PhoneCall size={14} style={{ color: 'var(--primary)' }} />
              </button>
              <button 
                onClick={() => {
                  handleStartCall('video');
                  triggerToast('Đang kết nối cuộc gọi Video...', 'info');
                }}
                style={{ padding: '6px', borderRadius: '50%', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Video size={14} style={{ color: '#10b981' }} />
              </button>
            </div>
          )}
        </div>

        {/* 24h consult session banner */}
        {isConsultingDoctor && (
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
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} />
              <span>Thời hạn phiên tư vấn chuyên sâu: <strong>24 giờ</strong> (Còn lại: 23 giờ 59 phút)</span>
            </div>
            {/* Expiry simulator button */}
            <button
              onClick={() => {
                setIsConsultingDoctor(false);
                triggerToast('Phiên tư vấn với bác sĩ đã kết thúc. Bạn đã quay lại kênh hội thoại với AI.', 'info');
                
                // Append AI back message and set activeDoctorConsult to false
                const updatedConvs = conversations.map(c => {
                  if (c.id === activeConvId) {
                    return {
                      ...c,
                      activeDoctorConsult: false,
                      messages: [
                        ...c.messages,
                        { sender: 'bot', text: 'Phiên kết nối trực tiếp với bác sĩ đã kết thúc sau 24h. Tôi là Trợ lý sức khỏe AI, bạn có cần tôi giúp đỡ gì thêm về triệu chứng sức khỏe nữa không?', time: 'Vừa xong' }
                      ]
                    };
                  }
                  return c;
                });
                setConversations(updatedConvs);
              }}
              style={{
                padding: '2px 8px',
                backgroundColor: '#b45309',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Hết hạn (Simulate)
            </button>
          </div>
        )}

        {/* Chat Message Scroll */}
        <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeConv.messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            const isDoc = msg.sender === 'doctor';
            
            // Check if this is a custom appointment card
            if (msg.isAptCard) {
              const lines = msg.text.split('\n');
              const doctorText = lines[1]?.replace('👨‍⚕️ Bác sĩ:', '') || '';
              const timeText = lines[2]?.replace('⏰ Thời gian:', '') || '';
              const locText = lines[3]?.replace('📍 Địa điểm:', '') || '';
              const feeText = lines[4]?.replace('💰 Chi phí:', '') || '';

              return (
                <div key={index} style={{ alignSelf: 'flex-start', width: '100%', maxWidth: '85%', margin: '8px 0' }}>
                  <div style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid #22c55e',
                    backgroundColor: '#f0fdf4',
                    color: '#14532d',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', borderBottom: '1px solid #bbf7d0', paddingBottom: '6px' }}>
                      <CheckCircle size={18} style={{ color: '#22c55e' }} />
                      <strong style={{ fontSize: '0.88rem' }}>ĐẶT LỊCH HẸN THÀNH CÔNG</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                      <div><strong>👨‍⚕️ Bác sĩ:</strong> {doctorText}</div>
                      <div><strong>⏰ Thời gian:</strong> {timeText}</div>
                      <div><strong>📍 Địa điểm:</strong> {locText}</div>
                      <div><strong>💰 Chi phí:</strong> {feeText}</div>
                    </div>
                  </div>
                </div>
              );
            }

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
            {['Sốt', 'Đau đầu', 'Buồn nôn', 'Chóng mặt', 'Đau họng', 'Ho'].map(s => (
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

        {/* Hướng dẫn chăm sóc tại nhà */}
        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '6px' }}>
            Hướng dẫn chăm sóc tại nhà
          </span>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.78rem', color: '#14532d', display: 'flex', flexDirection: 'column', gap: '4px', lineHeight: '1.4' }}>
            {getHomeCareInstructions().map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ul>
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
              margin: 0
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', textAlign: 'center', display: 'block' }}>
                Hỗ trợ tiếp theo
              </span>
              
              <button
                onClick={() => onNavigate('patient-schedule-create')}
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

      {/* SIMULATED VIDEO/VOICE CALL MODAL */}
      {showCallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          color: '#fff',
          padding: '20px'
        }}>
          <div style={{
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
                Cuộc gọi {callType === 'video' ? 'Video' : 'Thoại'} tư vấn chuyên sâu
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
                    <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>BS. Dương Gia Huy</h4>
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

                    {/* Doctor feed */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <svg viewBox="0 0 100 100" width="100" height="100">
                        <circle cx="50" cy="50" r="50" fill="#38bdf8" />
                        <circle cx="50" cy="40" r="20" fill="#0369a1" />
                        <path d="M20,80 C20,60 80,60 80,80" fill="#0369a1" />
                      </svg>
                      <span style={{ marginTop: '12px', fontSize: '1rem', fontWeight: '700' }}>BS. Dương Gia Huy</span>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Đang chia sẻ màn hình video tư vấn...</span>
                    </div>

                    {/* Patient Preview */}
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
                            <circle cx="50" cy="50" r="50" fill="#818cf8" />
                            <circle cx="50" cy="40" r="20" fill="#3730a3" />
                            <path d="M20,80 C20,60 80,60 80,80" fill="#3730a3" />
                          </svg>
                          <span style={{ fontSize: '0.65rem', color: '#fff', marginTop: '2px' }}>Bạn</span>
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
                      <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>BS. Dương Gia Huy</h4>
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
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
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
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10l-2.33-1.75-2.33-1.75"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  )}
                </button>
              )}

              {/* End Call */}
              <button
                onClick={() => {
                  setShowCallModal(false);
                  triggerToast('Cuộc gọi đã được ngắt kết nối', 'info');
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
