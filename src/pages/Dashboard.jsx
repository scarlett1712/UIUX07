import React, { useState } from 'react';
import { HeartHandshake, TrendingUp, TrendingDown, Pill, BookOpen, Bot, Star, Activity, ArrowRight } from 'lucide-react';

export default function Dashboard({ 
  onNavigate, 
  onSelectConversation, 
  onSelectId, 
  diseases = [], 
  medicines = [], 
  scenarios = [], 
  conversations = [], 
  triggerToast 
}) {
  const [activeSegment, setActiveSegment] = useState(null);

  const stats = [
    { title: 'Tổng số bệnh', value: diseases.length.toString(), trend: 'Xem chi tiết danh sách bệnh', isUp: true, icon: Activity, view: 'disease-list' },
    { title: 'Tổng số thuốc', value: medicines.length.toString(), trend: 'Xem chi tiết danh mục thuốc', isUp: true, icon: Pill, view: 'medicine-list' },
    { title: 'Tổng số kịch bản', value: scenarios.length.toString(), trend: 'Xem chi tiết kịch bản chatbot', isUp: true, icon: BookOpen, view: 'chatbot-scenarios' },
    { title: 'Đánh giá cần duyệt', value: conversations.filter(c => c.status === 'Chưa duyệt').length.toString(), trend: 'Xem chi tiết đánh giá AI', isUp: true, icon: Star, view: 'ai-evaluation' },
  ];

  const activities = [
    { id: 1, action: 'Chỉnh sửa thuốc', time: '05-05-2026 - 8:23', icon: Pill, type: 'medicine-edit', idRef: 'M001' },
    { id: 2, action: 'Thêm thuốc', time: '05-05-2026 - 8:20', icon: Pill, type: 'medicine-add', idRef: null },
    { id: 3, action: 'Chỉnh sửa kịch bản', time: '04-05-2026 - 16:17', icon: Bot, type: 'chatbot-scenario-edit', idRef: null },
  ];

  const totalConvs = conversations.length || 1;
  const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  conversations.forEach(c => {
    const num = c.ratingNum || 5;
    if (starCounts[num] !== undefined) {
      starCounts[num]++;
    }
  });

  const ratingsData = [
    { label: '★', value: Math.round((starCounts[1] / totalConvs) * 100), color: '#3b82f6', percentage: `${Math.round((starCounts[1] / totalConvs) * 100)}%` },
    { label: '★★', value: Math.round((starCounts[2] / totalConvs) * 100), color: '#ef4444', percentage: `${Math.round((starCounts[2] / totalConvs) * 100)}%` },
    { label: '★★★', value: Math.round((starCounts[3] / totalConvs) * 100), color: '#06b6d4', percentage: `${Math.round((starCounts[3] / totalConvs) * 100)}%` },
    { label: '★★★★', value: Math.round((starCounts[4] / totalConvs) * 100), color: '#a855f7', percentage: `${Math.round((starCounts[4] / totalConvs) * 100)}%` },
    { label: '★★★★★', value: Math.round((starCounts[5] / totalConvs) * 100), color: '#10b981', percentage: `${Math.round((starCounts[5] / totalConvs) * 100)}%` },
  ];

  const sumRatings = conversations.reduce((acc, c) => acc + (c.ratingNum || 5), 0);
  const avgRating = conversations.length > 0 ? (sumRatings / conversations.length).toFixed(1) : '0.0';

  const lowRatingConversations = conversations.filter(c => c.ratingNum <= 3);

  // SVG calculations for Doughnut Chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const handleConversationClick = (conv) => {
    onSelectConversation(conv.id);
    triggerToast(`Đang chuyển sang kiểm duyệt cuộc hội thoại ${conv.id}`, 'info');
    onNavigate('ai-evaluation-analysis');
  };

  const handleActivityClick = (act) => {
    triggerToast(`Mở hoạt động: ${act.action}`, 'info');
    if (act.idRef) {
      onSelectId(act.idRef);
    }
    onNavigate(act.type);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Row 1: Welcome Banner & Stats vs Doughnut Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Column: Welcome Banner & Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', justifyContent: 'space-between' }}>
          {/* Welcome Banner */}
          <div className="welcome-banner" style={{ margin: 0 }}>
            <div className="welcome-text">
              <h2>Chào Chuyên gia A,</h2>
              <p>Chúc bạn một ngày tốt lành và đừng quên chăm sóc cho bản thân nhé!</p>
              <div className="welcome-quote">"Good things take time."</div>
            </div>
            <div className="welcome-illustration">
              <HeartHandshake size={60} strokeWidth={1.5} />
            </div>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', flex: 1, width: '100%' }}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className="stat-card animate-fade-in" 
                  style={{ animationDelay: `${idx * 0.1}s`, margin: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  onClick={() => {
                    onNavigate(stat.view);
                    triggerToast(`Đang chuyển tới màn hình ${stat.title.toLowerCase()}`, 'info');
                  }}
                >
                  <div className="flex justify-between align-center">
                    <span className="stat-title">{stat.title}</span>
                    <div className="activity-icon-wrapper" style={{ margin: 0, width: '24px', height: '24px' }}>
                      <Icon size={12} />
                    </div>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className={`stat-trend ${stat.isUp ? 'trend-up' : 'trend-down'}`}>
                    {stat.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{stat.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Doughnut Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', margin: 0, height: '100%', justifyContent: 'center' }}>
          <h3 className="text-center" style={{ fontSize: '1.15rem', marginBottom: '8px', marginTop: 0 }}>
            Tỷ lệ đánh giá phản hồi chatbot
          </h3>
          <div className="chart-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="chart-svg-wrapper">
              <svg width="150" height="150" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
                {ratingsData.map((data, index) => {
                  const offset = 100 - accumulatedPercent;
                  accumulatedPercent += data.value;

                  const isHovered = activeSegment === index;

                  return (
                    <circle
                      key={index}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={data.color}
                      strokeWidth={isHovered ? 22 : 16}
                      pathLength="100"
                      strokeDasharray={`${data.value} ${100 - data.value}`}
                      strokeDashoffset={offset}
                      transform="rotate(-90 80 80)"
                      style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                      onMouseEnter={() => setActiveSegment(index)}
                      onMouseLeave={() => setActiveSegment(null)}
                    />
                  );
                })}
              </svg>
              <div className="chart-center-text">
                <div className="chart-center-value">
                  {activeSegment !== null ? ratingsData[activeSegment].percentage : `${avgRating} ★`}
                </div>
                <div className="chart-center-label">
                  {activeSegment !== null ? ratingsData[activeSegment].label : 'Điểm trung bình'}
                </div>
              </div>
            </div>
            <div className="chart-legend" style={{ marginTop: '12px' }}>
              {ratingsData.map((data, index) => (
                <div
                  key={index}
                  className="legend-item"
                  style={{ opacity: activeSegment === null || activeSegment === index ? 1 : 0.5, transition: 'opacity 0.2s' }}
                >
                  <div className="legend-color" style={{ backgroundColor: data.color }} />
                  <span>{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: Recent Activity vs Low Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* Left Column: Recent Activity */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '8px', marginTop: 0 }}>Hoạt động gần đây</h3>
          <div className="recent-activity-list" style={{ flex: 1 }}>
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="activity-item" onClick={() => handleActivityClick(act)}>
                  <div className="activity-icon-wrapper">
                    <Icon size={16} />
                  </div>
                  <div className="activity-details">
                    <div className="activity-title">{act.action}</div>
                    <div className="activity-time">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Low reviews list */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="flex justify-between align-center" style={{ marginBottom: '8px' }}>
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Danh sách hội thoại bị đánh giá thấp</h3>
            <a
              onClick={() => onNavigate('ai-evaluation')}
              style={{ fontSize: '0.8rem', color: 'var(--primary-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: '500' }}
            >
              Xem tất cả <ArrowRight size={12} />
            </a>
          </div>
          
          <div className="review-list" style={{ flex: 1 }}>
            {lowRatingConversations.map((conv) => (
              <div
                key={conv.id}
                className={`review-item rating-bg-${conv.ratingNum} animate-fade-in`}
                onClick={() => handleConversationClick(conv)}
              >
                <div className="review-user-avatar">
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className="review-info">
                  <div className="flex justify-between align-center">
                    <span className="review-user-name">{conv.name}</span>
                    <span className="review-date">{conv.time}</span>
                  </div>
                  <div className="review-text">{conv.topic}</div>
                </div>
                <div className={`review-rating-badge rating-score-${conv.ratingNum}`}>
                  {conv.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
