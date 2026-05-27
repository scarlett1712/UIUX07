import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, ArrowLeft, Camera, Undo2, Calendar, Clock, User, Check, X, Star } from 'lucide-react';

export default function ClinicManagement({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  appointments,
  setAppointments,
  patients,
  setPatients,
  doctors,
  feedbacks,
  setFeedbacks,
  triggerToast,
  showConfirm
}) {
  // --- SUB TAB STATES for clinic info ---
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'feedback'

  // --- FILTER STATES ---
  // Appointment Calendar filters
  const [selectedDept, setSelectedDept] = useState('Tất cả chuyên khoa');
  const [checkedDoctors, setCheckedDoctors] = useState({
    'Bs. Huy': true,
    'Bs. B': true,
    'Bs. C': true
  });

  // Patient database filters
  const [patientSearch, setPatientSearch] = useState('');
  const [patientGender, setPatientGender] = useState('');

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset page on tab/view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentView, activeTab, patientSearch, patientGender]);

  // Sync tab state when currentView changes (for deep links like notifications)
  useEffect(() => {
    if (currentView === 'clinic-feedback') {
      setActiveTab('feedback');
    } else if (currentView === 'clinic-info') {
      setActiveTab('info');
    }
  }, [currentView]);

  // --- FORM DATA & MODIFICATION STATE ---
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  // Clinic Info Edit State
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Phòng khám Đa khoa MediConsult',
    address: '123 Đường Thành Công, Ba Đình, Hà Nội',
    hotline: '1900 6039',
    specialties: ['Nội tổng quát', 'Nhi khoa', 'Tai mũi họng', 'Tim mạch', 'Hô hấp', 'Nội tiết', 'Truyền nhiễm', 'Ngoại tổng quát'],
    equipments: ['Máy siêu âm 4D', 'Máy chụp X-quang kỹ thuật số', 'Thiết bị xét nghiệm sinh hóa tự động', 'Máy đo điện tim ECG']
  });
  const [originalClinicInfo, setOriginalClinicInfo] = useState(JSON.parse(JSON.stringify(clinicInfo)));
  const [isEditingClinic, setIsEditingClinic] = useState(false);

  const [feedbackReplyText, setFeedbackReplyText] = useState({});

  // Active Popup Modal state
  const [activeAptPopup, setActiveAptPopup] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize forms when view changes
  useEffect(() => {
    if (currentView === 'appointment-add') {
      setOriginalData(null);
      setFormData({
        id: `APT${Date.now()}`,
        patientName: '',
        patientId: '',
        doctorName: 'Bs. Huy',
        date: '2026-05-15',
        time: '08:00 - 09:00',
        specialty: 'Ngoại tổng quát',
        status: 'Đang xử lý',
        symptoms: ''
      });
    } else if (currentView === 'appointment-edit') {
      const item = appointments.find(a => a.id === selectedId);
      if (item) {
        setFormData(JSON.parse(JSON.stringify(item)));
        setOriginalData(JSON.parse(JSON.stringify(item)));
      }
    } else if (currentView === 'patient-add') {
      setOriginalData(null);
      setFormData({
        id: `P${Date.now().toString().slice(-4)}`,
        name: '',
        dob: '1990-01-01',
        gender: 'Nam',
        phone: '',
        email: '',
        address: '',
        insurance: '',
        medicalHistory: []
      });
    } else if (currentView === 'patient-edit') {
      const item = patients.find(p => p.id === selectedId);
      if (item) {
        // Convert dob from DD-MM-YYYY to YYYY-MM-DD for standard html date input
        const cloned = JSON.parse(JSON.stringify(item));
        if (cloned.dob && cloned.dob.includes('-')) {
          const parts = cloned.dob.split('-');
          if (parts.length === 3 && parts[0].length === 2) {
            cloned.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        setFormData(cloned);
        setOriginalData(JSON.parse(JSON.stringify(cloned)));
      }
    }
  }, [currentView, selectedId, appointments, patients]);

  // Form field modification check
  const isFieldModified = (fieldName) => {
    if (!originalData) return false;
    return formData[fieldName] !== originalData[fieldName];
  };

  const isClinicFieldModified = (fieldName) => {
    return clinicInfo[fieldName] !== originalClinicInfo[fieldName];
  };

  // --- SAVE & DELETE HANDLERS ---
  const handleSaveClinicInfo = () => {
    setOriginalClinicInfo(JSON.parse(JSON.stringify(clinicInfo)));
    setIsEditingClinic(false);
    triggerToast('Cập nhật thông tin phòng khám thành công', 'success');
  };

  const handleSaveFeedbackReply = (id) => {
    const reply = feedbackReplyText[id] || '';
    if (!reply.trim()) {
      triggerToast('Nội dung phản hồi không được để trống', 'error');
      return;
    }
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, response: reply } : f));
    setFeedbackReplyText({ ...feedbackReplyText, [id]: '' });
    triggerToast('Đã gửi phản hồi thành công!', 'success');
  };

  const handleSaveAppointment = () => {
    if (!formData.patientName.trim()) {
      triggerToast('Tên bệnh nhân không được để trống', 'error');
      return;
    }
    if (currentView === 'appointment-add') {
      setAppointments([formData, ...appointments]);
      triggerToast('Thêm lịch hẹn mới thành công', 'success');
    } else {
      setAppointments(appointments.map(a => a.id === formData.id ? formData : a));
      triggerToast('Cập nhật lịch hẹn thành công', 'success');
    }
    onNavigate('appointment-calendar');
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Đã hủy' } : a));
    setActiveAptPopup(null);
    triggerToast('Đã hủy lịch hẹn khám thành công', 'info');
  };

  const handleSavePatient = () => {
    if (!formData.name.trim()) {
      triggerToast('Tên bệnh nhân không được để trống', 'error');
      return;
    }
    // Convert YYYY-MM-DD back to DD-MM-YYYY before saving to database state
    const savedData = { ...formData };
    if (savedData.dob && savedData.dob.includes('-')) {
      const parts = savedData.dob.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        savedData.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    if (currentView === 'patient-add') {
      setPatients([savedData, ...patients]);
      triggerToast('Đã thêm hồ sơ bệnh nhân mới', 'success');
    } else {
      setPatients(patients.map(p => p.id === savedData.id ? savedData : p));
      triggerToast('Đã cập nhật hồ sơ bệnh nhân', 'success');
    }
    onNavigate('patient-list');
  };

  const handleDeletePatient = (id) => {
    showConfirm('Bạn có chắc muốn xóa hồ sơ bệnh nhân này?', () => {
      setPatients(patients.filter(p => p.id !== id));
      triggerToast('Đã xóa hồ sơ bệnh nhân', 'success');
      onNavigate('patient-list');
    });
  };

  // --- APPOINTMENT CALENDAR GRID SETUP (DYNAMIC BASED ON CURRENT MONTH) ---
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1
  const startDayOffset = (firstDay + 6) % 7; // Monday is index 0
  const calendarCells = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const getAppointmentsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return appointments.filter(a => {
      if (a.date !== dateStr) return false;
      // Filter by Specialty
      if (selectedDept !== 'Tất cả chuyên khoa' && a.specialty !== selectedDept) return false;
      // Filter by Checked Doctors
      if (!checkedDoctors[a.doctorName]) return false;
      return true;
    });
  };

  // --- RENDER SECTIONS ---

  // 1. VIEW CLINIC INFO & REVIEWS
  if (currentView === 'clinic-info' || currentView === 'clinic-feedback') {
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '10px 0',
              fontWeight: activeTab === 'info' ? '700' : '500',
              color: activeTab === 'info' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'info' ? '2px solid var(--primary)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Thông tin phòng khám
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '10px 0',
              fontWeight: activeTab === 'feedback' ? '700' : '500',
              color: activeTab === 'feedback' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'feedback' ? '2px solid var(--primary)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Đánh giá & Phản hồi
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Hồ sơ phòng khám</h3>
              {!isEditingClinic ? (
                <button className="btn btn-outline" onClick={() => setIsEditingClinic(true)}>Chỉnh sửa</button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ color: 'red' }} onClick={() => {
                    setClinicInfo(originalClinicInfo);
                    setIsEditingClinic(false);
                  }}>Hủy</button>
                  <button className="btn btn-primary" onClick={handleSaveClinicInfo}>Lưu thông tin</button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              <div className="text-center" style={{ padding: '20px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--primary)' }}>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
                    <path d="M19 10.5V20H5V4h9v5h5v1.5z M14 2H4v20h16V8l-6-6z" />
                  </svg>
                </div>
                <h4>MediConsult Clinic</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Mã giấy phép: 2026/GPHĐ-BYT</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <span className="form-group-label">Tên phòng khám</span>
                  <input
                    type="text"
                    disabled={!isEditingClinic}
                    value={clinicInfo.name}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                    className={`form-input ${isEditingClinic && isClinicFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
                  />
                </div>

                <div className="form-group">
                  <span className="form-group-label">Địa chỉ</span>
                  <input
                    type="text"
                    disabled={!isEditingClinic}
                    value={clinicInfo.address}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                    className={`form-input ${isEditingClinic && isClinicFieldModified('address') ? 'input-modified' : 'input-unmodified'}`}
                  />
                </div>

                <div className="form-group">
                  <span className="form-group-label">Hotline hỗ trợ</span>
                  <input
                    type="text"
                    disabled={!isEditingClinic}
                    value={clinicInfo.hotline}
                    onChange={(e) => setClinicInfo({ ...clinicInfo, hotline: e.target.value })}
                    className={`form-input ${isEditingClinic && isClinicFieldModified('hotline') ? 'input-modified' : 'input-unmodified'}`}
                  />
                </div>

                <div className="form-group">
                  <span className="form-group-label">Chuyên khoa hoạt động</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {clinicInfo.specialties.map((s, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', backgroundColor: '#e2e8f0', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-group-label">Trang thiết bị nổi bật</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {clinicInfo.equipments.map((eq, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500 }}>
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(100vh - var(--header-height) - 220px)', overflowY: 'auto', paddingRight: '4px' }}>
              {feedbacks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((f) => (
                <div key={f.id} style={{ padding: '14px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600 }}>{f.name}</span>
                      <span style={{ display: 'inline-flex', color: '#eab308' }}>
                        {Array.from({ length: f.rating }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        {Array.from({ length: 5 - f.rating }).map((_, i) => <Star key={i} size={14} />)}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.date}</span>
                  </div>
                  
                  <p style={{ margin: '0 0 12px 0', color: 'var(--text-dark)' }}>{f.comment}</p>
                  
                  {f.response ? (
                    <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid var(--primary-light)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '4px', color: 'var(--primary)' }}>Phòng khám phản hồi:</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>{f.response}</div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <input
                        type="text"
                        placeholder="Nhập nội dung phản hồi đánh giá này..."
                        value={feedbackReplyText[f.id] || ''}
                        onChange={(e) => setFeedbackReplyText({ ...feedbackReplyText, [f.id]: e.target.value })}
                        style={{ flexGrow: 1, padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}
                      />
                      <button className="btn btn-primary" style={{ padding: '6px 12px' }} onClick={() => handleSaveFeedbackReply(f.id)}>
                        Gửi phản hồi
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Bar */}
            <div className="list-pagination-bar">
              <span>
                Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, feedbacks.length)}-
                {Math.min(currentPage * itemsPerPage, feedbacks.length)} trong tổng số {feedbacks.length}
              </span>
              <div className="pagination-nav-group">
                <button
                  className="pagination-nav-btn"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                <button
                  className="pagination-nav-btn"
                  onClick={() => setCurrentPage(Math.min(Math.ceil(feedbacks.length / itemsPerPage) || 1, currentPage + 1))}
                  disabled={currentPage === (Math.ceil(feedbacks.length / itemsPerPage) || 1)}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. VIEW APPOINTMENT CALENDAR GRID
  if (currentView === 'appointment-calendar') {
    return (
      <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', height: 'calc(100vh - var(--header-height) - 100px)' }}>
        {/* Left filter bar */}
        <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '14px', height: 'fit-content' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>CHUYÊN KHOA</h4>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
            >
              <option value="Tất cả chuyên khoa">Tất cả chuyên khoa</option>
              <option value="Ngoại tổng quát">Ngoại tổng quát</option>
              <option value="Nhi khoa">Nhi khoa</option>
              <option value="Tai mũi họng">Tai mũi họng</option>
            </select>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>BÁC SĨ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.keys(checkedDoctors).map((docName) => (
                <label key={docName} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkedDoctors[docName]}
                    onChange={(e) => setCheckedDoctors({ ...checkedDoctors, [docName]: e.target.checked })}
                  />
                  <span>{docName}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right calendar view */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Lịch hẹn tổng</h2>
              <button className="plus-btn-circle" onClick={() => onNavigate('appointment-add')}>
                <Plus size={14} />
              </button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontWeight: '600' }}>&lt; Tháng {currentMonth + 1}, {currentYear} &gt;</span>
              <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <button className="btn btn-outline" style={{ padding: '4px 8px', border: 'none', fontSize: '0.75rem' }}>Ngày</button>
                <button className="btn btn-outline" style={{ padding: '4px 8px', border: 'none', fontSize: '0.75rem' }}>Tuần</button>
                <button className="btn btn-primary" style={{ padding: '4px 8px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}>Tháng</button>
              </div>
            </div>
          </div>

          {/* Calendar Table Grid */}
          <div style={{ flexGrow: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'center', fontWeight: '600', fontSize: '0.75rem', padding: '6px 0', color: 'var(--text-muted)' }}>
              <div>MON</div>
              <div>TUE</div>
              <div>WED</div>
              <div>THU</div>
              <div>FRI</div>
              <div>SAT</div>
              <div>SUN</div>
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(60px, 1fr)', flexGrow: 1, backgroundColor: '#f1f5f9', gap: '1px' }}>
              {calendarCells.map((day, idx) => {
                const dayApts = getAppointmentsForDay(day);
                const isToday = day === today.getDate() && currentYear === today.getFullYear() && currentMonth === today.getMonth();
                return (
                  <div key={idx} style={{ backgroundColor: '#fff', padding: '4px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {day && (
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: isToday ? '700' : '500',
                        color: isToday ? 'var(--white)' : 'var(--text-muted)',
                        backgroundColor: isToday ? 'var(--primary-light)' : 'transparent',
                        width: isToday ? '18px' : 'auto',
                        height: isToday ? '18px' : 'auto',
                        borderRadius: isToday ? '50%' : 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '2px'
                      }}>
                        {day}
                      </span>
                    )}

                    {dayApts.map((apt) => {
                      // Color based on specialty or doctor
                      let color = '#3b82f6';
                      let bg = '#eff6ff';
                      if (apt.specialty === 'Nhi khoa') {
                        color = '#3b82f6';
                        bg = '#eff6ff';
                      } else if (apt.specialty === 'Tai mũi họng' || apt.specialty === 'Tai Mũi Họng') {
                        color = '#10b981';
                        bg = '#ecfdf5';
                      }
                      
                      if (apt.status === 'Đã hủy') {
                        color = '#ef4444';
                        bg = '#fee2e2';
                      }

                      return (
                        <div
                          key={apt.id}
                          onClick={() => setActiveAptPopup(apt)}
                          style={{
                            padding: '3px 6px',
                            borderRadius: '4px',
                            backgroundColor: bg,
                            color: color,
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            borderLeft: `3px solid ${color}`,
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <div>{apt.patientName}</div>
                          <div style={{ opacity: 0.8, fontSize: '0.65rem' }}>{apt.time}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive detail popup */}
          {activeAptPopup && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
              <div className="card animate-fade-in" style={{ padding: '20px', width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>Chi tiết lịch hẹn</h3>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setActiveAptPopup(null)}>
                    <X size={16} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div><strong>Bệnh nhân:</strong> {activeAptPopup.patientName}</div>
                  <div><strong>Mã lịch:</strong> {activeAptPopup.id}</div>
                  <div><strong>Chuyên khoa:</strong> {activeAptPopup.specialty}</div>
                  <div><strong>Bác sĩ phụ trách:</strong> {activeAptPopup.doctorName}</div>
                  <div><strong>Thời gian:</strong> {activeAptPopup.time}</div>
                  <div><strong>Ngày khám:</strong> {activeAptPopup.date}</div>
                  {activeAptPopup.symptoms && <div><strong>Triệu chứng:</strong> {activeAptPopup.symptoms}</div>}
                  <div>
                    <strong>Trạng thái:</strong>{' '}
                    <span className={`badge ${activeAptPopup.status === 'Đã xác nhận' ? 'badge-low' : activeAptPopup.status === 'Đang xử lý' ? 'badge-medium' : 'badge-high'}`}>
                      {activeAptPopup.status}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  {activeAptPopup.status !== 'Đã hủy' && (
                    <button className="btn btn-outline" style={{ flexGrow: 1, color: 'red' }} onClick={() => handleCancelAppointment(activeAptPopup.id)}>
                      Hủy lịch
                    </button>
                  )}
                  <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => {
                    onSelectId(activeAptPopup.id);
                    setActiveAptPopup(null);
                    onNavigate('appointment-edit');
                  }}>
                    Chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. EDIT/ADD APPOINTMENT VIEW
  if (currentView === 'appointment-edit' || currentView === 'appointment-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('appointment-calendar')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {currentView === 'appointment-add' ? 'Thêm lịch hẹn mới' : 'Chỉnh sửa lịch hẹn'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group" style={{ position: 'relative' }}>
            <span className="form-group-label">Tên bệnh nhân</span>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ ...formData, patientName: val });
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Nhập tên bệnh nhân..."
              className={`form-input ${isFieldModified('patientName') ? 'input-modified' : 'input-unmodified'}`}
            />
            {showSuggestions && formData.patientName.trim() && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                zIndex: 10,
                boxShadow: 'var(--shadow-md)',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {patients
                  .filter(p => p.name.toLowerCase().includes(formData.patientName.toLowerCase()))
                  .map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          patientName: p.name,
                          patientId: p.id
                        });
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        fontSize: '0.85rem',
                        color: 'var(--text-dark)'
                      }}
                      onMouseDown={(e) => e.preventDefault()} // prevent focus loss before click
                    >
                      <strong>{p.name}</strong> - Mã: {p.id} ({p.phone})
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <span className="form-group-label">Mã bệnh nhân</span>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              placeholder="VD: P001"
              className={`form-input ${isFieldModified('patientId') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Bác sĩ khám</span>
            <select
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              className={`form-select ${isFieldModified('doctorName') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Bs. Huy">Bs. Huy</option>
              <option value="Bs. B">Bs. B</option>
              <option value="Bs. C">Bs. C</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Chuyên khoa</span>
            <select
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className={`form-select ${isFieldModified('specialty') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Ngoại tổng quát">Ngoại tổng quát</option>
              <option value="Nhi khoa">Nhi khoa</option>
              <option value="Tai mũi họng">Tai mũi họng</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Ngày khám</span>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`form-input ${isFieldModified('date') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Giờ khám</span>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="Ví dụ: 08:00 - 09:00"
              className={`form-input ${isFieldModified('time') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Triệu chứng khai báo</span>
            <input
              type="text"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="Nhập triệu chứng của bệnh nhân..."
              className={`form-input ${isFieldModified('symptoms') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Trạng thái</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`form-select ${isFieldModified('status') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Đang xử lý">Đang xử lý</option>
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đã khám">Đã khám</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="form-action-buttons" style={{ marginTop: '20px' }}>
          <button className="btn btn-cancel" onClick={() => onNavigate('appointment-calendar')}>Hủy</button>
          <button className="btn btn-save" onClick={handleSaveAppointment}>Lưu lịch hẹn</button>
        </div>
      </div>
    );
  }

  // 4. VIEW PATIENTS DATABASE LIST
  if (currentView === 'patient-list') {
    const filteredPatients = patients.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.phone.includes(patientSearch) || p.id.toLowerCase().includes(patientSearch.toLowerCase());
      const matchGender = patientGender ? p.gender === patientGender : true;
      return matchSearch && matchGender;
    });

    const totalPatients = filteredPatients.length;
    const totalPatientPages = Math.ceil(totalPatients / itemsPerPage) || 1;
    const patientStartIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = filteredPatients.slice(patientStartIndex, patientStartIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <div className="flex align-center gap-4" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Danh sách bệnh nhân</h2>
          <button className="plus-btn-circle" onClick={() => onNavigate('patient-add')}>
            <Plus size={14} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="form-input"
              style={{ width: '200px', padding: '4px 8px' }}
            />
          </div>

          <div className="filter-group">
            <Filter size={14} />
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="filter-select"
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <button
              onClick={() => {
                setPatientSearch('');
                setPatientGender('');
              }}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
            >
              <Undo2 size={12} /> Hủy
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Mã BN</th>
                <th>Họ tên</th>
                <th style={{ width: '100px' }}>Ngày sinh</th>
                <th style={{ width: '80px' }}>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th style={{ width: '120px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => {
                  onSelectId(p.id);
                  onNavigate('patient-details');
                }}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.dob}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '4px' }} onClick={() => {
                        onSelectId(p.id);
                        onNavigate('patient-edit');
                      }}>
                        <Edit3 size={12} />
                      </button>
                      <button className="btn btn-outline" style={{ padding: '4px', color: 'red' }} onClick={() => handleDeletePatient(p.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="list-pagination-bar">
          <span>
            Hiển thị {Math.min(patientStartIndex + 1, totalPatients)}-
            {Math.min(patientStartIndex + paginatedPatients.length, totalPatients)} trong tổng số {totalPatients}
          </span>
          <div className="pagination-nav-group">
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            <button
              className="pagination-nav-btn"
              onClick={() => setCurrentPage(Math.min(totalPatientPages, currentPage + 1))}
              disabled={currentPage === totalPatientPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. VIEW PATIENT DETAILS & MEDICAL RECORD
  if (currentView === 'patient-details') {
    const item = patients.find(p => p.id === selectedId);
    if (!item) return <div>Không tìm thấy hồ sơ bệnh nhân</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('patient-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Hồ sơ chi tiết bệnh nhân</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 1fr', gap: '20px', marginTop: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', alignItems: 'center' }}>
          {/* Avatar placeholder */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '16px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', marginBottom: '8px' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'block', wordBreak: 'break-word', lineHeight: '1.2' }}>{item.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Mã: {item.id}</span>
          </div>

          {/* Col 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Ngày sinh:</strong> <span style={{ color: 'var(--text-muted)' }}>{item.dob}</span>
            </div>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Email:</strong> <span style={{ color: 'var(--text-muted)', wordBreak: 'break-all' }}>{item.email || 'Chưa cập nhật'}</span>
            </div>
          </div>

          {/* Col 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Giới tính:</strong> <span style={{ color: 'var(--text-muted)' }}>{item.gender}</span>
            </div>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Bảo hiểm y tế:</strong> <span style={{ color: 'var(--text-muted)' }}>{item.insurance || 'Không có BHYT'}</span>
            </div>
          </div>

          {/* Col 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Số điện thoại:</strong> <span style={{ color: 'var(--text-muted)' }}>{item.phone}</span>
            </div>
            <div style={{ fontSize: '0.88rem' }}>
              <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Địa chỉ:</strong> <span style={{ color: 'var(--text-muted)' }}>{item.address || 'Chưa cập nhật'}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '10px' }}>Lịch sử khám chữa bệnh</h3>
          <div className="custom-table-container" style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>Ngày khám</th>
                  <th>Chẩn đoán lâm sàng</th>
                  <th style={{ width: '150px' }}>Bác sĩ phụ trách</th>
                  <th>Phác đồ / Đơn thuốc kê</th>
                </tr>
              </thead>
              <tbody>
                {item.medicalHistory && item.medicalHistory.length > 0 ? (
                  item.medicalHistory.map((history, idx) => (
                    <tr key={idx}>
                      <td>{history.date}</td>
                      <td style={{ fontWeight: 600 }}>{history.diagnosis}</td>
                      <td>{history.doctor}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{history.treatment}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center" style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      Không có lịch sử khám bệnh trước đó.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('patient-edit')}><Edit3 size={14} /> Sửa hồ sơ</button>
          <button className="btn btn-outline" style={{ color: 'red' }} onClick={() => handleDeletePatient(item.id)}><Trash2 size={14} /> Xóa hồ sơ</button>
        </div>
      </div>
    );
  }

  // 6. EDIT/ADD PATIENT VIEW
  if (currentView === 'patient-edit' || currentView === 'patient-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('patient-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {currentView === 'patient-add' ? 'Thêm hồ sơ bệnh nhân mới' : 'Chỉnh sửa hồ sơ bệnh nhân'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group">
            <span className="form-group-label">Họ và tên</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nhập họ và tên bệnh nhân..."
              className={`form-input ${isFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Ngày sinh</span>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className={`form-input ${isFieldModified('dob') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Giới tính</span>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className={`form-select ${isFieldModified('gender') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Số điện thoại</span>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Nhập số điện thoại..."
              className={`form-input ${isFieldModified('phone') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Email</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Nhập địa chỉ email..."
              className={`form-input ${isFieldModified('email') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Số thẻ BHYT</span>
            <input
              type="text"
              value={formData.insurance}
              onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
              placeholder="VD: DN401..."
              className={`form-input ${isFieldModified('insurance') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Địa chỉ</span>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Địa chỉ liên hệ..."
              className={`form-input ${isFieldModified('address') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>
        </div>

        <div className="form-action-buttons" style={{ marginTop: '20px' }}>
          <button className="btn btn-cancel" onClick={() => onNavigate('patient-list')}>Hủy</button>
          <button className="btn btn-save" onClick={handleSavePatient}>Lưu hồ sơ</button>
        </div>
      </div>
    );
  }

  return null;
}
