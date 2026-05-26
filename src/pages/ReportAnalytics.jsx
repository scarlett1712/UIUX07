import React, { useState } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, RefreshCw, BarChart2, PieChart } from 'lucide-react';

export default function ReportAnalytics({ triggerToast }) {
  const [dateRange, setDateRange] = useState('01-05-2026 - 06-05-2026');

  const handleExport = () => {
    triggerToast('Đang tạo và tải xuống tệp báo cáo thống kê định dạng PDF...', 'success');
  };

  return (
    <div className="card animate-fade-in" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Top Filter and Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '6px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', width: '200px' }}
          />
        </div>

        <button className="btn btn-primary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Download size={16} />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {/* KPI 1 */}
        <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bệnh nhân mới</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>23</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981' }}>
            <TrendingUp size={14} />
            <span>+12.5% so với tháng trước</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Đánh giá mới</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)' }}>15</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444' }}>
            <TrendingDown size={14} />
            <span>-5.2% so với tháng trước</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Doanh thu phòng khám</span>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>125.450.000 VNĐ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444' }}>
            <TrendingDown size={14} />
            <span>-2.1% so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginTop: '8px' }}>
        
        {/* Chart 1: Lượt khám theo ngày */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart2 size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Lượt khám theo ngày</h4>
            </div>
            {/* Color indicators */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#60a5fa', borderRadius: '2px' }} />
                Đặt lịch hẹn trước
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#f43f5e', borderRadius: '2px' }} />
                Khám trực tiếp
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div style={{ height: '180px' }}>
            <svg viewBox="0 0 500 180" width="100%" height="100%">
              {/* Grid background lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#ebd5e1" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="30" y="25" fill="#94a3b8" fontSize="10" textAnchor="end">500</text>
              <text x="30" y="65" fill="#94a3b8" fontSize="10" textAnchor="end">300</text>
              <text x="30" y="105" fill="#94a3b8" fontSize="10" textAnchor="end">100</text>
              <text x="30" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>

              {/* Bar Elements: Sat (60), Sun (120), Mon (200), Tue (220), Wed (240), Thu (180), Fri (250) */}
              {/* Saturday */}
              <rect x="65" y="80" width="12" height="60" rx="2" fill="#60a5fa" />
              <rect x="80" y="90" width="12" height="50" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="78" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Sat</text>

              {/* Sunday */}
              <rect x="125" y="70" width="12" height="70" rx="2" fill="#60a5fa" />
              <rect x="140" y="85" width="12" height="55" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="138" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Sun</text>

              {/* Monday */}
              <rect x="185" y="50" width="12" height="90" rx="2" fill="#60a5fa" />
              <rect x="200" y="65" width="12" height="75" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="198" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Mon</text>

              {/* Tuesday */}
              <rect x="245" y="45" width="12" height="95" rx="2" fill="#60a5fa" />
              <rect x="260" y="55" width="12" height="85" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="258" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Tue</text>

              {/* Wednesday */}
              <rect x="305" y="40" width="12" height="100" rx="2" fill="#60a5fa" />
              <rect x="320" y="50" width="12" height="90" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="318" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Wed</text>

              {/* Thursday */}
              <rect x="365" y="60" width="12" height="80" rx="2" fill="#60a5fa" />
              <rect x="380" y="70" width="12" height="70" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="378" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Thu</text>

              {/* Friday */}
              <rect x="425" y="30" width="12" height="110" rx="2" fill="#60a5fa" />
              <rect x="440" y="45" width="12" height="95" rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="438" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Fri</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Top chuyên khoa */}
        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={16} style={{ color: 'var(--primary-light)' }} />
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Tỷ lệ khám chuyên khoa</h4>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            {/* SVG Pie Chart */}
            <svg viewBox="0 0 100 100" width="100" height="100%">
              {/* Segments: Ngoại (30%), Nhi (35%), Nội (15%), Khác (20%) */}
              {/* 35% Nhi khoa (Yellow): stroke-dasharray="35 65" stroke-dashoffset="0" */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="35 65" strokeDashoffset="0" />
              {/* 30% Ngoại khoa (Green): stroke-dasharray="30 70" stroke-dashoffset="-35" */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" strokeDasharray="30 70" strokeDashoffset="-35" />
              {/* 15% Nội khoa (Blue): stroke-dasharray="15 85" stroke-dashoffset="-65" */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" strokeDasharray="15 85" strokeDashoffset="-65" />
              {/* 20% Khác (Red): stroke-dasharray="20 80" stroke-dashoffset="-80" */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="20 80" strokeDashoffset="-80" />
            </svg>
          </div>

          {/* Legends with percentages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }} />
              Nhi khoa (35%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }} />
              Ngoại khoa (30%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }} />
              Nội khoa (15%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
              Chuyên khoa khác (20%)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
