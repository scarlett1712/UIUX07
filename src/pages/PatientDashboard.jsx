import React from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert, ArrowRight, Activity, Clock, MapPin, DollarSign } from 'lucide-react';

export default function PatientDashboard({ onNavigate, appointments = [], diseases = [] }) {
  // Get patient name dynamically from localStorage
  const cachedPatientData = localStorage.getItem('patientData');
  let patientName = 'Lương Hương Giang';
  if (cachedPatientData) {
    try {
      const parsed = JSON.parse(cachedPatientData);
      if (parsed.name) patientName = parsed.name;
    } catch (e) {}
  }

  // Get upcoming appointments for the patient
  const myAppointments = appointments.filter(
    (apt) => apt.patientName === patientName || apt.patientId === 'P004'
  );

  // If there's no pre-existing appointments for the mockup, let's show the default one from Image 1
  const upcomingAppointment = myAppointments.length > 0 ? myAppointments[0] : {
    doctorName: 'BS. Nguyễn Văn B',
    specialty: 'Khoa Nội tổng quát',
    time: '9:00 - 9:30 Thứ 6, 20-06-2026',
    date: '2026-06-20',
    location: 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội',
    fee: '350.000',
    status: 'Đã xác nhận'
  };

  // Recent epidemics & common diseases
  const recentEpidemics = [
    { id: 'D002', name: 'Cúm A / H5N1', desc: 'Sốt cao, ho, khó thở, lây lan nhanh qua đường hô hấp.', danger: 'Cao', count: '120 ca tuần qua' },
    { id: 'D007', name: 'Sốt xuất huyết', desc: 'Sốt cao đột ngột, phát ban, chảy máu cam, đau hốc mắt.', danger: 'Cao', count: '85 ca tuần qua' },
    { id: 'D008', name: 'Sởi', desc: 'Sốt, phát ban dạng nốt toàn thân, đỏ mắt, chảy nước mũi.', danger: 'Trung bình', count: '45 ca tuần qua' },
    { id: 'D002', name: 'Cúm mùa', desc: 'Hắt hơi, đau họng, nhức đầu ê ẩm, mệt mỏi toàn thân.', danger: 'Thấp', count: '310 ca tuần qua' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        
        {/* LEFT COLUMN */}
        <div className="dashboard-left-col" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Welcome Banner */}
          <div className="welcome-banner" style={{ margin: 0 }}>
            <div className="welcome-text">
              <h2>Chào {patientName},</h2>
              <p>Hôm nay sức khỏe của bạn thế nào? Hãy cùng MediConsult chăm sóc bản thân nhé!</p>
              <div className="welcome-quote">"Sức khỏe là lựa chọn, không phải sự ngẫu nhiên."</div>
            </div>
            <div className="welcome-illustration">
              <Heart size={60} strokeWidth={1.5} />
            </div>
          </div>

          {/* AI Assistant Callout */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: 'none',
            margin: 0,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                <Sparkles size={24} style={{ color: '#fff' }} />
              </div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.3rem' }}>Trợ lý sức khỏe AI</h3>
            </div>
            
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
              Bạn đang gặp các triệu chứng bất thường? Hãy trò chuyện với AI để nhận được những phân tích ban đầu và lời khuyên y tế chính xác dựa trên cơ sở dữ liệu y tế hiện đại.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => onNavigate('patient-consultation')}
                className="btn" 
                style={{
                  backgroundColor: '#fff',
                  color: 'var(--primary)',
                  fontWeight: '600',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                Bắt đầu tư vấn ngay <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', margin: 0 }}>
            <h3 style={{ fontSize: '1.1rem', margin: '0 0 4px 0', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
              Hoạt động gần đây
            </h3>
            
            <div className="recent-activity-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div 
                className="activity-item" 
                onClick={() => onNavigate('patient-consultation')}
                style={{ 
                  margin: 0, 
                  padding: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e0f2fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-light)',
                  flexShrink: 0
                }}>
                  <Sparkles size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Tư vấn sức khỏe</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hôm nay 15:40</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Triệu chứng: Sốt cao, Đau đầu, Mệt mỏi, Đau họng, Ho...
                  </p>
                </div>
              </div>

              <div 
                className="activity-item" 
                onClick={() => onNavigate('patient-schedule')}
                style={{ 
                  margin: 0, 
                  padding: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-light)';
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  flexShrink: 0
                }}>
                  <Calendar size={20} />
                </div>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>Đặt lịch khám</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>05-05-2026</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    BS. Nguyễn Văn A - Khoa Nội tổng quát
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Medical Data - Recent Epidemics */}
          <div className="card" style={{ margin: 0, padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
              Dữ liệu y tế: Dịch bệnh & Bệnh hay gặp
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentEpidemics.map((epidemic, index) => (
                <div 
                  key={index} 
                  onClick={() => onNavigate('patient-medical-data', epidemic.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-dark)' }}>{epidemic.name}</span>
                    <span className={`badge ${
                      epidemic.danger === 'Cao' ? 'badge-high' : epidemic.danger === 'Trung bình' ? 'badge-medium' : 'badge-low'
                    }`}>
                      {epidemic.danger}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    {epidemic.desc}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)', marginTop: '2px', fontWeight: '500' }}>
                    <Activity size={12} /> {epidemic.count}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => onNavigate('patient-medical-data')}
              style={{
                width: '100%',
                marginTop: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--primary-light)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.85rem',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              Xem tất cả triệu chứng & bệnh lý <ArrowRight size={14} />
            </button>
          </div>

          {/* Upcoming Appointment */}
          <div className="card" style={{ margin: 0, padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px' }}>
              Lịch hẹn sắp tới
            </h3>
            
            <div style={{
              background: 'linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%)',
              border: '1px solid #cce3ff',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#ffe2e2',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff'
                }}>
                  {/* Doctor Avatar Placeholder */}
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                    <circle cx="50" cy="40" r="20" fill="#2563eb" />
                    <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {upcomingAppointment.doctorName}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {upcomingAppointment.specialty}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(15, 59, 122, 0.08)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <Clock size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                  <div className="detail-row">
                    <span className="detail-label">Thời gian:</span>
                    <span className="detail-value">{upcomingAppointment.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem' }}>
                  <MapPin size={16} style={{ color: 'var(--primary-light)', marginTop: '2px', flexShrink: 0 }} />
                  <div className="detail-row" style={{ alignItems: 'flex-start' }}>
                    <span className="detail-label">Địa điểm:</span>
                    <span className="detail-value" style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{upcomingAppointment.location}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                  <DollarSign size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                  <div className="detail-row">
                    <span className="detail-label">Phí khám bệnh:</span>
                    <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: '600' }}>{upcomingAppointment.fee} VND</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span className="badge" style={{ backgroundColor: '#d1fae5', color: '#065f46', fontWeight: '600' }}>
                  {upcomingAppointment.status}
                </span>
                
                <button 
                  onClick={() => onNavigate('patient-schedule')}
                  style={{
                    background: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Chi tiết hẹn
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
