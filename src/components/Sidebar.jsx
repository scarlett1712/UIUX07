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
              >
                <LayoutDashboard size={20} />
                <span>Trang chủ</span>
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
              >
                <Calendar size={20} />
                <span>Lịch khám</span>
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

    </aside>
  );
}
