import React, { useState } from 'react';
import { Users, DollarSign, Star, Calendar, MessageSquare, ChevronLeft, ChevronRight, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

export default function ManagerDashboard({ 
  onNavigate, 
  onSelectId, 
  appointments = [], 
  patients = [], 
  feedbacks = [], 
  triggerToast 
}) {
  // Calendar state dynamic
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const yearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const confirmedAppts = appointments.filter(a => a.date.startsWith(yearMonthStr) && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'));
  const appointmentDays = confirmedAppts.map(a => {
    const parts = a.date.split('-');
    return parseInt(parts[2], 10);
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOffset = new Date(currentYear, currentMonth, 1).getDay();

  // Generate calendar days (Sunday start week)
  const calendarDays = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Upcoming appointments list (from mockup / specs)
  const upcomingAppointments = [
    { id: 'APT002', time: '08:00', patientName: 'Nguyễn Minh Anh', doctorName: 'Bs. B', status: 'Đã xác nhận' },
    { id: 'APT001', time: '11:30', patientName: 'Đỗ Minh Tú', doctorName: 'Bs. Huy', status: 'Đã xác nhận' },
    { id: 'APT003', time: '14:00', patientName: 'Văn Thị Trinh', doctorName: 'Bs. C', status: 'Chờ xác nhận' }
  ];

  // System alerts / notifications
  const notifications = [
    { id: 1, type: 'review', text: 'Có 5 đánh giá chờ phản hồi', time: '10 phút trước', icon: Star, color: '#eab308' },
    { id: 2, type: 'clash', text: 'Bs. Huy có 2 lịch trùng', time: '30 phút trước', icon: AlertTriangle, color: '#ef4444' },
    { id: 3, type: 'clash', text: 'Bs. B có 2 lịch trùng', time: '1 giờ trước', icon: AlertTriangle, color: '#ef4444' }
  ];

  const handleSelectDay = (day) => {
    if (!day) return;
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    triggerToast(`Hiển thị lịch hẹn ngày ${day}/${monthStr}/${currentYear}`, 'info');
    onNavigate('appointment-calendar');
  };

  const handleNotificationClick = (notif) => {
    if (notif.type === 'review') {
      onNavigate('clinic-feedback');
    } else if (notif.type === 'clash') {
      onNavigate('doctor-shifts');
    }
  };

  const getShiftInfo = (day) => {
    if (!day) return null;
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
      return { doctor: 'Bs. Huy', bg: '#f0fdf4', color: '#16a34a', border: '#4ade80' };
    }
    if (dayOfWeek === 2 || dayOfWeek === 4) {
      return { doctor: 'Bs. B', bg: '#f3e8ff', color: '#9333ea', border: '#c084fc' };
    }
    if (dayOfWeek === 6) {
      return { doctor: 'Bs. C', bg: '#fef9c3', color: '#ca8a04', border: '#facc15' };
    }
    return null;
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
      
      {/* Row 1: Banner & Stats vs Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Column: Welcome Banner & 4 Stats Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
          {/* Welcome Banner */}
          <div className="welcome-banner" style={{ margin: 0 }}>
            <div className="welcome-text">
              <h2>Chào Quản lý Linh,</h2>
              <p>Chúc bạn một ngày tốt lành và đừng quên chăm sóc bản thân nhé!</p>
              <div className="welcome-quote">"Good things take time."</div>
            </div>
            <div className="welcome-illustration">
              <svg viewBox="0 0 24 24" width="60" height="60" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                <path d="M12 5v14M5 12h14" strokeWidth="1" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>

          {/* 4 Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1 }}>
            {/* Card 1: Tổng bệnh nhân */}
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('patient-list');
                triggerToast('Chuyển tới Danh sách bệnh nhân', 'info');
              }}
              style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Tổng số bệnh nhân</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <Users size={16} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', margin: '2px 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>{patients.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                <ArrowUpRight size={14} />
                <span>Xem chi tiết danh sách</span>
              </div>
            </div>

            {/* Card 2: Doanh thu hệ thống */}
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('reports-analytics');
                triggerToast('Chuyển tới Báo cáo doanh thu', 'info');
              }}
              style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Doanh thu hệ thống</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d' }}>
                  <DollarSign size={16} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', margin: '2px 0' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>
                  {(appointments
                    .filter(apt => apt.status === 'Đã xác nhận' && apt.fee)
                    .reduce((sum, apt) => sum + (parseInt(apt.fee.replace(/\./g, '')) || 0), 0)
                  ).toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                <ArrowUpRight size={14} />
                <span>Từ các lịch đã xác nhận</span>
              </div>
            </div>

            {/* Card 3: Phản hồi & Đánh giá */}
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('clinic-feedback');
                triggerToast('Chuyển tới Đánh giá phòng khám', 'info');
              }}
              style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Tổng số đánh giá</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                  <Star size={16} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', margin: '2px 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>{feedbacks.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                <ArrowUpRight size={14} />
                <span>Xem phản hồi của người bệnh</span>
              </div>
            </div>

            {/* Card 4: Tổng số lịch hẹn */}
            <div 
              className="card stat-card" 
              onClick={() => {
                onNavigate('appointment-calendar');
                triggerToast('Chuyển tới Lịch hẹn khám', 'info');
              }}
              style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 0, height: '100%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Tổng số lịch hẹn</span>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                  <Calendar size={16} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', margin: '2px 0' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>{appointments.length}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
                <ArrowUpRight size={14} />
                <span>Xem chi tiết lịch hẹn khám</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Calendar Card */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Lịch</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {selectedDate}/{String(currentMonth + 1).padStart(2, '0')}/{currentYear}
            </span>
          </div>

          {/* Month Navigator Mockup */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Tháng {currentMonth + 1}, {currentYear}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronLeft size={14} /></button>
              <button className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.75rem' }}><ChevronRight size={14} /></button>
            </div>
          </div>

          {/* Calendar Grid Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <div>CN</div>
            <div>T2</div>
            <div>T3</div>
            <div>T4</div>
            <div>T5</div>
            <div>T6</div>
            <div>T7</div>
          </div>

          {/* Calendar Grid Body */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', gridAutoRows: 'minmax(30px, 1fr)', fontSize: '0.78rem' }}>
            {calendarDays.map((day, idx) => {
              const hasAppts = day ? appointmentDays.includes(day) : false;
              const isSelected = selectedDate === day;
              const shift = getShiftInfo(day);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (day) {
                      setSelectedDate(day);
                      handleSelectDay(day);
                    }
                  }}
                  style={{
                    height: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected || hasAppts || shift ? '700' : '400',
                    cursor: day ? 'pointer' : 'default',
                    position: 'relative',
                    backgroundColor: isSelected ? 'var(--primary)' : (shift ? shift.bg : 'transparent'),
                    color: isSelected ? '#fff' : (shift ? shift.color : (day ? 'var(--text-dark)' : 'transparent')),
                    border: isSelected ? 'none' : (shift ? (hasAppts ? `1.5px solid ${shift.border}` : `1.5px dashed ${shift.border}`) : (hasAppts ? '1.5px solid var(--primary)' : 'none')),
                  }}
                  className={day && !isSelected ? 'hover-day' : ''}
                >
                  <span style={{ marginTop: hasAppts ? '-2px' : '0' }}>{day || ''}</span>
                  {day && hasAppts && (
                    <span style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#fff' : 'var(--primary-light)',
                      position: 'absolute',
                      bottom: '3px'
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Upcoming Appointment list */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Sắp tới</span>
              <a onClick={() => onNavigate('appointment-calendar')} style={{ fontSize: '0.75rem', color: 'var(--primary-light)', cursor: 'pointer', fontWeight: 600 }}>Xem tất cả</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {upcomingAppointments.slice(0, 2).map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => {
                    onSelectId(apt.id);
                    onNavigate('appointment-calendar');
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f8fafc',
                    borderLeft: '4px solid var(--primary-light)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>{apt.time}</div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.doctorName}</div>
                    </div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', backgroundColor: '#e2e8f0', color: 'var(--text-dark)' }}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Activity Chart vs Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Column: Activity Chart */}
        <div className="card" style={{ padding: '16px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--primary)', fontWeight: 700 }}>Hoạt động gần đây</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lượt tương tác hệ thống hàng tháng</span>
          </div>
          <div style={{ height: '140px', position: 'relative' }}>
            <svg viewBox="0 0 800 200" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Smooth Spline curve */}
              <path
                d="M 50 160 C 120 80, 180 120, 250 50 C 320 -20, 380 150, 450 80 C 520 20, 580 130, 650 90 C 720 50, 750 60, 800 40"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              
              {/* Fill under curve */}
              <path
                d="M 50 160 C 120 80, 180 120, 250 50 C 320 -20, 380 150, 450 80 C 520 20, 580 130, 650 90 C 720 50, 750 60, 800 40 L 800 200 L 50 200 Z"
                fill="url(#grad)"
                opacity="0.1"
              />
              
              {/* Gradients */}
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="250" cy="50" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="450" cy="80" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />
              <circle cx="650" cy="90" r="5" fill="#10b981" stroke="#fff" strokeWidth="2" />

              {/* X Axis Labels */}
              <text x="50" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Jul</text>
              <text x="170" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Aug</text>
              <text x="290" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Sep</text>
              <text x="410" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Oct</text>
              <text x="530" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Nov</text>
              <text x="650" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Dec</text>
              <text x="750" y="190" fill="#94a3b8" fontSize="12" textAnchor="middle">Jan</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Notifications Card */}
        <div className="card" style={{ padding: '14px', margin: 0, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '10px', fontWeight: 700 }}>Thông báo</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {notifications.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px 12px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ color: n.color, marginTop: '2px' }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{n.text}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={10} />
                      {n.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
