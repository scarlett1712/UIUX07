import React, { useState } from 'react';
import { Search, Filter, Calendar as CalendarIcon, Clock, Check, X, AlertCircle } from 'lucide-react';

export default function DoctorAppointments({ onNavigate, triggerToast }) {
  const [selectedAptId, setSelectedAptId] = useState('APT901'); // default first one
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Pending appointments list mock database (June 2026)
  const [appointments, setAppointments] = useState([
    { id: 'APT901', name: 'Vũ Anh Long', date: '2026-06-15', dayStr: 'Thứ 6 15/6', time: '8:00 - 9:00', symptom: 'Đau tai, chảy dịch', fullSymptom: 'Đau tai phải từ hôm qua, có dịch mủ vàng chảy ra kèm sốt nhẹ.', status: 'Chờ xác nhận' },
    { id: 'APT902', name: 'Nguyễn Minh Anh', date: '2026-06-16', dayStr: 'Thứ 7 16/6', time: '9:00 - 10:00', symptom: 'Sốt cao, ho khan', fullSymptom: 'Sốt nóng lạnh 39 độ C kèm ho khan tức ngực.', status: 'Chờ xác nhận' },
    { id: 'APT903', name: 'Trần Phương Huế', date: '2026-06-18', dayStr: 'Thứ 2 18/6', time: '15:00 - 16:00', symptom: 'Đau đầu, chóng mặt', fullSymptom: 'Đau nửa đầu vai gáy ê ẩm, chóng mặt khi đứng lên.', status: 'Chờ xác nhận' },
    { id: 'APT904', name: 'Lê Hải Minh', date: '2026-06-21', dayStr: 'Thứ 5 21/6', time: '9:00 - 10:00', symptom: 'Khó thở nhẹ, tức ngực', fullSymptom: 'Cảm giác hụt hơi khi leo cầu thang, nặng ngực khi ngủ.', status: 'Chờ xác nhận' },
    { id: 'APT905', name: 'Phan Quốc Bảo', date: '2026-06-22', dayStr: 'Thứ 6 22/6', time: '14:00 - 15:00', symptom: 'Ù tai lâu ngày', fullSymptom: 'Ù tai trái kéo dài hơn 1 tuần, nghe kém.', status: 'Chờ xác nhận' }
  ]);

  const itemsPerPage = 4;

  const handleApprove = (id) => {
    setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'Đã đồng ý' } : apt));
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

  const activeApt = appointments.find(apt => apt.id === selectedAptId) || appointments[0];

  // Filters logic
  const filteredApts = appointments.filter(apt => {
    return apt.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           apt.symptom.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalItems = filteredApts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApts = filteredApts.slice(startIndex, startIndex + itemsPerPage);

  // Calendar render helpers (June 2026)
  // June 1st 2026 is Monday (starts at index 0 if Mon=0)
  const daysInMonth = 30;
  const startOffset = 1; // Mon = index 1 in Sun-Sat scheme (Sun=0, Mon=1)
  const weekdays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

  // June dates corresponding to appointments
  const appointmentDays = [15, 16, 18, 21, 22];

  const handleCellClick = (day) => {
    if (!day) return;
    const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
    const matched = appointments.find(apt => apt.date === dateStr);
    if (matched) {
      setSelectedAptId(matched.id);
      triggerToast(`Đã chọn lịch hẹn ngày ${day}/06/2026`, 'info');
    } else {
      triggerToast(`Không có yêu cầu lịch hẹn vào ngày ${day}/06/2026`, 'info');
    }
  };

  return (
    <div className="animate-fade-in">
      
      {/* Top filter header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Danh sách lịch hẹn</h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="filter-group" style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '150px' }}
            />
          </div>
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
                        {apt.dayStr} &nbsp;&bull;&nbsp; {apt.name}
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
                        backgroundColor: apt.status === 'Chờ xác nhận' ? '#fef3c7' : apt.status === 'Đã đồng ý' ? '#d1fae5' : '#fee2e2',
                        color: apt.status === 'Chờ xác nhận' ? '#d97706' : apt.status === 'Đã đồng ý' ? '#065f46' : '#dc2626'
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
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Thông tin yêu cầu</h4>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mã: {activeApt.id}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bệnh nhân:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{activeApt.name}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Thời gian đề xuất:</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{activeApt.dayStr} ({activeApt.time})</div>
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

        {/* RIGHT COLUMN: Calendar View (June 2026) */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              &larr;
            </button>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Tháng 6, 2026</h3>
            <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
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
                const isSelected = activeApt && activeApt.date === `2026-06-${day < 10 ? '0' + day : day}`;

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
              Bạn đang từ chối lịch hẹn của bệnh nhân <strong>{activeApt.name}</strong> ngày {activeApt.dayStr}. Vui lòng nhập lý do từ chối để hệ thống gửi thông báo phản hồi lại cho bệnh nhân:
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
