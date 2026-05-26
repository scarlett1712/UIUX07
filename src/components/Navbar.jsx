import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Activity, Pill, Bot, User, Stethoscope, Clock, BellRing, ShieldAlert, MessageCircle } from 'lucide-react';

export default function Navbar({
  role,
  currentView,
  previousView,
  onNavigate,
  onSelectId,
  diseases,
  medicines,
  patients = [],
  doctors = [],
  reminders = [],
  appointments = [],
  scenarios = [],
  conversations = [],
  doctorThreads = [],
  patientConversations = []
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // Initial mock notifications for each role
  const [notificationsList, setNotificationsList] = useState({
    expert: [
      { id: 'n1', text: "Kịch bản 'Tư vấn cảm cúm' vừa được chỉnh sửa bởi AI", view: 'chatbot-scenarios', read: false, time: '10 phút trước' },
      { id: 'n2', text: 'Hội thoại y khoa mới cần kiểm duyệt (Mã: #9281)', view: 'ai-evaluation', read: false, time: '1 giờ trước' },
      { id: 'n3', text: 'Báo cáo hiệu suất phản hồi AI tuần 21 đã sẵn sàng', view: 'ai-evaluation', read: false, time: 'Hôm qua' }
    ],
    manager: [
      { id: 'n4', text: 'Bệnh nhân Lương Hương Giang vừa đăng ký khám mới', view: 'appointment-calendar', read: false, time: '5 phút trước' },
      { id: 'n5', text: 'Yêu cầu trực/nghỉ của Bác sĩ cần duyệt điều chỉnh', view: 'doctor-shifts', read: false, time: '30 phút trước' },
      { id: 'n6', text: 'Có phản hồi đánh giá 5 sao từ bệnh nhân mới', view: 'clinic-feedback', read: false, time: '2 giờ trước' }
    ],
    doctor: [
      { id: 'n7', text: 'Lịch hẹn khám mới lúc 09:00 ngày mai với Đỗ Minh Tú', view: 'doctor-schedule', read: false, time: '15 phút trước' },
      { id: 'n8', text: 'Bệnh nhân Nguyễn Minh Anh gửi tin nhắn mới', view: 'doctor-messages', read: false, time: '45 phút trước' },
      { id: 'n9', text: 'Bệnh án bệnh nhân Đỗ Minh Tú cần nhập chẩn đoán', view: 'doctor-medical-records', read: false, time: '3 giờ trước' }
    ],
    patient: [
      { id: 'n10', text: 'Lịch khám hẹn ngày 20/06 với Bs. Nguyễn Văn B đã được xác nhận', view: 'patient-schedule', read: false, time: '10 phút trước' },
      { id: 'n11', text: 'Đã có hướng dẫn chăm sóc triệu chứng sốt của bạn', view: 'patient-consultation-keep', read: false, time: '30 phút trước' },
      { id: 'n12', text: 'Hồ sơ dữ liệu y tế của bạn vừa cập nhật bệnh án mới', view: 'patient-medical-data', read: false, time: '1 ngày trước' }
    ]
  });

  const currentNotifications = notificationsList[role] || [];
  const unreadCount = currentNotifications.filter(n => !n.read).length;

  const handleNotificationClick = (n) => {
    setNotificationsList(prev => ({
      ...prev,
      [role]: prev[role].map(item => item.id === n.id ? { ...item, read: true } : item)
    }));
    setShowNotifications(false);
    onNavigate(n.view);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute breadcrumbs and their corresponding navigation destinations
  const getBreadcrumbs = () => {
    const crumbs = [{ 
      text: 'Trang chủ', 
      view: role === 'expert' ? 'dashboard' : role === 'manager' ? 'manager-dashboard' : role === 'patient' ? 'patient-dashboard' : 'doctor-dashboard' 
    }];
    
    if (role === 'expert') {
      if (currentView === 'dashboard') {
        crumbs.push({ text: 'Trang chủ', view: 'dashboard' });
      } else if (currentView.includes('disease')) {
        crumbs.push({ text: 'Dữ liệu y tế', view: 'disease-list' });
        crumbs.push({ text: 'Bệnh', view: 'disease-list' });
        if (currentView === 'disease-list') crumbs.push({ text: 'Danh sách bệnh', view: 'disease-list' });
        if (currentView === 'disease-details') crumbs.push({ text: 'Chi tiết bệnh', view: 'disease-details' });
        if (currentView === 'disease-edit') crumbs.push({ text: 'Chỉnh sửa thông tin bệnh', view: 'disease-edit' });
        if (currentView === 'disease-add') crumbs.push({ text: 'Thêm thông tin bệnh', view: 'disease-add' });
      } else if (currentView.includes('medicine')) {
        crumbs.push({ text: 'Dữ liệu y tế', view: 'medicine-list' });
        crumbs.push({ text: 'Thuốc', view: 'medicine-list' });
        if (currentView === 'medicine-list') crumbs.push({ text: 'Danh sách thuốc', view: 'medicine-list' });
        if (currentView === 'medicine-details') crumbs.push({ text: 'Chi tiết thuốc', view: 'medicine-details' });
        if (currentView === 'medicine-edit') crumbs.push({ text: 'Chỉnh sửa thông tin thuốc', view: 'medicine-edit' });
        if (currentView === 'medicine-add') crumbs.push({ text: 'Thêm thông tin thuốc', view: 'medicine-add' });
      } else if (currentView.includes('chatbot')) {
        crumbs.push({ text: 'Kịch bản Chatbot', view: 'chatbot-scenarios' });
        if (currentView === 'chatbot-scenarios') crumbs.push({ text: 'Danh sách kịch bản', view: 'chatbot-scenarios' });
        if (currentView === 'chatbot-scenario-edit') crumbs.push({ text: 'Chỉnh sửa kịch bản', view: 'chatbot-scenario-edit' });
        if (currentView === 'chatbot-scenario-add') crumbs.push({ text: 'Thêm kịch bản', view: 'chatbot-scenario-add' });
        if (currentView === 'chatbot-scenario-test') crumbs.push({ text: 'Kiểm thử kịch bản', view: 'chatbot-scenario-test' });
      } else if (currentView.includes('ai-evaluation')) {
        crumbs.push({ text: 'Đánh giá & kiểm duyệt AI', view: 'ai-evaluation' });
        if (currentView === 'ai-evaluation') crumbs.push({ text: 'Danh sách hội thoại', view: 'ai-evaluation' });
        if (currentView === 'ai-evaluation-analysis') crumbs.push({ text: 'Phân tích hội thoại', view: 'ai-evaluation-analysis' });
      }
    } else if (role === 'manager') {
      // MANAGER crumbs
      if (currentView === 'manager-dashboard') {
        crumbs.push({ text: 'Trang chủ', view: 'manager-dashboard' });
      } else if (currentView === 'clinic-info' || currentView === 'clinic-feedback') {
        crumbs.push({ text: 'Quản lý', view: 'clinic-info' });
        crumbs.push({ text: 'Phòng khám', view: 'clinic-info' });
      } else if (currentView.includes('appointment')) {
        crumbs.push({ text: 'Quản lý', view: 'appointment-calendar' });
        crumbs.push({ text: 'Lịch khám', view: 'appointment-calendar' });
        if (currentView === 'appointment-edit') crumbs.push({ text: 'Chỉnh sửa lịch hẹn', view: 'appointment-edit' });
        if (currentView === 'appointment-add') crumbs.push({ text: 'Thêm lịch hẹn mới', view: 'appointment-add' });
      } else if (currentView.includes('patient')) {
        crumbs.push({ text: 'Quản lý', view: 'patient-list' });
        crumbs.push({ text: 'Bệnh nhân', view: 'patient-list' });
        if (currentView === 'patient-list') crumbs.push({ text: 'Danh sách bệnh nhân', view: 'patient-list' });
        if (currentView === 'patient-details') crumbs.push({ text: 'Chi tiết hồ sơ bệnh nhân', view: 'patient-details' });
        if (currentView === 'patient-edit') crumbs.push({ text: 'Chỉnh sửa bệnh nhân', view: 'patient-edit' });
        if (currentView === 'patient-add') crumbs.push({ text: 'Thêm bệnh nhân', view: 'patient-add' });
      } else if (currentView.includes('doctor')) {
        crumbs.push({ text: 'Điều phối bác sĩ', view: 'doctor-list' });
        if (currentView === 'doctor-list') crumbs.push({ text: 'Danh sách bác sĩ', view: 'doctor-list' });
        if (currentView === 'doctor-shifts') crumbs.push({ text: 'Lịch trực bác sĩ', view: 'doctor-shifts' });
        if (currentView === 'doctor-details') crumbs.push({ text: 'Chi tiết năng lực', view: 'doctor-details' });
        if (currentView === 'doctor-edit') crumbs.push({ text: 'Chỉnh sửa bác sĩ', view: 'doctor-edit' });
        if (currentView === 'doctor-add') crumbs.push({ text: 'Thêm bác sĩ mới', view: 'doctor-add' });
      } else if (currentView.includes('reminder')) {
        crumbs.push({ text: 'Nhắc lịch', view: 'reminder-list' });
        if (currentView === 'reminder-list') crumbs.push({ text: 'Danh sách nhắc lịch tự động', view: 'reminder-list' });
        if (currentView === 'reminder-details') crumbs.push({ text: 'Chi tiết kịch bản', view: 'reminder-details' });
        if (currentView === 'reminder-edit') crumbs.push({ text: 'Chỉnh sửa kịch bản', view: 'reminder-edit' });
        if (currentView === 'reminder-add') crumbs.push({ text: 'Tạo nhắc lịch mới', view: 'reminder-add' });
      } else if (currentView === 'reports-analytics') {
        crumbs.push({ text: 'Báo cáo, phân tích', view: 'reports-analytics' });
      }
    } else if (role === 'patient') {
      // PATIENT crumbs
      if (currentView === 'patient-dashboard') {
        crumbs.push({ text: 'Trang chủ', view: 'patient-dashboard' });
      } else if (currentView === 'patient-consultation') {
        crumbs.push({ text: 'Tư vấn sức khỏe', view: 'patient-consultation' });
      } else if (currentView === 'patient-schedule') {
        crumbs.push({ text: 'Lịch khám', view: 'patient-schedule' });
      } else if (currentView === 'patient-schedule-create') {
        crumbs.push({ text: 'Tư vấn sức khỏe', view: 'patient-consultation-keep' });
        crumbs.push({ text: 'Đặt lịch khám', view: 'patient-schedule-create' });
      } else if (currentView === 'patient-medical-data') {
        crumbs.push({ text: 'Dữ liệu y tế', view: 'patient-medical-data' });
      }
    } else {
      // DOCTOR crumbs
      if (currentView === 'doctor-dashboard') {
        crumbs.push({ text: 'Trang chủ', view: 'doctor-dashboard' });
      } else if (currentView === 'doctor-schedule') {
        crumbs.push({ text: 'Lịch khám', view: 'doctor-schedule' });
      } else if (currentView === 'doctor-appointments') {
        crumbs.push({ text: 'Quản lý lịch hẹn', view: 'doctor-appointments' });
      } else if (currentView === 'doctor-messages') {
        crumbs.push({ text: 'Tin nhắn', view: 'doctor-messages' });
      } else if (currentView === 'doctor-medical-records' || currentView.includes('doctor-patient-')) {
        if (previousView === 'doctor-messages' && currentView.includes('doctor-patient-')) {
          crumbs.push({ text: 'Tin nhắn', view: 'doctor-messages' });
        } else {
          crumbs.push({ text: 'Hồ sơ bệnh án', view: 'doctor-medical-records' });
        }
        if (currentView === 'doctor-medical-records') crumbs.push({ text: 'Danh sách bệnh nhân', view: 'doctor-medical-records' });
        if (currentView === 'doctor-patient-details') crumbs.push({ text: 'Chi tiết bệnh án', view: 'doctor-patient-details' });
        if (currentView === 'doctor-patient-diagnose') crumbs.push({ text: 'Chẩn đoán & kê đơn', view: 'doctor-patient-diagnose' });
      } else if (currentView === 'doctor-medicines' || currentView.includes('doctor-medicine-')) {
        crumbs.push({ text: 'Tra cứu thuốc', view: 'doctor-medicines' });
        if (currentView === 'doctor-medicines') crumbs.push({ text: 'Danh sách thuốc', view: 'doctor-medicines' });
        if (currentView === 'doctor-medicine-details') crumbs.push({ text: 'Chi tiết thuốc', view: 'doctor-medicine-details' });
      }
    }

    if (currentView === 'profile') {
      crumbs.push({ text: 'Thông tin tài khoản', view: 'profile' });
    }

    return crumbs;
  };

  const crumbs = getBreadcrumbs();

  // Search filter logic across database entities
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { diseases: [], medicines: [], patients: [], doctors: [], reminders: [], appointments: [], scenarios: [], evaluations: [], doctorThreads: [], patientConvs: [] };
    const query = searchQuery.toLowerCase();
    
    // Expert matches
    const matchedDiseases = diseases.filter(d => 
      d.name.toLowerCase().includes(query) || d.desc.toLowerCase().includes(query)
    );
    const matchedMedicines = medicines.filter(m => 
      m.name.toLowerCase().includes(query) || m.activeIngredient.toLowerCase().includes(query)
    );
    const matchedScenarios = (scenarios || []).filter(s =>
      s.name.toLowerCase().includes(query)
    );
    const matchedEvaluations = (conversations || []).filter(c =>
      c.name.toLowerCase().includes(query) || c.topic.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
    );

    // Manager matches
    const matchedPatients = patients.filter(p =>
      p.name.toLowerCase().includes(query) || p.phone.includes(query) || p.id.toLowerCase().includes(query)
    );
    const matchedDoctors = doctors.filter(doc =>
      doc.name.toLowerCase().includes(query) || doc.specialty.toLowerCase().includes(query)
    );
    const matchedReminders = reminders.filter(r =>
      r.title.toLowerCase().includes(query) || r.channel.toLowerCase().includes(query)
    );
    const matchedAppointments = appointments.filter(apt =>
      apt.patientName.toLowerCase().includes(query) || apt.doctorName.toLowerCase().includes(query)
    );

    // Doctor matches
    const matchedDoctorThreads = (doctorThreads || []).filter(t =>
      t.name.toLowerCase().includes(query) || t.lastMsg.toLowerCase().includes(query)
    );

    // Patient matches
    const matchedPatientConvs = (patientConversations || []).filter(c =>
      c.topic.toLowerCase().includes(query) || c.messages.some(m => m.text.toLowerCase().includes(query))
    );

    return {
      diseases: matchedDiseases,
      medicines: matchedMedicines,
      patients: matchedPatients,
      doctors: matchedDoctors,
      reminders: matchedReminders,
      appointments: matchedAppointments,
      scenarios: matchedScenarios,
      evaluations: matchedEvaluations,
      doctorThreads: matchedDoctorThreads,
      patientConvs: matchedPatientConvs
    };
  };

  const results = getSearchResults();
  
  const hasDisplayedResults = () => {
    if (role === 'expert') {
      return results.diseases.length > 0 || results.medicines.length > 0 || results.scenarios.length > 0 || results.evaluations.length > 0;
    }
    if (role === 'patient') {
      return results.diseases.length > 0 || results.medicines.length > 0 || results.doctors.length > 0 || results.appointments.length > 0 || results.patientConvs.length > 0;
    }
    if (role === 'doctor') {
      return results.patients.length > 0 || results.medicines.length > 0 || results.appointments.length > 0 || results.doctorThreads.length > 0;
    }
    if (role === 'manager') {
      return results.patients.length > 0 || results.doctors.length > 0 || results.appointments.length > 0 || results.reminders.length > 0;
    }
    return false;
  };

  const handleSearchResultClick = (type, id) => {
    setSearchQuery('');
    setShowDropdown(false);
    if (type === 'disease') {
      if (role !== 'doctor') {
        onSelectId(id);
        onNavigate(role === 'patient' ? 'patient-medical-data' : 'disease-details', id);
      }
    } else if (type === 'medicine') {
      onSelectId(id);
      onNavigate(role === 'doctor' ? 'doctor-medicine-details' : role === 'patient' ? 'patient-medical-data' : 'medicine-details', id);
    } else if (type === 'patient') {
      onSelectId(id);
      onNavigate(role === 'doctor' ? 'doctor-patient-details' : 'patient-details', id);
    } else if (type === 'doctor') {
      if (role === 'manager') {
        onSelectId(id);
        onNavigate('doctor-details', id);
      } else if (role === 'patient') {
        onNavigate('patient-schedule', id);
      }
    } else if (type === 'reminder') {
      if (role === 'manager') {
        onSelectId(id);
        onNavigate('reminder-details', id);
      }
    } else if (type === 'appointment') {
      if (role === 'manager') {
        onSelectId(id);
        onNavigate('appointment-calendar', id);
      } else if (role === 'doctor') {
        onNavigate('doctor-schedule', id);
      } else if (role === 'patient') {
        onNavigate('patient-schedule', id);
      }
    } else if (type === 'scenario') {
      onSelectId(id);
      onNavigate('chatbot-scenarios', id);
    } else if (type === 'evaluation') {
      onSelectId(id);
      onNavigate('ai-evaluation-analysis', id);
    } else if (type === 'doctor-thread') {
      onSelectId(id);
      onNavigate('doctor-messages', id);
    } else if (type === 'patient-conv') {
      onSelectId(id);
      onNavigate('patient-consultation-keep', id);
    }
  };

  return (
    <header className="navbar">
      {/* Clickable Breadcrumbs */}
      <div className="navbar-breadcrumbs">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span style={{ margin: '0 6px' }}>/</span>}
              {isLast ? (
                <span className="active-crumb">{crumb.text}</span>
              ) : (
                <a
                  className="breadcrumb-link"
                  onClick={() => onNavigate(crumb.view)}
                >
                  {crumb.text}
                </a>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right Navbar elements */}
      <div className="navbar-right">
        {/* Global Search */}
        <div className="navbar-search" ref={dropdownRef}>
          <Search size={16} className="navbar-search-icon" />
          <input
            type="text"
            placeholder={
              role === 'expert' 
                ? "Tìm bệnh, thuốc..." 
                : role === 'manager' 
                ? "Tìm bệnh nhân, bác sĩ, lịch hẹn..." 
                : role === 'patient'
                ? "Tìm dịch bệnh, bác sĩ, lịch hẹn..."
                : "Tìm bệnh nhân, thuốc..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {/* Search Dropdown Panel */}
          {showDropdown && searchQuery.trim() && (
            <div className="search-results-dropdown">
              {role === 'expert' && (
                <>
                  {/* Diseases section */}
                  {results.diseases.length > 0 && (
                    <>
                      <div className="search-results-section">Bệnh ({results.diseases.length})</div>
                      {results.diseases.map(d => (
                        <div
                          key={d.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('disease', d.id)}
                        >
                          <span>{d.name}</span>
                          <span className="search-results-type-badge"><Activity size={10} style={{ marginRight: '2px' }} /> Bệnh</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Medicines section */}
                  {results.medicines.length > 0 && (
                    <>
                      <div className="search-results-section">Thuốc ({results.medicines.length})</div>
                      {results.medicines.map(m => (
                        <div
                          key={m.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('medicine', m.id)}
                        >
                          <span>{m.name}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Pill size={10} style={{ marginRight: '2px' }} /> Thuốc</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Scenarios section */}
                  {results.scenarios.length > 0 && (
                    <>
                      <div className="search-results-section">Kịch bản Chatbot ({results.scenarios.length})</div>
                      {results.scenarios.map(s => (
                        <div
                          key={s.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('scenario', s.id)}
                        >
                          <span>{s.name}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}><Bot size={10} style={{ marginRight: '2px' }} /> Kịch bản</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* AI Evaluations section */}
                  {results.evaluations.length > 0 && (
                    <>
                      <div className="search-results-section">Đánh giá & Kiểm duyệt AI ({results.evaluations.length})</div>
                      {results.evaluations.map(c => (
                        <div
                          key={c.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('evaluation', c.id)}
                        >
                          <span>{c.name} - {c.topic}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}><ShieldAlert size={10} style={{ marginRight: '2px' }} /> AI</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {role === 'patient' && (
                <>
                  {/* Diseases section */}
                  {results.diseases.length > 0 && (
                    <>
                      <div className="search-results-section">Bệnh ({results.diseases.length})</div>
                      {results.diseases.map(d => (
                        <div
                          key={d.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('disease', d.id)}
                        >
                          <span>{d.name}</span>
                          <span className="search-results-type-badge"><Activity size={10} style={{ marginRight: '2px' }} /> Bệnh</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Medicines section */}
                  {results.medicines.length > 0 && (
                    <>
                      <div className="search-results-section">Thuốc ({results.medicines.length})</div>
                      {results.medicines.map(m => (
                        <div
                          key={m.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('medicine', m.id)}
                        >
                          <span>{m.name}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Pill size={10} style={{ marginRight: '2px' }} /> Thuốc</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Doctors section */}
                  {results.doctors.length > 0 && (
                    <>
                      <div className="search-results-section">Bác sĩ ({results.doctors.length})</div>
                      {results.doctors.map(doc => (
                        <div
                          key={doc.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('doctor', doc.id)}
                        >
                          <span>{doc.name} - {doc.specialty}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}><Stethoscope size={10} style={{ marginRight: '2px' }} /> Bác sĩ</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Appointments section */}
                  {results.appointments.length > 0 && (
                    <>
                      <div className="search-results-section">Lịch hẹn ({results.appointments.length})</div>
                      {results.appointments.map(apt => (
                        <div
                          key={apt.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('appointment', apt.id)}
                        >
                          <span>{apt.patientName} - {apt.doctorName} ({apt.time})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><Clock size={10} style={{ marginRight: '2px' }} /> Lịch</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Consultation history section */}
                  {results.patientConvs.length > 0 && (
                    <>
                      <div className="search-results-section">Tư vấn y tế ({results.patientConvs.length})</div>
                      {results.patientConvs.map(c => (
                        <div
                          key={c.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('patient-conv', c.id)}
                        >
                          <span>{c.topic} ({c.date})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#e2f5ff', color: '#0284c7' }}><MessageCircle size={10} style={{ marginRight: '2px' }} /> Tư vấn</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {role === 'doctor' && (
                <>
                  {/* Patients section */}
                  {results.patients.length > 0 && (
                    <>
                      <div className="search-results-section">Bệnh nhân ({results.patients.length})</div>
                      {results.patients.map(p => (
                        <div
                          key={p.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('patient', p.id)}
                        >
                          <span>{p.name} ({p.id})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}><User size={10} style={{ marginRight: '2px' }} /> Hồ sơ</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Medicines section */}
                  {results.medicines.length > 0 && (
                    <>
                      <div className="search-results-section">Thuốc ({results.medicines.length})</div>
                      {results.medicines.map(m => (
                        <div
                          key={m.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('medicine', m.id)}
                        >
                          <span>{m.name}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Pill size={10} style={{ marginRight: '2px' }} /> Thuốc</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Appointments section */}
                  {results.appointments.length > 0 && (
                    <>
                      <div className="search-results-section">Lịch hẹn ({results.appointments.length})</div>
                      {results.appointments.map(apt => (
                        <div
                          key={apt.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('appointment', apt.id)}
                        >
                          <span>{apt.patientName} - {apt.doctorName} ({apt.time})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><Clock size={10} style={{ marginRight: '2px' }} /> Lịch</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Doctor threads section */}
                  {results.doctorThreads.length > 0 && (
                    <>
                      <div className="search-results-section">Tin nhắn ({results.doctorThreads.length})</div>
                      {results.doctorThreads.map(t => (
                        <div
                          key={t.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('doctor-thread', t.id)}
                        >
                          <span>{t.name} - {t.lastMsg}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}><MessageCircle size={10} style={{ marginRight: '2px' }} /> Tin nhắn</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {role === 'manager' && (
                <>
                  {/* Patients section */}
                  {results.patients.length > 0 && (
                    <>
                      <div className="search-results-section">Bệnh nhân ({results.patients.length})</div>
                      {results.patients.map(p => (
                        <div
                          key={p.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('patient', p.id)}
                        >
                          <span>{p.name} ({p.id})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}><User size={10} style={{ marginRight: '2px' }} /> Hồ sơ</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Doctors section */}
                  {results.doctors.length > 0 && (
                    <>
                      <div className="search-results-section">Bác sĩ ({results.doctors.length})</div>
                      {results.doctors.map(doc => (
                        <div
                          key={doc.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('doctor', doc.id)}
                        >
                          <span>{doc.name} - {doc.specialty}</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#f0fdf4', color: '#15803d' }}><Stethoscope size={10} style={{ marginRight: '2px' }} /> Bác sĩ</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Appointments section */}
                  {results.appointments.length > 0 && (
                    <>
                      <div className="search-results-section">Lịch hẹn ({results.appointments.length})</div>
                      {results.appointments.map(apt => (
                        <div
                          key={apt.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('appointment', apt.id)}
                        >
                          <span>{apt.patientName} - {apt.doctorName} ({apt.time})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8' }}><Clock size={10} style={{ marginRight: '2px' }} /> Lịch</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Reminders section */}
                  {results.reminders.length > 0 && (
                    <>
                      <div className="search-results-section">Nhắc lịch ({results.reminders.length})</div>
                      {results.reminders.map(r => (
                        <div
                          key={r.id}
                          className="search-results-item"
                          onClick={() => handleSearchResultClick('reminder', r.id)}
                        >
                          <span>{r.title} ({r.channel})</span>
                          <span className="search-results-type-badge" style={{ backgroundColor: '#fffbeb', color: '#b45309' }}><BellRing size={10} style={{ marginRight: '2px' }} /> Nhắc</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}

              {!hasDisplayedResults() && (
                <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Không tìm thấy kết quả phù hợp
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bell */}
        <div ref={notificationRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button 
            className="navbar-bell"
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ border: 'none', cursor: 'pointer', outline: 'none', padding: 0 }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '1.5px solid #fff'
              }} />
            )}
          </button>

          {showNotifications && (
            <div className="card animate-fade-in" style={{
              position: 'absolute',
              top: '40px',
              right: '-10px',
              width: '320px',
              maxHeight: '400px',
              overflowY: 'auto',
              backgroundColor: '#fff',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '12px 0',
              zIndex: 999999,
              margin: 0
            }}>
              <style>{`
                .notification-item {
                  padding: 12px 16px;
                  border-bottom: 1px solid #f1f5f9;
                  cursor: pointer;
                  transition: background-color 0.2s;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                }
                .notification-item.unread {
                  background-color: #f0f7ff;
                }
                .notification-item.unread:hover {
                  background-color: #e0f2fe;
                }
                .notification-item.read {
                  background-color: transparent;
                }
                .notification-item.read:hover {
                  background-color: #f8fafc;
                }
              `}</style>
              
              <div style={{ padding: '0 16px 8px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>Thông báo</strong>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      setNotificationsList(prev => ({
                        ...prev,
                        [role]: prev[role].map(item => ({ ...item, read: true }))
                      }));
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {currentNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`notification-item ${n.read ? 'read' : 'unread'}`}
                  >
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: n.read ? '400' : '600',
                      color: 'var(--text-dark)',
                      lineHeight: '1.4',
                      textAlign: 'left'
                    }}>
                      {n.text}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'left' }}>
                      {n.time}
                    </span>
                  </div>
                ))}

                {currentNotifications.length === 0 && (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Không có thông báo nào mới
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="navbar-profile-pill" style={{ cursor: 'pointer' }} onClick={() => onNavigate('profile')}>
          <div className="profile-pill-text">
            <div className="profile-pill-name">
              {role === 'expert' 
                ? 'Mai Thùy Linh' 
                : role === 'manager' 
                ? 'Nguyễn Nhật Linh' 
                : role === 'patient'
                ? 'Lương Hương Giang'
                : 'Dương Gia Huy'}
            </div>
            <div className="profile-pill-role">
              {role === 'expert' 
                ? 'Chuyên gia' 
                : role === 'manager' 
                ? 'Quản lý' 
                : role === 'patient'
                ? 'Người dùng'
                : 'Bác sĩ'}
            </div>
          </div>
          <div className="profile-pill-avatar">
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
        </div>
      </div>
    </header>
  );
}
