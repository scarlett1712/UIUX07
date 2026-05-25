import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Search, Filter, Clock, Eye, AlertCircle, ChevronLeft, ChevronRight, X, User } from 'lucide-react';

// Appointments database for May 2026
const appointmentsByDay = {
  7: {
    morning: [
      { id: 'APT101', time: '8:00 - 9:00', patient: 'Ngô Gia Bảo', gender: 'Nam', dob: '2015-06-18', phone: '0977889900', symptom: 'Đau đầu, chóng mặt nhiều ngày, buồn nôn nhẹ.' },
      { id: 'APT102', time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT103', time: '10:00 - 11:00', patient: '', symptom: '----------------------------------------' }
    ],
    afternoon: [
      { id: 'APT104', time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT105', time: '14:00 - 15:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT106', time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' }
    ]
  },
  9: {
    morning: [
      { id: 'APT201', time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT202', time: '9:00 - 10:00', patient: 'Lê Hải Minh', gender: 'Nam', dob: '1992-03-14', phone: '0901223344', symptom: 'Mỏi mắt, nhức mỏi cơ và khô giác mạc nhẹ.' },
      { id: 'APT203', time: '10:00 - 11:00', patient: '', symptom: '----------------------------------------' }
    ],
    afternoon: [
      { id: 'APT204', time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT205', time: '14:00 - 15:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT206', time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' }
    ]
  },
  11: {
    morning: [
      { id: 'APT301', time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT302', time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT303', time: '10:00 - 11:00', patient: 'Nguyễn Minh Anh', gender: 'Nữ', dob: '2000-08-25', phone: '0912345678', symptom: 'Sốt cao 39 độ C đột ngột, ho đờm và đau họng.' }
    ],
    afternoon: [
      { id: 'APT304', time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT305', time: '14:00 - 15:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT306', time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' }
    ]
  },
  14: {
    morning: [
      { id: 'APT401', time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT402', time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT403', time: '10:00 - 11:00', patient: '', symptom: '----------------------------------------' }
    ],
    afternoon: [
      { id: 'APT404', time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { id: 'APT405', time: '14:00 - 15:00', patient: 'Trần Phương Huế', gender: 'Nữ', dob: '1985-09-02', phone: '0933456789', symptom: 'Đau tức vùng bụng thượng vị âm ỉ kéo dài.' },
      { id: 'APT406', time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' }
    ]
  }
};

const getDaySchedule = (day) => {
  const defaultSchedule = {
    morning: [
      { id: `d-${day}-m1`, time: '8:00 - 9:00', patient: '', symptom: '----------------------------------------' },
      { id: `d-${day}-m2`, time: '9:00 - 10:00', patient: '', symptom: '----------------------------------------' },
      { id: `d-${day}-m3`, time: '10:00 - 11:00', patient: '', symptom: '----------------------------------------' }
    ],
    afternoon: [
      { id: `d-${day}-a1`, time: '13:00 - 14:00', patient: '', symptom: '----------------------------------------' },
      { id: `d-${day}-a2`, time: '14:00 - 15:00', patient: '', symptom: '----------------------------------------' },
      { id: `d-${day}-a3`, time: '15:00 - 16:00', patient: '', symptom: '----------------------------------------' }
    ]
  };
  return appointmentsByDay[day] || defaultSchedule;
};

export default function DoctorSchedule({ onNavigate, triggerToast }) {
  const [selectedDay, setSelectedDay] = useState(7); // default 7th May 2026
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShiftFilter, setActiveShiftFilter] = useState('all'); // 'all', 'morning', 'afternoon'
  
  // Initialize selectedAppointment to first active appointment on Day 7
  const [selectedAppointment, setSelectedAppointment] = useState(() => {
    const schedule = getDaySchedule(7);
    const activeSlots = [...schedule.morning, ...schedule.afternoon].filter(s => s.patient && s.patient !== '');
    return activeSlots[0] || null;
  });

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
    if (filteredActiveSlots.length > 0) {
      const stillValid = filteredActiveSlots.find(s => s.id === selectedAppointment?.id);
      if (!stillValid) {
        setSelectedAppointment(filteredActiveSlots[0]);
      }
    } else {
      setSelectedAppointment(null);
    }
  }, [selectedDay, activeShiftFilter, searchQuery]);

  // Calendar cells config (May 2026)
  const daysInMonth = 31;
  const startOffset = 4; // May 1st is Friday
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  // Days with active appointments
  const appointmentDays = [7, 9, 11, 14];

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
      
      {/* Top Header Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Danh sách lịch khám</h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Search */}
          <div className="filter-group" style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '150px' }}
            />
          </div>

          {/* Shift filters */}
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' }}>
            <button
              onClick={() => setActiveShiftFilter('all')}
              className={`btn ${activeShiftFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
            >
              Tất cả ca
            </button>
            <button
              onClick={() => setActiveShiftFilter('morning')}
              className={`btn ${activeShiftFilter === 'morning' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
            >
              Buổi sáng
            </button>
            <button
              onClick={() => setActiveShiftFilter('afternoon')}
              className={`btn ${activeShiftFilter === 'afternoon' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
            >
              Buổi chiều
            </button>
          </div>
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
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>Thứ 5, {selectedDay}/5/2026</span>
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
                      {selectedAppointment.dob ? selectedAppointment.dob.split('-').reverse().join('/') : '18/05/2003'}
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
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &larr;
              </button>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Tháng 5, 2026</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &rarr;
              </button>
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', color: 'var(--text-muted)', paddingBottom: '6px' }}>
                <div>Chủ Nhật</div>
                <div>Thứ 2</div>
                <div>Thứ 3</div>
                <div>Thứ 4</div>
                <div>Thứ 5</div>
                <div>Thứ 6</div>
                <div>Thứ 7</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', gridAutoRows: 'minmax(36px, 1fr)' }}>
                {calendarCells.map((day, idx) => {
                  const hasAppts = appointmentDays.includes(day);
                  const isSelected = selectedDay === day;

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
                        fontWeight: isSelected || hasAppts ? '700' : '400',
                        cursor: day ? 'pointer' : 'default',
                        position: 'relative',
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? '#fff' : (day ? 'var(--text-dark)' : 'transparent'),
                        border: hasAppts && !isSelected ? '1.5px solid var(--primary)' : 'none',
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
                  setSelectedDay(7);
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

          {/* Quick instructions alert */}
          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--primary-light)', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <AlertCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <strong>Chú thích:</strong> Các ngày có ca trực khám bệnh được <strong>khoanh viền xanh đậm</strong> trên lịch lưới.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
