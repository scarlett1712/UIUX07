import React, { useState, useEffect, useRef } from 'react';
import { HeartPulse, Building, Stethoscope, Award, Send, Bot, User, Sparkles, ShieldAlert, CheckCircle, ArrowRight, HelpCircle, Lock, Mail, Key } from 'lucide-react';

export default function LandingPage({ onSelectRole, initialModal }) {
  // Modal states: null, 'login', 'register', 'forgot-password'
  const [activeModal, setActiveModal] = useState(initialModal || null);
  
  // Login states
  const [loginRole, setLoginRole] = useState('patient'); // patient, doctor, manager, expert
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register states
  const [regRole, setRegRole] = useState('patient');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmCode, setRegConfirmCode] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  // Forgot password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: New password
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [forgotPass, setForgotPass] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value.slice(-1);
    setOtpDigits(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newOtp = [...otpDigits];
        newOtp[index - 1] = '';
        setOtpDigits(newOtp);
      }
    }
  };

  // Live Chatbot Demo inside Landing Page
  const [demoMessages, setDemoMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý AI của MediConsult. Hãy thử nhập một triệu chứng bệnh (ví dụ: sốt, đau đầu, ho) để xem tôi có thể phân tích như thế nào nhé!' }
  ]);
  const [demoInput, setDemoInput] = useState('');
  const demoChatBodyRef = useRef(null);

  // Sample credentials map
  const credentials = {
    patient: { email: 'patient@mediconsult.vn', pass: '123456' },
    doctor: { email: 'doctor@mediconsult.vn', pass: '123456' },
    manager: { email: 'manager@mediconsult.vn', pass: '123456' },
    expert: { email: 'expert@mediconsult.vn', pass: '123456' }
  };

  // Pre-fill fields when login tab changes
  useEffect(() => {
    if (credentials[loginRole]) {
      setEmail(credentials[loginRole].email);
      setPassword(credentials[loginRole].pass);
      setLoginError('');
    }
  }, [loginRole]);

  // Sync with prop when changed
  useEffect(() => {
    if (initialModal) {
      setActiveModal(initialModal);
    }
  }, [initialModal]);

  // Scroll to bottom of demo chat without scrolling the entire window
  useEffect(() => {
    const container = demoChatBodyRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [demoMessages]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Validate credentials
    const cred = credentials[loginRole];
    if (email === cred.email && password === cred.pass) {
      onSelectRole(loginRole, false); // Login success as normal user
      setActiveModal(null);
    } else {
      // Allow custom values for demo
      if (email && password) {
        onSelectRole(loginRole, false);
        setActiveModal(null);
      } else {
        setLoginError('Vui lòng kiểm tra lại Email hoặc Mật khẩu.');
      }
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass) return;

    // Validation code for roles other than patient
    if (regRole !== 'patient' && regConfirmCode !== '123456') {
      setRegError('Mã xác nhận vai trò chuyên môn không chính xác! (Mã thử nghiệm là: 123456)');
      return;
    }
    
    setRegError('');
    setRegSuccess(true);
    setTimeout(() => {
      onSelectRole(regRole, false);
      setActiveModal(null);
      setRegSuccess(false);
      setRegName('');
      setRegEmail('');
      setRegPass('');
      setRegConfirmCode('');
    }, 1500);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotStep === 1) {
      if (!forgotEmail) return;
      setForgotError('');
      setForgotStep(2);
    } else if (forgotStep === 2) {
      const otpValue = otpDigits.join('');
      if (otpValue === '123456') {
        setForgotError('');
        setForgotStep(3);
      } else {
        setForgotError('Mã OTP không chính xác! Vui lòng sử dụng mã thử nghiệm: 123456');
      }
    } else if (forgotStep === 3) {
      if (!forgotPass || forgotPass.length < 6) {
        setForgotError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
        return;
      }
      setForgotError('');
      setForgotSuccess(true);
      setTimeout(() => {
        setForgotSuccess(false);
        setForgotStep(1);
        setForgotEmail('');
        setOtpDigits(['', '', '', '', '', '']);
        setForgotPass('');
        setActiveModal('login');
      }, 1500);
    }
  };

  // AI responses simulation for landing page interactive demo
  const handleSendDemoMessage = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!demoInput.trim()) return;

    const userText = demoInput.trim();
    const newMsgs = [...demoMessages, { sender: 'user', text: userText }];
    setDemoMessages(newMsgs);
    setDemoInput('');

    setTimeout(() => {
      let botText = '';
      const lower = userText.toLowerCase();

      if (lower.includes('sốt')) {
        botText = 'Hệ thống AI ghi nhận triệu chứng: SỐT.\n\nĐề xuất sơ bộ: Sốt có thể do nhiễm siêu vi hoặc nhiễm trùng. Bạn nên theo dõi thân nhiệt, uống nhiều nước ấm và lau mát. Nếu sốt cao trên 38.5 độ C, bạn có thể cân nhắc sử dụng thuốc hạ sốt paracetamol phù hợp.\n\nĐể nhận đơn thuốc chi tiết và kết nối trực tuyến với Bác sĩ Dương Gia Huy, vui lòng nhấn nút "Đặt lịch hẹn khám" hoặc sử dụng tính năng "Tư vấn sức khỏe chuyên sâu"!';
      } else if (lower.includes('đau đầu') || lower.includes('chóng mặt')) {
        botText = 'Hệ thống AI ghi nhận triệu chứng: ĐAU ĐẦU/CHÓNG MẶT.\n\nĐề xuất sơ bộ: Triệu chứng này có thể do căng thẳng, mất ngủ hoặc thay đổi huyết áp. Hãy nghỉ ngơi nơi thoáng mát, yên tĩnh.\n\nĐể được bác sĩ của MediConsult chẩn đoán chính xác bằng bệnh án điện tử, vui lòng Đăng nhập và tạo Lịch hẹn!';
      } else if (lower.includes('đau bụng') || lower.includes('buồn nôn')) {
        botText = 'Hệ thống AI ghi nhận triệu chứng: ĐAU BỤNG/BUỒN NÔN.\n\nĐề xuất sơ bộ: Có thể liên quan đến hội chứng ruột kích thích, viêm dạ dày hoặc ngộ độc thức ăn nhẹ. Bạn nên tránh đồ ăn chua cay, nhiều dầu mỡ.\n\nĐăng nhập vào hệ thống để tra cứu chi tiết thông tin thuốc hỗ trợ tiêu hóa hoặc liên hệ trực tiếp với bác sĩ trực phòng khám.';
      } else {
        botText = 'Tôi đã nhận được thông tin về triệu chứng của bạn. AI đề xuất bạn nên nghỉ ngơi và theo dõi thêm.\n\nBạn có thể nhấn nút "Trải nghiệm Chatbot AI (Khách)" ở trên để mở rộng cuộc hội thoại và thực hiện kiểm tra triệu chứng chi tiết hơn trên toàn hệ thống!';
      }

      setDemoMessages([...newMsgs, { sender: 'bot', text: botText }]);
    }, 1000);
  };

  return (
    <div className="landing-page" style={{ background: 'linear-gradient(135deg, #f0f4f9 0%, #e5eef7 50%, #f6f9fc 100%)' }}>
      
      {/* Top Header */}
      <header className="clinic-header" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        width: '100%', 
        borderBottom: '1.5px solid rgba(15, 59, 122, 0.1)',
        background: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1000
      }}>
        <div className="clinic-logo">
          <HeartPulse size={28} className="trend-up" style={{ animation: 'pulseGlow 2s infinite', color: 'var(--primary-light)' }} />
          Medi<span>Consult</span>
        </div>

        <nav className="clinic-nav-links">
          <a href="#about" className="clinic-nav-link">Giới thiệu</a>
          <a href="#services" className="clinic-nav-link">Dịch vụ</a>
          <a href="#doctors" className="clinic-nav-link">Đội ngũ bác sĩ</a>
          <a href="#chatbot-demo" className="clinic-nav-link">Trải nghiệm AI</a>
        </nav>

        <div className="clinic-auth-btns" style={{ gap: '16px' }}>
          <button className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '1.05rem', fontWeight: 600, borderRadius: '8px' }} onClick={() => setActiveModal('login')}>
            Đăng nhập
          </button>
          <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '1.05rem', fontWeight: 700, borderRadius: '8px' }} onClick={() => setActiveModal('register')}>
            Đăng ký
          </button>
        </div>
      </header>

      <div className="animate-fade-in" style={{ paddingTop: '70px' }}>
        {/* Hero Section */}
        <section className="clinic-hero" id="about" style={{ marginTop: 0 }}>
        <div className="hero-content">
          <h1 style={{ lineHeight: 1.25 }}>
            Phòng Khám Đa Khoa Quốc Tế & <span>Tư Vấn Y Tế AI 24/7</span>
          </h1>
          <p className="hero-description">
            MediConsult là nền tảng quản lý khám chữa bệnh hiện đại, tích hợp Trợ lý ảo AI thông minh tự động chẩn đoán triệu chứng ban đầu, kết hợp đội ngũ bác sĩ chuyên khoa đầu ngành giúp chăm sóc sức khỏe toàn diện cho gia đình bạn.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => onSelectRole('patient', true)} style={{ padding: '14px 28px', fontSize: '0.92rem', fontWeight: 700 }}>
              Trải nghiệm Chatbot AI (Khách) <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline" onClick={() => setActiveModal('login')} style={{ padding: '14px 28px', fontSize: '0.92rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.8)' }}>
              Đặt lịch hẹn khám bác sĩ
            </button>
          </div>
        </div>

        <div className="hero-visual" id="chatbot-demo">
          <div className="chatbot-demo-card">
            <div className="chatbot-demo-header">
              <Bot size={20} />
              <div>
                <strong style={{ fontSize: '0.88rem', display: 'block' }}>Hội thoại dùng thử với AI</strong>
                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>Phản hồi tự động trực tuyến</span>
              </div>
            </div>
            
            <div className="chatbot-demo-body" ref={demoChatBodyRef} style={{ scrollBehavior: 'smooth' }}>
              {demoMessages.map((m, i) => (
                <div key={i} className={`chatbot-demo-msg ${m.sender}`}>
                  {m.text.split('\n').map((line, key) => (
                    <span key={key}>{line}<br /></span>
                  ))}
                </div>
              ))}
            </div>

            <div className="chatbot-demo-input">
              <input
                type="text"
                placeholder="Nhập triệu chứng của bạn..."
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendDemoMessage(e);
                  }
                }}
              />
              <button onClick={(e) => {
                e.preventDefault();
                handleSendDemoMessage(e);
              }}>Gửi</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="clinic-stats-banner">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">15,000+</span>
            <span className="stat-label">Bệnh nhân tin dùng</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Bác sĩ chuyên khoa</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99.8%</span>
            <span className="stat-label">AI phản hồi chính xác</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Hỗ trợ tư vấn khẩn cấp</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="clinic-section" id="services">
        <h2 className="section-title">Dịch Vụ Y Tế Thông Minh</h2>
        <p className="section-subtitle">Chúng tôi cung cấp các giải pháp tối ưu cho trải nghiệm khám bệnh nhanh chóng và an tâm nhất</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-box">
              <Bot size={24} />
            </div>
            <h3>Tư vấn sức khỏe AI</h3>
            <p>Trợ lý AI thu thập triệu chứng ban đầu, gợi ý bệnh lý sơ bộ và đưa ra các lời khuyên chăm sóc sức khỏe tại nhà hữu ích.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <Stethoscope size={24} />
            </div>
            <h3>Đặt lịch & Khám chuyên sâu</h3>
            <p>Đặt lịch hẹn khám trực tiếp tại phòng khám hoặc thực hiện cuộc gọi video tư vấn trực tuyến với bác sĩ chuyên khoa đầu ngành.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <Building size={24} />
            </div>
            <h3>Hồ sơ bệnh án điện tử</h3>
            <p>Lưu trữ và tra cứu lịch sử bệnh lý, chẩn đoán, kê đơn thuốc và kết quả xét nghiệm một cách bảo mật, đồng bộ toàn hệ thống.</p>
          </div>
          <div className="service-card">
            <div className="service-icon-box">
              <Award size={24} />
            </div>
            <h3>Kiểm duyệt chất lượng AI</h3>
            <p>Báo cáo phân tích và kịch bản chatbot được các chuyên gia y tế hàng đầu thẩm định thường xuyên để đảm bảo an toàn tuyệt đối.</p>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="clinic-section" id="doctors" style={{ backgroundColor: 'rgba(15, 59, 122, 0.03)', maxWidth: '100%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="section-title">Đội Ngũ Bác Sĩ Chuyên Gia</h2>
          <p className="section-subtitle">Gặp gỡ những chuyên gia y tế giàu kinh nghiệm, tận tụy và nhiệt huyết tại phòng khám của chúng tôi</p>
          
          <div className="doctors-grid">
            <div className="doctor-card">
              <div className="doctor-avatar-circle">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                  <circle cx="50" cy="40" r="20" fill="#2563eb" />
                  <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                </svg>
              </div>
              <h3>Ths. Bs. Dương Gia Huy</h3>
              <p className="specialty">Ngoại tổng quát</p>
              <p className="bio">Hơn 10 năm kinh nghiệm phẫu thuật ngoại khoa và nội soi tiêu hóa tại bệnh viện Bạch Mai.</p>
            </div>

            <div className="doctor-card">
              <div className="doctor-avatar-circle">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <circle cx="50" cy="50" r="50" fill="#d1fae5" />
                  <circle cx="50" cy="40" r="20" fill="#059669" />
                  <path d="M20,80 C20,60 80,60 80,80" fill="#059669" />
                </svg>
              </div>
              <h3>Ths. Bs. Nguyễn Văn B</h3>
              <p className="specialty">Khoa Nội tổng quát</p>
              <p className="bio">Hơn 12 năm kinh nghiệm chẩn đoán và điều trị các bệnh lý nội tiết, hô hấp tại các bệnh viện lớn.</p>
            </div>

            <div className="doctor-card">
              <div className="doctor-avatar-circle">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  <circle cx="50" cy="50" r="50" fill="#fef3c7" />
                  <circle cx="50" cy="40" r="20" fill="#d97706" />
                  <path d="M20,80 C20,60 80,60 80,80" fill="#d97706" />
                </svg>
              </div>
              <h3>BS. chuyên khoa II Nguyễn Văn C</h3>
              <p className="specialty">Tai mũi họng</p>
              <p className="bio">Chuyên gia điều trị các bệnh lý đường hô hấp trên và viêm tai giữa trẻ em với phương pháp hiện đại.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="clinic-footer">
        <p style={{ margin: '0 0 10px 0' }}>© 2026 MediConsult - Hệ thống tư vấn y tế thông minh tích hợp AI. Bảo lưu mọi quyền.</p>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Phòng khám Đa khoa Quốc tế MediConsult, Cầu Giấy, Hà Nội.</p>
      </footer>

      </div> {/* Closing the animate-fade-in div */}

      {/* Auth Login Modal */}
      {activeModal === 'login' && (
        <div className="auth-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', textAlign: 'center' }}>Đăng nhập hệ thống</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px' }}>
              Vui lòng chọn vai trò để đăng nhập nhanh hoặc điền thông tin tài khoản
            </p>

            {/* Tab Bar */}
            <div className="auth-tab-bar">
              <button className={`auth-tab-btn ${loginRole === 'patient' ? 'active' : ''}`} onClick={() => setLoginRole('patient')}>
                Bệnh nhân
              </button>
              <button className={`auth-tab-btn ${loginRole === 'doctor' ? 'active' : ''}`} onClick={() => setLoginRole('doctor')}>
                Bác sĩ
              </button>
              <button className={`auth-tab-btn ${loginRole === 'manager' ? 'active' : ''}`} onClick={() => setLoginRole('manager')}>
                Quản lý
              </button>
              <button className={`auth-tab-btn ${loginRole === 'expert' ? 'active' : ''}`} onClick={() => setLoginRole('expert')}>
                Chuyên gia
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="login-email">Email tài khoản</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@mediconsult.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="login-password">Mật khẩu</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
                <span 
                  style={{ fontSize: '0.78rem', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} 
                  onClick={() => {
                    setForgotStep(1);
                    setForgotError('');
                    setForgotSuccess(false);
                    setActiveModal('forgot-password');
                  }}
                >
                  Quên mật khẩu?
                </span>
              </div>

              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' }}>
                  {loginError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', marginTop: '6px', fontWeight: '700' }}>
                Đăng nhập ngay
              </button>
            </form>

            <div className="quick-login-box">
              <p>Hoặc đăng nhập nhanh bằng tài khoản mẫu:</p>
              <div className="quick-login-grid">
                <button className="quick-login-btn" onClick={() => { setLoginRole('patient'); onSelectRole('patient', false); setActiveModal(null); }}>
                  Bệnh nhân mẫu
                </button>
                <button className="quick-login-btn" onClick={() => { setLoginRole('doctor'); onSelectRole('doctor', false); setActiveModal(null); }}>
                  Bác sĩ mẫu
                </button>
                <button className="quick-login-btn" onClick={() => { setLoginRole('manager'); onSelectRole('manager', false); setActiveModal(null); }}>
                  Quản lý mẫu
                </button>
                <button className="quick-login-btn" onClick={() => { setLoginRole('expert'); onSelectRole('expert', false); setActiveModal(null); }}>
                  Chuyên gia mẫu
                </button>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.82rem' }}>
              Chưa có tài khoản? <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveModal('register')}>Đăng ký ngay</span>
            </div>
          </div>
        </div>
      )}

      {/* Auth Register Modal */}
      {activeModal === 'register' && (
        <div className="auth-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', textAlign: 'center' }}>Đăng ký tài khoản</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px' }}>
              Tham gia MediConsult để trải nghiệm trọn vẹn dịch vụ y khoa AI
            </p>

            <form onSubmit={handleRegisterSubmit} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="reg-name">Họ và tên</label>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="reg-email">Email tài khoản</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="example@mediconsult.vn"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="reg-password">Mật khẩu</label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự..."
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="reg-role">Đăng ký dưới vai trò</label>
                <select id="reg-role" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                  <option value="patient">Bệnh nhân / Người cần tư vấn</option>
                  <option value="doctor">Bác sĩ khám bệnh</option>
                  <option value="manager">Quản lý phòng khám</option>
                  <option value="expert">Chuyên gia y khoa</option>
                </select>
              </div>

              {(regRole === 'doctor' || regRole === 'manager' || regRole === 'expert') && (
                <div className="auth-form-group animate-fade-in">
                  <label htmlFor="reg-confirm-code">Mã xác nhận vai trò chuyên môn (Mẫu: 123456)</label>
                  <input
                    id="reg-confirm-code"
                    type="text"
                    placeholder="Nhập mã xác nhận chuyên khoa/chức vụ..."
                    value={regConfirmCode}
                    onChange={(e) => setRegConfirmCode(e.target.value)}
                    required
                  />
                </div>
              )}

              {regError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' }}>
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Đăng ký thành công! Đang tự động đăng nhập...
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', marginTop: '6px', fontWeight: '700' }}>
                Đăng ký tài khoản
              </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.82rem' }}>
              Đã có tài khoản? <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveModal('login')}>Đăng nhập ngay</span>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal (OTP verification) */}
      {activeModal === 'forgot-password' && (
        <div className="auth-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setActiveModal(null)}>&times;</button>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '6px', textAlign: 'center' }}>Quên mật khẩu</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px' }}>
              {forgotStep === 1 && "Nhập email đã đăng ký để hệ thống gửi mã xác thực OTP"}
              {forgotStep === 2 && "Nhập mã xác thực OTP gồm 6 chữ số được gửi tới email"}
              {forgotStep === 3 && "Thiết lập lại mật khẩu mới bảo mật của bạn"}
            </p>

            <form onSubmit={handleForgotSubmit} className="auth-form">
              {forgotStep === 1 && (
                <div className="auth-form-group">
                  <label htmlFor="forgot-email">Email khôi phục</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Mail size={16} style={{ color: 'var(--text-muted)', position: 'absolute', marginLeft: '12px' }} />
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="name@mediconsult.vn"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      style={{ paddingLeft: '34px', width: '100%' }}
                      required
                    />
                  </div>
                </div>
              )}

              {forgotStep === 2 && (
                <div className="auth-form-group">
                  <label htmlFor="otp-input-0" style={{ textAlign: 'center', display: 'block', marginBottom: '12px' }}>
                    Mã xác thực OTP (Mẫu: 123456)
                  </label>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '15px 0' }}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        style={{
                          width: '45px',
                          height: '45px',
                          textAlign: 'center',
                          fontSize: '1.4rem',
                          fontWeight: 'bold',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: '8px',
                          outline: 'none',
                          transition: 'border-color 0.2s',
                          backgroundColor: '#f8fafc'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                        required
                      />
                    ))}
                  </div>
                </div>
              )}

              {forgotStep === 3 && (
                <div className="auth-form-group">
                  <label htmlFor="forgot-new-password">Mật khẩu mới</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Key size={16} style={{ color: 'var(--text-muted)', position: 'absolute', marginLeft: '12px' }} />
                    <input
                      id="forgot-new-password"
                      type="password"
                      placeholder="Nhập mật khẩu mới..."
                      value={forgotPass}
                      onChange={(e) => setForgotPass(e.target.value)}
                      style={{ paddingLeft: '34px', width: '100%' }}
                      required
                    />
                  </div>
                </div>
              )}

              {forgotError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center' }}>
                  {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div style={{ color: '#16a34a', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
                  ✓ Thiết lập mật khẩu thành công! Đang chuyển đến đăng nhập...
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ padding: '10px', marginTop: '6px', fontWeight: '700' }}>
                {forgotStep === 1 && "Gửi mã OTP"}
                {forgotStep === 2 && "Xác nhận mã OTP"}
                {forgotStep === 3 && "Thay đổi mật khẩu"}
              </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.82rem' }}>
              <span style={{ color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveModal('login')}>Quay lại đăng nhập</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
