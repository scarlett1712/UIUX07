import React, { useState } from 'react';
import { Calendar as CalendarIcon, MessageSquare, Users, TrendingUp, TrendingDown, Clock, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

export default function DoctorDashboard({ onNavigate, triggerToast }) {
  const [selectedDate, setSelectedDate] = useState(7); // default 7th May 2026
  
  // Quick Messaging Thread previews
  const messageAlerts = [
    { name: 'Nguyễn Minh Anh', desc: 'Triệu chứng sốt, đau họng', date: '05/05/2026', time: '08:15' },
    { name: 'Trần Phương Huế', desc: 'Đau bụng âm ỉ không dứt', date: '04/05/2026', time: '10:05' },
    { name: 'Lê Hải Minh', desc: 'Đau, chảy nước mắt', date: '02/05/2026', time: '18:01' },
    { name: 'Văn Mai Hương', desc: 'Khó thở, nghẹt mũi lâu ngày', date: '01/05/2026', time: '22:21' }
  ];

  // Appointment schedule mock data linked to calendar days
  const scheduleData = {
    7: [
      { time: '8:00 - 9:00', patient: 'Ngô Gia Bảo', symptom: 'đau đầu, chóng mặt nhiều ngày...' },
      { time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' },
      { time: '16:00 - 17:00', patient: '', symptom: '----------------------------------------' }
    ],
    9: [
      { time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { time: '9:00 - 10:00', patient: 'Lê Hải Minh', symptom: 'mỏi mắt, khô mắt chảy nước mắt...' },
      { time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' }
    ],
    11: [
      { time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { time: '10:00 - 11:00', patient: 'Nguyễn Minh Anh', symptom: 'sốt cao đột ngột, đau họng, chảy mũi...' }
    ],
    14: [
      { time: '15:00 - 16:00', patient: 'Trần Phương Huế', symptom: 'đau bụng âm ỉ thượng vị, buồn nôn...' }
    ]
  };

  const getAppointmentsForDay = (day) => {
    return scheduleData[day] || [
      { time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' }
    ];
  };

  // Calendar render helpers (May 2026)
  const daysInMonth = 31;
  const startOffset = 4; // May 1st 2026 is Friday (starts at index 4 if Mon=0, Tue=1, Wed=2, Thu=3, Fri=4)
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleCellClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    triggerToast(`Đang xem lịch khám ngày ${day}/05/2026`, 'info');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Main Grid: Left Column (Welcome, Stats, Messages) vs Right Column (Calendar, Daily Schedule) */}
      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* LEFT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Welcome Banner Card */}
          <div className="card welcome-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', position: 'relative', overflow: 'hidden', margin: 0 }}>
            <div style={{ zIndex: 2 }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>Chào Bác sĩ Huy,</h2>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-dark)', opacity: 0.9 }}>
                Chúc bạn một ngày tốt lành và đừng quên chăm sóc cho bản thân nhé!
              </p>
              <div style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                "Good things take time."
              </div>
            </div>
            
            {/* Heart Icon Graphics on Right */}
            <div style={{ zIndex: 1, color: 'var(--primary-light)', padding: '8px', opacity: 0.8, marginRight: '10px' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" />
                <circle cx="12" cy="11" r="4" strokeWidth="1.5" />
                <path d="M10 11h4M12 9v4" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
 
          {/* Stats Widgets Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tổng số bệnh nhân</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>15</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#ef4444' }}>
                <TrendingDown size={14} />
                <span>Giảm 10% so với tháng trước</span>
              </div>
            </div>
 
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lịch khám trong tuần</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>5</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981' }}>
                <TrendingUp size={14} />
                <span>Tăng 20% so với tuần trước</span>
              </div>
            </div>
          </div>
 
          {/* New Messages Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '8px 0 0 0', fontWeight: 600, color: 'var(--text-dark)' }}>Tin nhắn mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {messageAlerts.map((msg, index) => (
                <div 
                  key={index} 
                  className="card"
                  onClick={() => onNavigate('doctor-messages')}
                  style={{ 
                    padding: '8px 12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: '1px solid transparent',
                    margin: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', flexShrink: 0 }}>
                    <MessageSquare size={16} />
                  </div>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-dark)' }}>{msg.name}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.date} {msg.time}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '1px' }}>
                      {msg.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
 
        </div>
 
        {/* RIGHT PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Calendar Widget Card */}
          <div className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-dark)' }}>Lịch Khám</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>07/05/2026</span>
            </div>
 
            {/* Calendar grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.7rem', color: 'var(--text-muted)', paddingBottom: '4px' }}>
                {weekdays.map(d => <div key={d}>{d}</div>)}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {/* Starting empty offsets */}
                {Array.from({ length: startOffset }).map((_, idx) => (
                  <div key={`empty-${idx}`} />
                ))}
 
                {/* Days of May */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const day = idx + 1;
                  const hasAppts = scheduleData[day] && scheduleData[day].some(s => s.patient);
                  const isSelected = selectedDate === day;
 
                  return (
                    <div
                      key={day}
                      onClick={() => handleCellClick(day)}
                      style={{
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: isSelected || hasAppts ? '700' : '500',
                        cursor: 'pointer',
                        position: 'relative',
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--text-dark)',
                        border: hasAppts && !isSelected ? '1.5px solid var(--primary)' : 'none'
                      }}
                    >
                      {day}
                      {hasAppts && !isSelected && (
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--primary)', position: 'absolute', bottom: '2px' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
 
          {/* Hourly Daily Schedule */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: '4px 0 0 0', fontWeight: 600, color: 'var(--text-dark)' }}>Lịch khám sắp tới</h3>
            
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '4px' }}>
                Ca khám ngày {selectedDate}/05/2026
              </div>
 
              {getAppointmentsForDay(selectedDate).filter(slot => slot.patient).map((slot, index) => (
                <div 
                  key={index}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '8px 12px',
                    borderRadius: '8px', 
                    backgroundColor: '#e0f2fe',
                    border: 'none',
                    margin: 0
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>
                      {slot.time}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {slot.patient}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '4px' }}>
                    {slot.symptom}
                  </div>
                </div>
              ))}
              {getAppointmentsForDay(selectedDate).filter(slot => slot.patient).length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic', padding: '10px 0' }}>
                  Không có ca khám nào.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
