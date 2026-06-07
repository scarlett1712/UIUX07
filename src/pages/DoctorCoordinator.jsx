import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Filter, Trash2, Edit3, ArrowLeft, Camera, Undo2, Calendar, Clock, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

const getStatusBadgeStyle = (status) => {
  if (status === 'Đang làm việc') {
    return { backgroundColor: '#d1fae5', color: '#065f46' };
  }
  if (status === 'Nghỉ phép') {
    return { backgroundColor: '#fef3c7', color: '#d97706' };
  }
  return { backgroundColor: '#e2e8f0', color: '#475569' };
};

export default function DoctorCoordinator({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  doctors,
  setDoctors,
  triggerToast,
  showConfirm
}) {
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' or 'shifts'

  // --- FILTERS ---
  const [docSearch, setDocSearch] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('');

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // --- SHIFT MODAL STATE ---
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShiftDay, setSelectedShiftDay] = useState(null);
  const [modalDoctor, setModalDoctor] = useState('Bs. Huy');
  const [modalTime, setModalTime] = useState('08:00 - 10:00');
  const [editingShift, setEditingShift] = useState(null);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [docSearch, docSpecialty]);

  // --- FORM DATA FOR CRUD ---
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (currentView === 'doctor-add') {
      setOriginalData(null);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
        triggerToast('Đã khôi phục bản nháp hồ sơ bác sĩ', 'info');
      } else {
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
      }
    } else if (currentView === 'doctor-edit') {
      const item = doctors.find(d => d.id === selectedId);
      if (item) {
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
          triggerToast('Đã khôi phục bản nháp hồ sơ bác sĩ', 'info');
        } else {
          setFormData(JSON.parse(JSON.stringify(item)));
        }
        setOriginalData(JSON.parse(JSON.stringify(item)));
      }
    }
  }, [currentView, selectedId, doctors]);

  // Save doctor form draft
  useEffect(() => {
    if (formData && (currentView.includes('add') || currentView.includes('edit'))) {
      const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, currentView, selectedId]);

  const handleCancelDraft = () => {
    const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
    localStorage.removeItem(draftKey);
    triggerToast('Đã hủy và xóa bản nháp', 'info');
    onNavigate('doctor-list');
    setFormData(null);
    setOriginalData(null);
  };

  useEffect(() => {
    if (currentView === 'doctor-shifts') {
      setActiveTab('shifts');
    } else if (currentView === 'doctor-list') {
      setActiveTab('doctors');
    }
  }, [currentView]);

  const isFieldModified = (fieldName) => {
    if (!originalData) {
      const val = formData ? formData[fieldName] : null;
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    }
    return formData[fieldName] !== originalData[fieldName];
  };

  // --- CRUD ACTIONS ---
  const handleSaveDoctor = () => {
    if (!formData.name.trim()) {
      triggerToast('Tên bác sĩ không được để trống', 'error');
      return;
    }
    localStorage.removeItem(`draft_${currentView}_${selectedId || 'new'}`);
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
    showConfirm('Bạn có chắc chắn muốn xóa hồ sơ bác sĩ này?', () => {
      setDoctors(doctors.filter(d => d.id !== id));
      triggerToast('Đã xóa hồ sơ bác sĩ thành công!', 'success');
      onNavigate('doctor-list');
    });
  };

  // --- CALENDAR GRID SHIFTS DATA (DYNAMIC BASED ON STATE) ---
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June (0-indexed 5)
  const [calendarView, setCalendarView] = useState('month'); // 'day', 'week', 'month'
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(today.getDate());

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay(); // Sunday=0, Monday=1
  const startDayOffset = firstDay; // Sunday is index 0
  const calendarCells = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const selectedDayIndex = calendarCells.findIndex(d => d === selectedCalendarDay);
  const weekIndex = selectedDayIndex !== -1 ? Math.floor(selectedDayIndex / 7) : 0;
  const weekCells = calendarCells.slice(weekIndex * 7, (weekIndex + 1) * 7);

  const generateInitialShifts = () => {
    const initialShifts = [];
    let idCounter = 1;
    // Base shifts generated for June 2026
    const baseDays = 30;
    for (let day = 1; day <= baseDays; day++) {
      const date = new Date(2026, 5, day);
      const dayOfWeek = date.getDay();
      const dateStr = `2026-06-${String(day).padStart(2, '0')}`;

      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        initialShifts.push({
          id: idCounter++,
          date: dateStr,
          title: 'Bs. Huy',
          time: '08:00 - 12:00',
          type: 'duty',
          color: '#4ade80',
          bg: '#f0fdf4'
        });
      }
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        initialShifts.push({
          id: idCounter++,
          date: dateStr,
          title: 'Bs. B',
          time: '08:00 - 12:00',
          type: 'duty',
          color: '#c084fc',
          bg: '#f3e8ff'
        });
      }
      if (dayOfWeek === 6) {
        initialShifts.push({
          id: idCounter++,
          date: dateStr,
          title: 'Bs. C',
          time: '09:00 - 12:00',
          type: 'duty',
          color: '#facc15',
          bg: '#fef9c3'
        });
      }
    }
    return initialShifts;
  };

  const generateShiftsForMonth = (year, month) => {
    const days = new Date(year, month + 1, 0).getDate();
    const initialShifts = [];
    let idCounter = 1;
    for (let day = 1; day <= days; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        initialShifts.push({
          id: `shift-${year}-${month}-${idCounter++}`,
          date: dateStr,
          title: 'Bs. Huy',
          time: '08:00 - 12:00',
          type: 'duty',
          color: '#4ade80',
          bg: '#f0fdf4'
        });
      }
      if (dayOfWeek === 2 || dayOfWeek === 4) {
        initialShifts.push({
          id: `shift-${year}-${month}-${idCounter++}`,
          date: dateStr,
          title: 'Bs. B',
          time: '08:00 - 12:00',
          type: 'duty',
          color: '#c084fc',
          bg: '#f3e8ff'
        });
      }
      if (dayOfWeek === 6) {
        initialShifts.push({
          id: `shift-${year}-${month}-${idCounter++}`,
          date: dateStr,
          title: 'Bs. C',
          time: '09:00 - 12:00',
          type: 'duty',
          color: '#facc15',
          bg: '#fef9c3'
        });
      }
    }
    return initialShifts;
  };

  const [shifts, setShifts] = useState(generateInitialShifts());

  // Proactively generate mock shifts for other months/years if navigate
  useEffect(() => {
    const monthKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}`;
    const hasShifts = shifts.some(s => s.date.startsWith(monthKey));
    if (!hasShifts) {
      const newShifts = generateShiftsForMonth(calendarYear, calendarMonth);
      setShifts(prev => [...prev, ...newShifts]);
    }
  }, [calendarYear, calendarMonth]);

  const handlePrev = () => {
    if (calendarView === 'day') {
      const d = new Date(calendarYear, calendarMonth, selectedCalendarDay);
      d.setDate(d.getDate() - 1);
      setCalendarYear(d.getFullYear());
      setCalendarMonth(d.getMonth());
      setSelectedCalendarDay(d.getDate());
    } else if (calendarView === 'week') {
      const d = new Date(calendarYear, calendarMonth, selectedCalendarDay);
      d.setDate(d.getDate() - 7);
      setCalendarYear(d.getFullYear());
      setCalendarMonth(d.getMonth());
      setSelectedCalendarDay(d.getDate());
    } else {
      // month
      let newMonth = calendarMonth - 1;
      let newYear = calendarYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear -= 1;
      }
      setCalendarYear(newYear);
      setCalendarMonth(newMonth);
      const maxDays = new Date(newYear, newMonth + 1, 0).getDate();
      if (selectedCalendarDay > maxDays) {
        setSelectedCalendarDay(maxDays);
      }
    }
  };

  const handleNext = () => {
    if (calendarView === 'day') {
      const d = new Date(calendarYear, calendarMonth, selectedCalendarDay);
      d.setDate(d.getDate() + 1);
      setCalendarYear(d.getFullYear());
      setCalendarMonth(d.getMonth());
      setSelectedCalendarDay(d.getDate());
    } else if (calendarView === 'week') {
      const d = new Date(calendarYear, calendarMonth, selectedCalendarDay);
      d.setDate(d.getDate() + 7);
      setCalendarYear(d.getFullYear());
      setCalendarMonth(d.getMonth());
      setSelectedCalendarDay(d.getDate());
    } else {
      // month
      let newMonth = calendarMonth + 1;
      let newYear = calendarYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear += 1;
      }
      setCalendarYear(newYear);
      setCalendarMonth(newMonth);
      const maxDays = new Date(newYear, newMonth + 1, 0).getDate();
      if (selectedCalendarDay > maxDays) {
        setSelectedCalendarDay(maxDays);
      }
    }
  };

  const getCalendarHeaderLabel = () => {
    if (calendarView === 'day') {
      return `Ngày ${selectedCalendarDay} Tháng ${calendarMonth + 1}, ${calendarYear}`;
    } else if (calendarView === 'week') {
      const currentSelected = new Date(calendarYear, calendarMonth, selectedCalendarDay);
      const dayOfWeek = currentSelected.getDay(); // 0 = Sunday, 1 = Monday
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const monday = new Date(currentSelected);
      monday.setDate(currentSelected.getDate() + diffToMonday);
      
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      
      const formatShortDate = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      return `Tuần ${formatShortDate(monday)} - ${formatShortDate(sunday)}, ${sunday.getFullYear()}`;
    } else {
      return `Tháng ${calendarMonth + 1}, ${calendarYear}`;
    }
  };

  // Clash Alerts matching bottom of Image 3
  const clashAlerts = [
    { id: 1, doctor: 'Bs. Huy', date: `06/${String(calendarMonth + 1).padStart(2, '0')}/${calendarYear}`, count: 2 },
    { id: 2, doctor: 'Bs. B', date: `07/${String(calendarMonth + 1).padStart(2, '0')}/${calendarYear}`, count: 3 },
    { id: 3, doctor: 'Bs. C', date: `09/${String(calendarMonth + 1).padStart(2, '0')}/${calendarYear}`, count: 2 }
  ];

  const getShiftsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return shifts.filter(s => s.date === dateStr);
  };

  const getClashesForDay = (day) => {
    if (!day) return [];
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = String(calendarMonth + 1).padStart(2, '0');
    const dateStr = `${dayStr}/${monthStr}/${calendarYear}`;
    return clashAlerts.filter(c => c.date === dateStr);
  };

  const handleAddShift = (day) => {
    if (!day) return;
    setSelectedShiftDay(day);
    setModalDoctor('Bs. Huy');
    setModalTime('08:00 - 12:00');
    setEditingShift(null);
    setShowShiftModal(true);
  };

  const handleEditShift = (shiftItem, day) => {
    setSelectedShiftDay(day);
    setModalDoctor(shiftItem.title);
    setModalTime(shiftItem.time);
    setEditingShift(shiftItem);
    setShowShiftModal(true);
  };

  const handleDeleteShift = () => {
    if (!editingShift) return;
    showConfirm(`Bạn có chắc chắn muốn xóa ca trực của ${editingShift.title} ngày ${selectedShiftDay}/${String(calendarMonth + 1).padStart(2, '0')}/${calendarYear}?`, () => {
      setShifts(shifts.filter(sh => sh.id !== editingShift.id));
      triggerToast('Đã xóa ca trực thành công!', 'success');
      setShowShiftModal(false);
    });
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

    const targetDate = editingShift 
      ? editingShift.date 
      : `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${selectedShiftDay.toString().padStart(2, '0')}`;
    
    const hasConflict = shifts.some(sh => 
      sh.title === modalDoctor && 
      sh.date === targetDate && 
      (!editingShift || sh.id !== editingShift.id)
    );

    const performSave = () => {
      if (editingShift) {
        setShifts(shifts.map(sh => sh.id === editingShift.id ? {
          ...sh,
          title: modalDoctor,
          time: modalTime,
          color,
          bg
        } : sh));
        triggerToast(`Đã cập nhật ca trực cho ${modalDoctor} thành công!`, 'success');
      } else {
        const newShift = {
          id: Date.now(),
          date: targetDate,
          title: modalDoctor,
          time: modalTime,
          type: 'duty',
          color,
          bg
        };
        setShifts([...shifts, newShift]);
        triggerToast(`Đã xếp ca trực cho ${modalDoctor} ngày ${selectedShiftDay}/${String(calendarMonth + 1).padStart(2, '0')}/${calendarYear}`, 'success');
      }
      setShowShiftModal(false);
    };

    if (hasConflict) {
      showConfirm(
        `Cảnh báo: Bác sĩ ${modalDoctor} đã có ca trực vào ngày này rồi. Bạn có chắc chắn muốn xếp trùng lịch ca trực này không?`,
        () => {
          performSave();
        },
        'Cảnh báo trùng lịch ca trực'
      );
    } else {
      performSave();
    }
  };

  // --- RENDERING SUBVIEWS ---

  // 1. DOCTOR LIST & SHIFTS VIEW
  if (currentView === 'doctor-list' || currentView === 'doctor-shifts') {
    const draftDoctors = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('draft_doctor-')) {
        try {
          const draftVal = JSON.parse(localStorage.getItem(key));
          if (draftVal) {
            draftDoctors.push({
              ...draftVal,
              isDraft: true,
              draftKey: key,
              id: draftVal.id || (key.includes('-edit_') ? key.split('-edit_')[1] : 'new'),
              name: draftVal.name ? `${draftVal.name} (Bản nháp)` : 'Bác sĩ chưa đặt tên (Bản nháp)'
            });
          }
        } catch (e) {}
      }
    }

    const filteredDraftDocs = draftDoctors.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.specialty.toLowerCase().includes(docSearch.toLowerCase());
      const matchSpecialty = docSpecialty ? d.specialty === docSpecialty : true;
      return matchSearch && matchSpecialty;
    });

    const filteredDocs = doctors.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(docSearch.toLowerCase()) || d.specialty.toLowerCase().includes(docSearch.toLowerCase());
      const matchSpecialty = docSpecialty ? d.specialty === docSpecialty : true;
      return matchSearch && matchSpecialty;
    });

    const draftDocIds = new Set(filteredDraftDocs.map(d => d.id));
    const cleanFilteredDocs = filteredDocs.filter(d => !draftDocIds.has(d.id));
    const allDocs = [...filteredDraftDocs, ...cleanFilteredDocs];

    const totalPages = Math.ceil(allDocs.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
      <div className="animate-fade-in">
        {/* Navigation tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '20px' }}>
          <button
            onClick={() => onNavigate('doctor-list')}
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
            onClick={() => onNavigate('doctor-shifts')}
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
                  {allDocs.slice(startIndex, startIndex + itemsPerPage).map(d => (
                    <tr 
                      key={d.id} 
                      style={d.isDraft ? { cursor: 'pointer', opacity: 0.6, fontStyle: 'italic', borderLeft: '3px solid var(--primary-light)' } : { cursor: 'pointer' }}
                      onClick={d.isDraft ? () => {
                        if (d.draftKey.includes('-add_')) {
                          onSelectId(null);
                          onNavigate('doctor-add');
                        } else {
                          onSelectId(d.id);
                          onNavigate('doctor-edit');
                        }
                      } : () => {
                        onSelectId(d.id);
                        onNavigate('doctor-details');
                      }}
                    >
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{d.id}</td>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td style={{ fontWeight: 500 }}>{d.specialty}</td>
                      <td>{d.phone}</td>
                      <td>{d.email}</td>
                      <td>
                        <span 
                          className="badge"
                          style={getStatusBadgeStyle(d.status)}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {d.isDraft ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bản nháp</span>
                        ) : (
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
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar */}
            <div className="list-pagination-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>
                  Hiển thị {Math.min(startIndex + 1, allDocs.length)}-
                  {Math.min(startIndex + itemsPerPage, allDocs.length)} trong tổng số {allDocs.length}
                </span>
                <span style={{ margin: '0 8px' }}>|</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Số bản ghi:
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="filter-select"
                    style={{ padding: '2px 8px', height: 'auto', fontSize: '0.85rem' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </span>
              </div>
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
          <div className="card" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', height: 'calc(100vh - var(--header-height) - 100px)', margin: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>Lịch trực bác sĩ</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button 
                    type="button" 
                    onClick={handlePrev} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', color: 'var(--text-dark)', padding: '2px 6px' }}
                  >
                    &lt;
                  </button>
                  <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-dark)' }}>{getCalendarHeaderLabel()}</span>
                  <button 
                    type="button" 
                    onClick={handleNext} 
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', color: 'var(--text-dark)', padding: '2px 6px' }}
                  >
                    &gt;
                  </button>
                </div>
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#fff' }}>
                  <button 
                    type="button"
                    onClick={() => setCalendarView('day')} 
                    className={`btn ${calendarView === 'day' ? 'btn-primary' : 'btn-outline'}`} 
                    style={{ padding: '4px 8px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
                  >
                    Ngày
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCalendarView('week')} 
                    className={`btn ${calendarView === 'week' ? 'btn-primary' : 'btn-outline'}`} 
                    style={{ padding: '4px 8px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
                  >
                    Tuần
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCalendarView('month')} 
                    className={`btn ${calendarView === 'month' ? 'btn-primary' : 'btn-outline'}`} 
                    style={{ padding: '4px 8px', border: 'none', borderRadius: 0, fontSize: '0.75rem' }}
                  >
                    Tháng
                  </button>
                </div>
              </div>
            </div>

            {/* Grid or Day View */}
            {calendarView === 'day' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto', backgroundColor: '#fff', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, color: 'var(--primary)', fontWeight: '700', fontSize: '0.88rem' }}>Ca trực ngày {selectedCalendarDay} Tháng {calendarMonth + 1}, {calendarYear}</h4>
                  <button 
                    type="button"
                    className="btn btn-primary" 
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    onClick={() => handleAddShift(selectedCalendarDay)}
                  >
                    + Xếp ca trực
                  </button>
                </div>
                {getShiftsForDay(selectedCalendarDay).length === 0 ? (
                  <div style={{ padding: '30px', fontStyle: 'italic', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Không có ca trực nào được xếp cho ngày này. Nhấp vào "+ Xếp ca trực" để phân công.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getShiftsForDay(selectedCalendarDay).map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderLeft: `4px solid ${s.color}`, backgroundColor: s.bg, borderRadius: '6px', border: '1px solid var(--border-color)', borderLeftWidth: '4px' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{s.title}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Thời gian ca trực: {s.time}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button type="button" className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '0.72rem' }} onClick={() => handleEditShift(s, selectedCalendarDay)}>
                            Sửa ca
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Grid View (Month or Week) */
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'center', fontWeight: '700', fontSize: '0.72rem', padding: '6px 0', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <div>CN</div>
                  <div>T2</div>
                  <div>T3</div>
                  <div>T4</div>
                  <div>T5</div>
                  <div>T6</div>
                  <div>T7</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: calendarView === 'week' ? '1fr' : `repeat(${Math.ceil(calendarCells.length / 7)}, 1fr)`, backgroundColor: '#e2e8f0', gap: '1px', flex: 1 }}>
                  {(calendarView === 'week' ? weekCells : calendarCells).map((day, idx) => {
                    const dayShifts = getShiftsForDay(day);
                    const dayClashes = getClashesForDay(day);
                    const isDaySelected = selectedCalendarDay === day;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (day) {
                            setSelectedCalendarDay(day);
                          }
                        }}
                        style={{ 
                          backgroundColor: '#fff', 
                          padding: '4px', 
                          position: 'relative', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '2px', 
                          cursor: day ? 'pointer' : 'default',
                          minWidth: 0,
                          minHeight: 0,
                          overflow: 'hidden',
                          boxShadow: isDaySelected ? 'inset 0 0 0 2px var(--primary-light)' : 'none'
                        }}
                      >
                        {day && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: isDaySelected ? 'var(--primary)' : 'var(--text-muted)' }}>{day}</span>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddShift(day);
                              }}
                              style={{ fontSize: '0.7rem', color: 'var(--primary-light)', padding: '0 4px', fontWeight: 'bold' }}
                              title="Thêm ca trực"
                            >
                              +
                            </span>
                          </div>
                        )}
                        {dayShifts.map((s) => (
                          <div
                            key={s.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditShift(s, day);
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
                            <div style={{ fontWeight: 700 }}>{s.title}</div>
                            <div style={{ fontSize: '0.55rem', opacity: 0.8 }}>{s.time}</div>
                          </div>
                        ))}
                        {dayClashes.map((c) => (
                          <div
                            key={`clash-${c.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              padding: '2px 4px',
                              borderRadius: '3px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              fontSize: '0.62rem',
                              fontWeight: '700',
                              border: '1px solid #fca5a5',
                              marginTop: '1px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                            title={`${c.doctor} bị trùng ${c.count} ca trực`}
                          >
                            <AlertTriangle size={10} style={{ flexShrink: 0, color: '#dc2626' }} />
                            <span>Trùng: {c.doctor}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clash Alerts matching bottom of Image 3 */}
            <div style={{ marginTop: '6px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'red' }}>
                <ShieldAlert size={16} />
                <h4 style={{ margin: 0, fontSize: '0.82rem', color: 'red', fontWeight: 700 }}>Cảnh báo trùng lịch ca trực</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {clashAlerts.map(c => (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fff5f5',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ color: 'red' }}>
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{c.doctor} bị trùng lịch</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '1px' }}>
                        {c.date} • <strong style={{ color: 'red' }}>{c.count} ca trùng</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Modal for adding/editing shift */}
          {showShiftModal && createPortal(
            <div className="shift-modal-backdrop" onClick={() => setShowShiftModal(false)}>
              <div className="shift-modal-card" onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary)' }}>
                    {editingShift ? 'Chi tiết / Chỉnh sửa ca trực' : 'Xếp ca trực mới'}
                  </h3>
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

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginTop: '12px', width: '100%' }}>
                  {editingShift ? (
                    <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem', color: '#ff6b6b', borderColor: '#ff6b6b' }} onClick={handleDeleteShift}>
                      Xóa ca trực
                    </button>
                  ) : <div />}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={() => setShowShiftModal(false)}>
                      Hủy
                    </button>
                    <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }} onClick={handleSaveShiftModal}>
                      {editingShift ? 'Cập nhật' : 'Lưu ca trực'}
                    </button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
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
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Hồ sơ năng lực bác sĩ</h2>
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
            <div><strong>Trạng thái hoạt động:</strong> <span className="badge" style={getStatusBadgeStyle(item.status)}>{item.status}</span></div>
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
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
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
          <button className="btn btn-cancel" onClick={() => {
            triggerToast('Đã thoát form (giữ bản nháp)', 'info');
            onNavigate('doctor-list');
          }}>Thoát</button>
          {localStorage.getItem(`draft_${currentView}_${selectedId || 'new'}`) && (
            <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={handleCancelDraft}>Hủy nháp</button>
          )}
          <button className="btn btn-save" onClick={handleSaveDoctor}>Lưu hồ sơ</button>
        </div>
      </div>
    );
  }

  return null;
}
