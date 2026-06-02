import React, { useState } from 'react';
import { formatDate } from '../utils/date';
import { Calendar, User, MapPin, Clock, DollarSign, ChevronRight, CheckCircle, Trash2, ArrowLeft, Search, Filter, Stethoscope, Sparkles } from 'lucide-react';

const MOCK_DOCTORS = [
  { id: 'DOC001', name: 'BS. Nguyễn Văn A', specialty: 'Khoa Nội tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '350.000', location: 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội', biography: 'Hơn 15 năm kinh nghiệm điều trị các bệnh nội khoa, từng là Phó trưởng khoa tại BV Bạch Mai.' },
  { id: 'DOC002', name: 'BS. Nguyễn Văn B', specialty: 'Khoa Nội tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '350.000', location: 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội', biography: 'Hơn 10 năm kinh nghiệm khám chữa bệnh nội tổng quát, chuyên điều trị cúm, sốt và bệnh đường hô hấp.' },
  { id: 'DOC003', name: 'Bs. Huy', specialty: 'Khoa Ngoại tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '300.000', location: 'Tầng 2, Tòa nhà B, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội', biography: 'Chuyên gia ngoại tiêu hóa, nội soi dạ dày, đại tràng và điều trị viêm dạ dày tá tràng.' },
  { id: 'DOC004', name: 'Bs. B (Bình)', specialty: 'Khoa Nhi', degree: 'Bác sĩ CK I', fee: '250.000', location: 'Tầng 3, Tòa nhà B, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội', biography: 'Bác sĩ Nhi khoa tận tâm, giàu kinh nghiệm khám và tư vấn các bệnh lý trẻ em.' },
  { id: 'DOC005', name: 'Bs. C (Cúc)', specialty: 'Khoa Tai mũi họng', degree: 'Bác sĩ CK II', fee: '300.000', location: 'Tầng 4, Tòa nhà A, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội', biography: 'Hơn 12 năm kinh nghiệm điều trị viêm tai giữa, viêm họng, viêm mũi xoang trẻ em và người lớn.' }
];

const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00'
];

export default function PatientSchedule({ 
  appointments = [], 
  setAppointments, 
  triggerToast, 
  defaultTab, 
  onBookSuccess, 
  onNavigate,
  patientConversations = [],
  activePatientConvId,
  showConfirm
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || 'booked'); // 'booked' or 'create'
  
  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const [selectedAptId, setSelectedAptId] = useState(null);

  // Search & Filter state for Doctor Selection
  const [doctorSearch, setDoctorSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');

  // Auto-fill symptoms if booking from chat
  React.useEffect(() => {
    if (defaultTab === 'create') {
      const activeConv = patientConversations.find(c => c.id === activePatientConvId);
      if (activeConv && activeConv.symptoms && activeConv.symptoms.length > 0) {
        setBookingSymptoms(`Triệu chứng ghi nhận: ${activeConv.symptoms.join(', ')}`);
      } else {
        setBookingSymptoms('');
      }
    }
  }, [defaultTab, patientConversations, activePatientConvId]);

  // Get active appointments for Lương Hương Giang
  const myAppointments = appointments.filter(
    (apt) => apt.patientName === 'Lương Hương Giang' || apt.patientId === 'P004'
  );

  // Default selected appointment
  const currentAptId = selectedAptId || (myAppointments[0] && myAppointments[0].id);
  const selectedApt = myAppointments.find(apt => apt.id === currentAptId) || myAppointments[0];

  const handleCancelAppointment = (id) => {
    showConfirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này?', () => {
      const updated = appointments.map(apt => {
        if (apt.id === id) {
          return { ...apt, status: 'Đã hủy' };
        }
        return apt;
      });
      setAppointments(updated);
      triggerToast('Đã gửi yêu cầu hủy lịch khám thành công', 'info');
    });
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      triggerToast('Vui lòng chọn bác sĩ khám và chuyên khoa!', 'error');
      return;
    }
    if (!bookingDate) {
      triggerToast('Vui lòng chọn ngày hẹn khám!', 'error');
      return;
    }
    if (!bookingTime) {
      triggerToast('Vui lòng chọn khung giờ khám!', 'error');
      return;
    }

    const doctor = MOCK_DOCTORS.find(d => d.id === selectedDoctorId);
    
    // Create new appointment object
    const newApt = {
      id: `APT${Date.now()}`,
      patientName: 'Lương Hương Giang',
      patientId: 'P004',
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: bookingDate,
      time: bookingTime,
      location: doctor.location,
      fee: doctor.fee,
      symptoms: bookingSymptoms || 'Khám sức khỏe tổng quát định kỳ',
      status: 'Chờ xác nhận'
    };

    setAppointments([newApt, ...appointments]);
    triggerToast('Đặt lịch khám thành công! Đang đợi phòng khám xác nhận.', 'success');
    setSelectedAptId(newApt.id);
    setActiveTab('booked');
    
    // Trigger callback to add appointment to chat history
    if (onBookSuccess) {
      onBookSuccess(newApt);
    }

    // Reset booking state
    setSelectedDoctor(null);
    setSelectedDoctorId('');
    setBookingDate('');
    setBookingTime('');
    setBookingSymptoms('');

    // Redirect to consultation chat
    if (onNavigate) {
      onNavigate('patient-consultation-keep');
    }
  };

  // Filter doctors based on search & filter
  const filteredDoctors = MOCK_DOCTORS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || 
                        d.specialty.toLowerCase().includes(doctorSearch.toLowerCase());
    const matchSpecialty = specialtyFilter ? d.specialty === specialtyFilter : true;
    return matchSearch && matchSpecialty;
  });

  const uniqueSpecialties = Array.from(new Set(MOCK_DOCTORS.map(d => d.specialty)));

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Tabs Switcher Header */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', gap: '24px' }}>
        <button
          onClick={() => setActiveTab('booked')}
          style={{
            padding: '12px 8px',
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'booked' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'booked' ? '3px solid var(--primary)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Lịch khám đã đặt
        </button>
        
        <button
          onClick={() => {
            setActiveTab('create');
            setSelectedDoctor(null);
            setSelectedDoctorId('');
          }}
          style={{
            padding: '12px 8px',
            background: 'none',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '600',
            color: activeTab === 'create' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'create' ? '3px solid var(--primary)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Đặt lịch khám mới
        </button>
      </div>

      {/* TAB 1: BOOKED APPOINTMENTS LIST & DETAILS */}
      {activeTab === 'booked' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' }}>
          {/* Left panel: list of appointments */}
          <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
            <h3 style={{ fontSize: '0.95rem', margin: '4px 0', color: 'var(--text-dark)' }}>Danh sách cuộc hẹn</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {myAppointments.map(apt => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAptId(apt.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: currentAptId === apt.id ? 'var(--primary-light)' : 'var(--border-color)',
                    backgroundColor: currentAptId === apt.id ? '#f0f7ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--primary)' }}>{apt.doctorName}</span>
                    <span className="badge" style={{
                      backgroundColor: apt.status === 'Đã xác nhận' ? '#d1fae5' : apt.status === 'Chờ xác nhận' ? '#fef3c7' : '#fee2e2',
                      color: apt.status === 'Đã xác nhận' ? '#065f46' : apt.status === 'Chờ xác nhận' ? '#d97706' : '#dc2626',
                      fontSize: '0.7rem'
                    }}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div><strong>Khoa:</strong> {apt.specialty}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {formatDate(apt.date)} | <Clock size={12} /> {apt.time}
                    </div>
                  </div>
                </div>
              ))}

              {myAppointments.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Bạn chưa đặt lịch hẹn khám nào.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: appointment details */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
            {selectedApt ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary)' }}>Chi tiết lịch hẹn</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mã lịch khám: {selectedApt.id}</span>
                  </div>
                  <span className="badge" style={{
                    backgroundColor: selectedApt.status === 'Đã xác nhận' ? '#d1fae5' : selectedApt.status === 'Chờ xác nhận' ? '#fef3c7' : '#fee2e2',
                    color: selectedApt.status === 'Đã xác nhận' ? '#065f46' : selectedApt.status === 'Chờ xác nhận' ? '#d97706' : '#dc2626',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {selectedApt.status}
                  </span>
                </div>

                {/* Doctor card */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '6px 10px', borderRadius: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffe2e2', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                      <circle cx="50" cy="40" r="20" fill="#2563eb" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>{selectedApt.doctorName}</h4>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedApt.specialty}</div>
                  </div>
                </div>

                {/* Details layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                    <Calendar size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                    <div className="detail-row">
                      <span className="detail-label">Ngày khám bệnh:</span>
                      <span className="detail-value">{formatDate(selectedApt.date)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                    <Clock size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                    <div className="detail-row">
                      <span className="detail-label">Thời gian ca khám:</span>
                      <span className="detail-value">{selectedApt.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                    <MapPin size={16} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                      <span className="detail-label">Địa điểm khám:</span>
                      <span className="detail-value" style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{selectedApt.location || 'Bệnh viện Bạch Mai, Giải Phóng, Hà Nội'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                    <DollarSign size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                    <div className="detail-row">
                      <span className="detail-label">Phí dịch vụ khám:</span>
                      <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: '600' }}>{selectedApt.fee || '350.000'} VND</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms description */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                  <strong style={{ fontSize: '0.82rem', color: 'var(--text-dark)', display: 'block', marginBottom: '4px' }}>Triệu chứng / Lý do khám bệnh:</strong>
                  <div style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: '#f1f5f9', fontSize: '0.82rem', color: 'var(--text-dark)', fontStyle: 'italic', lineHeight: '1.4' }}>
                    {selectedApt.symptoms}
                  </div>
                </div>

                {selectedApt.status === 'Đã từ chối' && selectedApt.reason && (
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#dc2626', display: 'block', marginBottom: '4px' }}>Lý do từ chối khám từ bác sĩ:</strong>
                    <div style={{ padding: '6px 10px', borderRadius: '8px', backgroundColor: '#fff5f5', border: '1px solid #fee2e2', fontSize: '0.82rem', color: '#dc2626', fontWeight: 500, lineHeight: '1.4' }}>
                      {selectedApt.reason}
                    </div>
                  </div>
                )}

                {/* Cancel Button */}
                {selectedApt.status !== 'Đã hủy' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button
                      onClick={() => handleCancelAppointment(selectedApt.id)}
                      className="btn btn-outline-danger"
                      style={{
                        padding: '10px 24px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <Trash2 size={16} /> Hủy lịch khám hẹn
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <span>Vui lòng chọn hoặc đặt lịch khám để xem thông tin</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BOOK A NEW APPOINTMENT */}
      {activeTab === 'create' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {selectedDoctor === null ? (
            /* STEP 1: DOCTOR SEARCH & SELECTION */
            <div className="card animate-fade-in" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: '700' }}>Bước 1: Chọn bác sĩ & Chuyên khoa</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Xem thông tin chi tiết và năng lực bác sĩ trước khi lên lịch đặt</span>
                </div>
              </div>

              {/* Filters toolbar */}
              <div className="filters-bar" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative', flexGrow: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Tìm bác sĩ theo tên hoặc chuyên khoa..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '36px', fontSize: '0.85rem', height: '38px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={16} style={{ color: 'var(--text-muted)' }} />
                  <select
                    value={specialtyFilter}
                    onChange={(e) => setSpecialtyFilter(e.target.value)}
                    className="filter-select"
                    style={{ fontSize: '0.85rem', height: '38px', padding: '6px 12px', minWidth: '180px' }}
                  >
                    <option value="">Tất cả chuyên khoa</option>
                    {uniqueSpecialties.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctors Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '16px', marginTop: '4px' }}>
                {filteredDoctors.map(doc => (
                  <div 
                    key={doc.id}
                    className="card hover-card animate-fade-in"
                    style={{ 
                      padding: '16px', 
                      margin: 0, 
                      border: '1px solid var(--border-color)',
                      backgroundColor: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      justifyContent: 'space-between'
                    }}
                  >
                    {/* Header: avatar + name */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e0e7ff', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 100 100" width="100%" height="100%">
                          <circle cx="50" cy="50" r="50" fill="#e0e7ff" />
                          <circle cx="50" cy="40" r="20" fill="#4f46e5" />
                          <path d="M20,80 C20,60 80,60 80,80" fill="#4f46e5" />
                        </svg>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary)' }}>{doc.name}</h4>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-light)', marginTop: '2px' }}>{doc.degree}</div>
                        <span style={{ 
                          display: 'inline-block', 
                          marginTop: '4px',
                          padding: '2px 8px', 
                          backgroundColor: '#f1f5f9', 
                          color: '#475569', 
                          fontSize: '0.7rem', 
                          borderRadius: '4px',
                          fontWeight: 500
                        }}>
                          {doc.specialty}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p style={{ 
                      fontSize: '0.78rem', 
                      color: 'var(--text-muted)', 
                      margin: 0, 
                      lineHeight: '1.45', 
                      height: '42px', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {doc.biography}
                    </p>

                    {/* Vitals info */}
                    <div style={{ 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px', 
                      padding: '8px 12px', 
                      fontSize: '0.75rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>📍 Địa điểm:</span>
                        <span style={{ fontWeight: 500, color: 'var(--text-dark)', maxWidth: '180px', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.location}>{doc.location.split(',')[0]}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>💰 Chi phí khám:</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{doc.fee} VND</span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setSelectedDoctorId(doc.id);
                        setBookingTime('');
                        setBookingDate('');
                      }}
                      className="btn btn-primary"
                      style={{ 
                        width: '100%', 
                        fontSize: '0.8rem', 
                        padding: '8px', 
                        fontWeight: '700', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Stethoscope size={14} /> Chọn bác sĩ & Đặt lịch
                    </button>
                  </div>
                ))}

                {filteredDoctors.length === 0 && (
                  <div style={{ gridColumn: 'span 3', padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Không tìm thấy bác sĩ nào phù hợp với bộ lọc tìm kiếm của bạn.
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* STEP 2: FILL APPOINTMENT DETAILS (DATE, TIME, SYMPTOMS) */
            <form onSubmit={handleBookAppointment} className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', margin: 0 }}>
              
              {/* Back to Step 1 button */}
              <button 
                type="button" 
                onClick={() => setSelectedDoctor(null)}
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.2s'
                }}
              >
                <ArrowLeft size={16} /> Quay lại chọn bác sĩ khác
              </button>

              <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0 }}>
                Bước 2: Xác nhận thời gian và triệu chứng lâm sàng
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
                
                {/* Left side inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Selected Doctor Summary Preview */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#dbeafe', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 100 100" width="100%" height="100%">
                        <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                        <circle cx="50" cy="40" r="20" fill="#2563eb" />
                        <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                      </svg>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '700', color: 'var(--primary)' }}>{selectedDoctor.name}</h4>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{selectedDoctor.degree} | {selectedDoctor.specialty}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '600', marginTop: '2px' }}>Phí khám: {selectedDoctor.fee} VND</div>
                    </div>
                  </div>

                  {/* Date select */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span className="form-group-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Chọn ngày hẹn khám</span>
                    <input
                      type="date"
                      value={bookingDate}
                      min="2026-05-25"
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', height: '38px', padding: '6px 12px', fontSize: '0.85rem' }}
                    />
                  </div>

                  {/* Time slot select */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span className="form-group-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Chọn khung giờ khám</span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                      {TIME_SLOTS.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBookingTime(t)}
                          style={{
                            padding: '8px 2px',
                            borderRadius: '6px',
                            border: '1.5px solid',
                            borderColor: bookingTime === t ? 'var(--primary)' : 'var(--border-color)',
                            backgroundColor: bookingTime === t ? '#eff6ff' : '#fff',
                            color: bookingTime === t ? 'var(--primary)' : 'var(--text-dark)',
                            fontWeight: bookingTime === t ? '700' : '500',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            textAlign: 'center'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side inputs & review */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Symptoms input */}
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span className="form-group-label" style={{ fontWeight: '600', fontSize: '0.82rem' }}>Mô tả triệu chứng sức khỏe cụ thể</span>
                    <textarea
                      value={bookingSymptoms}
                      onChange={(e) => setBookingSymptoms(e.target.value)}
                      placeholder="Ví dụ: Tôi bị sốt cao kèm đau đầu, rát cổ họng từ ngày hôm qua, người mỏi mệt ăn uống kém..."
                      className="form-input"
                      style={{ width: '100%', height: '90px', padding: '10px 12px', resize: 'none', lineHeight: '1.4', fontSize: '0.82rem' }}
                    />
                  </div>

                  {/* Booking Summary Check sheet */}
                  {bookingDate && bookingTime ? (
                    <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#166534', borderBottom: '1px solid #bbf7d0', paddingBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={12} /> Xem lại chi tiết lịch hẹn đặt
                      </span>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.75rem', color: '#14532d' }}>
                        <div className="detail-row"><span className="detail-label">Bác sĩ khám:</span> <span className="detail-value">{selectedDoctor.name} ({selectedDoctor.specialty})</span></div>
                        <div className="detail-row"><span className="detail-label">Thời gian:</span> <span className="detail-value">{bookingTime} | Ngày {formatDate(bookingDate)}</span></div>
                        <div className="detail-row"><span className="detail-label">Địa điểm:</span> <span className="detail-value" style={{ maxWidth: '240px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={selectedDoctor.location}>{selectedDoctor.location}</span></div>
                        <div className="detail-row"><span className="detail-label">Chi phí dịch vụ:</span> <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: '700' }}>{selectedDoctor.fee} VND</span></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '90px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Vui lòng chọn ngày hẹn khám và khung giờ để hiển thị thông tin xem trước.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(null);
                  }}
                  className="btn btn-outline"
                  style={{ padding: '8px 24px', margin: 0, fontSize: '0.8rem' }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="btn btn-save"
                  style={{ padding: '8px 30px', margin: 0, fontSize: '0.8rem', fontWeight: '700' }}
                >
                  Xác nhận đặt lịch khám
                </button>
              </div>
            </form>
          )}
        </div>
      )}

    </div>
  );
}
