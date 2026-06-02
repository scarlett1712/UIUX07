import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, TrendingUp, TrendingDown, BarChart2, PieChart, Info, Star, Shield, ArrowUpRight, MessageSquare, Award, Bot, FileText } from 'lucide-react';

export default function ExpertReports({ conversations = [], scenarios = [], triggerToast }) {
  // Calendar state for Range Picker
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);
  const [pickerMonth, setPickerMonth] = useState(4); // May (0-indexed 4)
  
  // Date Range state
  const [startDate, setStartDate] = useState(new Date(2026, 4, 1));
  const [endDate, setEndDate] = useState(new Date(2026, 4, 6));
  const pickerRef = useRef(null);
  const [activeSegment, setActiveSegment] = useState(null);

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
    if (!date) return '';
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
    triggerToast(`Đang xuất báo cáo kiểm duyệt AI giai đoạn ${rangeText} định dạng PDF...`, 'success');
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
    
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      triggerToast(`Đã chọn ngày bắt đầu: ${formatDateString(clickedDate)}`, 'info');
    } else {
      if (clickedDate < startDate) {
        setStartDate(clickedDate);
        setEndDate(null);
        triggerToast(`Đã chọn ngày bắt đầu: ${formatDateString(clickedDate)}`, 'info');
      } else {
        setEndDate(clickedDate);
        setShowPicker(false);
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

  // Dynamic calculations based on conversations state
  const totalConvs = conversations.length || 1;
  
  // Calculate errors dynamically
  let medical = 0;
  let hallucination = 0;
  let tone = 0;
  let logic = 0;
  conversations.forEach(c => {
    if (c.errors) {
      if (c.errors.medical) medical++;
      if (c.errors.hallucination) hallucination++;
      if (c.errors.tone) tone++;
      if (c.errors.logic) logic++;
    }
  });

  const totalErrors = medical + hallucination + tone + logic || 1;
  const pctMedical = Math.round((medical / totalErrors) * 100);
  const pctHallucination = Math.round((hallucination / totalErrors) * 100);
  const pctTone = Math.round((tone / totalErrors) * 100);
  const pctLogic = 100 - pctMedical - pctHallucination - pctTone;

  const auditedConvs = conversations.filter(c => c.status === 'Đã duyệt' || c.status === 'Cần chỉnh sửa').length;
  const errorRate = auditedConvs > 0 
    ? ((conversations.filter(c => c.status === 'Cần chỉnh sửa' || (c.errors && Object.values(c.errors).some(v => v))).length / auditedConvs) * 100).toFixed(1) 
    : '28.5';

  const activeScenariosCount = scenarios.filter(s => s.status === 'Hoạt động').length;

  // Doughnut Chart data for AI Error categories
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const errorsData = [
    { label: 'Sai lệch y khoa', value: pctMedical, color: '#ef4444', count: medical },
    { label: 'Ảo giác hệ thống', value: pctHallucination, color: '#eab308', count: hallucination },
    { label: 'Thái độ không phù hợp', value: pctTone, color: '#a855f7', count: tone },
    { label: 'Lỗi logic kịch bản', value: pctLogic, color: '#3b82f6', count: logic }
  ];

  // Chatbot Query Trends data (dynamic based on multiplier)
  const queriesData = [
    { topic: 'Sốt cao, đau đầu, viêm họng', count: Math.round(124 * multiplier), pct: 36, trend: '+15%', isUp: true },
    { topic: 'Tra cứu đơn thuốc & liều Paracetamol', count: Math.round(92 * multiplier), pct: 27, trend: '+8%', isUp: true },
    { topic: 'Đau bụng thượng vị, đầy hơi, ợ chua', count: Math.round(68 * multiplier), pct: 20, trend: '-3%', isUp: false },
    { topic: 'Mẩn ngứa, phát ban dị ứng da', count: Math.round(41 * multiplier), pct: 12, trend: '+22%', isUp: true },
    { topic: 'Đặt lịch khám Tai Mũi Họng trực tiếp', count: Math.round(18 * multiplier), pct: 5, trend: '+10%', isUp: true }
  ];

  // AI Self-Resolution rate trend (over time, line points calculation)
  const selfResolutionData = [
    { date: '01/05', rate: 78 + Math.round(2 * Math.sin(multiplier)) },
    { date: '02/05', rate: 82 - Math.round(3 * Math.cos(multiplier)) },
    { date: '03/05', rate: 80 + Math.round(1.5 * multiplier) },
    { date: '04/05', rate: 85 - Math.round(1 * multiplier) },
    { date: '05/05', rate: 83 + Math.round(2.5 * multiplier) },
    { date: '06/05', rate: Math.min(98, Math.round(88 + 2 * multiplier)) }
  ];

  // Map self-resolution values to SVG Line Coordinates
  const linePoints = selfResolutionData.map((d, i) => {
    const x = 30 + i * 50; // index 0-5 translates to 30 to 280
    const y = 110 - (d.rate - 50) * 1.8; // 50% rate is at y=110, 100% rate is at y=20
    return { x, y, rate: d.rate, date: d.date };
  });

  const pathD = `M ${linePoints.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${linePoints[linePoints.length - 1].x} 120 L ${linePoints[0].x} 120 Z`;

  return (
    <div className="reports-page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 'calc(100vh - 100px)', width: '100%' }}>
      
      {/* Top Filter and Actions */}
      <div className="card" style={{ padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Thời gian phân tích AI:</span>
          
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
          <span>Xuất báo cáo AI</span>
        </button>
      </div>
 
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {/* KPI 1: Tổng số cuộc hội thoại */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Lượt hội thoại Chatbot</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>
            {Math.round(totalConvs * 32 * multiplier)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={14} />
            <span>+14.2% so với kỳ trước</span>
          </div>
        </div>
 
        {/* KPI 2: Tỷ lệ lỗi phát hiện qua kiểm duyệt */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tỷ lệ phát hiện lỗi AI</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>
            {errorRate}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
            <TrendingDown size={14} />
            <span>-2.1% (giảm thiểu sai sót)</span>
          </div>
        </div>
 
        {/* KPI 3: Số kịch bản hoạt động */}
        <div className="card" style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Kịch bản đang chạy</span>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1.2 }}>
            {activeScenariosCount} / {scenarios.length}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <TrendingUp size={14} />
            <span>Đã tối ưu hóa 100%</span>
          </div>
        </div>
      </div>
 
      {/* Grid of 4 Reports Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1 }}>
        
        {/* Report 1: Lượt hội thoại hàng ngày (Bar Chart) */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart2 size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Tần suất hội thoại hàng ngày</h4>
            </div>
            {/* Color indicators */}
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.7rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '1px' }} />
                AI Tự xử lý
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <span style={{ width: '6px', height: '6px', backgroundColor: '#f43f5e', borderRadius: '1px' }} />
                Chuyển bác sĩ
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
              <text x="30" y="25" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(180 * multiplier)}</text>
              <text x="30" y="65" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(100 * multiplier)}</text>
              <text x="30" y="105" fill="#94a3b8" fontSize="10" textAnchor="end">{Math.round(40 * multiplier)}</text>
              <text x="30" y="145" fill="#94a3b8" fontSize="10" textAnchor="end">0</text>
 
              {/* Bars scaled by multiplier */}
              {/* Mon */}
              <rect x="65" y={140 - Math.min(120, 75 * multiplier)} width="12" height={Math.min(120, 75 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="80" y={140 - Math.min(120, 18 * multiplier)} width="12" height={Math.min(120, 18 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="78" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T2</text>
 
              {/* Tue */}
              <rect x="125" y={140 - Math.min(120, 85 * multiplier)} width="12" height={Math.min(120, 85 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="140" y={140 - Math.min(120, 12 * multiplier)} width="12" height={Math.min(120, 12 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="138" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T3</text>
 
              {/* Wed */}
              <rect x="185" y={140 - Math.min(120, 95 * multiplier)} width="12" height={Math.min(120, 95 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="200" y={140 - Math.min(120, 15 * multiplier)} width="12" height={Math.min(120, 15 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="198" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T4</text>
 
              {/* Thu */}
              <rect x="245" y={140 - Math.min(120, 80 * multiplier)} width="12" height={Math.min(120, 80 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="260" y={140 - Math.min(120, 20 * multiplier)} width="12" height={Math.min(120, 20 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="258" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T5</text>
 
              {/* Fri */}
              <rect x="305" y={140 - Math.min(120, 110 * multiplier)} width="12" height={Math.min(120, 110 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="320" y={140 - Math.min(120, 14 * multiplier)} width="12" height={Math.min(120, 14 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="318" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T6</text>
 
              {/* Sat */}
              <rect x="365" y={140 - Math.min(120, 60 * multiplier)} width="12" height={Math.min(120, 60 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="380" y={140 - Math.min(120, 8 * multiplier)} width="12" height={Math.min(120, 8 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="378" y="160" fill="#64748b" fontSize="10" textAnchor="middle">T7</text>
 
              {/* Sun */}
              <rect x="425" y={140 - Math.min(120, 50 * multiplier)} width="12" height={Math.min(120, 50 * multiplier)} rx="2" fill="#3b82f6" />
              <rect x="440" y={140 - Math.min(120, 10 * multiplier)} width="12" height={Math.min(120, 10 * multiplier)} rx="2" fill="#f43f5e" opacity="0.8" />
              <text x="438" y="160" fill="#64748b" fontSize="10" textAnchor="middle">CN</text>
            </svg>
          </div>
        </div>
 
        {/* Report 2: Phân loại lỗi AI (Doughnut Chart) */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <PieChart size={16} style={{ color: 'var(--primary-light)' }} />
            <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Cơ cấu phân loại lỗi AI phát hiện</h4>
          </div>
 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '160px', position: 'relative' }}>
            {/* SVG Doughnut Chart */}
            <svg viewBox="0 0 100 100" width="155" height="155">
              <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="12" />
              {errorsData.map((data, index) => {
                const offset = 100 - accumulatedPercent;
                accumulatedPercent += data.value;
                const isHovered = activeSegment === index;
                return (
                  <circle
                     key={index}
                     cx="50"
                     cy="50"
                     r={radius}
                     fill="transparent"
                     stroke={data.color}
                     strokeWidth={isHovered ? 17 : 12}
                     pathLength="100"
                     strokeDasharray={`${data.value} ${100 - data.value}`}
                     strokeDashoffset={offset}
                     transform="rotate(-90 50 50)"
                     style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease, stroke 0.2s' }}
                     onMouseEnter={() => setActiveSegment(index)}
                     onMouseLeave={() => setActiveSegment(null)}
                  />
                );
              })}
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', lineHeight: 1 }}>
                {activeSegment !== null ? `${errorsData[activeSegment].value}%` : `${totalErrors}`}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center', maxWidth: '95px', overflow: 'hidden', lineHeight: '1.2' }}>
                {activeSegment !== null ? errorsData[activeSegment].label : 'Tổng lỗi'}
              </span>
            </div>
          </div>
 
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.72rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
            {errorsData.map((data, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  opacity: activeSegment === null || activeSegment === idx ? 1 : 0.45,
                  transition: 'opacity 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={() => setActiveSegment(idx)}
                onMouseLeave={() => setActiveSegment(null)}
              >
                <span style={{ width: '6px', height: '6px', backgroundColor: data.color, borderRadius: '50%' }} />
                <span>{data.label} ({data.value}%)</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* Report 3: Xu hướng tra cứu chatbot (Popular Query Trends - Horizontal Progress Bars) */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Xu hướng nội dung tra cứu phổ biến</h4>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Xếp hạng theo tuần</span>
          </div>
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'center' }}>
            {queriesData.map((q, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                  <span style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{q.topic}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{q.count} lượt</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: q.isUp ? '#10b981' : '#ef4444', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1px' 
                    }}>
                      {q.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {q.trend}
                    </span>
                  </div>
                </div>
                <div style={{ height: '5px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${q.pct}%`, 
                      height: '100%', 
                      backgroundColor: idx === 0 ? '#3b82f6' : idx === 1 ? '#60a5fa' : '#93c5fd', 
                      borderRadius: '3px',
                      transition: 'width 0.5s ease-out'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Report 4: Tỷ lệ giải quyết tự động của AI (AI Self-Resolution Rate Line/Area Chart) */}
        <div className="card" style={{ padding: '12px', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary-light)' }} />
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary)' }}>Tỷ lệ AI giải quyết tự động thành công</h4>
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', backgroundColor: '#ecfdf5', padding: '1px 6px', borderRadius: '8px' }}>
              Trung bình: {Math.round(selfResolutionData.reduce((acc, d) => acc + d.rate, 0) / selfResolutionData.length)}%
            </span>
          </div>
 
          <div style={{ flex: 1, minHeight: '110px', position: 'relative' }}>
            <svg viewBox="0 0 300 120" width="100%" height="100%">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="280" y2="20" stroke="#f8fafc" strokeWidth="1" />
              <line x1="30" y1="56" x2="280" y2="56" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="92" x2="280" y2="92" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="110" x2="280" y2="110" stroke="#cbd5e1" strokeWidth="1" />
 
              {/* Y Axis labels */}
              <text x="25" y="24" fill="#94a3b8" fontSize="8" textAnchor="end">100%</text>
              <text x="25" y="60" fill="#94a3b8" fontSize="8" textAnchor="end">70%</text>
              <text x="25" y="96" fill="#94a3b8" fontSize="8" textAnchor="end">40%</text>
 
              {/* Area under line */}
              <path 
                d={areaD}
                fill="url(#expert-resolution-grad)"
                opacity="0.18"
              />
 
              {/* Resolution line chart */}
              <path
                d={pathD}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
 
              {/* Data points */}
              {linePoints.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="3.5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} />
                  <text x={p.x} y={p.y - 8} fill="var(--primary-dark)" fontSize="8" fontWeight="700" textAnchor="middle">{p.rate}%</text>
                  <text x={p.x} y="118" fill="#94a3b8" fontSize="8" textAnchor="middle">{p.date}</text>
                </g>
              ))}
 
              {/* Gradients */}
              <defs>
                <linearGradient id="expert-resolution-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
 
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', borderTop: '1px solid var(--border-color)', paddingTop: '6px', color: 'var(--text-muted)' }}>
            <span>Số cuộc tự giải quyết: <strong>{Math.round(totalConvs * 26 * multiplier)}</strong></span>
            <span>Chuyển tiếp bác sĩ: <strong>{Math.round(totalConvs * 6 * multiplier)}</strong></span>
          </div>
        </div>
 
      </div>
      
    </div>
  );
}
