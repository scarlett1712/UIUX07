import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, ArrowLeft, Camera, Undo2, ToggleLeft, ToggleRight, Check, X, Bell } from 'lucide-react';

const getReminderStatusBadgeStyle = (status) => {
  if (status === 'Đang hoạt động') {
    return { backgroundColor: '#d1fae5', color: '#065f46' };
  }
  return { backgroundColor: '#f1f5f9', color: '#475569' };
};

export default function ReminderAlerts({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  reminders,
  setReminders,
  triggerToast,
  showConfirm
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [targetFilter, setTargetFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, targetFilter, channelFilter, statusFilter]);

  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    if (currentView === 'reminder-add') {
      setOriginalData(null);
      setFormData({
        id: `REM${Date.now().toString().slice(-3)}`,
        title: '',
        target: 'Bệnh nhân',
        time: 'Trước 1 ngày 08:00',
        channel: 'SMS',
        status: 'Đang hoạt động',
        messageContent: ''
      });
    } else if (currentView === 'reminder-edit') {
      const item = reminders.find(r => r.id === selectedId);
      if (item) {
        setFormData(JSON.parse(JSON.stringify(item)));
        setOriginalData(JSON.parse(JSON.stringify(item)));
      }
    }
  }, [currentView, selectedId, reminders]);

  const isFieldModified = (fieldName) => {
    if (!originalData) return false;
    return formData[fieldName] !== originalData[fieldName];
  };

  const handleToggle = (id) => {
    const updated = reminders.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === 'Đang hoạt động' ? 'Tạm dừng' : 'Đang hoạt động';
        triggerToast(`Đã ${nextStatus.toLowerCase()} nhắc lịch "${r.title}"`, 'info');
        return { ...r, status: nextStatus };
      }
      return r;
    });
    setReminders(updated);
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      triggerToast('Tiêu đề nhắc lịch không được để trống', 'error');
      return;
    }
    if (currentView === 'reminder-add') {
      setReminders([formData, ...reminders]);
      triggerToast('Đã tạo kịch bản nhắc lịch tự động mới!', 'success');
    } else {
      setReminders(reminders.map(r => r.id === formData.id ? formData : r));
      triggerToast('Đã lưu cấu hình nhắc lịch thành công!', 'success');
    }
    onNavigate('reminder-list');
  };

  const handleDelete = (id) => {
    showConfirm('Bạn có chắc chắn muốn xóa quy trình nhắc lịch này?', () => {
      setReminders(reminders.filter(r => r.id !== id));
      triggerToast('Đã xóa nhắc lịch tự động', 'success');
      onNavigate('reminder-list');
    });
  };

  if (currentView === 'reminder-list') {
    const filtered = reminders.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTarget = targetFilter ? r.target === targetFilter : true;
      const matchChannel = channelFilter ? r.channel === channelFilter : true;
      const matchStatus = statusFilter ? r.status === statusFilter : true;
      return matchSearch && matchTarget && matchChannel && matchStatus;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedReminders = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <div className="card" style={{ padding: '20px', margin: 0 }}>
          <div className="flex align-center gap-4" style={{ marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Danh sách nhắc lịch tự động</h2>
            <button className="plus-btn-circle" onClick={() => onNavigate('reminder-add')}>
              <Plus size={14} />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="filters-bar">
            <div className="filter-group">
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm nhắc lịch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ width: '180px', padding: '4px 8px' }}
              />
            </div>

            <div className="filter-group">
              <Filter size={14} />
              <select
                value={targetFilter}
                onChange={(e) => setTargetFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Đối tượng</option>
                <option value="Bệnh nhân">Bệnh nhân</option>
                <option value="Bác sĩ">Bác sĩ</option>
              </select>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Kênh gửi</option>
                <option value="SMS">SMS</option>
                <option value="App">App</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Tạm dừng">Tạm dừng</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setTargetFilter('');
                  setChannelFilter('');
                  setStatusFilter('');
                  triggerToast('Đã xóa tất cả bộ lọc nhắc lịch', 'info');
                }}
                className="btn btn-outline"
                style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
              >
                <Undo2 size={12} /> Hủy lọc
              </button>
            </div>
          </div>

          {/* Table layout matching Image 4 */}
          <div className="custom-table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tên thông báo</th>
                  <th style={{ width: '120px' }}>Đối tượng</th>
                  <th>Thời điểm gửi</th>
                  <th style={{ width: '90px' }}>Kênh</th>
                  <th style={{ width: '150px' }}>Trạng thái</th>
                  <th style={{ width: '100px' }}>Kích hoạt</th>
                  <th style={{ width: '100px' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReminders.map(r => (
                  <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => {
                    onSelectId(r.id);
                    onNavigate('reminder-details');
                  }}>
                    <td style={{ fontWeight: 600 }}>{r.title}</td>
                    <td>{r.target}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.time}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: r.channel === 'SMS' ? '#eff6ff' : '#ecfdf5',
                        color: r.channel === 'SMS' ? '#2563eb' : '#059669',
                        border: `1px solid ${r.channel === 'SMS' ? '#bfdbfe' : '#a7f3d0'}`
                      }}>
                        {r.channel}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={getReminderStatusBadgeStyle(r.status)}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggle(r.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: r.status === 'Đang hoạt động' ? '#10b981' : '#cbd5e1' }}
                      >
                        {r.status === 'Đang hoạt động' ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                      </button>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="flex gap-2">
                        <button className="btn btn-outline" style={{ padding: '4px' }} onClick={() => {
                          onSelectId(r.id);
                          onNavigate('reminder-edit');
                        }}>
                          <Edit3 size={12} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '4px', color: 'red' }} onClick={() => handleDelete(r.id)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Bar */}
        <div className="list-pagination-bar">
          <span>
            Hiển thị {Math.min(startIndex + 1, totalItems)}-
            {Math.min(startIndex + paginatedReminders.length, totalItems)} trong tổng số {totalItems}
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
    );
  }

  if (currentView === 'reminder-details') {
    const item = reminders.find(r => r.id === selectedId);
    if (!item) return <div>Không tìm thấy nhắc lịch</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('reminder-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Chi tiết cấu hình nhắc lịch</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', fontSize: '0.85rem' }}>
          <div><strong>Tiêu đề nhắc lịch:</strong> {item.title}</div>
          <div><strong>Đối tượng nhận tin:</strong> {item.target}</div>
          <div><strong>Thời điểm gửi:</strong> {item.time}</div>
          <div><strong>Kênh truyền thông:</strong> {item.channel}</div>
          <div>
            <strong>Trạng thái hoạt động:</strong>{' '}
            <span 
              className="badge"
              style={{ ...getReminderStatusBadgeStyle(item.status), marginLeft: '8px' }}
            >
              {item.status}
            </span>
          </div>
          {item.messageContent && (
            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <strong>Nội dung tin nhắn SMS / App mẫu:</strong>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.messageContent}</p>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
          <button className="btn btn-outline" onClick={() => onNavigate('reminder-edit')}><Edit3 size={14} /> Chỉnh sửa</button>
          <button className="btn btn-outline" style={{ color: 'red' }} onClick={() => handleDelete(item.id)}><Trash2 size={14} /> Xóa kịch bản</button>
        </div>
      </div>
    );
  }

  if (currentView === 'reminder-edit' || currentView === 'reminder-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in" style={{ padding: '20px' }}>
        <div className="details-header">
          <button className="back-btn" onClick={() => onNavigate('reminder-list')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>
            {currentView === 'reminder-add' ? 'Tạo quy trình nhắc lịch tự động mới' : 'Chỉnh sửa quy trình nhắc lịch'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div className="form-group">
            <span className="form-group-label">Tiêu đề thông báo</span>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Nhắc tái khám định kỳ..."
              className={`form-input ${isFieldModified('title') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Đối tượng thụ hưởng</span>
            <select
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              className={`form-select ${isFieldModified('target') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Bệnh nhân">Bệnh nhân</option>
              <option value="Bác sĩ">Bác sĩ</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Thời điểm gửi tự động</span>
            <input
              type="text"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="VD: Trước 1 ngày 08:00"
              className={`form-input ${isFieldModified('time') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>

          <div className="form-group">
            <span className="form-group-label">Kênh gửi tin</span>
            <select
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              className={`form-select ${isFieldModified('channel') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="SMS">SMS</option>
              <option value="App">App</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Trạng thái</span>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`form-select ${isFieldModified('status') ? 'input-modified' : 'input-unmodified'}`}
            >
              <option value="Đang hoạt động">Đang hoạt động</option>
              <option value="Tạm dừng">Tạm dừng</option>
            </select>
          </div>

          <div className="form-group">
            <span className="form-group-label">Mẫu tin nhắn tự động</span>
            <textarea
              value={formData.messageContent}
              onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
              placeholder="Nhập nội dung mẫu gửi đi... Sử dụng [Tên bệnh nhân], [Giờ khám], [Tên bác sĩ] để tự động cá nhân hóa."
              className={`form-input form-textarea ${isFieldModified('messageContent') ? 'input-modified' : 'input-unmodified'}`}
            />
          </div>
        </div>

        <div className="form-action-buttons" style={{ marginTop: '20px' }}>
          <button className="btn btn-cancel" onClick={() => onNavigate('reminder-list')}>Hủy</button>
          <button className="btn btn-save" onClick={handleSave}>Lưu cấu hình</button>
        </div>
      </div>
    );
  }

  return null;
}
