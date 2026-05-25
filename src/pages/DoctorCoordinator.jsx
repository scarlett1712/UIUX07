import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, ArrowLeft, Camera, Undo2, Calendar, Clock, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

export default function DoctorCoordinator({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  doctors,
  setDoctors,
  triggerToast
}) {
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'shifts'

  // --- FILTERS ---
  const [docSearch, setDocSearch] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- SHIFT MODAL STATE ---
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShiftDay, setSelectedShiftDay] = useState(null);
  const [modalDoctor, setModalDoctor] = useState('Bs. Huy');
  const [modalTime, setModalTime] = useState('08:00 - 10:00');

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [docSearch, docSpecialty]);

  // --- FORM DATA FOR CRUD ---
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (currentView === 'doctor-add') {
      setOriginalData(null);
      setFormData({
        id: `DOC${Date.now().toString().slice(-3)}`,
        name: '',
        specialty: 'Ngoại tổng quát',
        phone: '',
        email: '',
        status: 'Đang làm việc',
        degree: 'Thạc sĩ Bác sĩ',
        biography: ''
      });
    } else if (currentView === 'doctor-edit') {
      const item = doctors.find(d => d.id === selectedId);
      if (item) {
        setFormData(JSON.parse(JSON.stringify(item)));
        setOriginalData(JSON.parse(JSON.stringify(item)));
      }
    }
  }, [currentView, selectedId, doctors]);

  useEffect(() => {
    if (currentView === 'doctor-shifts') {
      setActiveTab('shifts');
    } else if (currentView === 'doctor-list') {
      setActiveTab('doctors');
    }
  }, [currentView]);

  const isFieldModified = (fieldName) => {
    if (!originalData) return false;
    return formData[fieldName] !== originalData[fieldName];
  };

  // --- CRUD ACTIONS ---
  const handleSaveDoctor = () => {
    if (!formData.name.trim()) {
      triggerToast('Tên bác sĩ không được để trống', 'error');
      return;
    }
    if (currentView === 'doctor-add') {
      setDoctors([formData, ...doctors]);
      triggerToast('Đã thêm hồ sơ bác sĩ mới thành công!', 'success');
    } else {
      setDoctors(doctors.map(d => d.id === formData.id ? formData : d));
      triggerToast('Đã cập nhật hồ sơ bác sĩ thành công!', 'success');
    }
    onNavigate('doctor-list');
  };

  const handleDeleteDoctor = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ bác sĩ này?')) {
      setDoctors(doctors.filter(d => d.id !== id));
      triggerToast('Đã xóa hồ sơ bác sĩ thành công!', 'success');
      onNavigate('doctor-list');
    }
  };

  // --- CALENDAR GRID SHIFTS DATA (MAY 2026) ---
  const daysInMonth = 31;
  const startDayOffset = 5; // May 1st, 2026 is Friday
  const calendarCells = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // Shifts records matching mockup Image 3
  const [shifts, setShifts] = useState([
    { id: 1, date: '2026-05-09', title: 'Bs. B', time: '08:00 - 10:00', type: 'duty', color: '#c084fc', bg: '#f3e8ff' },
    { id: 2, date: '2026-05-11', title: 'Bs. Huy', time: '08:00 - 10:00', type: 'duty', color: '#4ade80', bg: '#f0fdf4' },
    { id: 3, date: '2026-05-17', title: 'Bs. C', time: '17:00 - 19:00', type: 'duty', color: '#facc15', bg: '#fef9c3' },
    { id: 4, date: '2026-05-20', title: 'Nghỉ lễ / Bảo trì phòng khám', time: 'Cả ngày', type: 'maintenance', color: '#94a3b8', bg: '#f1f5f9' }
  ]);

  // Clash Alerts matching bottom of Image 3
  const clashAlerts = [
    { id: 1, doctor: 'Bs. Huy', date: '06/05/2026', count: 2 },
    { id: 2, doctor: 'Bs. B', date: '07/05/2026', count: 3 },
    { id: 3, doctor: 'Bs. C', date: '09/05/2026', count: 2 }
  ];

  const getShiftsForDay = (day) => {
    if (!day) return [];
    const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
    return shifts.filter(s => s.date === dateStr);
  };

  const handleAddShift = (day) => {
    if (!day) return;
    setSelectedShiftDay(day);
    setModalDoctor('Bs. Huy');
    setModalTime('08:00 - 12:00');
    setShowShiftModal(true);
  };

  const handleSaveShiftModal = () => {
    if (!modalTime.trim()) {
      triggerToast('Vui lòng nhập giờ trực', 'error');
      return;
    }
    let color = '#4ade80';
    let bg = '#f0fdf4';
    if (modalDoctor === 'Bs. B') {
      color = '#c084fc';
      bg = '#f3e8ff';
    } else if (modalDoctor === 'Bs. C') {
      color = '#facc15';
      bg = '#fef9c3';
    }
    const newShift = {
      id: Date.now(),
      date: `2026-05-${selectedShiftDay.toString().padStart(2, '0')}`,
      title: modalDoctor,
      time: modalTime,
      type: 'duty',
      color,
      bg
    };
    setShifts([...shifts, newShift]);
    triggerToast(`Đã xếp ca trực cho ${modalDoctor} ngày ${selectedShiftDay}/05/2026`, 'success');
    setShowShiftModal(false);
  };

  // --- RENDERING SUBVIEWS ---

  // 1. DOCTOR LIST & SHIFTS VIEW
  if (currentView === 'doctor-list' || currentView === 'doctor-shifts') {
    const filteredDocs = doctors.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.specialty.toLowerCase().includes(docSearch.toLowerCase());
      const matchSpecialty = docSpecialty ? d.specialty === docSpecialty : true;
      return matchSearch && matchSpecialty;
    });
    const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;

    return (
      <div className="animate-fade-in">
        {/* Navigation tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '20px' }}>
          <button
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '10px 0',
              fontWeight: activeTab === 'doctors' ? '700' : '500',
              color: activeTab === 'doctors' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'doctors' ? '2px solid var(--primary)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Danh sách bác sĩ
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            style={{
              padding: '10px 0',
              fontWeight: activeTab === 'shifts' ? '700' : '500',
              color: activeTab === 'shifts' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'shifts' ? '2px solid var(--primary)' : 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Lịch trực bác sĩ
          </button>
        </div>

        {activeTab === 'doctors' ? (
          <div>
            <div className="flex align-center gap-4" style={{ marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Điều phối nhân sự</h3>
              <button className="plus-btn-circle" onClick={() => onNavigate('doctor-add')}>
                <Plus size={14} />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="filters-bar">
              <div className="filter-group">
                <Search size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ..."
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  className="form-input"
                  style={{ width: '180px', padding: '4px 8px' }}
                />
              </div>

              <div className="filter-group">
                <Filter size={14} />
                <select
                  value={docSpecialty}
                  onChange={(e) => setDocSpecialty(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Chuyên khoa</option>
                  <option value="Ngoại tổng quát">Ngoại tổng quát</option>
                  <option value="Nhi khoa">Nhi khoa</option>
                  <option value="Tai mũi họng">Tai mũi họng</option>
                  <option value="Tim mạch">Tim mạch</option>
                  <option value="Nội tổng quát">Nội tổng quát</option>
                </select>

                <button
                  onClick={() => {
                    setDocSearch('');
                    setDocSpecialty('');
                  }}
                  className="btn btn-outline"
                  style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
                >
                  <Undo2 size={12} /> Hủy
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
              <table className="custom-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Mã BS</th>
                    <th>Họ tên</th>
                    <th>Chuyên khoa</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th style={{ width: '120px' }}>Trạng thái</th>
                    <th style={{ width: '100px' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.filter(d => {
                    const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.specialty.toLowerCase().includes(docSearch.toLowerCase());
                    const matchSpecialty = docSpecialty ? d.specialty === docSpecialty : true;
                    return matchSearch && matchSpecialty;
                  }).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(d => (
                    <tr key={d.id} style={{ cursor: 'pointer' }} onClick={() => {
                      onSelectId(d.id);
                      onNavigate('doctor-details');
                    }}>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{d.id}</td>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td style={{ fontWeight: 500 }}>{d.specialty}</td>
                      <td>{d.phone}</td>
                      <td>{d.email}</td>
                      <td>
                        <span className={`badge ${d.status === 'Đang làm việc' ? 'badge-low' : d.status === 'Nghỉ phép' ? 'badge-medium' : 'badge-high'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button className="btn btn-outline" style={{ padding: '4px' }} onClick={() => {
                            onSelectId(d.id);
                            onNavigate('doctor-edit');
                          }}>
                            <Edit3 size={12} />
                          </button>
                          <button className="btn btn-outline" style={{ padding: '4px', color: 'red' }} onClick={() => handleDeleteDoctor(d.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="list-pagination-bar">
              <span>
                Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDocs.length)}-
                {Math.min(currentPage * itemsPerPage, filteredDocs.length)} trong tổng số {filteredDocs.length}
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
        ) : (
          /* Calendar shifts layout matching Image 3 */
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1rem' }}>Lịch trực bác sĩ</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '600' }}>&lt; Tháng 5, 2026 &gt;</span>
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                  <button className="btn btn-outline" style={{ padding: '4px 8px', border: 'none', fontSize: '0.75rem' }}>Ngày</button>
                  <button className="btn btn-outline" style={{ padding: '4px 8px', border: 'none', fontSize: '0.75rem' }}>Tuần</button>
                  <button className="btn btn-primary" style={{ padding: '4px 8px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}>Tháng</button>
                </div>
              </div>
            </div>

            {/* Grid */}
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'center', fontWeight: '600', fontSize: '0.75rem', padding: '6px 0', color: 'var(--text-muted)' }}>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(64px, 1fr)', backgroundColor: '#e2e8f0', gap: '1px' }}>
                {calendarCells.map((day, idx) => {
                  const dayShifts = getShiftsForDay(day);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleAddShift(day)}
                      style={{ backgroundColor: '#fff', padding: '4px', position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px', cursor: day ? 'pointer' : 'default' }}
                    >
                      {day && <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '2px' }}>{day}</span>}
                      {dayShifts.map((s) => (
                        <div
                          key={s.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Xóa ca trực của ${s.title} ngày ${day}/05/2026?`)) {
                              setShifts(shifts.filter(sh => sh.id !== s.id));
                              triggerToast('Đã xóa ca trực', 'info');
                            }
                          }}
                          style={{
                            padding: '2px 4px',
                            borderRadius: '3px',
                            backgroundColor: s.bg,
                            color: s.color,
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            borderLeft: `2px solid ${s.color}`,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <div>{s.title}</div>
                          <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>{s.time}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clash Alerts matching bottom of Image 3 */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'red' }}>
                <ShieldAlert size={18} />
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: 'red' }}>Cảnh báo trùng lịch ca trực</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {clashAlerts.map(c => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fff5f5',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ color: 'red' }}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{c.doctor} bị trùng lịch</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {c.date} • <strong style={{ color: 'red' }}>{c.count} ca trùng</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Modal for adding shift */}
          {showShiftModal && (
            <div className="shift-modal-backdrop" onClick={() => setShowShiftModal(false)}>
              <div className="shift-modal-card" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>Xếp ca trực mới</h3>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowShiftModal(false)}>
                    <X size={16} />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <div className="form-group">
                    <span className="form-group-label" style={{ marginBottom: '4px', display: 'block', fontSize: '0.85rem' }}>Chọn bác sĩ trực</span>
                    <select
                      value={modalDoctor}
                      onChange={(e) => setModalDoctor(e.target.value)}
                      className="form-select"
                      style={{ width: '100%', padding: '6px', fontSize: '0.85rem' }}
                    >
                      <option value="Bs. Huy">Bs. Huy (Ngoại tổng quát)</option>
                      <option value="Bs. B">Bs. B (Nhi khoa)</option>
                      <option value="Bs. C">Bs. C (Tai mũi họng)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <span className="form-group-label" style={{ marginBottom: '4px', display: 'block', fontSize: '0.85rem' }}>Khung giờ trực</span>
                    <input
                      type="text"
                      value={modalTime}
                      onChange={(e) => setModalTime(e.target.value)}
                      placeholder="Ví dụ: 08:00 - 12:00"
                      className="form-input"
                      style={{ width: '100%', padding: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                  <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowShiftModal(false)}>
                    Hủy
                  </button>
                  <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={handleSaveShiftModal}>
                    Lưu ca trực
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

  // 2. DOCTOR DETAILS VIEW
  if (currentView === 'doctor-details') {
    const item = doctors.find(d => d.id === selectedId);
    if (!item) return <div>Không tìm thấy hồ sơ bác sĩ</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('doctor-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Hồ sơ năng lực bác sĩ</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '20px', marginTop: '16px' }}>
          <div className="text-center" style={{ borderRight: '1px solid var(--border-color)', paddingRight: '16px' }}>
            <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', margin: '0 auto 12px auto' }}>
              <Camera size={32} />
            </div>
            <h4 style={{ margin: '4px 0 0 0' }}>{item.name}</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.degree}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div><strong>Chuyên khoa phụ trách:</strong> {item.specialty}</div>
            <div><strong>Số điện thoại:</strong> {item.phone}</div>
            <div><strong>Email liên hệ:</strong> {item.email}</div>
            <div><strong>Trạng thái hoạt động:</strong> <span className={`badge ${item.status === 'Đang làm việc' ? 'badge-low' : 'badge-medium'}`}>{item.status}</span></div>
            {item.biography && <div style={{ marginTop: '8px' }}><strong>Tiểu sử & Kinh nghiệm:</strong> <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.5 }}>{item.biography}</p></div>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('doctor-edit')}><Edit3 size={14} /> Chỉnh sửa</button>
          <button className="btn btn-outline" style={{ color: 'red' }} onClick={() => handleDeleteDoctor(item.id)}><Trash2 size={14} /> Xóa bác sĩ</button>
        </div>
      </div>
    );
  }

  // 3. EDIT/ADD DOCTOR VIEW
  if (currentView === 'doctor-edit' || currentView === 'doctor-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('doctor-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {currentView === 'doctor-add' ? 'Thêm bác sĩ mới' : 'Chỉnh sửa hồ sơ bác sĩ'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group">
            <span className="form-group-label">Họ và tên bác sĩ</span>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Văn A..."
              className={`form-input ${isFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Học hàm / Học vị</span>
            <input
              type="text"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              placeholder="VD: Thạc sĩ Bác sĩ..."
              className={`form-input ${isFieldModified('degree') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Chuyên khoa</span>
            <select
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className={`form-select ${isFieldModified('specialty') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Ngoại tổng quát">Ngoại tổng quát</option>
              <option value="Nhi khoa">Nhi khoa</option>
              <option value="Tai mũi họng">Tai mũi họng</option>
              <option value="Tim mạch">Tim mạch</option>
              <option value="Nội tổng quát">Nội tổng quát</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Số điện thoại</span>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Nhập số điện thoại..."
              className={`form-input ${isFieldModified('phone') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Email liên hệ</span>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Nhập email..."
              className={`form-input ${isFieldModified('email') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Trạng thái làm việc</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`form-select ${isFieldModified('status') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Đang làm việc">Đang làm việc</option>
              <option value="Nghỉ phép">Nghỉ phép</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Giới thiệu ngắn</span>
            <textarea
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              placeholder="Tóm tắt quá trình công tác..."
              className={`form-input form-textarea ${isFieldModified('biography') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>
        </div>

        <div className="form-action-buttons" style={{ marginTop: '20px' }}>
          <button className="btn btn-cancel" onClick={() => onNavigate('doctor-list')}>Hủy</button>
          <button className="btn btn-save" onClick={handleSaveDoctor}>Lưu hồ sơ</button>
        </div>
      </div>
    );
  }

  return null;
}
