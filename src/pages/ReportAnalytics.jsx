import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, BarChart2, PieChart, Info, Star, Shield, ArrowUpRight, MessageSquare, Award } from 'lucide-react';

export default function ReportAnalytics({ triggerToast }) {
  // Calendar state for Range Picker
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(4); // May (0-indexed 4)
  
  // Date Range state
  const [startDate, setStartDate] = useState(new Date(2026, 4, 1));
  const [endDate, setEndDate] = useState(new Date(2026, 4, 6));
  const pickerRef = useRef(null);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date range text
  const formatDateString = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const rangeText = startDate && endDate 
    ? `${formatDateString(startDate)} - ${formatDateString(endDate)}` 
    : startDate 
      ? `${formatDateString(startDate)} - Chọn ngày kết thúc` 
      : 'Chọn khoảng thời gian';

  // Calculate dynamic multiplier based on number of days selected
  const daysDiff = (startDate && endDate)
    ? Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)
    : 5; // default to 5 days if selection is in progress
  const multiplier = daysDiff / 6; // base 6 days is 1.0

  // Export report handler
  const handleExport = () => {
    triggerToast(`Đang xuất báo cáo thống kê giai đoạn ${rangeText} định dạng PDF...`, 'success');
  };

  // Calendar render helpers for Date picker
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartOffset = (year, month) => new Date(year, month, 1).getDay();

  const pickerDaysInMonth = getDaysInMonth(pickerYear, pickerMonth);
  const pickerStartOffset = getStartOffset(pickerYear, pickerMonth);

  const calendarCells = [];
  for (let i = 0; i < pickerStartOffset; i++) calendarCells.push(null);
  for (let i = 1; i <= pickerDaysInMonth; i++) calendarCells.push(i);

  // Month navigation in picker
  const handlePrevMonth = () => {
    if (pickerMonth === 0) {
      setPickerMonth(11);
      setPickerYear(prev => prev - 1);
    } else {
      setPickerMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (pickerMonth === 11) {
      setPickerMonth(0);
      setPickerYear(prev => prev + 1);
    } else {
      setPickerMonth(prev => prev + 1);
    }
  };

  // Handle clicking day in picker
  const handleDayClick = (day) => {
    if (!day) return;
    const clickedDate = new Date(pickerYear, pickerMonth, day);
    
    // If no start date, or both start & end are already selected, reset to start date
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      triggerToast(`Đã chọn ngày bắt đầu: ${formatDateString(clickedDate)}`, 'info');
    } else {
      // If clicked date is before start date, swap them or make it start date
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
        triggerToast(`Đã chọn ngày bắt đầu: ${formatDateString(clickedDate)}`, 'info');
      } else {
        setEndDate(clickedDate);
        setShowPicker(false); // Auto close on range complete
        triggerToast(`Đã chọn khoảng thời gian: ${formatDateString(startDate)} - ${formatDateString(clickedDate)}`, 'success');
      }
    }
  };

  // Check if a day is in range
  const isDateSelected = (day) => {
    if (!day) return false;
    const current = new Date(pickerYear, pickerMonth, day);
    if (startDate && current.getTime() === startDate.getTime()) return 'start';
    if (endDate && current.getTime() === endDate.getTime()) return 'end';
    if (startDate && endDate && current > startDate && current < endDate) return 'between';
    return false;
  };

  // Simulated dynamic KPIs
  const newPatients = Math.round(23 * multiplier);
  const feedbackCount = Math.round(15 * multiplier);
  const revenueVal = Math.round(125450000 * multiplier);

    return (
    <div className="reports-page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 'calc(100vh - 100px)', width: '100%' }}>
      
      {/* Top Filter and Actions */}
      <div className="card" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Thời gian báo cáo:</span>
          
          {/* Custom Date Range Picker Dropdown */}
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowPicker(!showPicker)}
              className="btn btn-outline" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', fontSize: '0.78rem', fontWeight: 600, borderColor: 'var(--border-color)', backgroundColor: '#fff' }}
            >
              <Calendar size={14} style={{ color: 'var(--primary)' }} />
              <span>{rangeText}</span>
            </button>
 
            {showPicker && (
              <div className="card shadow-lg" style={{ position: 'absolute', top: '105%', left: 0, width: '240px', padding: '10px', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', zIndex: 999 }}>
                {/* Header Month Navigate */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <button onClick={handlePrevMonth} className="btn btn-outline" style={{ padding: '1px 4px', fontSize: '0.7rem' }}>&lt;</button>
                  <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-dark)' }}>Tháng {pickerMonth + 1}, {pickerYear}</span>
                  <button onClick={handleNextMonth} className="btn btn-outline" style={{ padding: '1px 4px', fontSize: '0.7rem' }}>&gt;</button>
                </div>
 
                {/* Days Grid Header */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontWeight: 700, fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <div>CN</div><div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div>
                </div>
 
                {/* Days Grid Body */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', fontSize: '0.72rem' }}>
                  {calendarCells.map((day, idx) => {
                    const selectStatus = isDateSelected(day);
                    let cellBg = 'transparent';
                    let cellColor = 'var(--text-dark)';
                    let cellRadius = '4px';
 
                    if (selectStatus === 'start' || selectStatus === 'end') {
                      cellBg = 'var(--primary)';
                      cellColor = '#fff';
                      cellRadius = '50%';
                    } else if (selectStatus === 'between') {
                      cellBg = '#e0f2fe';
                      cellColor = '#0369a1';
                    }
 
                    return (
                      <div
                        key={idx}
                        onClick={() => handleDayClick(day)}
                        style={{
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: day ? 'pointer' : 'default',
                          backgroundColor: cellBg,
                          color: day ? cellColor : 'transparent',
                          borderRadius: cellRadius,
                          fontWeight: selectStatus ? '700' : '400'
                        }}
                        className={day && !selectStatus ? 'hover-day' : ''}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
 
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  <span>Chọn 2 ngày để tạo khoảng</span>
                  <a onClick={() => { setStartDate(new Date(2026, 4, 1)); setEndDate(new Date(2026, 4, 6)); setShowPicker(false); }} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Mặc định</a>
                </div>
              </div>
            )}
          </div>
        </div>
 
        <button className="btn btn-primary" onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '0.78rem' }}>
          <Download size={14} />
          <span>Xuất báo cáo</span>
        </button>
      </div>
 
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* KPI 1: Bệnh nhân mới */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Bệnh nhân mới</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>{newPatients}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={14} />
            <span>+12.5% so với kỳ trước</span>
          </div>
        </div>
 
        {/* KPI 2: Đánh giá mới */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Đánh giá mới</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>{feedbackCount}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
            <TrendingDown size={14} />
            <span>-5.2% so với kỳ trước</span>
          </div>
        </div>
 
        {/* KPI 3: Doanh thu */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Doanh thu phòng khám</span>
          <div style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>{revenueVal.toLocaleString('vi-VN')} VNĐ</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={14} />
            <span>+3.8% so với kỳ trước</span>
          </div>
        </div>
      </div>
 
      {/* Grid of 4 Reports Charts (Fullscreen Fit) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1 }}>
        
        {/* Report 1: Lượt khám theo ngày */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart2 size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Lượt khám theo ngày</h4>
            </div>
            {/* Color indicators */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#60a5fa', borderRadius: '1px' }} />
                Hẹn trước
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#f43f5e', borderRadius: '1px' }} />
                Trực tiếp
              </span>
            </div>
          </div>
 
          {/* SVG Bar Chart */}
          <div style={{ flex: 1, minHeight: '130px' }}>
            <svg viewBox="0 0 500 180" width="100%" height="100%">
              {/* Grid background lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#ebd5e1" strokeWidth="1" />
 
              {/* Y Axis Labels */}
              <text x="30" y="25" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(500 * multiplier)}</text>
              <text x="30" y="65" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(300 * multiplier)}</text>
              <text x="30" y="105" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(100 * multiplier)}</text>
              <text x="30" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
 
              {/* Bars scaled by multiplier */}
              {/* Saturday */}
              <rect x="65" y={140 - Math.min(120, 60 * multiplier)} width="12" height={Math.min(120, 60 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="80" y={140 - Math.min(120, 50 * multiplier)} width="12" height={Math.min(120, 50 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="78" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Sat</text>
 
              {/* Sunday */}
              <rect x="125" y={140 - Math.min(120, 70 * multiplier)} width="12" height={Math.min(120, 70 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="140" y={140 - Math.min(120, 55 * multiplier)} width="12" height={Math.min(120, 55 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="138" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Sun</text>
 
              {/* Monday */}
              <rect x="185" y={140 - Math.min(120, 90 * multiplier)} width="12" height={Math.min(120, 90 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="200" y={140 - Math.min(120, 75 * multiplier)} width="12" height={Math.min(120, 75 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="198" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Mon</text>
 
              {/* Tuesday */}
              <rect x="245" y={140 - Math.min(120, 95 * multiplier)} width="12" height={Math.min(120, 95 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="260" y={140 - Math.min(120, 85 * multiplier)} width="12" height={Math.min(120, 85 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="258" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Tue</text>
 
              {/* Wednesday */}
              <rect x="305" y={140 - Math.min(120, 100 * multiplier)} width="12" height={Math.min(120, 100 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="320" y={140 - Math.min(120, 90 * multiplier)} width="12" height={Math.min(120, 90 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="318" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Wed</text>
 
              {/* Thursday */}
              <rect x="365" y={140 - Math.min(120, 80 * multiplier)} width="12" height={Math.min(120, 80 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="380" y={140 - Math.min(120, 70 * multiplier)} width="12" height={Math.min(120, 70 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="378" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Thu</text>
 
              {/* Friday */}
              <rect x="425" y={140 - Math.min(120, 110 * multiplier)} width="12" height={Math.min(120, 110 * multiplier)} rx="2" fill="#60a5fa" />
              <rect x="440" y={140 - Math.min(120, 95 * multiplier)} width="12" height={Math.min(120, 95 * multiplier)} rx="2" fill="#f43f5e" opacity="0.6" />
              <text x="438" y="160" fill="#64748b" fontSize="10" textAnchor="middle">Fri</text>
            </svg>
          </div>
        </div>
 
        {/* Report 2: Tỷ lệ khám chuyên khoa */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <PieChart size={16} style={{ color: 'var(--primary-light)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Tỷ lệ khám chuyên khoa</h4>
          </div>
 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '100px' }}>
            {/* SVG Pie Chart */}
            <svg viewBox="0 0 100 100" width="80" height="80">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" pathLength="100" strokeDasharray="35 65" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="20" pathLength="100" strokeDasharray="30 70" strokeDashoffset="-35" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="20" pathLength="100" strokeDasharray="15 85" strokeDashoffset="-65" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" pathLength="100" strokeDasharray="20 80" strokeDashoffset="-80" />
            </svg>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.72rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '50%' }} />
              Nhi khoa (35%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
              Ngoại khoa (30%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }} />
              Nội khoa (15%)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
              Khác (20%)
            </div>
          </div>
        </div>
 
        {/* Report 3: Hiệu suất Trợ lý AI */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Hiệu suất Trợ lý AI</h4>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '8px' }}>
              Tự giải quyết: 84%
            </span>
          </div>
 
          <div style={{ flex: 1, minHeight: '100px', position: 'relative' }}>
            <svg viewBox="0 0 300 100" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="300" y2="20" stroke="#f8fafc" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="300" y2="80" stroke="#f1f5f9" strokeWidth="1" />
 
              {/* Area under line */}
              <path 
                d={`M 10 90 L 50 65 L 100 70 L 150 40 L 200 45 L 250 20 Q 280 25 290 30 L 290 100 L 10 100 Z`}
                fill="#e0f2fe"
                opacity="0.5"
              />
 
              {/* Performance line chart */}
              <path
                d={`M 10 90 L 50 65 L 100 70 L 150 40 L 200 45 L 250 20 Q 280 25 290 30`}
                fill="none"
                stroke="var(--primary-light)"
                strokeWidth="2"
                strokeLinecap="round"
              />
 
              <circle cx="150" cy="40" r="3" fill="var(--primary)" />
              <circle cx="250" cy="20" r="3" fill="var(--primary)" />
            </svg>
          </div>
 
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            <span>Hỗ trợ AI: <strong>{Math.round(412 * multiplier)}</strong></span>
            <span>Chuyển tiếp bác sĩ: <strong>{Math.round(66 * multiplier)}</strong></span>
          </div>
        </div>
 
        {/* Report 4: Đánh giá chất lượng & Đội ngũ tiêu biểu */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} style={{ color: 'var(--primary-light)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Độ hài lòng chuyên khoa</h4>
          </div>
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'center' }}>
            {/* Dept 1 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '1px' }}>
                <span style={{ fontWeight: 600 }}>Nhi khoa</span>
                <span style={{ color: '#d97706', fontWeight: 600 }}>4.8 ★</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', backgroundColor: '#f59e0b' }} />
              </div>
            </div>
 
            {/* Dept 2 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '1px' }}>
                <span style={{ fontWeight: 600 }}>Ngoại tổng quát</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>4.5 ★</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '90%', height: '100%', backgroundColor: '#10b981' }} />
              </div>
            </div>
 
            {/* Dept 3 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '1px' }}>
                <span style={{ fontWeight: 600 }}>Tai mũi họng</span>
                <span style={{ color: '#3b82f6', fontWeight: 600 }}>4.2 ★</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '84%', height: '100%', backgroundColor: '#3b82f6' }} />
              </div>
            </div>
 
            {/* Dept 4 */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '1px' }}>
                <span style={{ fontWeight: 600 }}>Tim mạch</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>4.9 ★</span>
              </div>
              <div style={{ height: '4px', backgroundColor: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', backgroundColor: '#ef4444' }} />
              </div>
            </div>
          </div>
        </div>
 
      </div>
      
    </div>
  );
}
