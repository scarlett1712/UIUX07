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
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const yearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const myConfirmedAppts = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.date.startsWith(yearMonthStr) && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'));
  const appointmentDays = myConfirmedAppts.map(a => {
    const parts = a.date.split('-');
    return parseInt(parts[2], 10);
  });

  const isDutyDay = (day) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  };

  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

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
      
      {/* Top Section: Welcome & Stats vs Calendar (aligned bottoms) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* TOP LEFT: Welcome Banner & Stats Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          
          {/* Welcome Banner */}
          <div className="welcome-banner" style={{ margin: 0 }}>
            <div className="welcome-text">
              <h2>Chào Bác sĩ Huy,</h2>
              <p>Chúc bạn một ngày tốt lành và đừng quên chăm sóc bản thân nhé!</p>
              <div className="welcome-quote">"Good things take time."</div>
            </div>
            <div className="welcome-illustration">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" />
                <circle cx="12" cy="11" r="4" strokeWidth="1.5" />
                <path d="M10 11h4M12 9v4" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
  
          {/* Stats Widgets Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1 }}>
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('doctor-schedule');
                triggerToast('Chuyển tới Lịch khám bác sĩ', 'info');
              }}
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, cursor: 'pointer', height: '100%', backgroundColor: '#fff' }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lịch khám hôm nay</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-dark)' }}>{todayConfirmedCount}</span>
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
              style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, cursor: 'pointer', height: '100%', backgroundColor: '#fff' }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lịch hẹn cần duyệt</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '8px 0' }}>
                <span style={{ fontSize: '2rem', fontWeight: 700, color: '#d97706' }}>{pendingCount}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#d97706' }}>
                <Clock size={14} />
                <span>Xem lịch hẹn chờ duyệt</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* TOP RIGHT: Calendar Widget Card */}
        <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', backgroundColor: '#fff' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--primary)' }}>Lịch Khám</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {formatDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`)}
              </span>
            </div>

            {/* Month Navigator Mockup */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tháng {currentMonth + 1}, {currentYear}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrevMonth} className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronLeft size={14} /></button>
                <button onClick={handleNextMonth} className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronRight size={14} /></button>
              </div>
            </div>
 
            {/* Calendar grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', color: 'var(--text-muted)', paddingBottom: '4px' }}>
                {weekdays.map(d => <div key={d}>{d}</div>)}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', gridAutoRows: 'minmax(32px, 1fr)' }}>
                {calendarCells.map((day, idx) => {
                  const hasAppts = appointmentDays.includes(day);
                  const isSelected = selectedDate === day;
                  const isDuty = isDutyDay(day);
 
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCellClick(day)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: isSelected || hasAppts || isDuty ? '700' : '400',
                        cursor: day ? 'pointer' : 'default',
                        position: 'relative',
                        backgroundColor: isSelected ? 'var(--primary)' : (isDuty ? '#e0f2fe' : 'transparent'),
                        color: isSelected ? '#fff' : (isDuty ? '#0369a1' : (day ? 'var(--text-dark)' : 'transparent')),
                        border: isSelected ? 'none' : (isDuty ? (hasAppts ? '1.5px solid #0284c7' : '1.5px dashed #0284c7') : (hasAppts ? '1.5px solid var(--primary)' : 'none')),
                        height: '32px'
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: New Messages vs Upcoming Appointments (aligned horizontally) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        
        {/* BOTTOM LEFT: New Messages wrapped in card */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Tin nhắn mới
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messageAlerts.map((msg, index) => (
              <div 
                key={index} 
                onClick={() => {
                  onNavigate('doctor-messages', msg.id);
                  triggerToast(`Mở hội thoại với ${msg.name}`, 'info');
                }}
                style={{ 
                  padding: '10px 14px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  margin: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', flexShrink: 0 }}>
                  <MessageSquare size={16} />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)' }}>{msg.name}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{msg.date} {msg.time}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {msg.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM RIGHT: Upcoming Appointments */}
        <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0, backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Lịch khám sắp tới
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {getUpcomingAppointments().slice(0, 4).map((apt) => {
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
                    padding: '10px 14px',
                    borderRadius: '8px', 
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-color)',
                    margin: 0,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>
                      {displayDate} &bull; {apt.time}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                      {apt.patientName || apt.name || apt.patient}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '4px' }}>
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
  );
}
