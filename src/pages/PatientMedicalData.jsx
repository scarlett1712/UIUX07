import React, { useState } from 'react';
import { ShieldAlert, BookOpen, UserCheck, Stethoscope, Clock, HelpCircle, Activity } from 'lucide-react';

export default function PatientMedicalData({ onNavigate, diseases = [], triggerToast }) {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState(diseases[0]?.id || 'D001');

  const selectedDisease = diseases.find(d => d.id === selectedDiseaseId) || diseases[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
        Tra cứu Dữ liệu Y tế học thuật
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px 0', marginTop: '-10px' }}>
        Thông tin chi tiết về các bệnh lý phổ biến, triệu chứng lâm sàng và định hướng điều trị từ Hội đồng Y khoa MediConsult.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px', height: 'calc(100vh - 200px)', minHeight: '450px' }}>
        
        {/* Left side list of diseases */}
        <div className="card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '0.95rem', margin: '4px 0', color: 'var(--text-dark)', fontWeight: '600' }}>
            Danh sách bệnh lý & dịch bệnh
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {diseases.map(d => (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDiseaseId(d.id);
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
            ))}
          </div>
        </div>

        {/* Right side detailed pane */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', margin: 0, overflowY: 'auto' }}>
          {selectedDisease ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Header block */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary)' }}>{selectedDisease.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã bệnh án: {selectedDisease.id}</span>
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
          )}
        </div>

      </div>
    </div>
  );
}
