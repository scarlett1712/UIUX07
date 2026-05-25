import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Database, Bot, Star, Heart, Building, Calendar, Users, Bell, BarChart2, Stethoscope, MessageCircle, Clipboard } from 'lucide-react';

export default function Sidebar({ role, currentView, onNavigate, onLogout }) {
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

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo-circle">
          <Heart size={36} fill="currentColor" />
        </div>
      </div>

      <nav className="sidebar-menu">
        {role === 'expert' ? (
          /* EXPERT ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </a>
            </div>

            {/* Dữ liệu y tế */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${
                  currentView.includes('disease') || currentView.includes('medicine') ? 'active' : ''
                }`}
                onClick={() => setIsMedicalExpanded(!isMedicalExpanded)}
              >
                <Database size={20} />
                <span>Dữ liệu y tế</span>
              </a>
              
              {isMedicalExpanded && (
                <div className="sidebar-submenu">
                  <a
                    className={`sidebar-sublink ${currentView.includes('disease') ? 'active' : ''}`}
                    onClick={() => onNavigate('disease-list')}
                  >
                    Bệnh
                  </a>
                  <a
                    className={`sidebar-sublink ${currentView.includes('medicine') ? 'active' : ''}`}
                    onClick={() => onNavigate('medicine-list')}
                  >
                    Thuốc
                  </a>
                </div>
              )}
            </div>

            {/* Kịch bản Chatbot */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView.includes('chatbot') ? 'active' : ''}`}
                onClick={() => onNavigate('chatbot-scenarios')}
              >
                <Bot size={20} />
                <span>Kịch bản Chatbot</span>
              </a>
            </div>

            {/* Đánh giá & kiểm duyệt AI */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView.includes('ai-evaluation') ? 'active' : ''}`}
                onClick={() => onNavigate('ai-evaluation')}
              >
                <Star size={20} />
                <span>Đánh giá & kiểm duyệt AI</span>
              </a>
            </div>
          </>
        ) : role === 'manager' ? (
          /* MANAGER ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'manager-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('manager-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </a>
            </div>

            {/* Quản lý (Phòng khám, Lịch khám, Bệnh nhân) */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${
                  currentView === 'clinic-info' || currentView === 'clinic-feedback' || currentView.includes('appointment') || currentView.includes('patient') ? 'active' : ''
                }`}
                onClick={() => setIsManagementExpanded(!isManagementExpanded)}
              >
                <Building size={20} />
                <span>Quản lý</span>
              </a>
              
              {isManagementExpanded && (
                <div className="sidebar-submenu">
                  <a
                    className={`sidebar-sublink ${currentView === 'clinic-info' || currentView === 'clinic-feedback' ? 'active' : ''}`}
                    onClick={() => onNavigate('clinic-info')}
                  >
                    Phòng khám
                  </a>
                  <a
                    className={`sidebar-sublink ${currentView.includes('appointment') ? 'active' : ''}`}
                    onClick={() => onNavigate('appointment-calendar')}
                  >
                    Lịch khám
                  </a>
                  <a
                    className={`sidebar-sublink ${currentView.includes('patient') ? 'active' : ''}`}
                    onClick={() => onNavigate('patient-list')}
                  >
                    Bệnh nhân
                  </a>
                </div>
              )}
            </div>

            {/* Điều phối bác sĩ */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${
                  currentView.includes('doctor') ? 'active' : ''
                }`}
                onClick={() => setIsDoctorExpanded(!isDoctorExpanded)}
              >
                <Stethoscope size={20} />
                <span>Điều phối bác sĩ</span>
              </a>
              
              {isDoctorExpanded && (
                <div className="sidebar-submenu">
                  <a
                    className={`sidebar-sublink ${currentView === 'doctor-list' || currentView === 'doctor-details' || currentView === 'doctor-edit' || currentView === 'doctor-add' ? 'active' : ''}`}
                    onClick={() => onNavigate('doctor-list')}
                  >
                    Danh sách
                  </a>
                  <a
                    className={`sidebar-sublink ${currentView === 'doctor-shifts' ? 'active' : ''}`}
                    onClick={() => onNavigate('doctor-shifts')}
                  >
                    Lịch trực
                  </a>
                </div>
              )}
            </div>

            {/* Nhắc lịch */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView.includes('reminder') ? 'active' : ''}`}
                onClick={() => onNavigate('reminder-list')}
              >
                <Bell size={20} />
                <span>Nhắc lịch</span>
              </a>
            </div>

            {/* Báo cáo, phân tích */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'reports-analytics' ? 'active' : ''}`}
                onClick={() => onNavigate('reports-analytics')}
              >
                <BarChart2 size={20} />
                <span>Báo cáo, phân tích</span>
              </a>
            </div>
          </>
        ) : role === 'patient' ? (
          /* PATIENT ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'patient-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </a>
            </div>

            {/* Tư vấn sức khỏe */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'patient-consultation' || currentView === 'patient-schedule-create' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-consultation')}
              >
                <Bot size={20} />
                <span>Tư vấn sức khỏe</span>
              </a>
            </div>

            {/* Lịch khám */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'patient-schedule' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-schedule')}
              >
                <Calendar size={20} />
                <span>Lịch khám</span>
              </a>
            </div>

            {/* Dữ liệu y tế */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'patient-medical-data' ? 'active' : ''}`}
                onClick={() => onNavigate('patient-medical-data')}
              >
                <Database size={20} />
                <span>Dữ liệu y tế</span>
              </a>
            </div>
          </>
        ) : (
          /* DOCTOR ROLE MENU */
          <>
            {/* Trang chủ */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'doctor-dashboard' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-dashboard')}
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
              </a>
            </div>

            {/* Lịch khám */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'doctor-schedule' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-schedule')}
              >
                <Calendar size={20} />
                <span>Lịch khám</span>
              </a>
            </div>

            {/* Quản lý lịch hẹn */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'doctor-appointments' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-appointments')}
              >
                <Clipboard size={20} />
                <span>Quản lý lịch hẹn</span>
              </a>
            </div>

            {/* Tin nhắn */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${currentView === 'doctor-messages' ? 'active' : ''}`}
                onClick={() => onNavigate('doctor-messages')}
              >
                <MessageCircle size={20} />
                <span>Tin nhắn</span>
              </a>
            </div>

            {/* Hồ sơ bệnh án */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${
                  currentView === 'doctor-medical-records' || currentView.includes('doctor-patient-') ? 'active' : ''
                }`}
                onClick={() => onNavigate('doctor-medical-records')}
              >
                <Users size={20} />
                <span>Hồ sơ bệnh án</span>
              </a>
            </div>

            {/* Tra cứu thuốc */}
            <div className="sidebar-item">
              <a
                className={`sidebar-link ${
                  currentView === 'doctor-medicines' || currentView.includes('doctor-medicine-') ? 'active' : ''
                }`}
                onClick={() => onNavigate('doctor-medicines')}
              >
                <Database size={20} />
                <span>Tra cứu thuốc</span>
              </a>
            </div>
          </>
        )}
      </nav>

      {/* Profile Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => onNavigate('profile')}>
          <div className="sidebar-avatar">
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
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">
              {role === 'expert'
                ? 'Mai Thùy Linh'
                : role === 'manager'
                ? 'Nguyễn Nhật Linh'
                : role === 'patient'
                ? 'Lương Hương Giang'
                : 'Dương Gia Huy'}
            </div>
            <div className="sidebar-user-role">
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
        <button 
          onClick={onLogout} 
          style={{ 
            marginTop: '10px', 
            width: '100%', 
            background: 'transparent', 
            border: 'none', 
            color: 'rgba(255,255,255,0.4)', 
            cursor: 'pointer', 
            fontSize: '0.8rem',
            textAlign: 'center' 
          }}
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
