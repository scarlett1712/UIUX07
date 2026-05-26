import React, { useState } from 'react';
import { Search, Filter, ArrowLeft, Pill, BookOpen } from 'lucide-react';

export default function DoctorMedicines({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  medicines,
  triggerToast
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Filter medicines
  const filteredMedicines = medicines.filter(m => {
    return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.activeIngredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
           m.desc.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalItems = filteredMedicines.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, startIndex + itemsPerPage);

  const activeMed = medicines.find(m => m.id === selectedId);

  // --- VIEWS ---

  // 1. DETAILS MONOGRAPH VIEW
  if (currentView === 'doctor-medicine-details' && activeMed) {
    return (
      <div className="animate-fade-in">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button className="back-btn" onClick={() => onNavigate('doctor-medicines')}>
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Chi tiết thông tin thuốc</h2>
        </div>

        {/* Details Grid Card */}
        <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#e2fbe8', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={24} style={{ margin: '0 auto' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-dark)' }}>{activeMed.name}</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mã hoạt chất: <strong>{activeMed.activeIngredient}</strong> &bull; Mã: {activeMed.id}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Row 1: General Description & Dosage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Mô tả tổng quan</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.45 }}>{activeMed.desc}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Liều lượng & Cách dùng</span>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-dark)', borderLeft: '3px solid var(--primary-light)', marginTop: '4px', lineHeight: 1.45 }}>
                  {activeMed.dosage}
                </div>
              </div>
            </div>

            {/* Row 2: Indication & Side Effects */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chỉ định điều trị</span>
                <div style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.82rem', color: 'var(--text-dark)', borderLeft: '3px solid #10b981', marginTop: '4px', lineHeight: 1.45 }}>
                  {activeMed.indication}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Tác dụng phụ có thể gặp</span>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--text-dark)', lineHeight: 1.45 }}>{activeMed.sideEffects || 'Chưa ghi nhận tác dụng phụ đáng kể.'}</p>
              </div>
            </div>

            {/* Row 3: Contraindications */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Chống chỉ định</span>
                <div style={{ padding: '10px', backgroundColor: '#fff5f5', borderRadius: '6px', fontSize: '0.82rem', color: '#dc2626', borderLeft: '3px solid #ef4444', marginTop: '4px', lineHeight: 1.45 }}>
                  {activeMed.contraindication}
                </div>
              </div>
              <div>
                {/* Empty cell to maintain symmetry */}
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // 2. MEDICINES LIST TABLE VIEW (Read-only)
  return (
    <div className="animate-fade-in">
      
      {/* Header filter toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Cơ sở dữ liệu Tra cứu thuốc</h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="filter-group" style={{ backgroundColor: '#fff', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm tên thuốc, hoạt chất..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              style={{ border: 'none', outline: 'none', fontSize: '0.8rem', width: '200px' }}
            />
          </div>
        </div>
      </div>

      {/* Medicines Table Card */}
      <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
        <table className="custom-table" style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Mã</th>
              <th>Tên thuốc</th>
              <th>Hoạt chất chính</th>
              <th>Liều lượng chuẩn</th>
              <th>Tác dụng phụ</th>
              <th style={{ width: '120px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMedicines.map(m => (
              <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => {
                onSelectId(m.id);
                onNavigate('doctor-medicine-details');
              }}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{m.id}</td>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td style={{ fontWeight: 600 }}>{m.activeIngredient}</td>
                <td>{m.dosage}</td>
                <td style={{ color: 'var(--text-muted)' }}>{m.sideEffects}</td>
                <td onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => {
                      onSelectId(m.id);
                      onNavigate('doctor-medicine-details');
                    }}
                    className="btn btn-outline" 
                    style={{ padding: '4px 10px', fontSize: '0.78rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <BookOpen size={12} /> Tra cứu chi tiết
                  </button>
                </td>
              </tr>
            ))}
            {paginatedMedicines.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                  Không tìm thấy loại thuốc nào phù hợp
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
          {Math.min(startIndex + paginatedMedicines.length, totalItems)} trong tổng số {totalItems}
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
