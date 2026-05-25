import React, { useState } from 'react';
import { Calendar, User, MapPin, Clock, DollarSign, ChevronRight, CheckCircle, Trash2, ArrowLeft } from 'lucide-react';

const MOCK_DOCTORS = [
  { id: 'DOC001', name: 'BS. Nguyễn Văn A', specialty: 'Khoa Nội tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '350.000', location: 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội' },
  { id: 'DOC002', name: 'BS. Nguyễn Văn B', specialty: 'Khoa Nội tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '350.000', location: 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội' },
  { id: 'DOC003', name: 'Bs. Huy', specialty: 'Khoa Ngoại tổng quát', degree: 'Thạc sĩ Bác sĩ', fee: '300.000', location: 'Tầng 2, Tòa nhà B, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội' },
  { id: 'DOC004', name: 'Bs. B (Bình)', specialty: 'Khoa Nhi', degree: 'Bác sĩ CK I', fee: '250.000', location: 'Tầng 3, Tòa nhà B, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội' },
  { id: 'DOC005', name: 'Bs. C (Cúc)', specialty: 'Khoa Tai mũi họng', degree: 'Bác sĩ CK II', fee: '300.000', location: 'Tầng 4, Tòa nhà A, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội' }
];

const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00'
];

export default function PatientSchedule({ appointments = [], setAppointments, triggerToast }) {
  const [activeTab, setActiveTab] = useState('booked'); // 'booked' or 'create'
  const [selectedAptId, setSelectedAptId] = useState(null);

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(MOCK_DOCTORS[0].id);
  const [bookingDate, setBookingDate] = useState('2026-06-20');
  const [bookingTime, setBookingTime] = useState(TIME_SLOTS[0]);
  const [bookingSymptoms, setBookingSymptoms] = useState('');

  // Get active appointments for Lương Hương Giang
  const myAppointments = appointments.filter(
    (apt) => apt.patientName === 'Lương Hương Giang' || apt.patientId === 'P004'
  );

  // Default selected appointment
  const currentAptId = selectedAptId || (myAppointments[0] && myAppointments[0].id);
  const selectedApt = myAppointments.find(apt => apt.id === currentAptId) || myAppointments[0];

  const handleCancelAppointment = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn khám này?')) {
      const updated = appointments.map(apt => {
        if (apt.id === id) {
          return { ...apt, status: 'Đã hủy' };
        }
        return apt;
      });
      setAppointments(updated);
      triggerToast('Đã gửi yêu cầu hủy lịch khám thành công', 'info');
    }
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
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
      status: 'Đang xử lý'
    };

    setAppointments([newApt, ...appointments]);
    triggerToast('Đặt lịch khám thành công! Đang đợi phòng khám xác nhận.', 'success');
    setSelectedAptId(newApt.id);
    setActiveTab('booked');
    
    // Reset booking state
    setBookingSymptoms('');
  };

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
          onClick={() => setActiveTab('create')}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', height: 'calc(100vh - 200px)', minHeight: '400px' }}>
          {/* Left panel: list of appointments */}
          <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, overflowY: 'auto' }}>
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
                      backgroundColor: apt.status === 'Đã xác nhận' ? '#d1fae5' : apt.status === 'Đang xử lý' ? '#fef3c7' : '#fee2e2',
                      color: apt.status === 'Đã xác nhận' ? '#065f46' : apt.status === 'Đang xử lý' ? '#d97706' : '#dc2626',
                      fontSize: '0.7rem'
                    }}>
                      {apt.status}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div><strong>Khoa:</strong> {apt.specialty}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={12} /> {apt.date} | <Clock size={12} /> {apt.time}
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
          <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, overflowY: 'auto' }}>
            {selectedApt ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)' }}>Chi tiết lịch hẹn</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã lịch khám: {selectedApt.id}</span>
                  </div>
                  <span className="badge" style={{
                    backgroundColor: selectedApt.status === 'Đã xác nhận' ? '#d1fae5' : selectedApt.status === 'Đang xử lý' ? '#fef3c7' : '#fee2e2',
                    color: selectedApt.status === 'Đã xác nhận' ? '#065f46' : selectedApt.status === 'Đang xử lý' ? '#d97706' : '#dc2626',
                    padding: '6px 14px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {selectedApt.status}
                  </span>
                </div>

                {/* Doctor card */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffe2e2', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                      <circle cx="50" cy="40" r="20" fill="#2563eb" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{selectedApt.doctorName}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedApt.specialty}</div>
                  </div>
                </div>

                {/* Details layout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
                    <Calendar size={18} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Ngày khám bệnh:</strong>
                      <span style={{ color: 'var(--text-dark)' }}>{selectedApt.date}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
                    <Clock size={18} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Thời gian ca khám:</strong>
                      <span style={{ color: 'var(--text-dark)' }}>{selectedApt.time}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
                    <MapPin size={18} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Địa điểm khám:</strong>
                      <span style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{selectedApt.location || 'Bệnh viện Bạch Mai, Giải Phóng, Hà Nội'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
                    <DollarSign size={18} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: 'var(--text-dark)', display: 'block' }}>Phí dịch vụ khám:</strong>
                      <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{selectedApt.fee || '350.000'} VND</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms description */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Triệu chứng / Lý do khám bệnh:</strong>
                  <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#f1f5f9', fontSize: '0.85rem', color: 'var(--text-dark)', fontStyle: 'italic', lineHeight: '1.4' }}>
                    {selectedApt.symptoms}
                  </div>
                </div>

                {/* Cancel Button */}
                {selectedApt.status !== 'Đã hủy' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button
                      onClick={() => handleCancelAppointment(selectedApt.id)}
                      className="btn btn-cancel"
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
        <form onSubmit={handleBookAppointment} className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', margin: 0 }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0 }}>
            Đăng ký Đặt lịch khám bệnh mới
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            {/* Left side inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Doctor select */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="form-group-label" style={{ fontWeight: '600' }}>1. Chọn bác sĩ khám & Chuyên khoa</span>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '42px', padding: '8px 12px' }}
                >
                  {MOCK_DOCTORS.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty}) - Phí: {d.fee}đ
                    </option>
                  ))}
                </select>
              </div>

              {/* Date select */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="form-group-label" style={{ fontWeight: '600' }}>2. Chọn ngày hẹn khám</span>
                <input
                  type="date"
                  value={bookingDate}
                  min="2026-05-25"
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', height: '42px', padding: '8px 12px' }}
                />
              </div>

              {/* Time slot select */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="form-group-label" style={{ fontWeight: '600' }}>3. Chọn khung giờ khám</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBookingTime(t)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '6px',
                        border: '1.5px solid',
                        borderColor: bookingTime === t ? 'var(--primary)' : 'var(--border-color)',
                        backgroundColor: bookingTime === t ? '#eff6ff' : '#fff',
                        color: bookingTime === t ? 'var(--primary)' : 'var(--text-dark)',
                        fontWeight: bookingTime === t ? '700' : '500',
                        fontSize: '0.78rem',
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
                <span className="form-group-label" style={{ fontWeight: '600' }}>4. Mô tả triệu chứng sức khỏe cụ thể</span>
                <textarea
                  value={bookingSymptoms}
                  onChange={(e) => setBookingSymptoms(e.target.value)}
                  placeholder="Ví dụ: Tôi bị sốt cao kèm đau đầu, rát cổ họng từ ngày hôm qua, người mỏi mệt ăn uống kém..."
                  className="form-input"
                  style={{ width: '100%', height: '110px', padding: '10px 12px', resize: 'none', lineHeight: '1.4' }}
                />
              </div>

              {/* Booking Summary Check sheet */}
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#166534', borderBottom: '1px solid #bbf7d0', paddingBottom: '4px' }}>
                  Xem lại chi tiết lịch hẹn
                </span>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem', color: '#14532d' }}>
                  <div><strong>Bác sĩ khám:</strong> {MOCK_DOCTORS.find(d => d.id === selectedDoctorId).name} ({MOCK_DOCTORS.find(d => d.id === selectedDoctorId).specialty})</div>
                  <div><strong>Thời gian:</strong> {bookingTime} | Ngày {bookingDate}</div>
                  <div><strong>Địa điểm:</strong> {MOCK_DOCTORS.find(d => d.id === selectedDoctorId).location}</div>
                  <div><strong>Chi phí dịch vụ:</strong> <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{MOCK_DOCTORS.find(d => d.id === selectedDoctorId).fee} VND</span></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('booked')}
              className="btn btn-outline"
              style={{ padding: '10px 32px', margin: 0 }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="btn btn-save"
              style={{ padding: '10px 36px', margin: 0 }}
            >
              Xác nhận đặt lịch khám
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
