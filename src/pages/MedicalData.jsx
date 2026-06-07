import React, { useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit3, ArrowLeft, Camera, Undo2 } from 'lucide-react';

export default function MedicalData({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  diseases,
  setDiseases,
  medicines,
  setMedicines,
  triggerToast,
  showConfirm,
}) {
  // Filter States
  const [diseaseSearch, setDiseaseSearch] = useState('');
  const [diseaseDangerFilter, setDiseaseDangerFilter] = useState('');
  const [diseaseDeptFilter, setDiseaseDeptFilter] = useState('');

  const [medicineSearch, setMedicineSearch] = useState('');
  const [medicineClassFilter, setMedicineClassFilter] = useState('');

  // Page States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Active item state for Add/Edit Form
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null); // Keep copy of original item for visual old/new diff

  // Initialize or reset form data when editing or adding
  const initForm = (type, id = null) => {
    const draftKey = `draft_${currentView}_${id || 'new'}`;
    const savedDraft = localStorage.getItem(draftKey);

    if (id) {
      // Edit mode - clone original data and form data separately
      if (type === 'disease') {
        const item = diseases.find((d) => d.id === id);
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
          triggerToast('Đã khôi phục bản nháp chưa lưu', 'info');
        } else {
          setFormData(JSON.parse(JSON.stringify(item)));
        }
        setOriginalData(JSON.parse(JSON.stringify(item)));
      } else {
        const item = medicines.find((m) => m.id === id);
        if (savedDraft) {
          setFormData(JSON.parse(savedDraft));
          triggerToast('Đã khôi phục bản nháp chưa lưu', 'info');
        } else {
          setFormData(JSON.parse(JSON.stringify(item)));
        }
        setOriginalData(JSON.parse(JSON.stringify(item)));
      }
    } else {
      // Add mode - originalData is null, all typed text is treated as new
      let defaultData = null;
      if (type === 'disease') {
        defaultData = {
          id: `D${Date.now()}`,
          name: '',
          desc: '',
          danger: 'Thấp',
          department: 'Tai Mũi Họng',
          symptoms: [],
        };
      } else {
        defaultData = {
          id: `M${Date.now()}`,
          name: '',
          desc: '',
          activeIngredient: '',
          indication: '',
          contraindication: '',
          dosage: '',
          sideEffects: '',
        };
      }

      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
        triggerToast('Đã khôi phục bản nháp chưa lưu', 'info');
      } else {
        setFormData(defaultData);
      }
      setOriginalData(null);
    }
  };

  // Trigger form open
  React.useEffect(() => {
    if (currentView === 'disease-add') initForm('disease');
    if (currentView === 'disease-edit') initForm('disease', selectedId);
    if (currentView === 'medicine-add') initForm('medicine');
    if (currentView === 'medicine-edit') initForm('medicine', selectedId);
  }, [currentView, selectedId]);

  // Save draft state
  React.useEffect(() => {
    if (formData && (currentView.includes('add') || currentView.includes('edit'))) {
      const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, currentView, selectedId]);

  // Handle Cancel Draft
  const handleCancelDraft = (type) => {
    const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
    localStorage.removeItem(draftKey);
    triggerToast('Đã hủy và xóa bản nháp', 'info');
    onNavigate(type === 'disease' ? 'disease-list' : (currentView === 'medicine-edit' ? 'medicine-details' : 'medicine-list'));
    setFormData(null);
    setOriginalData(null);
  };

  // UI status helpers: Check if field is modified from original
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

  // Symptom row specific change checker
  const isSymptomFieldModified = (index, fieldName) => {
    if (!originalData || !originalData.symptoms) {
      const row = formData && formData.symptoms ? formData.symptoms[index] : null;
      if (!row) return false;
      const val = row[fieldName];
      if (val === null || val === undefined) return false;
      if (typeof val === 'string') return val.trim() !== '';
      return !!val;
    }
    const origRow = originalData.symptoms[index];
    if (!origRow) return true; // Newly added symptom row is bold/highlighted
    return formData.symptoms[index][fieldName] !== origRow[fieldName];
  };

  // Handle Save
  const handleSave = (type) => {
    if (!formData.name.trim()) {
      triggerToast('Vui lòng nhập tên đầy đủ', 'error');
      return;
    }

    const draftKey = `draft_${currentView}_${selectedId || 'new'}`;
    localStorage.removeItem(draftKey);

    if (type === 'disease') {
      if (currentView === 'disease-add') {
        setDiseases([formData, ...diseases]);
        triggerToast('Thêm thông tin bệnh mới thành công!', 'success');
      } else {
        setDiseases(diseases.map((d) => (d.id === formData.id ? formData : d)));
        triggerToast('Cập nhật thông tin bệnh thành công!', 'success');
      }
      onNavigate('disease-list');
    } else {
      if (currentView === 'medicine-add') {
        setMedicines([formData, ...medicines]);
        triggerToast('Thêm thông tin thuốc mới thành công!', 'success');
        onNavigate('medicine-list');
      } else {
        setMedicines(medicines.map((m) => (m.id === formData.id ? formData : m)));
        triggerToast('Cập nhật thông tin thuốc thành công!', 'success');
        onSelectId(formData.id);
        onNavigate('medicine-details');
      }
    }
    setFormData(null);
    setOriginalData(null);
  };

  // Handle Delete
  const handleDelete = (type, id) => {
    showConfirm('Bạn có chắc chắn muốn xóa bản ghi này?', () => {
      if (type === 'disease') {
        setDiseases(diseases.filter((d) => d.id !== id));
        triggerToast('Đã xóa dữ liệu bệnh thành công!', 'success');
        onNavigate('disease-list');
      } else {
        setMedicines(medicines.filter((m) => m.id !== id));
        triggerToast('Đã xóa dữ liệu thuốc thành công!', 'success');
        onNavigate('medicine-list');
      }
    });
  };

  // --- Dynamic Symptoms Rows in Disease Form ---
  const handleAddSymptomRow = () => {
    const newSymptom = {
      stt: formData.symptoms.length + 1,
      name: 'Số mũi',
      desc: '',
      duration: '',
      frequency: 'Thường xuyên',
    };
    setFormData({
      ...formData,
      symptoms: [...formData.symptoms, newSymptom],
    });
    triggerToast('Đã thêm 1 dòng triệu chứng mới', 'info');
  };

  const handleUpdateSymptomRow = (index, field, value) => {
    const updatedSymptoms = [...formData.symptoms];
    updatedSymptoms[index][field] = value;
    setFormData({
      ...formData,
      symptoms: updatedSymptoms,
    });
  };

  const handleRemoveSymptomRow = (index) => {
    const filtered = formData.symptoms.filter((_, idx) => idx !== index);
    const reordered = filtered.map((s, idx) => ({ ...s, stt: idx + 1 }));
    setFormData({
      ...formData,
      symptoms: reordered,
    });
    triggerToast('Đã xóa dòng triệu chứng', 'info');
  };

  // Clear filters
  const resetFilters = (type) => {
    if (type === 'disease') {
      setDiseaseSearch('');
      setDiseaseDangerFilter('');
      setDiseaseDeptFilter('');
    } else {
      setMedicineSearch('');
      setMedicineClassFilter('');
    }
    triggerToast('Đã xóa tất cả bộ lọc dữ liệu', 'info');
  };

  // --- RENDERING DISEASES VIEWS ---

  const handleDraftClick = (d, type) => {
    if (d.draftKey.includes('-add_')) {
      onSelectId(null);
      onNavigate(`${type}-add`);
    } else {
      onSelectId(d.id);
      onNavigate(`${type}-edit`);
    }
  };

  if (currentView === 'disease-list') {
    const draftDiseases = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('draft_disease-')) {
        try {
          const draftVal = JSON.parse(localStorage.getItem(key));
          if (draftVal) {
            draftDiseases.push({
              ...draftVal,
              isDraft: true,
              draftKey: key,
              id: draftVal.id || (key.includes('-edit_') ? key.split('-edit_')[1] : 'new'),
              name: draftVal.name ? `${draftVal.name} (Bản nháp)` : 'Bệnh chưa đặt tên (Bản nháp)'
            });
          }
        } catch (e) {}
      }
    }

    const filteredDraftDiseases = draftDiseases.filter(d => {
      const matchSearch =
        d.name.toLowerCase().includes(diseaseSearch.toLowerCase()) ||
        (d.desc && d.desc.toLowerCase().includes(diseaseSearch.toLowerCase()));
      const matchDanger = diseaseDangerFilter ? d.danger === diseaseDangerFilter : true;
      const matchDept = diseaseDeptFilter ? d.department === diseaseDeptFilter : true;
      return matchSearch && matchDanger && matchDept;
    });

    const filteredDiseases = diseases.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(diseaseSearch.toLowerCase()) ||
        d.desc.toLowerCase().includes(diseaseSearch.toLowerCase());
      const matchDanger = diseaseDangerFilter ? d.danger === diseaseDangerFilter : true;
      const matchDept = diseaseDeptFilter ? d.department === diseaseDeptFilter : true;
      return matchSearch && matchDanger && matchDept;
    });

    const draftIds = new Set(filteredDraftDiseases.map(d => d.id));
    const cleanFilteredDiseases = filteredDiseases.filter(d => !draftIds.has(d.id));
    const allDiseasesList = [...filteredDraftDiseases, ...cleanFilteredDiseases];

    const totalItems = allDiseasesList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDiseases = allDiseasesList.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        {/* Title bar */}
        <div className="flex align-center gap-4" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Danh sách bệnh</h2>
          <button
            className="plus-btn-circle"
            onClick={() => onNavigate('disease-add')}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh..."
              value={diseaseSearch}
              onChange={(e) => setDiseaseSearch(e.target.value)}
              className="form-input"
              style={{ width: '180px', padding: '6px 10px' }}
            />
          </div>

          <div className="filter-group">
            <Filter size={14} />
            <span>Lọc</span>
            <select
              value={diseaseDangerFilter}
              onChange={(e) => setDiseaseDangerFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Mức độ nguy hiểm</option>
              <option value="Cao">Cao</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Thấp">Thấp</option>
            </select>

            <select
              value={diseaseDeptFilter}
              onChange={(e) => setDiseaseDeptFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Chuyên khoa</option>
              <option value="Tai Mũi Họng">Tai Mũi Họng</option>
              <option value="Nội tổng quát">Nội tổng quát</option>
              <option value="Hô hấp">Hô hấp</option>
              <option value="Nội tiết">Nội tiết</option>
              <option value="Tim mạch">Tim mạch</option>
              <option value="Tiêu hóa">Tiêu hóa</option>
              <option value="Truyền nhiễm">Truyền nhiễm</option>
            </select>

            <button
              onClick={() => resetFilters('disease')}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
            >
              <Undo2 size={12} /> Hủy
            </button>
          </div>
        </div>

        {/* Diseases Table */}
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Tên bệnh</th>
                <th>Mô tả</th>
                <th>Triệu chứng</th>
                <th style={{ width: '130px' }}>Mức độ nguy hiểm</th>
                <th style={{ width: '160px' }}>Chuyên khoa liên quan</th>
                <th style={{ width: '100px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDiseases.length > 0 ? (
                paginatedDiseases.map((d) => {
                  const symptomsSummary = d.symptoms && d.symptoms.map((s) => s.name).join(', ') || 'Không có triệu chứng';
                  return (
                    <tr 
                      key={d.id} 
                      style={d.isDraft ? { cursor: 'pointer', opacity: 0.6, fontStyle: 'italic', borderLeft: '3px solid var(--primary-light)' } : { cursor: 'pointer' }}
                      onClick={d.isDraft ? () => handleDraftClick(d, 'disease') : undefined}
                    >
                      <td
                        onClick={d.isDraft ? undefined : () => {
                          onSelectId(d.id);
                          onNavigate('disease-details');
                        }}
                        style={{ fontWeight: 600, color: 'var(--primary)' }}
                      >
                        {d.name}
                      </td>
                      <td
                        onClick={d.isDraft ? undefined : () => {
                          onSelectId(d.id);
                          onNavigate('disease-details');
                        }}
                        style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {d.desc}
                      </td>
                      <td
                        onClick={d.isDraft ? undefined : () => {
                          onSelectId(d.id);
                          onNavigate('disease-details');
                        }}
                        style={{ color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {symptomsSummary}
                      </td>
                      <td
                        onClick={d.isDraft ? undefined : () => {
                          onSelectId(d.id);
                          onNavigate('disease-details');
                        }}
                      >
                        <span
                          className={`badge ${
                            d.danger === 'Cao'
                              ? 'badge-high'
                              : d.danger === 'Trung bình'
                              ? 'badge-medium'
                              : 'badge-low'
                          }`}
                        >
                          {d.danger}
                        </span>
                      </td>
                      <td
                        onClick={d.isDraft ? undefined : () => {
                          onSelectId(d.id);
                          onNavigate('disease-details');
                        }}
                        style={{ fontWeight: 500 }}
                      >
                        {d.department}
                      </td>
                      <td>
                        {d.isDraft ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bản nháp</span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectId(d.id);
                                onNavigate('disease-edit');
                              }}
                              className="btn btn-outline"
                              style={{ padding: '4px' }}
                            >
                              <Edit3 size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete('disease', d.id);
                              }}
                              className="btn btn-outline"
                              style={{ padding: '4px', color: 'red' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '20px', color: 'var(--text-muted)' }}>
                    Không có bệnh phù hợp với tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="list-pagination-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{`Hiển thị ${startIndex + 1}-${Math.min(startIndex + paginatedDiseases.length, totalItems)} trong tổng số ${totalItems}`}</span>
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-nav-btn"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-nav-btn"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'disease-details') {
    const item = diseases.find((d) => d.id === selectedId);
    if (!item) return <div>Không tìm thấy bệnh</div>;

    return (
      <div className="card animate-fade-in">
        {/* Header */}
        <div className="details-header">
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Chi tiết bệnh</h2>
        </div>

        {/* Content Layout */}
        <div className="details-grid">
          {/* Box Image */}
          <div className="details-image-box">
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              <circle cx="9" cy="9" r="2" />
            </svg>
          </div>

          {/* Details Fields */}
          <div className="details-info-grid">
            <div className="detail-field">
              <span className="detail-field-label">Tên bệnh</span>
              <div className="detail-field-value">{item.name}</div>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Mức độ nguy hiểm</span>
              <div className="detail-field-value">{item.danger}</div>
            </div>
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <span className="detail-field-label">Mô tả bệnh án</span>
              <div className="detail-field-value" style={{ minHeight: '60px' }}>{item.desc}</div>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Chuyên khoa liên quan</span>
              <div className="detail-field-value">{item.department}</div>
            </div>
          </div>
        </div>

        {/* Symptoms Section */}
        <h3 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '10px' }}>
          Triệu chứng lâm sàng
        </h3>

        <div className="custom-table-container" style={{ marginBottom: '20px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>STT</th>
                <th style={{ width: '180px' }}>Triệu chứng</th>
                <th>Mô tả triệu chứng</th>
                <th style={{ width: '150px' }}>Thời gian xảy ra</th>
                <th style={{ width: '150px' }}>Mức độ xuất hiện</th>
              </tr>
            </thead>
            <tbody>
              {item.symptoms && item.symptoms.length > 0 ? (
                item.symptoms.map((symptom) => (
                  <tr key={symptom.stt}>
                    <td>{symptom.stt}</td>
                    <td style={{ fontWeight: 600 }}>{symptom.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{symptom.desc || 'Không có mô tả thêm'}</td>
                    <td>{symptom.duration || 'Không xác định'}</td>
                    <td>
                      <span
                        className={`badge ${
                          symptom.frequency === 'Thường xuyên'
                            ? 'badge-high'
                            : symptom.frequency === 'Trung bình'
                            ? 'badge-medium'
                            : 'badge-low'
                        }`}
                      >
                        {symptom.frequency}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    Chưa cập nhật triệu chứng cụ thể cho bệnh này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Action Panel in right corner */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => onNavigate('disease-edit')}
            className="btn btn-outline"
            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '6px' }}
          >
            <Edit3 size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={() => handleDelete('disease', item.id)}
            className="btn btn-outline"
            style={{ padding: '8px 16px', border: '1px solid var(--border-color)', color: 'red', borderRadius: '6px' }}
          >
            <Trash2 size={14} /> Xóa
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'disease-edit' || currentView === 'disease-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in">
        {/* Header */}
        <div className="details-header">
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {currentView === 'disease-add' ? 'Thêm thông tin bệnh mới' : 'Chỉnh sửa thông tin bệnh'}
          </h2>
        </div>

        {/* Form Fields with old/new visual styling */}
        <div className="form-grid">
          <div className="file-upload-circle">
            <Camera size={24} />
            <span style={{ fontSize: '0.7rem' }}>Tải ảnh lên</span>
          </div>

          <div className="form-inputs-container">
            <div className="form-group">
              <span className="form-group-label">Tên bệnh</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Cảm cúm"
                className={`form-input ${isFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Mô tả tổng quan</span>
              <textarea
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Mô tả tóm tắt..."
                className={`form-input form-textarea ${isFieldModified('desc') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Mức độ nguy hiểm</span>
              <select
                value={formData.danger}
                onChange={(e) => setFormData({ ...formData, danger: e.target.value })}
                className={`form-select ${isFieldModified('danger') ? 'input-modified' : 'input-unmodified'}`}
              >
                <option value="Thấp">Thấp</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Cao">Cao</option>
              </select>
            </div>

            <div className="form-group">
              <span className="form-group-label">Chuyên khoa liên quan</span>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`form-select ${isFieldModified('department') ? 'input-modified' : 'input-unmodified'}`}
              >
                <option value="Tai Mũi Họng">Tai Mũi Họng</option>
                <option value="Nội tổng quát">Nội tổng quát</option>
                <option value="Hô hấp">Hô hấp</option>
                <option value="Nội tiết">Nội tiết</option>
                <option value="Tim mạch">Tim mạch</option>
                <option value="Tiêu hóa">Tiêu hóa</option>
                <option value="Truyền nhiễm">Truyền nhiễm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Symptoms edit table */}
        <div className="form-section-title-bar">
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Triệu chứng bệnh án</h3>
          <button className="plus-btn-circle" onClick={handleAddSymptomRow}>
            <Plus size={14} />
          </button>
        </div>

        <div className="custom-table-container" style={{ marginBottom: '16px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>STT</th>
                <th style={{ width: '180px' }}>Triệu chứng</th>
                <th>Mô tả triệu chứng</th>
                <th style={{ width: '150px' }}>Thời gian xảy ra</th>
                <th style={{ width: '150px' }}>Mức độ xuất hiện</th>
                <th style={{ width: '60px' }}>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {formData.symptoms && formData.symptoms.length > 0 ? (
                formData.symptoms.map((s, index) => (
                  <tr key={index}>
                    <td>{s.stt}</td>
                    <td>
                      <select
                        value={s.name}
                        onChange={(e) => handleUpdateSymptomRow(index, 'name', e.target.value)}
                        className={`form-select ${isSymptomFieldModified(index, 'name') ? 'input-modified' : 'input-unmodified'}`}
                        style={{ width: '100%', padding: '4px' }}
                      >
                        <option value="Số mũi">Sổ mũi</option>
                        <option value="Hắt hơi">Hắt hơi</option>
                        <option value="Đau họng">Đau họng</option>
                        <option value="Ho nhẹ">Ho nhẹ</option>
                        <option value="Sốt cao">Sốt cao</option>
                        <option value="Khó thở">Khó thở</option>
                        <option value="Đau đầu">Đau đầu</option>
                        <option value="Phát ban">Phát ban</option>
                        <option value="Mệt mỏi">Mệt mỏi</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.desc}
                        onChange={(e) => handleUpdateSymptomRow(index, 'desc', e.target.value)}
                        placeholder="Mô tả chi tiết triệu chứng..."
                        className={`form-input ${isSymptomFieldModified(index, 'desc') ? 'input-modified' : 'input-unmodified'}`}
                        style={{ width: '100%', padding: '4px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={s.duration}
                        onChange={(e) => handleUpdateSymptomRow(index, 'duration', e.target.value)}
                        placeholder="Ví dụ: Ngày 1-3"
                        className={`form-input ${isSymptomFieldModified(index, 'duration') ? 'input-modified' : 'input-unmodified'}`}
                        style={{ width: '100%', padding: '4px' }}
                      />
                    </td>
                    <td>
                      <select
                        value={s.frequency}
                        onChange={(e) => handleUpdateSymptomRow(index, 'frequency', e.target.value)}
                        className={`form-select ${isSymptomFieldModified(index, 'frequency') ? 'input-modified' : 'input-unmodified'}`}
                        style={{ width: '100%', padding: '4px' }}
                      >
                        <option value="Thường xuyên">Thường xuyên</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                      </select>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemoveSymptomRow(index)}
                        style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    Nhấn vào dấu cộng (+) để thêm triệu chứng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save & Cancel buttons */}
        <div className="form-action-buttons">
          <button className="btn btn-cancel" onClick={() => {
            triggerToast('Đã thoát form (giữ bản nháp)', 'info');
            onNavigate('disease-list');
          }}>
            Thoát
          </button>
          {localStorage.getItem(`draft_${currentView}_${selectedId || 'new'}`) && (
            <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleCancelDraft('disease')}>
              Hủy nháp
            </button>
          )}
          <button className="btn btn-save" onClick={() => handleSave('disease')}>
            Lưu
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERING MEDICINES VIEWS ---

  if (currentView === 'medicine-list') {
    const draftMedicines = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('draft_medicine-')) {
        try {
          const draftVal = JSON.parse(localStorage.getItem(key));
          if (draftVal) {
            draftMedicines.push({
              ...draftVal,
              isDraft: true,
              draftKey: key,
              id: draftVal.id || (key.includes('-edit_') ? key.split('-edit_')[1] : 'new'),
              name: draftVal.name ? `${draftVal.name} (Bản nháp)` : 'Thuốc chưa đặt tên (Bản nháp)'
            });
          }
        } catch (e) {}
      }
    }

    const filteredDraftMedicines = draftMedicines.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
        (m.indication && m.indication.toLowerCase().includes(medicineSearch.toLowerCase())) ||
        (m.activeIngredient && m.activeIngredient.toLowerCase().includes(medicineSearch.toLowerCase()));
      const matchClass = medicineClassFilter ? m.activeIngredient.includes(medicineClassFilter) : true;
      return matchSearch && matchClass;
    });

    const filteredMedicines = medicines.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
        m.indication.toLowerCase().includes(medicineSearch.toLowerCase()) ||
        m.activeIngredient.toLowerCase().includes(medicineSearch.toLowerCase());
      const matchClass = medicineClassFilter ? m.activeIngredient.includes(medicineClassFilter) : true;
      return matchSearch && matchClass;
    });

    const draftMedIds = new Set(filteredDraftMedicines.map(m => m.id));
    const cleanFilteredMedicines = filteredMedicines.filter(m => !draftMedIds.has(m.id));
    const allMedicinesList = [...filteredDraftMedicines, ...cleanFilteredMedicines];

    const totalItems = allMedicinesList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMedicines = allMedicinesList.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <div className="flex align-center gap-4" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Danh sách thuốc</h2>
          <button
            className="plus-btn-circle"
            onClick={() => onNavigate('medicine-add')}
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="filters-bar">
          <div className="filter-group">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm thuốc..."
              value={medicineSearch}
              onChange={(e) => setMedicineSearch(e.target.value)}
              className="form-input"
              style={{ width: '180px', padding: '6px 10px' }}
            />
          </div>

          <div className="filter-group">
            <Filter size={14} />
            <span>Lọc hoạt chất</span>
            <select
              value={medicineClassFilter}
              onChange={(e) => setMedicineClassFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Tất cả hoạt chất</option>
              <option value="Paracetamol">Paracetamol</option>
              <option value="Amoxicillin">Amoxicillin</option>
              <option value="Ibuprofen">Ibuprofen</option>
              <option value="Metformin">Metformin</option>
              <option value="Amlodipine">Amlodipine</option>
            </select>

            <button
              onClick={() => resetFilters('medicine')}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
            >
              <Undo2 size={12} /> Hủy
            </button>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Tên thuốc</th>
                <th>Hoạt chất chính</th>
                <th>Chỉ định điều trị</th>
                <th>Liều lượng dùng</th>
                <th style={{ width: '100px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((m) => (
                  <tr 
                    key={m.id} 
                    style={m.isDraft ? { cursor: 'pointer', opacity: 0.6, fontStyle: 'italic', borderLeft: '3px solid var(--primary-light)' } : { cursor: 'pointer' }}
                    onClick={m.isDraft ? () => handleDraftClick(m, 'medicine') : undefined}
                  >
                    <td
                      onClick={m.isDraft ? undefined : () => {
                        onSelectId(m.id);
                        onNavigate('medicine-details');
                      }}
                      style={{ fontWeight: 600, color: 'var(--primary)' }}
                    >
                      <span>{m.name}</span>
                    </td>
                    <td
                      onClick={m.isDraft ? undefined : () => {
                        onSelectId(m.id);
                        onNavigate('medicine-details');
                      }}
                    >
                      {m.activeIngredient}
                    </td>
                    <td
                      onClick={m.isDraft ? undefined : () => {
                        onSelectId(m.id);
                        onNavigate('medicine-details');
                      }}
                      style={{ color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {m.indication}
                    </td>
                    <td
                      onClick={m.isDraft ? undefined : () => {
                        onSelectId(m.id);
                        onNavigate('medicine-details');
                      }}
                    >
                      {m.dosage}
                    </td>
                    <td>
                      {m.isDraft ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bản nháp</span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectId(m.id);
                              onNavigate('medicine-edit');
                            }}
                            className="btn btn-outline"
                            style={{ padding: '4px' }}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete('medicine', m.id);
                            }}
                            className="btn btn-outline"
                            style={{ padding: '4px', color: 'red' }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{ padding: '20px', color: 'var(--text-muted)' }}>
                    Không tìm thấy dữ liệu thuốc phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="list-pagination-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{`Hiển thị ${startIndex + 1}-${Math.min(startIndex + paginatedMedicines.length, totalItems)} trong tổng số ${totalItems}`}</span>
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
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-nav-btn"
            >
              &lt;
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-nav-btn"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'medicine-details') {
    const item = medicines.find((m) => m.id === selectedId);
    if (!item) return <div>Không tìm thấy thuốc</div>;

    return (
      <div className="card animate-fade-in">
        <div className="details-header">
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Chi tiết thông tin thuốc</h2>
        </div>

        <div className="details-grid">
          <div className="details-image-box" style={{ background: 'linear-gradient(135deg, #a3f7ff 0%, #cbdcff 100%)' }}>
            <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>

          <div className="details-info-grid">
            <div className="detail-field">
              <span className="detail-field-label">Tên thuốc</span>
              <div className="detail-field-value">{item.name}</div>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Hoạt chất chính</span>
              <div className="detail-field-value">{item.activeIngredient}</div>
            </div>
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <span className="detail-field-label">Chỉ định điều trị</span>
              <div className="detail-field-value">{item.indication}</div>
            </div>
            <div className="detail-field" style={{ gridColumn: 'span 2' }}>
              <span className="detail-field-label">Chống chỉ định</span>
              <div className="detail-field-value">{item.contraindication}</div>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Liều lượng & Cách dùng</span>
              <div className="detail-field-value">{item.dosage}</div>
            </div>
            <div className="detail-field">
              <span className="detail-field-label">Tác dụng phụ có thể xảy ra</span>
              <div className="detail-field-value">{item.sideEffects}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => onNavigate('medicine-edit')}
            className="btn btn-outline"
            style={{ padding: '8px 16px', borderRadius: '6px' }}
          >
            <Edit3 size={14} /> Chỉnh sửa
          </button>
          <button
            onClick={() => handleDelete('medicine', item.id)}
            className="btn btn-outline"
            style={{ padding: '8px 16px', color: 'red', borderRadius: '6px' }}
          >
            <Trash2 size={14} /> Xóa
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'medicine-edit' || currentView === 'medicine-add') {
    if (!formData) return <div>Đang tải form...</div>;

    return (
      <div className="card animate-fade-in">
        <div className="details-header">
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            {currentView === 'medicine-add' ? 'Thêm thông tin thuốc mới' : 'Chỉnh sửa thông tin thuốc'}
          </h2>
        </div>

        <div className="form-grid">
          <div className="file-upload-circle" style={{ background: '#e0f7fa' }}>
            <Camera size={24} />
            <span style={{ fontSize: '0.75rem' }}>Tải ảnh lên</span>
          </div>

          <div className="form-inputs-container">
            <div className="form-group">
              <span className="form-group-label">Tên thuốc</span>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Panadol Extra"
                className={`form-input ${isFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Hoạt chất chính</span>
              <input
                type="text"
                value={formData.activeIngredient}
                onChange={(e) => setFormData({ ...formData, activeIngredient: e.target.value })}
                placeholder="Ví dụ: Paracetamol 500mg"
                className={`form-input ${isFieldModified('activeIngredient') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-group-label">Chỉ định</span>
              <textarea
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                placeholder="Ví dụ: Giảm đau hạ sốt..."
                className={`form-input form-textarea ${isFieldModified('indication') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-group-label">Chống chỉ định</span>
              <textarea
                value={formData.contraindication}
                onChange={(e) => setFormData({ ...formData, contraindication: e.target.value })}
                placeholder="Ví dụ: Suy gan nặng..."
                className={`form-input form-textarea ${isFieldModified('contraindication') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Liều lượng & Cách dùng</span>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="Liều lượng..."
                className={`form-input ${isFieldModified('dosage') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Tác dụng phụ</span>
              <input
                type="text"
                value={formData.sideEffects}
                onChange={(e) => setFormData({ ...formData, sideEffects: e.target.value })}
                placeholder="Tác dụng phụ..."
                className={`form-input ${isFieldModified('sideEffects') ? 'input-modified' : 'input-unmodified'}`}
              />
            </div>
          </div>
        </div>

        <div className="form-action-buttons">
          <button className="btn btn-cancel" onClick={() => {
            triggerToast('Đã thoát form (giữ bản nháp)', 'info');
            onNavigate(currentView === 'medicine-edit' ? 'medicine-details' : 'medicine-list');
          }}>
            Thoát
          </button>
          {localStorage.getItem(`draft_${currentView}_${selectedId || 'new'}`) && (
            <button className="btn btn-outline" style={{ color: 'red', borderColor: 'red' }} onClick={() => handleCancelDraft('medicine')}>
              Hủy nháp
            </button>
          )}
          <button className="btn btn-save" onClick={() => handleSave('medicine')}>
            Lưu
          </button>
        </div>
      </div>
    );
  }

  return null;
}
