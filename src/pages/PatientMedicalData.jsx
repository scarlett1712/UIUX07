import React, { useState, useEffect } from 'react';
import { ShieldAlert, BookOpen, UserCheck, Stethoscope, Clock, HelpCircle, Activity, Pill } from 'lucide-react';

export default function PatientMedicalData({ 
  onNavigate, 
  diseases = [], 
  medicines = [],
  selectedId = null,
  onSelectId,
  triggerToast 
}) {
  const [activeTab, setActiveTab] = useState('diseases'); // 'diseases' or 'medicines'
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(diseases[0]?.id || 'D001');
  const [selectedMedicineId, setSelectedMedicineId] = useState(medicines[0]?.id || 'M001');

  useEffect(() => {
    if (selectedId) {
      if (selectedId.startsWith('M')) {
        setActiveTab('medicines');
        setSelectedMedicineId(selectedId);
      } else if (selectedId.startsWith('D')) {
        setActiveTab('diseases');
        setSelectedDiseaseId(selectedId);
      }
    }
  }, [selectedId]);

  const selectedDisease = diseases.find(d => d.id === selectedDiseaseId) || diseases[0];
  const selectedMedicine = medicines.find(m => m.id === selectedMedicineId) || medicines[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
          Tra cứu Dữ liệu Y tế học thuật
        </h2>
        
        {/* Tab switcher */}
        <div style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '8px', gap: '4px' }}>
          <button
            onClick={() => {
              setActiveTab('diseases');
              if (onSelectId) onSelectId(selectedDiseaseId);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'diseases' ? '700' : '500',
              backgroundColor: activeTab === 'diseases' ? '#fff' : 'transparent',
              color: activeTab === 'diseases' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={14} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} /> Bệnh lý & Dịch bệnh
          </button>
          <button
            onClick={() => {
              setActiveTab('medicines');
              if (onSelectId) onSelectId(selectedMedicineId);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'medicines' ? '700' : '500',
              backgroundColor: activeTab === 'medicines' ? '#fff' : 'transparent',
              color: activeTab === 'medicines' ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Pill size={14} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} /> Cơ sở dữ liệu Thuốc
          </button>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0', marginTop: '-10px' }}>
        {activeTab === 'diseases'
          ? "Thông tin chi tiết về các bệnh lý phổ biến, triệu chứng lâm sàng và định hướng điều trị từ Hội đồng Y khoa MediConsult."
          : "Tra cứu công dụng, liều dùng chuẩn, chống chỉ định và tác dụng phụ của các loại thuốc thuộc danh mục phòng khám."
        }
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px', height: 'calc(100vh - 200px)', minHeight: '450px' }}>
        
        {/* LEFT COLUMN: List of Diseases or Medicines */}
        <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', margin: '4px 0', color: 'var(--text-dark)', fontWeight: '600' }}>
            {activeTab === 'diseases' ? "Danh sách bệnh lý & dịch bệnh" : "Danh mục dược phẩm"}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeTab === 'diseases' ? (
              diseases.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDiseaseId(d.id);
                    if (onSelectId) onSelectId(d.id);
                    triggerToast(`Đang xem chi tiết bệnh: ${d.name}`, 'info');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: selectedDiseaseId === d.id ? 'var(--primary-light)' : 'var(--border-color)',
                    backgroundColor: selectedDiseaseId === d.id ? '#f0f7ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-dark)' }}>{d.name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chuyên khoa: {d.department}</span>
                  </div>
                  <span className={`badge ${
                    d.danger === 'Cao' ? 'badge-high' : d.danger === 'Trung bình' ? 'badge-medium' : 'badge-low'
                  }`}>
                    {d.danger}
                  </span>
                </div>
              ))
            ) : (
              medicines.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMedicineId(m.id);
                    if (onSelectId) onSelectId(m.id);
                    triggerToast(`Đang xem chi tiết thuốc: ${m.name}`, 'info');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px solid',
                    borderColor: selectedMedicineId === m.id ? 'var(--primary-light)' : 'var(--border-color)',
                    backgroundColor: selectedMedicineId === m.id ? '#f0f7ff' : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-dark)' }}>{m.name}</div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hoạt chất: {m.activeIngredient}</span>
                  </div>
                  <span className="badge" style={{ backgroundColor: '#e2fbe8', color: '#10b981' }}>
                    Thuốc
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Details Pane */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, overflowY: 'auto' }}>
          {activeTab === 'diseases' ? (
            selectedDisease ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header block */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary)' }}>{selectedDisease.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã bệnh lý: {selectedDisease.id}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>Mức độ nguy hiểm:</span>
                    <span className={`badge ${
                      selectedDisease.danger === 'Cao' ? 'badge-high' : selectedDisease.danger === 'Trung bình' ? 'badge-medium' : 'badge-low'
                    }`} style={{ padding: '6px 14px', fontSize: '0.85rem', fontWeight: '600' }}>
                      {selectedDisease.danger}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'block', marginBottom: '6px' }}>Mô tả tổng quan:</strong>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5' }}>
                    {selectedDisease.desc}
                  </p>
                </div>

                {/* Department recommendation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#eff6ff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <Stethoscope size={18} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                    Khuyên khám tại chuyên khoa: <strong>{selectedDisease.department}</strong>
                  </span>
                </div>

                {/* Symptoms breakdown table */}
                <div style={{ marginTop: '8px' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)', display: 'block', marginBottom: '8px' }}>
                    Bảng phân tích triệu chứng lâm sàng:
                  </strong>
                  
                  <div className="custom-table-container">
                    <table className="custom-table" style={{ margin: 0 }}>
                      <thead>
                        <tr>
                          <th style={{ width: '60px' }}>STT</th>
                          <th>Triệu chứng</th>
                          <th>Mô tả chi tiết</th>
                          <th>Thời điểm</th>
                          <th>Tần suất</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDisease.symptoms.map((s, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{s.stt || idx + 1}</td>
                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{s.name}</td>
                            <td style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>{s.desc}</td>
                            <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.duration}</td>
                            <td style={{ fontSize: '0.82rem' }}>
                              <span className="badge badge-low" style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                                {s.frequency}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Related actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button
                    onClick={() => onNavigate('patient-consultation')}
                    className="btn btn-outline"
                    style={{ padding: '10px 20px', margin: 0, fontSize: '0.85rem' }}
                  >
                    Tư vấn AI triệu chứng này
                  </button>
                  <button
                    onClick={() => onNavigate('patient-schedule')}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', margin: 0, fontSize: '0.85rem' }}
                  >
                    Đặt lịch khám chuyên khoa
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <span>Vui lòng chọn một bệnh từ danh sách để xem dữ liệu y tế học thuật</span>
              </div>
            )
          ) : (
            selectedMedicine ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Header block */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#e2fbe8', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{selectedMedicine.name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hoạt chất chính: <strong>{selectedMedicine.activeIngredient}</strong> &bull; Mã: {selectedMedicine.id}</span>
                  </div>
                </div>

                {/* Medicine info rows grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Row 1 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mô tả tổng quan</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.45 }}>{selectedMedicine.desc}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Liều lượng & Cách dùng</span>
                      <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-dark)', borderLeft: '3px solid var(--primary-light)', marginTop: '4px', lineHeight: 1.45 }}>
                        {selectedMedicine.dosage}
                      </div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chỉ định điều trị</span>
                      <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-dark)', borderLeft: '3px solid #10b981', marginTop: '4px', lineHeight: 1.45 }}>
                        {selectedMedicine.indication}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tác dụng phụ có thể gặp</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.45 }}>{selectedMedicine.sideEffects || 'Chưa ghi nhận tác dụng phụ đáng kể.'}</p>
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chống chỉ định</span>
                      <div style={{ padding: '10px', backgroundColor: '#fff5f5', borderRadius: '6px', fontSize: '0.82rem', color: '#dc2626', borderLeft: '3px solid #ef4444', marginTop: '4px', lineHeight: 1.45 }}>
                        {selectedMedicine.contraindication}
                      </div>
                    </div>
                    <div>
                      {/* Empty cell */}
                    </div>
                  </div>
                </div>

                {/* Related actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  <button
                    onClick={() => onNavigate('patient-consultation')}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px', margin: 0, fontSize: '0.85rem' }}
                  >
                    Hỏi AI về thuốc này
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                <span>Vui lòng chọn một loại thuốc để xem thông tin dược học</span>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
