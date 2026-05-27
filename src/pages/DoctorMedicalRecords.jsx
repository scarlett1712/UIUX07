import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Printer, Plus, Trash2, Camera, Clipboard, X, Check, Award } from 'lucide-react';

export default function DoctorMedicalRecords({
  currentView,
  onNavigate,
  previousView,
  selectedId,
  onSelectId,
  patients,
  setPatients,
  medicines,
  triggerToast
}) {
  const [patientSearch, setPatientSearch] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Diagnose & Prescription form states
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalSymptoms, setClinicalSymptoms] = useState('');
  const [prescribedDrugs, setPrescribedDrugs] = useState([]);
  
  // Current drug input states
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false);
  const [drugQty, setDrugQty] = useState('');
  const [drugUsage, setDrugUsage] = useState('');

  // Selected history item popup state
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  // Printable prescription modal state
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printedPrescriptionData, setPrintedPrescriptionData] = useState(null);

  // Default selected patient fallback
  const activePatientId = selectedId || 'P002'; // default Nguyễn Minh Anh
  const patient = patients.find(p => p.id === activePatientId) || patients[0];

  // Auto-fill form when entering diagnose view
  const handleOpenDiagnose = () => {
    setDiagnosis('');
    setClinicalSymptoms(
      activePatientId === 'P002' 
        ? 'Sốt cao 39 độ C đột ngột, ho khan kéo dài, đau họng, nghẹt mũi'
        : 'Đau tức vùng thượng vị rát cổ họng'
    );
    setPrescribedDrugs([]);
    setSelectedDrugId('');
    setDrugSearchQuery('');
    setShowDrugSuggestions(false);
    setDrugQty('');
    setDrugUsage('');
    onNavigate('doctor-patient-diagnose');
  };

  const handleAddDrug = () => {
    if (!drugSearchQuery.trim()) {
      triggerToast('Vui lòng nhập hoặc chọn thuốc kê đơn', 'error');
      return;
    }
    if (!drugQty.trim()) {
      triggerToast('Vui lòng nhập số lượng thuốc', 'error');
      return;
    }
    if (!drugUsage.trim()) {
      triggerToast('Vui lòng nhập hướng dẫn sử dụng', 'error');
      return;
    }

    const drug = medicines.find(m => m.name.toLowerCase() === drugSearchQuery.trim().toLowerCase() || m.id === selectedDrugId) || {
      id: `custom-${Date.now()}`,
      name: drugSearchQuery.trim(),
      activeIngredient: 'Tự nhập'
    };

    // Check if drug already in list
    if (prescribedDrugs.some(d => d.name.toLowerCase() === drug.name.toLowerCase())) {
      triggerToast('Thuốc này đã được thêm vào đơn thuốc', 'error');
      return;
    }

    setPrescribedDrugs([
      ...prescribedDrugs,
      {
        id: drug.id,
        name: drug.name,
        activeIngredient: drug.activeIngredient,
        qty: drugQty,
        usage: drugUsage
      }
    ]);

    // Reset drug inputs
    setDrugSearchQuery('');
    setSelectedDrugId('');
    setDrugQty('');
    setDrugUsage('');
    triggerToast('Đã thêm thuốc vào đơn thành công!', 'success');
  };

  const handleRemoveDrug = (id) => {
    setPrescribedDrugs(prescribedDrugs.filter(d => d.id !== id));
    triggerToast('Đã xóa thuốc khỏi đơn', 'info');
  };

  const handleSavePrescription = () => {
    if (!diagnosis.trim()) {
      triggerToast('Vui lòng nhập kết luận chẩn đoán', 'error');
      return;
    }
    if (prescribedDrugs.length === 0) {
      triggerToast('Vui lòng kê ít nhất một loại thuốc', 'error');
      return;
    }

    const todayObj = new Date();
    const dateToday = `${String(todayObj.getDate()).padStart(2, '0')}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${todayObj.getFullYear()}`;
    const newRecord = {
      date: dateToday,
      diagnosis: diagnosis,
      doctor: 'Bs. Huy',
      treatment: prescribedDrugs.map(d => `${d.name} (${d.qty}) - ${d.usage}`).join('; ')
    };

    // Update patient history
    const updatedPatients = patients.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          medicalHistory: [newRecord, ...p.medicalHistory]
        };
      }
      return p;
    });

    setPatients(updatedPatients);
    triggerToast('Lưu chẩn đoán và kê đơn thành công!', 'success');

    // Load prescription printed template
    setPrintedPrescriptionData({
      patientName: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      insurance: patient.insurance || 'Không có BHYT',
      diagnosis: diagnosis,
      drugs: prescribedDrugs,
      date: dateToday
    });

    // Show printable modal
    setShowPrintModal(true);
  };

  const handleClosePrintModal = () => {
    setShowPrintModal(false);
    onNavigate('doctor-patient-details');
  };

  const handlePrintTrigger = () => {
    triggerToast('Đang kết nối máy in để in đơn thuốc...', 'success');
    setTimeout(() => {
      setShowPrintModal(false);
      onNavigate('doctor-patient-details');
    }, 1500);
  };

  const renderModals = () => {
    return (
      <>
        {showPrintModal && printedPrescriptionData && (
          <div className="shift-modal-backdrop" style={{ zIndex: 2000 }}>
            <div className="shift-modal-card" style={{ maxWidth: '520px', padding: '24px', borderRadius: '8px', border: '2px solid #334155' }}>
              
              {/* Action Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={16} /> Xem trước bản in đơn thuốc
                </span>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={handleClosePrintModal}>
                  <X size={18} />
                </button>
              </div>

              {/* Printable Area block */}
              <div className="prescription-card" style={{ border: '1px solid #94a3b8', padding: '20px', backgroundColor: '#fff', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: 'monospace, sans-serif', color: '#0f172a' }}>
                
                {/* Clinic Banner */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px double #475569', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>PHÒNG KHÁM ĐA KHOA MEDICONSULT</div>
                    <div style={{ fontSize: '0.65rem' }}>Đ/c: Cầu Giấy, Hà Nội - Hotline: 1900 6039</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.65rem' }}>
                    <strong>Mã đơn:</strong> RX-{Date.now().toString().slice(-6)}
                  </div>
                </div>

                {/* Title */}
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px' }}>ĐƠN THUỐC Y KHOA</h2>
                  <span style={{ fontSize: '0.7rem' }}>Bác sĩ khám: <strong>Dương Gia Huy</strong></span>
                </div>

                {/* Patient Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '8px', fontSize: '0.72rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                  <div>
                    Họ tên: <strong>{printedPrescriptionData.patientName}</strong>
                  </div>
                  <div>
                    Ngày sinh: {printedPrescriptionData.dob}
                  </div>
                  <div>
                    Giới tính: {printedPrescriptionData.gender}
                  </div>
                  <div>
                    BHYT: {printedPrescriptionData.insurance}
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    Số điện thoại: {printedPrescriptionData.phone}
                  </div>
                </div>

                {/* Diagnosis */}
                <div style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
                  <strong>Chẩn đoán bệnh lý:</strong> {printedPrescriptionData.diagnosis}
                </div>

                {/* Prescribed Drugs list */}
                <div>
                  <strong style={{ fontSize: '0.75rem', display: 'block', marginBottom: '6px' }}>Thuốc kê đơn chi tiết:</strong>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.7rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #475569', textAlign: 'left' }}>
                        <th style={{ padding: '4px', width: '30px' }}>STT</th>
                        <th style={{ padding: '4px' }}>Tên thuốc / Hoạt chất</th>
                        <th style={{ padding: '4px', width: '80px', textAlign: 'center' }}>Số lượng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printedPrescriptionData.drugs.map((d, idx) => (
                        <React.Fragment key={d.id}>
                          <tr style={{ fontWeight: 700 }}>
                            <td style={{ padding: '4px' }}>{idx + 1}</td>
                            <td style={{ padding: '4px' }}>{d.name} ({d.activeIngredient})</td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>{d.qty}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px dashed #e2e8f0' }}>
                            <td />
                            <td colSpan="2" style={{ padding: '0 4px 4px 4px', fontStyle: 'italic', color: '#475569', fontSize: '0.65rem' }}>
                              HDSD: {d.usage}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signature Block */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', fontSize: '0.7rem', marginTop: '16px', borderTop: '1px solid #cbd5e1', paddingTop: '10px' }}>
                  <div style={{ fontSize: '0.62rem', fontStyle: 'italic', color: '#475569' }}>
                    Lưu ý: Uống thuốc đúng giờ, đúng liều lượng chỉ định. Tái khám sau khi hết thuốc nếu triệu chứng không thuyên giảm.
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div>Ngày {printedPrescriptionData.date}</div>
                    <div style={{ fontWeight: 700, margin: '4px 0' }}>Bác sĩ điều trị</div>
                    <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.7 }}>
                      <svg viewBox="0 0 100 50" width="80" height="30" stroke="#1e40af" strokeWidth="1.5" fill="none">
                        <path d="M10,20 Q30,10 50,20 T90,20 M30,15 L40,35 T60,25" />
                      </svg>
                    </div>
                    <div style={{ fontWeight: 800 }}>Dương Gia Huy</div>
                  </div>
                </div>

              </div>

              {/* Print trigger buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button 
                  onClick={handleClosePrintModal} 
                  className="btn btn-outline" 
                  style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                >
                  Đóng lại
                </button>
                <button 
                  onClick={handlePrintTrigger} 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={14} /> In đơn thuốc y khoa
                </button>
              </div>

            </div>
          </div>
        )}

        {selectedHistoryItem && (
          <div className="shift-modal-backdrop" style={{ zIndex: 1999 }}>
            <div className="shift-modal-card" style={{ maxWidth: '460px', padding: '24px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clipboard size={16} /> Chi tiết lịch sử khám bệnh
                </span>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedHistoryItem(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#334155' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <strong>Bệnh nhân:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{patient.name}</span>
                  </div>
                  <div>
                    <strong>Mã hồ sơ:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{patient.id}</span>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <strong>Ngày khám:</strong> <span style={{ color: 'var(--text-dark)' }}>{selectedHistoryItem.date}</span>
                  </div>
                  <div>
                    <strong>Bác sĩ phụ trách:</strong> <span style={{ color: 'var(--text-dark)' }}>{selectedHistoryItem.doctor}</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>Chẩn đoán bệnh lý:</strong>
                  <div style={{ padding: '8px 12px', backgroundColor: '#f0f9ff', borderLeft: '3px solid #0284c7', color: '#0369a1', fontWeight: 600, borderRadius: '4px' }}>
                    {selectedHistoryItem.diagnosis}
                  </div>
                </div>

                <div>
                  <strong style={{ display: 'block', marginBottom: '4px' }}>Đơn thuốc & Hướng dẫn điều trị:</strong>
                  <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', borderRadius: '6px', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                    {selectedHistoryItem.treatment}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button 
                  onClick={() => setSelectedHistoryItem(null)} 
                  className="btn btn-primary" 
                  style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // --- VIEWS ---

  // 1. PATIENTS DATABASE LIST VIEW
  if (currentView === 'doctor-medical-records') {
    const filtered = patients.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(patientSearch.toLowerCase()) || 
                          p.phone.includes(patientSearch) || 
                          p.id.toLowerCase().includes(patientSearch.toLowerCase());
      const matchGender = patientGender ? p.gender === patientGender : true;
      return matchSearch && matchGender;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPatients = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        
        {/* Header toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Hồ sơ bệnh án bệnh nhân</h2>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="filter-group" style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={14} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh nhân..."
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '160px' }}
              />
            </div>

            <div className="filter-group" style={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
              <select
                value={patientGender}
                onChange={(e) => {
                  setPatientGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
                style={{ padding: '6px 12px', border: 'none', outline: 'none', fontSize: '0.8rem' }}
              >
                <option value="">Giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Table Card */}
        <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Mã BN</th>
                <th>Họ tên</th>
                <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Ngày sinh</th>
                <th style={{ width: '80px' }}>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th style={{ width: '120px' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPatients.map(p => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => {
                  onSelectId(p.id);
                  onNavigate('doctor-patient-details');
                }}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{p.dob}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{p.email}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button 
                      onClick={() => {
                        onSelectId(p.id);
                        onNavigate('doctor-patient-details');
                      }}
                      className="btn btn-outline" 
                      style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--primary)' }}
                    >
                      Xem hồ sơ
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedPatients.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                    Không tìm thấy bệnh nhân nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Standardized transparent pagination bar */}
        <div className="list-pagination-bar">
          <span>
            Hiển thị {Math.min(startIndex + 1, totalItems)}-
            {Math.min(startIndex + paginatedPatients.length, totalItems)} trong tổng số {totalItems}
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
        {renderModals()}
      </div>
    );
  }

  // 2. PATIENT DETAILS PROFILE VIEW
  if (currentView === 'doctor-patient-details') {
    return (
      <div className="animate-fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button className="back-btn" onClick={() => {
            if (previousView === 'doctor-messages') {
              onNavigate('doctor-messages');
            } else {
              onNavigate('doctor-medical-records');
            }
          }}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Hồ sơ chi tiết bệnh nhân</h2>
        </div>

        {/* Profile Card & Details Grid */}
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr 1fr', gap: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', alignItems: 'center' }}>
            {/* Avatar placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: '1px solid var(--border-color)', paddingRight: '16px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fbcfe8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#db2777', marginBottom: '8px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)', display: 'block', wordBreak: 'break-word', lineHeight: '1.2' }}>{patient.name}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Mã: {patient.id}</span>
            </div>

            {/* Col 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Ngày sinh:</strong> <span style={{ color: 'var(--text-muted)' }}>{patient.dob}</span>
              </div>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Email:</strong> <span style={{ color: 'var(--text-muted)', wordBreak: 'break-all' }}>{patient.email || 'Chưa cập nhật'}</span>
              </div>
            </div>

            {/* Col 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Giới tính:</strong> <span style={{ color: 'var(--text-muted)' }}>{patient.gender}</span>
              </div>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Bảo hiểm y tế:</strong> <span style={{ color: 'var(--text-muted)' }}>{patient.insurance || 'Không có BHYT'}</span>
              </div>
            </div>

            {/* Col 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Số điện thoại:</strong> <span style={{ color: 'var(--text-muted)' }}>{patient.phone}</span>
              </div>
              <div style={{ fontSize: '0.88rem' }}>
                <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Địa chỉ:</strong> <span style={{ color: 'var(--text-muted)' }}>{patient.address || 'Chưa cập nhật'}</span>
              </div>
            </div>
          </div>

          {/* Clinical symptoms and notes section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Triệu chứng lâm sàng</span>
              <div style={{ padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid var(--primary-light)', fontSize: '0.8rem', color: 'var(--text-dark)', lineHeight: 1.4 }}>
                {patient.id === 'P002' ? (
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    <li>Sốt cao trên 39 độ C đột ngột</li>
                    <li>Chảy nước mũi đặc màu vàng đục</li>
                    <li>Đau rát cổ họng khi nuốt thức ăn</li>
                  </ul>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '16px' }}>
                    <li>Đau bụng vùng thượng vị ê ẩm kéo dài</li>
                    <li>Ợ chua hơi nóng rát họng sau ăn</li>
                  </ul>
                )}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Kết quả xét nghiệm lâm sàng</span>
              <table className="custom-table" style={{ fontSize: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '6px' }}>STT</th>
                    <th style={{ padding: '6px' }}>Loại xét nghiệm</th>
                    <th style={{ padding: '6px' }}>Kết quả</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px' }}>1</td>
                    <td style={{ padding: '6px' }}>Test nhanh Cúm A/B</td>
                    <td style={{ padding: '6px', fontWeight: 700, color: '#16a34a' }}>Âm tính</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>2</td>
                    <td style={{ padding: '6px' }}>Test nhanh Covid-19</td>
                    <td style={{ padding: '6px', fontWeight: 700, color: '#16a34a' }}>Âm tính</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Medical History Section */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Lịch sử khám & điều trị</h3>
            <button 
              onClick={handleOpenDiagnose}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 14px' }}
            >
              <Award size={14} /> Chẩn đoán và kê đơn
            </button>
          </div>

          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <table className="custom-table" style={{ fontSize: '0.8rem', margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>STT</th>
                  <th style={{ width: '120px' }}>Ngày khám</th>
                  <th>Chẩn đoán bệnh</th>
                  <th>Phác đồ điều trị / Kê đơn thuốc</th>
                  <th style={{ width: '100px' }}>Bác sĩ khám</th>
                </tr>
              </thead>
              <tbody>
                {patient.medicalHistory.map((h, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => setSelectedHistoryItem(h)} 
                    style={{ cursor: 'pointer' }}
                    title="Nhấn để xem chi tiết lịch sử khám"
                    className="hover-row"
                  >
                    <td>{patient.medicalHistory.length - idx}</td>
                    <td style={{ fontWeight: 600 }}>{h.date}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{h.diagnosis}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{h.treatment}</td>
                    <td>{h.doctor}</td>
                  </tr>
                ))}
                {patient.medicalHistory.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Chưa có lịch sử bệnh án nào được ghi nhận.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {renderModals()}
      </div>
    );
  }

  // 3. DIAGNOSE & PRESCRIBE FORM VIEW
  if (currentView === 'doctor-patient-diagnose') {
    return (
      <div className="animate-fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button className="back-btn" onClick={() => onNavigate('doctor-patient-details')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Chẩn đoán & Kê đơn thuốc</h2>
        </div>

        {/* Split Grid: Form Input vs Active Prescribed Items list */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', alignItems: 'start' }}>
          
          {/* Left: Input Form */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', margin: 0 }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Kết luận khám bệnh</h3>
            
            <div className="form-group">
              <span className="form-group-label" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Chẩn đoán bệnh lý</span>
              <input
                type="text"
                placeholder="Ví dụ: Cúm mùa, Viêm họng cấp..."
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="form-input"
                style={{ padding: '8px', fontSize: '0.8rem', width: '100%' }}
              />
            </div>

            <div className="form-group">
              <span className="form-group-label" style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }}>Triệu chứng lâm sàng</span>
              <textarea
                placeholder="Mô tả triệu chứng..."
                value={clinicalSymptoms}
                onChange={(e) => setClinicalSymptoms(e.target.value)}
                className="form-input"
                style={{ padding: '8px', fontSize: '0.8rem', width: '100%', minHeight: '60px' }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '6px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Thêm thuốc kê đơn</h4>
              
              <div className="form-group" style={{ marginBottom: '10px', position: 'relative' }}>
                <span className="form-group-label" style={{ fontSize: '0.78rem', display: 'block', marginBottom: '3px' }}>Chọn loại thuốc</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input
                    type="text"
                    value={drugSearchQuery}
                    onChange={(e) => {
                      setDrugSearchQuery(e.target.value);
                      setShowDrugSuggestions(true);
                    }}
                    onFocus={() => setShowDrugSuggestions(true)}
                    placeholder="Nhập tên thuốc hoặc chọn..."
                    className="form-input"
                    style={{ flexGrow: 1, padding: '6px', fontSize: '0.8rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDrugSuggestions(!showDrugSuggestions)}
                    className="btn btn-outline"
                    style={{ padding: '4px 8px', fontSize: '0.8rem', minWidth: '32px' }}
                  >
                    ▼
                  </button>
                </div>
                {showDrugSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    zIndex: 100,
                    boxShadow: 'var(--shadow-md)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    marginTop: '2px'
                  }}>
                    {medicines
                      .filter(m => 
                        !drugSearchQuery.trim() || 
                        m.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                        m.activeIngredient.toLowerCase().includes(drugSearchQuery.toLowerCase())
                      )
                      .map(m => (
                        <div
                           key={m.id}
                           onClick={() => {
                             setDrugSearchQuery(m.name);
                             setSelectedDrugId(m.id);
                             setShowDrugSuggestions(false);
                           }}
                           style={{
                             padding: '8px 12px',
                             cursor: 'pointer',
                             borderBottom: '1px solid #f1f5f9',
                             fontSize: '0.8rem',
                             color: 'var(--text-dark)'
                           }}
                           onMouseDown={(e) => e.preventDefault()}
                        >
                           <strong>{m.name}</strong> <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({m.activeIngredient})</span>
                        </div>
                      ))}
                    {medicines.filter(m => 
                      !drugSearchQuery.trim() || 
                      m.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                      m.activeIngredient.toLowerCase().includes(drugSearchQuery.toLowerCase())
                    ).length === 0 && (
                      <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Không tìm thấy thuốc khớp, có thể tự nhập
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: '10px' }}>
                <span className="form-group-label" style={{ fontSize: '0.78rem', display: 'block', marginBottom: '3px' }}>Số lượng kê</span>
                <input
                  type="text"
                  placeholder="Ví dụ: 10 viên, 1 lọ..."
                  value={drugQty}
                  onChange={(e) => setDrugQty(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '6px', fontSize: '0.8rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <span className="form-group-label" style={{ fontSize: '0.78rem', display: 'block', marginBottom: '3px' }}>Hướng dẫn sử dụng</span>
                <input
                  type="text"
                  placeholder="Ví dụ: Uống 1 viên/lần, ngày 2 lần sau ăn..."
                  value={drugUsage}
                  onChange={(e) => setDrugUsage(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', padding: '6px', fontSize: '0.8rem' }}
                />
              </div>

              <button
                onClick={handleAddDrug}
                className="btn btn-outline"
                style={{ width: '100%', padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary)' }}
              >
                <Plus size={14} /> Thêm vào đơn thuốc
              </button>
            </div>
          </div>

          {/* Right: Active Prescribed list */}
          <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)' }}>Đơn thuốc đang kê</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bệnh nhân: <strong>{patient.name}</strong></span>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {prescribedDrugs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '220px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Clipboard size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
                  Đơn thuốc trống. Hãy thêm thuốc ở panel trái.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {prescribedDrugs.map((d, index) => (
                    <div 
                      key={d.id} 
                      style={{ 
                        padding: '10px 12px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-color)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center' 
                      }}
                    >
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                          {index + 1}. {d.name} <span style={{ fontWeight: 500, fontSize: '0.75rem', color: 'var(--text-muted)' }}>({d.qty})</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                          Cách dùng: {d.usage}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRemoveDrug(d.id)}
                        className="btn btn-outline" 
                        style={{ padding: '6px', border: 'none', color: '#dc2626' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => onNavigate('doctor-patient-details')} 
                className="btn btn-outline" 
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSavePrescription} 
                className="btn btn-primary" 
                style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Check size={14} /> Lưu & In đơn thuốc
              </button>
            </div>

          </div>

        </div>
        {renderModals()}
      </div>
    );
  }

  return renderModals();
}
