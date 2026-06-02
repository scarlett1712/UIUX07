import React, { useState } from 'react';
import { Clipboard, Star, MessageSquare, AlertCircle, Calendar, User, FileText, Search, Filter, CheckCircle2, ChevronRight, Download, Printer, X } from 'lucide-react';

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
    warning: 'Chỉ số Glucose của bạn hơi cao nhẹ so với ngưỡng bình thường. Hãy hạn chế dùng đồ ngọt trước khi ngủ.'
  };
};

export default function PatientMedicalHistory({ 
  currentView,
  onNavigate, 
  selectedId,
  onSelectId,
  patients = [], 
  setPatients,
  feedbacks = [], 
  setFeedbacks, 
  triggerToast 
}) {
  const [showRateModal, setShowRateModal] = useState(false);
  const [activeVisitIndex, setActiveVisitIndex] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [commentText, setCommentText] = useState('');

  // Modals state for Detail view
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showTestResultsModal, setShowTestResultsModal] = useState(false);
  const [activeTestName, setActiveTestName] = useState('');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [symptomFilter, setSymptomFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  // Find Lương Hương Giang's patient record
  const patientData = patients.find(p => p.id === 'P004') || { name: 'Lương Hương Giang', medicalHistory: [] };

  const handleOpenRateModal = (index, e) => {
    e.stopPropagation();
    setActiveVisitIndex(index);
    setRatingStars(5);
    setCommentText('');
    setShowRateModal(true);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      triggerToast('Vui lòng nhập ý kiến phản hồi của bạn', 'error');
      return;
    }

    const targetVisit = patientData.medicalHistory[activeVisitIndex];
    if (!targetVisit) return;

    // 1. Create a new feedback for the manager view
    const newFeedback = {
      id: Date.now(),
      name: patientData.name,
      rating: ratingStars,
      comment: `[Khám ngày ${targetVisit.date} - ${targetVisit.doctor}] ${commentText}`,
      response: '',
      date: new Date().toLocaleDateString('vi-VN').replace(/\//g, '-')
    };

    setFeedbacks([newFeedback, ...feedbacks]);

    // 2. Update patient medical history in database to mark this visit as rated
    setPatients(prev => prev.map(p => {
      if (p.id === 'P004') {
        return {
          ...p,
          medicalHistory: p.medicalHistory.map((item, idx) => {
            if (idx === activeVisitIndex) {
              return { 
                ...item, 
                rated: true, 
                rating: ratingStars, 
                comment: commentText 
              };
            }
            return item;
          })
        };
      }
      return p;
    }));

    triggerToast('Cảm ơn bạn đã đánh giá dịch vụ phòng khám!', 'success');
    setShowRateModal(false);
  };

  const getVisitTests = (visit) => {
    if (visit.tests) return visit.tests;
    const diag = (visit.diagnosis || '').toLowerCase();
    if (diag.includes('dạ dày')) return ['Công thức máu', 'Urea / Creatinine', 'Nội soi dạ dày', 'Siêu âm ổ bụng'];
    if (diag.includes('cúm')) return ['Xét nghiệm nhanh cúm A/B', 'Công thức máu'];
    if (diag.includes('tiêu hóa')) return ['Xét nghiệm phân', 'Siêu âm ổ bụng'];
    if (diag.includes('phế quan') || diag.includes('họng') || diag.includes('mũi')) return ['Nội soi tai mũi họng'];
    return [];
  };

  const getVisitCost = (visit) => {
    if (visit.cost) return visit.cost;
    const diag = (visit.diagnosis || '').toLowerCase();
    if (diag.includes('dạ dày')) return '450.000 VND';
    if (diag.includes('cúm')) return '150.000 VND';
    if (diag.includes('tiêu hóa')) return '250.000 VND';
    if (diag.includes('phế quan') || diag.includes('phế quản')) return '220.000 VND';
    return '150.000 VND';
  };

  const getDoctorSpecialty = (docName) => {
    const nameLower = docName.toLowerCase();
    if (nameLower.includes('huy')) return 'Khoa Ngoại tổng quát';
    if (nameLower.includes('nguyễn văn b') || nameLower.includes('b')) return 'Khoa Nội tổng quát';
    return 'Khoa Tai mũi họng';
  };

  const getVisitCode = (index) => {
    return `#058${91 - index * 14}`;
  };

  const getDayOfWeek = (dateStr) => {
    // format dateStr is DD-MM-YYYY
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[2], parts[1] - 1, parts[0]);
      const day = d.getDay();
      const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
      return days[day];
    }
    return 'Thứ sáu';
  };

  const getVisitTimeRange = (index) => {
    return index === 0 ? '9:00 - 9:30' : '14:00 - 14:30';
  };

  // Filter history records
  const filteredHistory = patientData.medicalHistory.map((visit, index) => ({ visit, index })).filter(({ visit }) => {
    const matchSearch = visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        visit.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    // specialty logic
    const spec = getDoctorSpecialty(visit.doctor);
    const matchSpecialty = specialtyFilter ? spec === specialtyFilter : true;

    // symptom logic
    const matchSymptom = symptomFilter ? visit.diagnosis.toLowerCase().includes(symptomFilter.toLowerCase()) : true;

    return matchSearch && matchSpecialty && matchSymptom;
  });

  const isDetailView = currentView === 'patient-medical-history-detail';
  const detailIndex = Number(selectedId || 0);
  const detailVisit = patientData.medicalHistory[detailIndex];

  // Detailed symptoms & conclusions matching mockup image
  const getSymptomsText = (diagnosis = '') => {
    if (diagnosis.toLowerCase().includes('dạ dày')) {
      return 'Bệnh nhân đau vùng thượng vị âm ỉ liên tục trong 2 tuần, đau tăng lên sau khi ăn đồ ăn chua, cay, nóng hoặc khi chịu căng thẳng công việc (stress). Có hiện tượng ợ nóng, ợ chua nhẹ vào sáng sớm, chướng bụng đầy hơi khó tiêu sau ăn. Ăn uống không ngon miệng và thỉnh thoảng mất ngủ nhẹ.';
    }
    return 'Bệnh nhân có triệu chứng sốt nhẹ từ tối hôm trước, ho khan kèm đau rát nhẹ cổ họng, nghẹt mũi chảy nước mũi trong. Cơ thể mệt mỏi, đau nhức các khớp nhẹ, ăn uống kém ngon miệng, không có khó thở.';
  };

  const getConclusionText = (diagnosis = '') => {
    if (diagnosis.toLowerCase().includes('dạ dày')) {
      return 'Viêm dạ dày tá tràng thể xung huyết cấp tính, có trào ngược dạ dày thực quản (GERD) mức độ A. Đề xuất điều trị bằng phác đồ PPI bảo vệ niêm mạc phối hợp thuốc trung hòa acid dạ dày. Cần duy trì chế độ dinh dưỡng lành mạnh, tránh thức khuya và tái khám định kỳ sau 14 ngày điều trị.';
    }
    return 'Cảm cúm mùa thông thường do nhiễm virus đường hô hấp cấp tính. Đề xuất nghỉ ngơi tại nhà, bổ sung nhiều nước ấm và các loại vitamin. Điều trị triệu chứng hạ sốt bằng Paracetamol khi sốt cao trên 38.5 độ C. Theo dõi sát sao tình trạng sức khỏe.';
  };

  // --- RENDER MAIN LAYOUT ---
  return (
    <>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {!isDetailView ? (
        /* 1. LIST VIEW OF VISIT HISTORY */
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
              Lịch sử khám bệnh
            </h2>
          </div>

          {/* Filters Bar matching Image 1 */}
          <div className="card" style={{ padding: '16px', margin: 0, display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', flexGrow: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm kiếm bệnh lý hoặc triệu chứng ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '0.85rem', width: '100%', height: '38px' }}
              />
            </div>

            <div style={{ width: '160px' }}>
              <select
                value={symptomFilter}
                onChange={(e) => setSymptomFilter(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem', height: '38px', padding: '6px 10px', width: '100%' }}
              >
                <option value="">Triệu chứng</option>
                <option value="dạ dày">Đau dạ dày</option>
                <option value="cảm cúm">Cảm cúm</option>
                <option value="viêm">Viêm họng</option>
              </select>
            </div>

            <div style={{ width: '180px' }}>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem', height: '38px', padding: '6px 10px', width: '100%' }}
              >
                <option value="">Chuyên khoa</option>
                <option value="Khoa Nội tổng quát">Khoa Nội tổng quát</option>
                <option value="Khoa Ngoại tổng quát">Khoa Ngoại tổng quát</option>
                <option value="Khoa Tai mũi họng">Khoa Tai mũi họng</option>
              </select>
            </div>

            <button 
              onClick={() => {
                setSearchTerm('');
                setSymptomFilter('');
                setSpecialtyFilter('');
                triggerToast('Đã xóa bộ lọc tìm kiếm', 'info');
              }}
              className="btn btn-primary"
              style={{ height: '38px', padding: '0 20px', fontSize: '0.85rem', fontWeight: '600' }}
            >
              Lọc kết quả
            </button>
          </div>

          {/* Visits List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredHistory.map(({ visit, index }) => (
              <div 
                key={index}
                className="card hover-card animate-fade-in"
                style={{
                  margin: 0,
                  padding: '16px 20px',
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2fr 1.5fr 1.2fr 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                {/* Column 1: Date & Time block */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {getDayOfWeek(visit.date)}
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                    {visit.date}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {getVisitTimeRange(index)}
                  </span>
                </div>

                {/* Column 2: Doctor info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                      <circle cx="50" cy="40" r="20" fill="#2563eb" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-dark)' }}>Bác sĩ {visit.doctor.replace('Bs. ', '').replace('BS. ', '')}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getDoctorSpecialty(visit.doctor)}</span>
                  </div>
                </div>

                {/* Column 3: Status Badge */}
                <div>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    fontSize: '0.78rem', 
                    fontWeight: '600', 
                    color: '#15803d', 
                    backgroundColor: '#dcfce7', 
                    padding: '6px 12px', 
                    borderRadius: '6px' 
                  }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} /> Đã hoàn thành
                  </span>
                </div>

                {/* Column 4: Medical Code */}
                <div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Mã khám bệnh
                  </span>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-dark)', marginTop: '2px' }}>
                    {getVisitCode(index)}
                  </div>
                </div>

                {/* Column 5: Action Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => {
                      onSelectId(index);
                      onNavigate('patient-medical-history-detail');
                    }}
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: '700', borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: '#fff', width: '100%', textAlign: 'center' }}
                  >
                    Xem chi tiết
                  </button>
                  
                  {!visit.rated ? (
                    <button
                      onClick={(e) => handleOpenRateModal(index, e)}
                      className="btn btn-primary"
                      style={{ padding: '6px 10px', fontSize: '0.72rem', width: '100%', textAlign: 'center' }}
                    >
                      Đánh giá ca khám
                    </button>
                  ) : (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      backgroundColor: '#f8fafc', 
                      padding: '8px 10px', 
                      borderRadius: '6px', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#eab308' }}>
                        {Array.from({ length: visit.rating || 5 }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                        {Array.from({ length: 5 - (visit.rating || 5) }).map((_, i) => <Star key={i} size={12} />)}
                      </div>
                      {visit.comment && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic', wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.3' }}>
                          "{visit.comment}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredHistory.length === 0 && (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                Không tìm thấy bệnh án phù hợp
              </div>
            )}
          </div>
        </>
      ) : (
        /* 2. DETAIL VIEW OF SINGLE VISIT (MATCHES IMAGE 2) */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {detailVisit ? (
            <>
              {/* Page Title */}
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
                Chi tiết lịch sử khám bệnh
              </h2>

              {/* Top Banner (Details header: Time, place & Doctor card) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
                {/* Left Card: Appointment Time & Location */}
                <div className="card" style={{ padding: '16px 20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '700' }}>Lịch khám định kỳ</h3>
                    <span style={{ fontSize: '0.75rem', color: '#15803d', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                      ● Hoàn thành
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                    <div>
                      <strong>⏰ Thời gian:</strong> {getVisitTimeRange(detailIndex)} {getDayOfWeek(detailVisit.date)}, {detailVisit.date}
                    </div>
                    <div style={{ lineHeight: '1.4' }}>
                      <strong>📍 Địa điểm:</strong> {detailIndex === 0 ? 'Tầng 2, Tòa nhà B, Phòng khám Đa khoa MediConsult, Cầu Giấy, Hà Nội' : 'Tầng 6, Tòa nhà K1, Khoa Nội tổng quát, Bệnh viện Bạch Mai, Giải Phóng, Hà Nội'}
                    </div>
                    {detailVisit.rated && (
                      <div style={{ 
                        marginTop: '8px', 
                        paddingTop: '8px', 
                        borderTop: '1px dashed var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <strong>⭐️ Đánh giá của bạn:</strong>
                          <span style={{ display: 'flex', color: '#eab308' }}>
                            {Array.from({ length: detailVisit.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            {Array.from({ length: 5 - (detailVisit.rating || 5) }).map((_, i) => <Star key={i} size={14} />)}
                          </span>
                        </div>
                        {detailVisit.comment && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            "{detailVisit.comment}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Card: Doctor Profile */}
                <div className="card" style={{ padding: '16px 20px', margin: 0, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <circle cx="50" cy="50" r="50" fill="#dbeafe" />
                      <circle cx="50" cy="40" r="20" fill="#2563eb" />
                      <path d="M20,80 C20,60 80,60 80,80" fill="#2563eb" />
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bác sĩ khám</span>
                    <strong style={{ fontSize: '0.98rem', color: 'var(--primary)' }}>{detailVisit.doctor}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chuyên khoa: {getDoctorSpecialty(detailVisit.doctor)}</span>
                  </div>
                </div>
              </div>

              {/* Two Column details split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', alignItems: 'start' }}>
                
                {/* Left Column: Diagnostics & Laboratory Tests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Card: Diagnose Results */}
                  <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📋 Kết quả chẩn đoán
                      </span>
                      <button 
                        onClick={() => triggerToast('Đang tạo tóm tắt kết quả chẩn đoán bệnh án...', 'success')}
                        className="btn btn-outline" 
                        style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Printer size={12} /> In kết quả
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>TRIỆU CHỨNG LÂM SÀNG</span>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: '1.45', backgroundColor: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                          {getSymptomsText(detailVisit.diagnosis)}
                        </p>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>KẾT LUẬN CỦA BÁC SĨ</span>
                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: '1.45', backgroundColor: '#f0f9ff', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #0284c7' }}>
                          <strong>{detailVisit.diagnosis}</strong>. {getConclusionText(detailVisit.diagnosis)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card: Tests list */}
                  <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'block' }}>
                      🧪 Kết quả xét nghiệm
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '-6px', display: 'block' }}>
                      Nhấn vào từng xét nghiệm dưới đây để xem chỉ số chi tiết
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {getVisitTests(detailVisit).map((test, idx) => {
                        let statusColor = '#15803d'; // green
                        let bgColor = '#f0fdf4';
                        let borderColor = '#bbf7d0';
                        let desc = 'Bình thường';

                        const testInfo = getTestResultsData(test);
                        const hasHigh = testInfo.results.some(r => r.status === 'high');
                        const hasLow = testInfo.results.some(r => r.status === 'low');
                        
                        if (hasHigh) {
                          statusColor = '#ef4444'; // red
                          bgColor = '#fef2f2';
                          borderColor = '#fecaca';
                          desc = 'Có chỉ số cao';
                        } else if (hasLow) {
                          statusColor = '#3b82f6'; // blue
                          bgColor = '#eff6ff';
                          borderColor = '#bfdbfe';
                          desc = 'Có chỉ số thấp';
                        }

                        return (
                          <div 
                            key={idx}
                            onClick={() => {
                              setActiveTestName(test);
                              setShowTestResultsModal(true);
                            }}
                            className="hover-card"
                            style={{
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: borderColor,
                              backgroundColor: bgColor,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              transition: 'all 0.2s'
                            }}
                          >
                            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-dark)' }}>{test}</span>
                            <span style={{ 
                              alignSelf: 'flex-start', 
                              fontSize: '0.68rem', 
                              fontWeight: '600', 
                              color: statusColor, 
                              backgroundColor: 'rgba(255,255,255,0.7)', 
                              padding: '2px 6px', 
                              borderRadius: '4px' 
                            }}>
                              {desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Column: Prescription & Billing */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Card: Prescription drugs list */}
                  <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'block' }}>
                      💊 Đơn thuốc
                    </span>

                    {/* Drugs list summary */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>1. Nexium (Esomeprazole) 40mg</span>
                            <span style={{ color: 'var(--text-muted)' }}>14 viên</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>2. Gaviscon Dual Action Hỗn dịch</span>
                            <span style={{ color: 'var(--text-muted)' }}>20 gói</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>3. Phosphalugel (Chữ P)</span>
                            <span style={{ color: 'var(--text-muted)' }}>10 gói</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>1. Paracetamol 500mg</span>
                            <span style={{ color: 'var(--text-muted)' }}>10 viên</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                            <span style={{ fontWeight: 600 }}>2. Vitamin C Sủi 500mg</span>
                            <span style={{ color: 'var(--text-muted)' }}>1 tuýp</span>
                          </div>
                        </>
                      )}
                    </div>

                    <button 
                      onClick={() => setShowPrescriptionModal(true)}
                      className="btn btn-primary"
                      style={{ width: '100%', fontSize: '0.82rem', padding: '8px', fontWeight: '700', marginTop: '6px' }}
                    >
                      Xem chi tiết đơn thuốc
                    </button>
                  </div>

                  {/* Card: Billing Summary */}
                  <div className="card" style={{ padding: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dark)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'block' }}>
                      📋 Thanh toán hồ sơ
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dark)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Phí khám bệnh:</span>
                        <span style={{ fontWeight: 500 }}>{detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? '400.000đ' : '150.000đ'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Dịch vụ xét nghiệm:</span>
                        <span style={{ fontWeight: 500 }}>{detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? '1.000.000đ' : '150.000đ'}</span>
                      </div>
                      
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingMinutes: '4px', margin: '4px 0' }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700', color: '#16a34a' }}>
                        <span>Tổng cộng:</span>
                        <span>{detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? '1.400.000đ' : '300.000đ'}</span>
                      </div>
                    </div>

                    <div style={{ 
                      marginTop: '6px', 
                      backgroundColor: '#f0fdf4', 
                      borderRadius: '6px', 
                      padding: '8px', 
                      textAlign: 'center', 
                      fontSize: '0.72rem', 
                      color: '#15803d', 
                      fontWeight: '600',
                      border: '1px solid #bbf7d0'
                    }}>
                      ✓ Đã thanh toán (Ví MoMo)
                    </div>
                  </div>

                </div>

              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Không tìm thấy hồ sơ chi tiết này.
            </div>
          )}
        </div>
      )}
      </div>

      {/* RATING SUB-MODAL */}
      {showRateModal && (
        <div 
          onClick={() => setShowRateModal(false)}
          className="shift-modal-backdrop"
          style={{ zIndex: 100000 }}
        >
          <form 
            onSubmit={handleSubmitRating} 
            onClick={(e) => e.stopPropagation()} 
            className="card animate-fade-in" 
            style={{
              width: '100%',
              maxWidth: '450px',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              Đánh giá dịch vụ khám chữa bệnh
            </h3>
            
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Vui lòng để lại mức độ hài lòng đối với ca khám của bác sĩ tại phòng khám MediConsult.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>Mức độ hài lòng:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingStars(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star 
                      size={28} 
                      fill={star <= ratingStars ? '#eab308' : 'none'} 
                      color={star <= ratingStars ? '#eab308' : '#cbd5e1'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dark)' }}>Ý kiến phản hồi / Góp ý</label>
              <textarea
                rows="4"
                placeholder="Ví dụ: Bác sĩ khám rất kỹ, tư vấn phác đồ dễ hiểu. Nhân viên đón tiếp nhiệt tình..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.82rem',
                  resize: 'none',
                  outline: 'none',
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '4px' }}>
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={() => setShowRateModal(false)}
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                Hủy bỏ
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '8px 24px', fontSize: '0.82rem', fontWeight: '700' }}
              >
                Gửi đánh giá
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL 1: DETAILED PRESCRIPTION */}
      {showPrescriptionModal && detailVisit && (
        <div 
          onClick={() => setShowPrescriptionModal(false)}
          className="shift-modal-backdrop"
          style={{ zIndex: 100001 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="card animate-fade-in"
            style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-lg)',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                  💊 Đơn thuốc chi tiết
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Mã đơn thuốc: DT-2026-99120
                </span>
              </div>
              <button onClick={() => setShowPrescriptionModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Patient overview header */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1.5fr 1fr', 
              gap: '8px', 
              fontSize: '0.75rem', 
              backgroundColor: '#f8fafc', 
              padding: '10px 12px', 
              borderRadius: '6px', 
              border: '1px solid var(--border-color)',
              color: 'var(--text-dark)' 
            }}>
              <div><strong>BỆNH NHÂN:</strong> {patientData.name}</div>
              <div><strong>NGÀY KÊ ĐƠN:</strong> {detailVisit.date}</div>
              <div><strong>Mã khám bệnh:</strong> {getVisitCode(detailIndex)}</div>
              <div><strong>Bác sĩ kê đơn:</strong> {detailVisit.doctor}</div>
            </div>

            {/* Drugs List Table */}
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Danh mục thuốc chỉ định:</strong>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--text-dark)', textAlign: 'left', fontWeight: 'bold' }}>
                    <th style={{ padding: '6px 4px', width: '40px' }}>STT</th>
                    <th style={{ padding: '6px 4px' }}>Tên thuốc / Hoạt chất</th>
                    <th style={{ padding: '6px 4px', width: '80px', textAlign: 'center' }}>Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? (
                    <>
                      <tr>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>1</td>
                        <td style={{ padding: '8px 4px' }}>
                          <strong>Nexium (Esomeprazole) 40mg</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Liều dùng: Sáng uống 1 viên trước khi ăn sáng 30 phút. Bảo vệ niêm mạc dạ dày và hạn chế tiết acid thừa.</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>14 viên</td>
                      </tr>
                      <tr style={{ borderTop: '1px dashed var(--border-color)' }}>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>2</td>
                        <td style={{ padding: '8px 4px' }}>
                          <strong>Gaviscon Dual Action Hỗn Dịch</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Liều dùng: Uống 1 gói sau bữa ăn trưa, tối 1 giờ và trước khi đi ngủ. Hỗ trợ trung hòa acid và ngăn dịch trào ngược.</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>20 gói</td>
                      </tr>
                      <tr style={{ borderTop: '1px dashed var(--border-color)', borderBottom: '1px solid var(--text-dark)' }}>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>3</td>
                        <td style={{ padding: '8px 4px' }}>
                          <strong>Phosphalugel (Dạng sữa chữ P)</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Liều dùng: Uống 1 gói ngay khi cảm thấy nóng rát vùng thượng vị. Tối đa không quá 3 gói một ngày.</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>10 gói</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>1</td>
                        <td style={{ padding: '8px 4px' }}>
                          <strong>Paracetamol 500mg</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Liều dùng: Sốt trên 38.5 độ C uống 1 viên. Các liều cách nhau 4-6 tiếng, tối đa 4 viên/ngày.</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>10 viên</td>
                      </tr>
                      <tr style={{ borderTop: '1px dashed var(--border-color)', borderBottom: '1px solid var(--text-dark)' }}>
                        <td style={{ padding: '8px 4px', fontWeight: 600 }}>2</td>
                        <td style={{ padding: '8px 4px' }}>
                          <strong>Vitamin C Sủi 500mg</strong>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Liều dùng: Hòa tan 1 viên trong 200ml nước đun sôi để nguội. Uống sau bữa ăn sáng giúp tăng đề kháng.</div>
                        </td>
                        <td style={{ padding: '8px 4px', textAlign: 'center', fontWeight: 600 }}>1 tuýp</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Doctor Advice notes */}
            <div style={{ 
              padding: '10px 12px', 
              borderRadius: '8px', 
              backgroundColor: '#fffbeb', 
              border: '1px solid #fde68a',
              fontSize: '0.75rem',
              color: '#92400e',
              lineHeight: '1.45' 
            }}>
              <strong>Lời dặn của bác sĩ:</strong>
              {detailVisit.diagnosis.toLowerCase().includes('dạ dày') ? (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                  <li>Kiêng đồ chua, cay, nóng, nhiều dầu mỡ và chất kích thích (rượu, bia, cà phê).</li>
                  <li>Ăn đúng giờ, nhai kỹ, không thức khuya và tránh căng thẳng (stress).</li>
                  <li>Tuyệt đối không nằm ngay sau khi ăn (nghỉ ngơi tối thiểu 30 phút).</li>
                  <li>Tái khám sau 14 ngày hoặc đi khám ngay nếu đau tăng dữ dội.</li>
                </ul>
              ) : (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
                  <li>Nghỉ ngơi tĩnh dưỡng tối đa tại giường, giữ ấm vùng cổ ngực.</li>
                  <li>Ăn thức ăn loãng dễ tiêu như cháo gà ấm, súp ấm.</li>
                  <li>Uống nhiều nước ấm giúp loãng đờm và hạ nhiệt tốt hơn.</li>
                  <li>Theo dõi sát nhiệt độ cơ thể, tái khám sau 3 ngày nếu sốt không dứt.</li>
                </ul>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
              <button 
                onClick={() => setShowPrescriptionModal(false)}
                className="btn btn-outline"
                style={{ padding: '8px 20px', fontSize: '0.8rem' }}
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  triggerToast('Tải xuống PDF đơn thuốc thành công!', 'success');
                  setShowPrescriptionModal(false);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Download size={14} /> Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODAL 2: DETAILED TEST RESULTS */}
      {showTestResultsModal && detailVisit && (() => {
        const testData = getTestResultsData(activeTestName);
        return (
          <div 
            onClick={() => setShowTestResultsModal(false)}
            className="shift-modal-backdrop"
            style={{ zIndex: 100002 }}
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="card animate-fade-in"
              style={{
                width: '100%',
                maxWidth: '540px',
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                boxShadow: 'var(--shadow-lg)',
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
                    📊 Chi tiết kết quả xét nghiệm tổng quát
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Xét nghiệm được thực hiện: <strong>{activeTestName}</strong>
                  </span>
                </div>
                <button onClick={() => setShowTestResultsModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Patient Header */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1fr', 
                gap: '8px', 
                fontSize: '0.75rem', 
                backgroundColor: '#f8fafc', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-dark)' 
              }}>
                <div><strong>BỆNH NHÂN:</strong> {patientData.name}</div>
                <div><strong>MÃ BỆNH NHÂN:</strong> BN-2026-9938</div>
                <div><strong>NGÀY THỰC HIỆN:</strong> {detailVisit.date} 11:15</div>
                <div><strong>Bác sĩ chỉ định:</strong> {detailVisit.doctor}</div>
              </div>

              {/* Results Table matching mockup image */}
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#eff6ff', borderBottom: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 'bold' }}>
                      <th style={{ padding: '8px' }}>TÊN XÉT NGHIỆM</th>
                      <th style={{ padding: '8px', width: '140px' }}>KẾT QUẢ</th>
                      <th style={{ padding: '8px', width: '80px' }}>ĐƠN VỊ</th>
                      <th style={{ padding: '8px', width: '140px' }}>CHỈ SỐ BÌNH THƯỜNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testData.results.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          <strong>{item.name}</strong>
                        </td>
                        <td style={{ 
                          padding: '10px 8px', 
                          color: item.status === 'high' ? '#ef4444' : item.status === 'low' ? '#3b82f6' : '#16a34a', 
                          fontWeight: 'bold' 
                        }}>
                          {item.value} {item.status === 'high' ? '🔺' : item.status === 'low' ? '🔻' : ''}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          {item.unit || '-'}
                        </td>
                        <td style={{ padding: '10px 8px', color: 'var(--text-muted)', backgroundColor: '#f8fafc' }}>
                          {item.reference}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Note alert */}
              {testData.warning && (
                <div style={{ 
                  padding: '8px 12px', 
                  borderRadius: '6px', 
                  backgroundColor: '#fee2e2', 
                  border: '1px solid #fecaca',
                  fontSize: '0.72rem',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={12} />
                  <span>{testData.warning}</span>
                </div>
              )}

              {/* Bottom buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                <button 
                  onClick={() => setShowTestResultsModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                >
                  Đóng
                </button>
                <button 
                  onClick={() => {
                    triggerToast('Tải xuống PDF kết quả xét nghiệm thành công!', 'success');
                    setShowTestResultsModal(false);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Tải xuống PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </>
  );
}
