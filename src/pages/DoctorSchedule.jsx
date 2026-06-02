import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/date';
import { Calendar as CalendarIcon, Search, Filter, Clock, Eye, AlertCircle, ChevronLeft, ChevronRight, X, User, Undo2 } from 'lucide-react';

export default function DoctorSchedule({ onNavigate, appointments = [], selectedId, triggerToast }) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDay, setSelectedDay] = useState(today.getDate()); // default today
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShiftFilter, setActiveShiftFilter] = useState('all'); // 'all', 'morning', 'afternoon'

  // Initialize selectedAppointment to first active appointment on currentDay
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const lastHandledId = React.useRef(null);

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

  // Auto select appointment or date from selectedId (navigated from Dashboard)
  useEffect(() => {
    if (selectedId && lastHandledId.current !== selectedId) {
      lastHandledId.current = selectedId;
      
      // Check if selectedId is a date string in YYYY-MM-DD format
      if (selectedId.includes('-') && selectedId.split('-').length === 3 && !selectedId.startsWith('APT') && !selectedId.startsWith('MSG') && !selectedId.startsWith('P')) {
        const parts = selectedId.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // 0-indexed
        const day = parseInt(parts[2], 10);
        setCurrentYear(year);
        setCurrentMonth(month);
        setSelectedDay(day);
        setSelectedAppointment(null);
        return;
      }

      const apt = appointments.find(a => a.id === selectedId);
      if (apt) {
        const parts = apt.date.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // 0-indexed
          const day = parseInt(parts[2], 10);
          
          setCurrentYear(year);
          setCurrentMonth(month);
          setSelectedDay(day);
          
          const activeSlot = {
            id: apt.id,
            time: apt.time,
            patient: apt.patientName || apt.name || apt.patient || 'Bệnh nhân',
            gender: apt.gender || 'Nam',
            dob: apt.dob || '25-08-2000',
            phone: apt.phone || '0912345678',
            symptom: apt.symptoms || apt.symptom || 'Khám tổng quát',
            notes: apt.notes || '',
            status: apt.status
          };
          setSelectedAppointment(activeSlot);
        }
      }
    }
  }, [selectedId, appointments]);
  
  const getDaySchedule = (day) => {
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dayStr = `${currentYear}-${monthStr}-${day < 10 ? '0' + day : day}`;
    const myAppts = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.date === dayStr && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'));
    
    const morningTimes = ['8:00 - 9:00', '9:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30'];
    const afternoonTimes = ['13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'];
    
    const mapApptsToSlots = (times, prefix) => {
      return times.map((t, idx) => {
        const apt = myAppts.find(a => a.time.trim() === t);
        if (apt) {
          return {
            id: apt.id,
            time: apt.time,
            patient: apt.patientName || apt.name || apt.patient,
            gender: apt.gender || 'Nam',
            dob: apt.dob || '2000-08-25',
            phone: apt.phone || '0912345678',
            symptom: apt.symptoms || apt.symptom || 'Khám tổng quát',
            notes: apt.notes || ''
          };
        }
        return {
          id: `d-${day}-${prefix}${idx}`,
          time: t,
          patient: '',
          symptom: '----------------------------------------'
        };
      });
    };
    
    return {
      morning: mapApptsToSlots(morningTimes, 'm'),
      afternoon: mapApptsToSlots(afternoonTimes, 'a')
    };
  };

  const currentSchedule = getDaySchedule(selectedDay);

  // Get active slots for display/filtering
  const allMorningActive = (currentSchedule.morning || []).filter(s => s.patient && s.patient !== '');
  const allAfternoonActive = (currentSchedule.afternoon || []).filter(s => s.patient && s.patient !== '');

  let activeSlots = [];
  if (activeShiftFilter !== 'afternoon') {
    activeSlots.push(...allMorningActive);
  }
  if (activeShiftFilter !== 'morning') {
    activeSlots.push(...allAfternoonActive);
  }

  const filteredActiveSlots = activeSlots.filter(s => {
    if (!searchQuery.trim()) return true;
    return s.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
           (s.symptom && s.symptom.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Synchronize selectedAppointment when day, shift filter, or search changes
  useEffect(() => {
    if (selectedId) {
      const apt = appointments.find(a => a.id === selectedId);
      if (apt) {
        const parts = apt.date.split('-');
        if (parts.length === 3 && parseInt(parts[2], 10) === selectedDay) {
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[0], 10);
          if (month === currentMonth && year === currentYear) {
            if (selectedAppointment?.id === selectedId) {
              return;
            }
            const activeSlot = {
              id: apt.id,
              time: apt.time,
              patient: apt.patientName || apt.name || apt.patient || 'Bệnh nhân',
              symptom: apt.symptoms || apt.symptom || 'Khám tổng quát',
              notes: apt.notes || '',
              status: apt.status
            };
            setSelectedAppointment(activeSlot);
            return;
          }
        }
      }
    }

    if (filteredActiveSlots.length > 0) {
      const stillValid = filteredActiveSlots.find(s => s.id === selectedAppointment?.id);
      if (!stillValid) {
        setSelectedAppointment(filteredActiveSlots[0]);
      }
    } else {
      setSelectedAppointment(null);
    }
  }, [selectedDay, activeShiftFilter, searchQuery, appointments, selectedId, selectedAppointment?.id, currentMonth, currentYear]);

  // Calendar cells config dynamic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  const isDutyDay = (day) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, 2 is Tuesday, etc.
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  };

  // Days with active appointments
  const yearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const myConfirmedAppts = appointments.filter(a => a.doctorName === 'Bs. Huy' && a.date.startsWith(yearMonthStr) && (a.status === 'Đã xác nhận' || a.status === 'Đã đồng ý'));
  const appointmentDays = myConfirmedAppts.map(a => {
    const parts = a.date.split('-');
    return parseInt(parts[2], 10);
  });

  const getFormattedDateHeader = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const targetDate = new Date(dateStr);
    const wDays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${wDays[targetDate.getDay()]} ${formatDate(dateStr)}`;
  };

  const handleCellClick = (day) => {
    if (!day) return;
    setSelectedDay(day);
  };

  const handleSlotClick = (slot) => {
    if (!slot.patient) return;
    setSelectedAppointment(slot);
    triggerToast(`Đang xem chi tiết bệnh án khám của ${slot.patient}`, 'info');
  };

  return (
    <div className="animate-fade-in">
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '700', color: 'var(--text-dark)' }}>
          Danh sách lịch khám
        </h2>
      </div>

      <div className="filters-bar" style={{ marginBottom: '16px' }}>
        <div className="filter-group">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '220px', padding: '6px 10px' }}
          />
        </div>

        <div className="filter-group">
          <Filter size={14} />
          <select
            value={activeShiftFilter}
            onChange={(e) => setActiveShiftFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả ca trực</option>
            <option value="morning">Ca trực buổi sáng</option>
            <option value="afternoon">Ca trực buổi chiều</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setActiveShiftFilter('all');
              triggerToast('Đã xóa bộ lọc lịch khám', 'info');
            }}
            className="btn btn-outline"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
          >
            <Undo2 size={12} /> Hủy lọc
          </button>
        </div>
      </div>

      {/* Main Grid: Left Slots View vs Right Calendar View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Slots list & details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* TOP SECTION: List of all scheduled appointments */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-dark)', fontWeight: 700 }}>Danh sách ca khám</h3>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>{getFormattedDateHeader(selectedDay)}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredActiveSlots.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  Không có lịch khám nào trong ngày.
                </div>
              ) : (
                filteredActiveSlots.map((slot) => {
                  const isSelected = selectedAppointment && selectedAppointment.id === slot.id;
                  const isMorning = slot.time.startsWith('8:') || slot.time.startsWith('9:') || slot.time.startsWith('10:') || slot.time.startsWith('11:');
                  return (
                    <div
                      key={slot.id}
                      onClick={() => {
                        setSelectedAppointment(slot);
                        triggerToast(`Đang xem chi tiết lịch khám của ${slot.patient}`, 'info');
                      }}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? '#f0f9ff' : '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s',
                        boxShadow: isSelected ? '0 2px 4px rgba(3, 105, 161, 0.1)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{isMorning ? '☀️' : '🌙'} {slot.time}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>&bull;</span>
                          <span>{slot.patient}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }}>
                          {slot.symptom}
                        </div>
                      </div>

                      <span style={{ 
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        fontWeight: 600
                      }}>
                        {slot.phone || '0976425876'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination bar */}
            {filteredActiveSlots.length > 0 && (
              <div className="list-pagination-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '4px' }}>
                <span>
                  Hiển thị 1-{filteredActiveSlots.length} trong tổng số {filteredActiveSlots.length}
                </span>
                <div className="pagination-nav-group" style={{ display: 'flex', gap: '4px' }}>
                  <button className="pagination-nav-btn" disabled style={{ opacity: 0.5 }}>&lt;</button>
                  <button className="pagination-nav-btn" disabled style={{ opacity: 0.5 }}>&gt;</button>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM SECTION: Detailed information of the selected appointment */}
          {selectedAppointment ? (
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary)', fontWeight: 700 }}>Chi tiết lịch khám</h4>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mã: {selectedAppointment.id}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Họ tên bệnh nhân</span>
                  <div style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#f1f5f9', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    fontWeight: 600, 
                    color: '#1e293b' 
                  }}>
                    {selectedAppointment.patient}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Giới tính</span>
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f1f5f9', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 500, 
                      color: '#1e293b' 
                    }}>
                      {selectedAppointment.gender || 'Nam'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Ngày sinh</span>
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f1f5f9', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 500, 
                      color: '#1e293b' 
                    }}>
                      {selectedAppointment.dob ? (selectedAppointment.dob.includes('-') && selectedAppointment.dob.split('-')[0].length === 4 ? selectedAppointment.dob.split('-').reverse().join('-') : selectedAppointment.dob) : '18-05-2003'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Số điện thoại</span>
                  <div style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#f1f5f9', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    fontWeight: 500, 
                    color: '#1e293b' 
                  }}>
                    {selectedAppointment.phone || '0976425876'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Triệu chứng</span>
                  <div style={{ 
                    padding: '10px 12px', 
                    backgroundColor: '#f1f5f9', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    color: '#1e293b', 
                    minHeight: '60px', 
                    lineHeight: 1.4 
                  }}>
                    {selectedAppointment.symptom}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155' }}>Ghi chú</span>
                  <div style={{ 
                    padding: '10px 12px', 
                    backgroundColor: '#f1f5f9', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    fontSize: '0.8rem', 
                    minHeight: '44px', 
                    color: selectedAppointment.notes ? '#1e293b' : 'var(--text-muted)' 
                  }}>
                    {selectedAppointment.notes || 'Không có ghi chú thêm'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '24px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
              Vui lòng chọn một lịch khám từ danh sách phía trên để xem chi tiết thông tin.
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Grid Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button 
                onClick={handlePrevMonth}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px' }}
              >
                &larr;
              </button>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Tháng {currentMonth + 1}, {currentYear}</h3>
              <button 
                onClick={handleNextMonth}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px' }}
              >
                &rarr;
              </button>
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', color: 'var(--text-muted)', paddingBottom: '6px' }}>
                <div>CN</div>
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', gridAutoRows: 'minmax(36px, 1fr)' }}>
                {calendarCells.map((day, idx) => {
                  const hasAppts = appointmentDays.includes(day);
                  const isSelected = selectedDay === day;
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
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              {/* Back to Today button */}
              <button
                onClick={() => {
                  const today = new Date();
                  setCurrentYear(today.getFullYear());
                  setCurrentMonth(today.getMonth());
                  setSelectedDay(today.getDate());
                  setSelectedAppointment(null);
                  triggerToast('Đã quay lại lịch hôm nay', 'info');
                }}
                className="btn btn-outline"
                style={{ width: '100%', padding: '6px', marginTop: '12px', fontSize: '0.8rem', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', fontWeight: 600 }}
              >
                📅 Hôm nay
              </button>

            </div>
          </div>

          {/* Quick instructions legend */}
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 700 }}>Chú thích lịch biểu</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1.5px dashed #0284c7', fontSize: '0.7rem', fontWeight: '700' }}>T2</div>
                <span>Ngày trực khám (Thứ 2, 4, 6)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1.5px solid #0284c7', fontSize: '0.7rem', fontWeight: '700' }}>T4</div>
                <span>Ngày trực khám & có lịch hẹn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: '700' }}>31</div>
                <span>Ngày đang chọn xem</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1.5px solid var(--primary)', fontSize: '0.7rem', fontWeight: '700' }}>20</div>
                <span>Ngày thường có lịch hẹn</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
