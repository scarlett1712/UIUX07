import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, Bot, Star, Heart, Building, Calendar, Users, Bell, BarChart2, Stethoscope, MessageCircle, Clipboard, User, LogOut, LogIn, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export default function Sidebar({ role, currentView, onNavigate, onLogout, isGuest, onOpenLoginModal, showConfirm, isSidebarCollapsed, onToggleSidebar }) {
  const getSidebarUserName = () => {
    if (role === 'patient') {
      const cached = localStorage.getItem('patientData');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.name) return parsed.name;
        } catch (e) {}
      }
      return 'Lương Hương Giang';
    }
    const cached = localStorage.getItem('profile_' + role);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.name) return parsed.name;
      } catch (e) {}
    }
    if (role === 'expert') return 'Mai Thùy Linh';
    if (role === 'manager') return 'Nguyễn Nhật Linh';
    if (role === 'doctor') return 'Dương Gia Huy';
    return '';
  };

  const [isMedicalExpanded, setIsMedicalExpanded] = useState(
    currentView.includes('disease') || currentView.includes('medicine')
  );

  const [isManagementExpanded, setIsManagementExpanded] = useState(
    currentView === 'clinic-info' || currentView === 'clinic-feedback' || currentView.includes('appointment') || currentView.includes('patient')
  );

  const [isDoctorExpanded, setIsDoctorExpanded] = useState(
    currentView.includes('doctor')
  );

  // Automatically expand submenus if navigated from outside
  useEffect(() => {
    if (currentView.includes('disease') || currentView.includes('medicine')) {
      setIsMedicalExpanded(true);
    }
    if (currentView === 'clinic-info' || currentView === 'clinic-feedback' || currentView.includes('appointment') || currentView.includes('patient')) {
      setIsManagementExpanded(true);
    }
    if (currentView.includes('doctor')) {
      setIsDoctorExpanded(true);
    }
  }, [currentView]);

  const handleLogoClick = () => {
    if (role === 'expert') {
      onNavigate('dashboard');
    } else if (role === 'manager') {
      onNavigate('manager-dashboard');
    } else if (role === 'doctor') {
      onNavigate('doctor-dashboard');
    } else if (role === 'patient') {
      onNavigate('patient-dashboard');
    }
  };

  return (
    <aside className="sidebar">
      <button 
        type="button" 
        className="sidebar-toggle-btn" 
        onClick={onToggleSidebar}
        title={isSidebarCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        <Menu size={14} />
      </button>
      <div className="sidebar-brand">
        <div className="sidebar-logo-circle" onClick={handleLogoClick}>
          <Heart size={36} fill="currentColor" />
        </div>
      </div>

      <nav className="sidebar-menu">
        {role === 'expert' ? (
          /* EXPERT ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </button>
            </div>

            {/* Dữ liệu y tế */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${
                  currentView.includes('disease') || currentView.includes('medicine') ? 'active' : ''
                }`}
                onClick={() => setIsMedicalExpanded(!isMedicalExpanded)}
              >
                <Database size={20} />
                <span>Dữ liệu y tế</span>
              </button>
              
              {isMedicalExpanded && (
                <div className="sidebar-submenu">
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView.includes('disease') ? 'active' : ''}`}
                    onClick={() => onNavigate('disease-list')}
                  >
                    Bệnh
                  </button>
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView.includes('medicine') ? 'active' : ''}`}
                    onClick={() => onNavigate('medicine-list')}
                  >
                    Thuốc
                  </button>
                </div>
              )}
            </div>

            {/* Kịch bản Chatbot */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView.includes('chatbot') ? 'active' : ''}`}
                onClick={() => onNavigate('chatbot-scenarios')}
              >
                <Bot size={20} />
                <span>Kịch bản Chatbot</span>
              </button>
            </div>

            {/* Đánh giá & kiểm duyệt AI */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView.includes('ai-evaluation') ? 'active' : ''}`}
                onClick={() => onNavigate('ai-evaluation')}
              >
                <Star size={20} />
                <span>Đánh giá & kiểm duyệt AI</span>
              </button>
            </div>

            {/* Báo cáo, phân tích */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'expert-reports' ? 'active' : ''}`}
                onClick={() => onNavigate('expert-reports')}
              >
                <BarChart2 size={20} />
                <span>Báo cáo, phân tích</span>
              </button>
            </div>
          </>
        ) : role === 'manager' ? (
          /* MANAGER ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'manager-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('manager-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </button>
            </div>

            {/* Quản lý (Phòng khám, Lịch khám, Bệnh nhân) */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${
                  currentView === 'clinic-info' || currentView === 'clinic-feedback' || currentView.includes('appointment') || currentView.includes('patient') ? 'active' : ''
                }`}
                onClick={() => setIsManagementExpanded(!isManagementExpanded)}
              >
                <Building size={20} />
                <span>Quản lý</span>
              </button>
              
              {isManagementExpanded && (
                <div className="sidebar-submenu">
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView === 'clinic-info' || currentView === 'clinic-feedback' ? 'active' : ''}`}
                    onClick={() => onNavigate('clinic-info')}
                  >
                    Phòng khám
                  </button>
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView.includes('appointment') ? 'active' : ''}`}
                    onClick={() => onNavigate('appointment-calendar')}
                  >
                    Lịch khám
                  </button>
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView.includes('patient') ? 'active' : ''}`}
                    onClick={() => onNavigate('patient-list')}
                  >
                    Bệnh nhân
                  </button>
                </div>
              )}
            </div>

            {/* Điều phối bác sĩ */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${
                  currentView.includes('doctor') ? 'active' : ''
                }`}
                onClick={() => setIsDoctorExpanded(!isDoctorExpanded)}
              >
                <Stethoscope size={20} />
                <span>Điều phối bác sĩ</span>
              </button>
              
              {isDoctorExpanded && (
                <div className="sidebar-submenu">
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView === 'doctor-list' || currentView === 'doctor-details' || currentView === 'doctor-edit' || currentView === 'doctor-add' ? 'active' : ''}`}
                    onClick={() => onNavigate('doctor-list')}
                  >
                    Danh sách
                  </button>
                  <button
                    type="button"
                    className={`sidebar-sublink ${currentView === 'doctor-shifts' ? 'active' : ''}`}
                    onClick={() => onNavigate('doctor-shifts')}
                  >
                    Lịch trực
                  </button>
                </div>
              )}
            </div>

            {/* Nhắc lịch */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView.includes('reminder') ? 'active' : ''}`}
                onClick={() => onNavigate('reminder-list')}
              >
                <Bell size={20} />
                <span>Nhắc lịch</span>
              </button>
            </div>

            {/* Báo cáo, phân tích */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'reports-analytics' ? 'active' : ''}`}
                onClick={() => onNavigate('reports-analytics')}
              >
                <BarChart2 size={20} />
                <span>Báo cáo, phân tích</span>
              </button>
            </div>
          </>
        ) : role === 'patient' ? (
          /* PATIENT ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'patient-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-dashboard')}
                style={isGuest ? { opacity: 0.65 } : {}}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
                {isGuest && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>🔒</span>}
              </button>
            </div>

            {/* Tư vấn sức khỏe */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'patient-consultation' || currentView === 'patient-schedule-create' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-consultation')}
              >
                <Bot size={20} />
                <span>Tư vấn sức khỏe</span>
              </button>
            </div>

            {/* Lịch khám */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'patient-schedule' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-schedule')}
                style={isGuest ? { opacity: 0.65 } : {}}
              >
                <Calendar size={20} />
                <span>Lịch khám</span>
                {isGuest && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>🔒</span>}
              </button>
            </div>

            {/* Lịch sử khám */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'patient-medical-history' || currentView === 'patient-medical-history-detail' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-medical-history')}
                style={isGuest ? { opacity: 0.65 } : {}}
              >
                <Clipboard size={20} />
                <span>Lịch sử khám</span>
                {isGuest && <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>🔒</span>}
              </button>
            </div>

            {/* Dữ liệu y tế */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'patient-medical-data' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-medical-data')}
              >
                <Database size={20} />
                <span>Dữ liệu y tế</span>
              </button>
            </div>
          </>
        ) : (
          /* DOCTOR ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'doctor-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </button>
            </div>

            {/* Lịch khám */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'doctor-schedule' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-schedule')}
              >
                <Calendar size={20} />
                <span>Lịch khám</span>
              </button>
            </div>

            {/* Quản lý lịch hẹn */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'doctor-appointments' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-appointments')}
              >
                <Clipboard size={20} />
                <span>Quản lý lịch hẹn</span>
              </button>
            </div>

            {/* Tin nhắn */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${currentView === 'doctor-messages' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-messages')}
              >
                <MessageCircle size={20} />
                <span>Tin nhắn</span>
              </button>
            </div>

            {/* Hồ sơ bệnh án */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${
                  currentView === 'doctor-medical-records' || currentView.includes('doctor-patient-') ? 'active' : ''
                }`}
                onClick={() => onNavigate('doctor-medical-records')}
              >
                <Users size={20} />
                <span>Hồ sơ bệnh án</span>
              </button>
            </div>

            {/* Tra cứu thuốc */}
            <div className="sidebar-item">
              <button
                type="button"
                className={`sidebar-link ${
                  currentView === 'doctor-medicines' || currentView.includes('doctor-medicine-') ? 'active' : ''
                }`}
                onClick={() => onNavigate('doctor-medicines')}
              >
                <Database size={20} />
                <span>Tra cứu thuốc</span>
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Sidebar Footer: Account and Logout / Login */}
      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px' }}>
        {!isGuest ? (
          <>
            <div className="sidebar-item" style={{ padding: 0 }}>
              <div
                className={`sidebar-user ${currentView === 'profile' ? 'active' : ''}`}
                onClick={() => onNavigate('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: currentView === 'profile' ? 'var(--sidebar-active-bg)' : 'rgba(255, 255, 255, 0.08)',
                  color: currentView === 'profile' ? 'var(--sidebar-active-text)' : 'var(--white)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <div className="sidebar-avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  {role === 'expert' ? (
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#fbcfe8" />
                      <circle cx="50" cy="40" r="20" fill="#db2777" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#db2777" />
                    </svg>
                  ) : role === 'manager' ? (
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#fef3c7" />
                      <circle cx="50" cy="40" r="20" fill="#d97706" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#d97706" />
                    </svg>
                  ) : role === 'patient' ? (
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#e0e7ff" />
                      <circle cx="50" cy="40" r="20" fill="#4f46e5" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#4f46e5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                      <circle cx="50" cy="40" r="20" fill="#2563eb" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                    </svg>
                  )}
                </div>
                <div className="sidebar-user-info" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flexGrow: 1 }}>
                  <div className="sidebar-user-name" style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: '600', 
                    color: currentView === 'profile' ? 'var(--sidebar-active-text)' : 'var(--white)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {getSidebarUserName()}
                  </div>
                  <div className="sidebar-user-role" style={{ 
                    fontSize: '0.7rem', 
                    color: currentView === 'profile' ? 'rgba(15, 59, 122, 0.7)' : 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    {role === 'expert' 
                      ? 'Chuyên gia' 
                      : role === 'manager' 
                      ? 'Quản lý' 
                      : role === 'patient'
                      ? 'Người dùng'
                      : 'Bác sĩ'}
                  </div>
                </div>
              </div>
            </div>
            <div className="sidebar-item" style={{ padding: 0 }}>
              <button
                type="button"
                className="sidebar-link sidebar-logout-btn"
                onClick={() => {
                  if (showConfirm) {
                    showConfirm(
                      'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
                      onLogout,
                      'Xác nhận đăng xuất'
                    );
                  } else {
                    onLogout();
                  }
                }}
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </div>
          </>
        ) : (
          <div className="sidebar-item sidebar-login-container" style={{ padding: '0 16px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenLoginModal}
              style={{ 
                width: '100%', 
                fontSize: '0.78rem', 
                padding: '8px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
              title="Đăng nhập"
            >
              <LogIn size={16} />
              <span className="sidebar-login-text">Đăng nhập</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
