import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Printer, Plus, Trash2, Camera, Clipboard, X, Check, Award, Undo2 } from 'lucide-react';

export const getTestResultsData = (testName = '') => {
  const name = testName.toLowerCase();
  
  if (name.includes('cúm') || name.includes('influenza') || name.includes('flu')) {
    return {
      results: [
        { name: 'Kháng nguyên Cúm A (Influenza A)', value: 'Dương tính (+)', status: 'high', unit: '', reference: 'Âm tính' },
        { name: 'Kháng nguyên Cúm B (Influenza B)', value: 'Âm tính (-)', status: 'normal', unit: '', reference: 'Âm tính' }
      ],
      warning: 'Kết quả xét nghiệm cúm A Dương tính. Bạn cần cách ly, nghỉ ngơi tại nhà và uống hạ sốt nếu sốt cao.'
    };
  }
  
  if (name.includes('công thức máu') || name.includes('cbc') || name.includes('máu')) {
    return {
      results: [
        { name: 'Số lượng Bạch cầu (WBC)', value: '11.2', status: 'high', unit: 'G/L', reference: '4.0 - 10.0' },
        { name: 'Số lượng Hồng cầu (RBC)', value: '4.5', status: 'normal', unit: 'T/L', reference: '3.8 - 5.8' },
        { name: 'Số lượng Tiểu cầu (PLT)', value: '245', status: 'normal', unit: 'G/L', reference: '150 - 450' }
      ],
      warning: 'Chỉ số Bạch cầu hơi tăng nhẹ, thể hiện cơ thể đang có phản ứng tự nhiên chống lại tình trạng viêm nhiễm.'
    };
  }
  
  if (name.includes('dạ dày') || name.includes('nội soi dạ dày') || name.includes('endoscopy')) {
    return {
      results: [
        { name: 'Niêm mạc hang vị dạ dày', value: 'Xung huyết đỏ nhẹ', status: 'high', unit: '', reference: 'Bình thường' },
        { name: 'Test nhanh vi khuẩn Helicobacter Pylori (HP)', value: 'Dương tính (+)', status: 'high', unit: '', reference: 'Âm tính' },
        { name: 'Tâm vị và Thân vị', value: 'Bình thường', status: 'normal', unit: '', reference: 'Bình thường' }
      ],
      warning: 'Có hình ảnh xung huyết niêm mạc hang vị dạ dày và kết quả kiểm tra vi khuẩn HP Dương tính (+). Cần dùng phác đồ điều trị HP.'
    };
  }
  
  if (name.includes('nước tiểu') || name.includes('urine')) {
    return {
      results: [
        { name: 'Protein nước tiểu', value: 'Âm tính', status: 'normal', unit: '', reference: 'Âm tính' },
        { name: 'Glucose nước tiểu', value: 'Âm tính', status: 'normal', unit: '', reference: 'Âm tính' },
        { name: 'Bạch cầu nước tiểu (LEU)', value: 'Âm tính', status: 'normal', unit: '', reference: 'Âm tính' }
      ],
      warning: ''
    };
  }
  
  if (name.includes('siêu âm') || name.includes('ultrasound')) {
    return {
      results: [
        { name: 'Kích thước Gan & nhu mô', value: 'Bình thường, đều', status: 'normal', unit: '', reference: 'Bình thường' },
        { name: 'Túi mật & Đường mật', value: 'Thành mỏng, không sỏi', status: 'normal', unit: '', reference: 'Bình thường' },
        { name: 'Kích thước Lách', value: 'Bình thường', status: 'normal', unit: '', reference: 'Bình thường' },
        { name: 'Thận trái & Thận phải', value: 'Không sỏi, không ứ nước', status: 'normal', unit: '', reference: 'Bình thường' }
      ],
      warning: ''
    };
  }
  
  if (name.includes('phân') || name.includes('stool')) {
    return {
      results: [
        { name: 'Trứng ký sinh trùng trong phân', value: 'Không tìm thấy', status: 'normal', unit: '', reference: 'Không tìm thấy' },
        { name: 'Hồng cầu trong phân', value: 'Âm tính', status: 'normal', unit: '', reference: 'Âm tính' }
      ],
      warning: ''
    };
  }
  
  return {
    results: [
      { name: 'Glucose (Đường huyết lúc đói)', value: '6.8', status: 'high', unit: 'mmol/L', reference: '3.9 - 6.4' },
      { name: 'Urea (Chức năng thận)', value: '5.2', status: 'normal', unit: 'mmol/L', reference: '2.5 - 7.5' },
      { name: 'Creatinine huyết thanh', value: '82', status: 'normal', unit: 'µmol/L', reference: '62 - 115' }
    ],
    warning: 'Chỉ số Glucose của bệnh nhân hơi cao nhẹ so với ngưỡng bình thường. Hãy hạn chế dùng đồ ngọt trước khi ngủ.'
  };
};

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

  // 3-stage diagnostic process states
  const [testStage, setTestStage] = useState('initial'); // 'initial', 'tests_ordered', 'tests_completed'
  const [selectedTests, setSelectedTests] = useState(['Xét nghiệm sinh hóa máu (Glucose, Urea, Creatinine)']);

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
    setTestStage('initial');
    setSelectedTests(['Xét nghiệm sinh hóa máu (Glucose, Urea, Creatinine)']);
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
      treatment: prescribedDrugs.map(d => `${d.name} (${d.qty}) - ${d.usage}`).join('; '),
      tests: selectedTests
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
            Hồ sơ bệnh án bệnh nhân
          </h2>
        </div>

        <div className="filters-bar" style={{ marginBottom: '16px' }}>
          <div className="filter-group">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm bệnh nhân..."
              value={patientSearch}
              onChange={(e) => {
                setPatientSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="form-input"
              style={{ width: '220px', padding: '6px 10px' }}
            />
          </div>

          <div className="filter-group">
            <Filter size={14} />
            <select
              value={patientGender}
              onChange={(e) => {
                setPatientGender(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <button
              onClick={() => {
                setPatientSearch('');
                setPatientGender('');
                setCurrentPage(1);
                triggerToast('Đã xóa bộ lọc bệnh nhân', 'info');
              }}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
            >
              <Undo2 size={12} /> Hủy lọc
            </button>
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
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Hồ sơ chi tiết bệnh nhân</h2>
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

          {/* Health Indicators Row */}
          <div style={{ 
            marginTop: '16px', 
            paddingTop: '16px', 
            borderTop: '1px solid var(--border-color)', 
            display: 'grid', 
            gridTemplateColumns: '130px 1fr 1fr 1fr 1.5fr', 
            gap: '20px', 
            alignItems: 'stretch' 
          }}>
            <div style={{ 
              borderRight: '1px solid var(--border-color)', 
              paddingRight: '16px', 
              color: 'var(--primary)', 
              fontWeight: '700', 
              fontSize: '0.85rem', 
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}>
              Chỉ số cơ thể
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nhóm máu</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{patient.blood || 'Chưa rõ'}</strong>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chiều cao</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{patient.height ? `${patient.height} cm` : 'Chưa cập nhật'}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cân nặng</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>{patient.weight ? `${patient.weight} kg` : 'Chưa cập nhật'}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chỉ số BMI</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>
                {(() => {
                  const h = patient.height ? patient.height / 100 : 0;
                  const w = patient.weight || 0;
                  if (h > 0 && w > 0) {
                    const bmi = (w / (h * h)).toFixed(1);
                    let status = 'Bình thường';
                    if (bmi < 18.5) status = 'Gầy';
                    else if (bmi >= 25) status = 'Thừa cân';
                    return `${bmi} (${status})`;
                  }
                  return 'Chưa tính';
                })()}
              </strong>
            </div>
          </div>

          {/* Health Notes / Allergies Row */}
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px', 
            borderTop: '1px dashed var(--border-color)', 
            fontSize: '0.85rem' 
          }}>
            <strong style={{ color: 'var(--text-dark)', fontWeight: 600 }}>Ghi chú tiền sử & Dị ứng: </strong>
            <span style={{ color: '#ef4444', fontWeight: '500' }}>
              {patient.notes || 'Không có bệnh nền hay dị ứng thuốc nghiêm trọng.'}
            </span>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, color: 'var(--primary)' }}>
            Chẩn đoán & Kê đơn thuốc
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Bệnh nhân: <strong>{patient.name}</strong> ({patient.gender === 'Nữ' ? 'Nữ' : 'Nam'}, {patient.dob})
          </span>
        </div>

        {/* Diagnostic flow progress bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-around', 
          backgroundColor: 'var(--white)', 
          padding: '12px 20px', 
          borderRadius: 'var(--radius-md)', 
          border: '1px solid var(--border-color)',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: testStage === 'initial' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: testStage === 'initial' ? 700 : 500 }}>
            <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: testStage === 'initial' ? 'var(--primary)' : '#e2e8f0', color: testStage === 'initial' ? '#fff' : 'var(--text-muted)', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>1</span>
            <span>Chỉ định xét nghiệm</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: testStage === 'tests_ordered' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: testStage === 'tests_ordered' ? 700 : 500 }}>
            <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: testStage === 'tests_ordered' ? 'var(--primary)' : '#e2e8f0', color: testStage === 'tests_ordered' ? '#fff' : 'var(--text-muted)', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>2</span>
            <span>Chờ kết quả phòng Lab</span>
          </div>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--border-color)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: testStage === 'tests_completed' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: testStage === 'tests_completed' ? 700 : 500 }}>
            <span style={{ display: 'inline-flex', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: testStage === 'tests_completed' ? 'var(--primary)' : '#e2e8f0', color: testStage === 'tests_completed' ? '#fff' : 'var(--text-muted)', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>3</span>
            <span>Đọc kết quả & Kê đơn</span>
          </div>
        </div>

        {/* STAGE 1: INITIAL */}
        {testStage === 'initial' && (
          <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', margin: 0 }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)' }}>Bước 1: Nhập triệu chứng & Chỉ định xét nghiệm</h3>
            
            {/* Triệu chứng lâm sàng */}
            <div className="form-group">
              <span className="form-group-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Triệu chứng lâm sàng</span>
              <textarea
                placeholder="Mô tả các triệu chứng lâm sàng quan sát được hoặc khai báo từ bệnh nhân..."
                value={clinicalSymptoms}
                onChange={(e) => setClinicalSymptoms(e.target.value)}
                className="form-input"
                style={{ padding: '10px', fontSize: '0.85rem', width: '100%', minHeight: '90px' }}
              />
            </div>

            {/* Chỉ định xét nghiệm */}
            <div>
              <span className="form-group-label" style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Chọn dịch vụ xét nghiệm chỉ định</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {[
                  'Xét nghiệm sinh hóa máu (Glucose, Urea, Creatinine)',
                  'Xét nghiệm công thức máu toàn phần (CBC)',
                  'Xét nghiệm nước tiểu 10 thông số',
                  'Siêu âm ổ bụng tổng quát',
                  'Nội soi dạ dày tá tràng chẩn đoán HP',
                  'Chụp X-quang phổi thẳng'
                ].map((testName, index) => {
                  const isChecked = selectedTests.includes(testName);
                  return (
                    <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedTests(selectedTests.filter(t => t !== testName));
                          } else {
                            setSelectedTests([...selectedTests, testName]);
                          }
                        }}
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      <span style={{ color: 'var(--text-dark)' }}>{testName}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
              <button 
                onClick={() => onNavigate('doctor-patient-details')} 
                className="btn btn-outline" 
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => {
                  if (selectedTests.length === 0) {
                    triggerToast('Vui lòng chọn ít nhất một dịch vụ xét nghiệm chỉ định!', 'error');
                    return;
                  }
                  setTestStage('tests_ordered');
                  triggerToast('Đã gửi chỉ định xét nghiệm thành công!', 'success');
                }} 
                className="btn btn-primary" 
                style={{ padding: '8px 22px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Check size={16} /> Gửi yêu cầu xét nghiệm
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: TESTS ORDERED */}
        {testStage === 'tests_ordered' && (
          <div className="card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', margin: 0, alignItems: 'center', textAlign: 'center' }}>
            
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 4px 6px -1px rgba(217, 119, 6, 0.1)',
              marginBottom: '4px'
            }}>
              ⏳
            </div>
            
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: '#b45309' }}>Trạng thái: Đang tiến hành xét nghiệm</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', lineHeight: 1.5 }}>
                Yêu cầu xét nghiệm cận lâm sàng đã được chuyển giao thành công sang hệ thống phòng Lab. Bệnh nhân đang được kỹ thuật viên hỗ trợ lấy mẫu để chạy phân tích chỉ số.
              </p>
            </div>

            <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'left' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Các xét nghiệm đã chỉ định</span>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedTests.map((t, idx) => (
                  <li key={idx}><strong>{t}</strong></li>
                ))}
              </ul>
            </div>

            <div style={{ 
              marginTop: '10px', 
              padding: '16px 20px', 
              border: '1px dashed #bbf7d0', 
              borderRadius: '8px', 
              backgroundColor: '#f0fdf4',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '440px',
              width: '100%'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '500' }}>💡 Trình giả lập demo: Cập nhật trạng thái từ phòng xét nghiệm</span>
              <button
                onClick={() => {
                  setTestStage('tests_completed');
                  triggerToast('Kết quả xét nghiệm đã được phòng Lab trả về thành công!', 'success');
                }}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#16a34a', borderColor: '#16a34a' }}
              >
                <Check size={16} /> Nhận kết quả & Đọc chỉ số (Hoàn thành)
              </button>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => setTestStage('initial')} 
                className="btn btn-outline" 
                style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ← Thay đổi chỉ định xét nghiệm
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: TESTS COMPLETED */}
        {testStage === 'tests_completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Lab Test Results Review Card */}
            <div className="card animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📊 Kết quả xét nghiệm cận lâm sàng (Phòng Lab trả về)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#16a34a', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                  ● Đã có kết quả
                </span>
              </div>

              {/* Table matching Patient UI */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}>
                      <th style={{ padding: '8px 12px' }}>TÊN XÉT NGHIỆM</th>
                      <th style={{ padding: '8px 12px', width: '140px' }}>KẾT QUẢ</th>
                      <th style={{ padding: '8px 12px', width: '80px' }}>ĐƠN VỊ</th>
                      <th style={{ padding: '8px 12px', width: '160px' }}>CHỈ SỐ BÌNH THƯỜNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTests.map((testName) => {
                      const testData = getTestResultsData(testName);
                      return (
                        <React.Fragment key={testName}>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                            <td colSpan="4" style={{ padding: '8px 12px', fontWeight: '700', color: 'var(--primary)', fontSize: '0.78rem' }}>
                              📋 {testName}
                            </td>
                          </tr>
                          {testData.results.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '10px 12px', paddingLeft: '24px' }}>
                                <strong>{item.name}</strong>
                              </td>
                              <td style={{ 
                                padding: '10px 12px', 
                                color: item.status === 'high' ? '#ef4444' : item.status === 'low' ? '#3b82f6' : '#16a34a', 
                                fontWeight: 'bold' 
                              }}>
                                {item.value} {item.status === 'high' ? '🔺' : item.status === 'low' ? '🔻' : ''}
                              </td>
                              <td style={{ padding: '10px 12px' }}>
                                {item.unit || '-'}
                              </td>
                              <td style={{ padding: '10px 12px', color: 'var(--text-muted)', backgroundColor: '#f8fafc' }}>
                                {item.reference}
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Warning notes */}
              {(() => {
                const allWarnings = selectedTests
                  .map(testName => getTestResultsData(testName).warning)
                  .filter(warning => !!warning);
                
                if (allWarnings.length === 0) return null;

                return (
                  <div style={{ 
                    padding: '10px 12px', 
                    borderRadius: '6px', 
                    backgroundColor: '#fee2e2', 
                    border: '1px solid #fecaca',
                    fontSize: '0.78rem',
                    color: '#dc2626',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    marginTop: '12px'
                  }}>
                    {allWarnings.map((warn, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️</span>
                        <span>{warn}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
                    readOnly
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
                    onClick={() => setTestStage('tests_ordered')} 
                    className="btn btn-outline" 
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    Quay lại
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
          </div>
        )}
        {renderModals()}
      </div>
    );
  }

  return renderModals();
}
