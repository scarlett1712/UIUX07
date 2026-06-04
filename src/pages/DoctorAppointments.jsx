import React, { useState } from 'react';
import { formatDate } from '../utils/date';
import { Search, Filter, Calendar as CalendarIcon, Clock, Check, X, AlertCircle, Undo2 } from 'lucide-react';

export default function DoctorAppointments({ onNavigate, appointments = [], setAppointments, triggerToast }) {
  const [selectedAptId, setSelectedAptId] = useState('APT008'); // default pending appointment
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const itemsPerPage = 4;

  const handleApprove = (id) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'Đã xác nhận' } : apt));
    triggerToast('Đã phê duyệt lịch hẹn khám thành công!', 'success');
  };

  const handleOpenReject = () => {
    setRejectReason('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      triggerToast('Vui lòng nhập lý do từ chối lịch hẹn', 'error');
      return;
    }
    setAppointments(appointments.map(apt => apt.id === selectedAptId ? { ...apt, status: 'Đã từ chối', reason: rejectReason } : apt));
    setShowRejectModal(false);
    triggerToast('Đã từ chối lịch hẹn khám và gửi phản hồi!', 'info');
  };

  const getDayStr = (dateStr) => {
    if (!dateStr) return '';
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const date = new Date(dateStr);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayName} ${day}/${month}`;
  };

  // Get appointments of Bs. Huy and map properties for compatibility
  const myAppointments = appointments
    .filter(a => a.doctorName === 'Bs. Huy')
    .map(a => ({
      ...a,
      name: a.patientName || a.name || a.patient || 'Bệnh nhân',
      symptom: a.symptom || a.symptoms || 'Khám lâm sàng',
      fullSymptom: a.fullSymptom || a.symptoms || a.symptom || 'Khám lâm sàng',
      dayStr: getDayStr(a.date)
    }));

  const activeApt = myAppointments.find(apt => apt.id === selectedAptId) || myAppointments[0];

  // Filters logic
  const filteredApts = myAppointments.filter(apt => {
    const term = searchQuery.toLowerCase();
    const nameStr = (apt.name || '').toLowerCase();
    const symptomStr = (apt.symptom || '').toLowerCase();
    const matchesSearch = nameStr.includes(term) || symptomStr.includes(term);
    const matchesStatus = statusFilter === '' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedApts = [...filteredApts].sort((a, b) => {
    const isAPending = a.status === 'Chờ xác nhận';
    const isBPending = b.status === 'Chờ xác nhận';
    if (isAPending && !isBPending) return -1;
    if (!isAPending && isBPending) return 1;
    return 0;
  });

  const totalItems = sortedApts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApts = sortedApts.slice(startIndex, startIndex + itemsPerPage);

  // Calendar render helpers dynamic
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay();
  const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

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

  const isDutyDay = (day) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
  };

  // Days with active/pending appointments for Bs. Huy in current month
  const yearMonthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const myMonthAppts = myAppointments.filter(a => a.date.startsWith(yearMonthStr));
  const appointmentDays = myMonthAppts.map(a => {
    const parts = a.date.split('-');
    return parseInt(parts[2], 10);
  });

  const handleCellClick = (day) => {
    if (!day) return;
    const monthStr = String(currentMonth + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${monthStr}-${day < 10 ? '0' + day : day}`;
    const matched = myAppointments.find(apt => apt.date === dateStr);
    if (matched) {
      setSelectedAptId(matched.id);
      triggerToast(`Đã chọn lịch hẹn ngày ${formatDate(dateStr)}`, 'info');
    } else {
      triggerToast(`Không có yêu cầu lịch hẹn vào ngày ${formatDate(dateStr)}`, 'info');
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top filter header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
          Danh sách lịch hẹn
        </h2>
      </div>

      <div className="filters-bar" style={{ marginBottom: '16px' }}>
        <div className="filter-group">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="form-input"
            style={{ width: '220px', padding: '6px 10px' }}
          />
        </div>

        <div className="filter-group">
          <Filter size={14} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="filter-select"
          >
            <option value="">Trạng thái</option>
            <option value="Đã xác nhận">Đã xác nhận</option>
            <option value="Chờ xác nhận">Chờ xác nhận</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('');
              triggerToast('Đã xóa bộ lọc lịch hẹn', 'info');
            }}
            className="btn btn-outline"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
          >
            <Undo2 size={12} /> Hủy lọc
          </button>
        </div>
      </div>

      {/* Split view: List vs Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: List & details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-dark)' }}>Yêu cầu hẹn khám</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paginatedApts.map((apt) => {
                const isSelected = apt.id === selectedAptId;
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAptId(apt.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? '#f0f9ff' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                        {formatDate(apt.date)} &nbsp;&bull;&nbsp; {apt.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {apt.time} &nbsp;&bull;&nbsp; {apt.symptom}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge`} style={{ 
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: apt.status === 'Chờ xác nhận' ? '#fef3c7' : (apt.status === 'Đã đồng ý' || apt.status === 'Đã xác nhận') ? '#d1fae5' : '#fee2e2',
                        color: apt.status === 'Chờ xác nhận' ? '#d97706' : (apt.status === 'Đã đồng ý' || apt.status === 'Đã xác nhận') ? '#065f46' : '#dc2626'
                      }}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Bar */}
            <div className="list-pagination-bar">
              <span>
                Hiển thị {Math.min(startIndex + 1, totalItems)}-
                {Math.min(startIndex + paginatedApts.length, totalItems)} trong tổng số {totalItems}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            </div>

          </div>

          {/* Detailed Request Actions Panel */}
          {activeApt && (
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Thông tin yêu cầu</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge" style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: activeApt.status === 'Chờ xác nhận' ? '#fef3c7' : (activeApt.status === 'Đã đồng ý' || activeApt.status === 'Đã xác nhận') ? '#d1fae5' : '#fee2e2',
                    color: activeApt.status === 'Chờ xác nhận' ? '#d97706' : (activeApt.status === 'Đã đồng ý' || activeApt.status === 'Đã xác nhận') ? '#065f46' : '#dc2626'
                  }}>
                    {activeApt.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mã: {activeApt.id}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bệnh nhân:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{activeApt.name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thời gian đề xuất:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatDate(activeApt.date)} ({activeApt.time})</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mô tả triệu chứng:</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-dark)', lineHeight: 1.4, padding: '8px', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid var(--primary-light)' }}>
                  {activeApt.fullSymptom}
                </p>
              </div>

              {activeApt.status === 'Đã từ chối' && (
                <div style={{ fontSize: '0.8rem', padding: '8px', backgroundColor: '#fff5f5', border: '1px solid #fee2e2', borderRadius: '6px', color: '#dc2626' }}>
                  <strong>Lý do từ chối:</strong> {activeApt.reason}
                </div>
              )}

              {activeApt.status === 'Chờ xác nhận' && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '10px' }}>
                  <button
                    onClick={handleOpenReject}
                    className="btn btn-outline"
                    style={{ color: '#dc2626', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 16px' }}
                  >
                    <X size={14} /> Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(activeApt.id)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 16px' }}
                  >
                    <Check size={14} /> Đồng ý
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Calendar View (Dynamic Month & Duty shifts) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card" style={{ padding: '20px', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button 
                onClick={handlePrevMonth}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px' }}
              >
                &larr;
              </button>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                Tháng {currentMonth + 1}, {currentYear}
              </h3>
              <button 
                onClick={handleNextMonth}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px' }}
              >
                &rarr;
              </button>
            </div>

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
                  const monthStr = String(currentMonth + 1).padStart(2, '0');
                  const dateStr = `${currentYear}-${monthStr}-${day < 10 ? '0' + day : day}`;
                  const isSelected = activeApt && activeApt.date === dateStr;
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
                  const yyyy = today.getFullYear();
                  const mm = String(today.getMonth() + 1).padStart(2, '0');
                  const dd = String(today.getDate()).padStart(2, '0');
                  const todayDateStr = `${yyyy}-${mm}-${dd}`;
                  
                  setCurrentYear(yyyy);
                  setCurrentMonth(today.getMonth());
                  
                  const matched = myAppointments.find(apt => apt.date === todayDateStr);
                  if (matched) {
                    setSelectedAptId(matched.id);
                  }
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
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0 }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 700 }}>Chú thích lịch biểu</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1.5px dashed #0284c7', fontSize: '0.7rem', fontWeight: '700' }}>T2</div>
                <span>Ngày trực khám cố định (Thứ 2, 4, 6)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1', border: '1.5px solid #0284c7', fontSize: '0.7rem', fontWeight: '700' }}>T4</div>
                <span>Ngày trực & có yêu cầu lịch hẹn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: '700' }}>03</div>
                <span>Ngày hẹn đang chọn xem</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', backgroundColor: 'transparent', color: 'var(--text-dark)', border: '1.5px solid var(--primary)', fontSize: '0.7rem', fontWeight: '700' }}>05</div>
                <span>Ngày thường có yêu cầu hẹn</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* REJECT APPOINTMENT MODAL */}
      {showRejectModal && (
        <div className="shift-modal-backdrop" onClick={() => setShowRejectModal(false)}>
          <div className="shift-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#dc2626', fontWeight: 700 }}>Từ chối yêu cầu lịch hẹn</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowRejectModal(false)}>
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
              Bạn đang từ chối lịch hẹn của bệnh nhân <strong>{activeApt.name}</strong> ngày {formatDate(activeApt.date)}. Vui lòng nhập lý do từ chối để hệ thống gửi thông báo phản hồi lại cho bệnh nhân:
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <span className="form-group-label" style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Lý do từ chối</span>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Bác sĩ có ca phẫu thuật đột xuất, vui lòng chọn khung giờ khác..."
                className="form-input"
                style={{ width: '100%', minHeight: '80px', padding: '8px', fontSize: '0.8rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.8rem' }} onClick={() => setShowRejectModal(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#dc2626', border: 'none', padding: '6px 16px', fontSize: '0.8rem' }} onClick={handleConfirmReject}>
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
