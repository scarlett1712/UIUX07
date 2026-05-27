import React, { useState } from 'react';
import { formatDate } from '../utils/date';
import { Calendar as CalendarIcon, MessageSquare, Users, TrendingUp, TrendingDown, Clock, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

export default function DoctorDashboard({ 
  onNavigate, 
  appointments = [], 
  patients = [], 
  triggerToast 
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Calculate stats dynamically
  const todayConfirmedCount = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.date === todayStr && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý')).length;
  const pendingCount = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.status === 'Chờ xác nhận').length;

  const [selectedDate, setSelectedDate] = useState(today.getDate()); // default to today's date

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };
  
  // Quick Messaging Thread previews
  const messageAlerts = [
    { id: 'MSG101', name: 'Nguyễn Minh Anh', desc: 'Triệu chứng sốt, đau họng', date: '05-05-2026', time: '08:15' },
    { id: 'MSG102', name: 'Trần Phương Huế', desc: 'Đau bụng âm ỉ không dứt', date: '04-05-2026', time: '10:05' },
    { id: 'MSG103', name: 'Lê Hải Minh', desc: 'Đau, chảy nước mắt', date: '02-05-2026', time: '18:01' },
    { id: 'MSG104', name: 'Văn Mai Hương', desc: 'Khó thở, nghẹt mũi lâu ngày', date: '01-05-2026', time: '22:21' }
  ];

  const getAppointmentsForDay = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = `${currentYear}-${monthStr}-${day < 10 ? '0' + day : day}`;
    return appointments
      .filter(a => a.doctorName === 'Bs. Huy' && a.date === dayStr && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'))
      .map(a => ({
        id: a.id,
        time: a.time,
        patient: a.patientName || a.name || a.patient || 'Bệnh nhân',
        symptom: a.symptoms || a.symptom || 'Khám tổng quát'
      }));
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    
    return appointments
      .filter(a => {
        if (a.doctorName !== 'Bs. Huy') return false;
        if (a.status !== 'Đã xác nhận' && a.status !== 'Đã đồng ý') return false;
        
        // Parse date
        const aptDate = new Date(a.date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= today; // today or future
      })
      .sort((a, b) => {
        // Compare date
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        // Compare start time
        const startA = a.time.split(' - ')[0].trim();
        const startB = b.time.split(' - ')[0].trim();
        return startA.localeCompare(startB);
      });
  };

  // Calendar render helpers dynamic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const yearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const myConfirmedAppts = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.date.startsWith(yearMonthStr) && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'));
  const appointmentDays = myConfirmedAppts.map(a => {
    const parts = a.date.split('-');
    return parseInt(parts[2], 10);
  });

  const handleCellClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${dayStr}`;
    onNavigate('doctor-schedule', dateStr);
    triggerToast(`Đang chuyển tới lịch trực ngày ${day}/${monthStr}/${currentYear}`, 'info');
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
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('doctor-schedule');
                triggerToast('Chuyển tới Lịch khám bác sĩ', 'info');
              }}
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lịch khám hôm nay</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>{todayConfirmedCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#10b981' }}>
                <TrendingUp size={14} />
                <span>Xem ca trực hôm nay</span>
              </div>
            </div>
 
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('doctor-appointments');
                triggerToast('Chuyển tới Danh sách lịch hẹn cần duyệt', 'info');
              }}
              style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lịch hẹn cần duyệt</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706' }}>{pendingCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#d97706' }}>
                <Clock size={14} />
                <span>Xem lịch hẹn chờ duyệt</span>
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
                  onClick={() => {
                    onNavigate('doctor-messages', msg.id);
                    triggerToast(`Mở hội thoại với ${msg.name}`, 'info');
                  }}
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
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {formatDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`)}
              </span>
            </div>

            {/* Month Navigator Mockup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tháng {currentMonth + 1}, {currentYear}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrevMonth} className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronLeft size={14} /></button>
                <button onClick={handleNextMonth} className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronRight size={14} /></button>
              </div>
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
                  const hasAppts = appointmentDays.includes(day);
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
              {getUpcomingAppointments().slice(0, 5).map((apt) => {
                const displayDate = formatDate(apt.date);
                return (
                  <div 
                    key={apt.id}
                    onClick={() => {
                      onNavigate('doctor-schedule', apt.id);
                      triggerToast(`Đang xem chi tiết ca khám của ${apt.patientName || apt.name}`, 'info');
                    }}
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: '8px 12px',
                      borderRadius: '8px', 
                      backgroundColor: '#e0f2fe',
                      border: 'none',
                      margin: 0,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>
                        {displayDate} &bull; {apt.time}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                        {apt.patientName || apt.name || apt.patient}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', marginTop: '4px' }}>
                      {apt.symptoms || apt.symptom || 'Khám lâm sàng'}
                    </div>
                  </div>
                );
              })}
              {getUpcomingAppointments().length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem', fontStyle: 'italic', padding: '10px 0' }}>
                  Không có ca khám sắp tới nào.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
