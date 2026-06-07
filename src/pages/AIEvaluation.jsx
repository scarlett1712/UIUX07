import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, FileText, Edit2, Play, ArrowLeft, Heart, Sparkles, Search, Filter, Undo2 } from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    id: 'CONV001',
    name: 'Nguyễn Minh Anh',
    time: '05-05-2026 - 08:15',
    topic: 'Triệu chứng sốt, đau họng',
    rating: '★',
    ratingNum: 1,
    status: 'Chưa duyệt',
    transcript: [
      { sender: 'patient', text: 'Chào bác sĩ. Tôi bị sốt đột ngột từ tối qua kèm theo đau họng và nhức đầu ê ẩm.' },
      { sender: 'bot', text: 'Chào bạn. Triệu chứng sốt đột ngột kèm đau họng có thể là dấu hiệu của cúm virus cấp tính. Bạn nên tự mua ngay thuốc kháng sinh Amoxicillin uống liều cao 1000mg/ngày để nhanh tiêu diệt mầm bệnh.', flagged: true, errorType: 'Sai lệch chuyên môn y tế' },
      { sender: 'patient', text: 'Nhưng tôi nghe nói kháng sinh không diệt được virus cúm đúng không?' },
      { sender: 'bot', text: 'Kháng sinh giúp phòng tránh bội nhiễm phổi nên bạn bắt buộc phải dùng ngay lúc này.', flagged: true, errorType: 'Sai lệch chuyên môn y tế' }
    ],
    errors: { medical: true, hallucination: false, tone: false, logic: false },
    notes: 'Bot khuyên tự ý dùng kháng sinh Amoxicillin cho trường hợp nghi nhiễm cúm virus là sai chuyên môn y khoa nghiêm trọng. Cần chỉnh sửa kịch bản chatbot ngay.'
  },
  {
    id: 'CONV002',
    name: 'Trần Thu Hà',
    time: '05-05-2026 - 09:40',
    topic: 'Tra cứu đơn thuốc cũ',
    rating: '★★',
    ratingNum: 2,
    status: 'Chưa duyệt',
    transcript: [
      { sender: 'patient', text: 'Tôi muốn tìm lại đơn thuốc bổ gan bác sĩ kê tuần trước.' },
      { sender: 'bot', text: 'Đơn thuốc cũ của bạn có thuốc Boganic 1 vỉ. Bạn có muốn đặt mua trực tuyến luôn không?' },
      { sender: 'patient', text: 'Tôi nhớ đơn của tôi có 3 loại thuốc cơ mà, sao chỉ có mỗi Boganic?' },
      { sender: 'bot', text: 'Xin lỗi, hệ thống không ghi nhận thêm thuốc nào khác trong đơn của bạn.', flagged: true, errorType: 'Ảo giác hệ thống' }
    ],
    errors: { medical: false, hallucination: true, tone: false, logic: true },
    notes: 'Lỗi truy xuất cơ sở dữ liệu bệnh án cũ, hiển thị thiếu thuốc của bệnh nhân.'
  },
  {
    id: 'CONV003',
    name: 'Lê Quốc Bảo',
    time: '05-05-2026 - 10:05',
    topic: 'Đặt lịch khám',
    rating: '★',
    ratingNum: 1,
    status: 'Đã duyệt',
    transcript: [
      { sender: 'patient', text: 'Tôi muốn hẹn khám tai mũi họng lúc 2h chiều nay.' },
      { sender: 'bot', text: 'Xin lỗi, lịch chiều nay đã kín.' },
      { sender: 'patient', text: 'Vậy còn giờ nào trống trong chiều nay không?' },
      { sender: 'bot', text: 'Tôi không biết lịch trống. Bạn tự lên trang chủ để xem nhé.', flagged: true, errorType: 'Thái độ không phù hợp' }
    ],
    errors: { medical: false, hallucination: false, tone: true, logic: false },
    notes: 'Câu trả lời của bot thiếu tính xây dựng và hướng dẫn cho người dùng. Đã nhắc nhở bộ phận vận hành AI.'
  },
  {
    id: 'CONV004',
    name: 'Phạm Ngọc Linh',
    time: '05-05-2026 - 11:20',
    topic: 'Dị ứng da',
    rating: '★',
    ratingNum: 1,
    status: 'Cần chỉnh sửa',
    transcript: [
      { sender: 'patient', text: 'Tôi bị nổi mẩn ngứa đỏ sau khi ăn hải sản.' },
      { sender: 'bot', text: 'Chào bạn, mẩn ngứa dị ứng hải sản có thể bôi hồ nước hoặc uống Telfast. Cho hỏi bạn có bị khó thở hay sưng môi không?' },
      { sender: 'patient', text: 'Tôi hơi khó thở nhẹ, môi cũng tê tê.' },
      { sender: 'bot', text: 'Vậy bạn nằm nghỉ ngơi và theo dõi thêm nhé, sẽ nhanh hết thôi.', flagged: true, errorType: 'Sai lệch chuyên môn y tế' }
    ],
    errors: { medical: true, hallucination: false, tone: false, logic: false },
    notes: 'Sốc phản vệ hải sản có triệu chứng khó thở và sưng tê môi là ca cấp cứu tối khẩn cấp, bot khuyên nằm nghỉ ngơi là cực kỳ nguy hiểm. Phải sửa kịch bản để tự động chuyển tiếp cuộc gọi tới bác sĩ hoặc cảnh báo cấp cứu ngay lập tức!'
  },
  {
    id: 'CONV005',
    name: 'Vũ Văn Thanh',
    time: '05-05-2026 - 13:30',
    topic: 'Tư vấn tiêm chủng',
    rating: '★★★★★',
    ratingNum: 5,
    status: 'Đã duyệt',
    transcript: [
      { sender: 'patient', text: 'Cho hỏi lịch tiêm vắc xin sởi cho bé 9 tháng tuổi.' },
      { sender: 'bot', text: 'Bé tròn 9 tháng tuổi bắt đầu có thể tiêm mũi sởi đơn thứ nhất. Bạn hãy liên hệ trạm y tế gần nhất nhé.' }
    ],
    errors: { medical: false, hallucination: false, tone: false, logic: false },
    notes: 'Câu trả lời chuẩn xác, tư vấn nhiệt tình.'
  },
  {
    id: 'CONV006',
    name: 'Đặng Thị Thu',
    time: '05-05-2026 - 14:15',
    topic: 'Triệu chứng đau tai',
    rating: '★★★',
    ratingNum: 3,
    status: 'Chưa duyệt',
    transcript: [
      { sender: 'patient', text: 'Tai tôi bị ù và hơi nhức sau khi đi bơi về.' },
      { sender: 'bot', text: 'Có thể nước vào tai gây viêm tai ngoài nhẹ. Bạn hãy dùng cồn boric nhỏ tai thử xem nhé.', flagged: true, errorType: 'Tự ý đề xuất hóa chất nhỏ tai' }
    ],
    errors: { medical: true, hallucination: false, tone: false, logic: false },
    notes: 'Khuyên nhỏ cồn boric mà chưa qua bác sĩ nội soi là không an toàn. Cần cập nhật chatbot.'
  },
  {
    id: 'CONV007',
    name: 'Hoàng Minh Đức',
    time: '05-05-2026 - 15:45',
    topic: 'Kê đơn vitamin',
    rating: '★★★★',
    ratingNum: 4,
    status: 'Đã duyệt',
    transcript: [
      { sender: 'patient', text: 'Tôi muốn bổ sung vitamin D3 cho bé 1 tuổi.' },
      { sender: 'bot', text: 'Liều dự phòng thông thường cho bé là 400 IU/ngày. Bạn nên chọn loại nhỏ giọt chuyên dụng.' }
    ],
    errors: { medical: false, hallucination: false, tone: false, logic: false },
    notes: 'Đúng liều khuyến cáo dinh dưỡng trẻ em.'
  },
  {
    id: 'CONV008',
    name: 'Trần Minh Quang',
    time: '05-05-2026 - 16:20',
    topic: 'Triệu chứng đau đầu',
    rating: '★★',
    ratingNum: 2,
    status: 'Cần chỉnh sửa',
    transcript: [
      { sender: 'patient', text: 'Đầu tôi đau bừng bừng sau gáy, đo huyết áp là 160/90.' },
      { sender: 'bot', text: 'Uống hoạt huyết dưỡng não và nghỉ ngơi đi bạn.', flagged: true, errorType: 'Bỏ qua dấu hiệu tăng huyết áp khẩn cấp' }
    ],
    errors: { medical: true, hallucination: false, tone: false, logic: true },
    notes: 'Tăng huyết áp kèm đau sau gáy là dấu hiệu tiền đột quỵ nguy hiểm, bot khuyên uống hoạt huyết dưỡng não là sai lầm chết người. Cần sửa chatbot cảnh báo ngay lập tức.'
  }
];

export default function AIEvaluation({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  conversations,
  setConversations,
  triggerToast
}) {
  const [activeConv, setActiveConv] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [ratingFilter, setRatingFilter] = useState('Tất cả');
  const [errorFilter, setErrorFilter] = useState('Tất cả');
  const [itemsPerPage, setItemsPerPage] = useState(5);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, ratingFilter, errorFilter]);

  // Load active conversation details
  React.useEffect(() => {
    if (currentView === 'ai-evaluation-analysis') {
      const item = conversations.find((c) => c.id === selectedId) || conversations[0];
      if (item) {
        setActiveConv(JSON.parse(JSON.stringify(item))); // Deep copy
      }
    }
  }, [currentView, selectedId, conversations]);

  const handleUpdateCheckbox = (field) => {
    setActiveConv({
      ...activeConv,
      errors: {
        ...activeConv.errors,
        [field]: !activeConv.errors[field]
      }
    });
  };
  const handleToggleFlagMessage = (index) => {
    if (!activeConv) return;
    const updatedTranscript = (activeConv.transcript || []).map((msg, idx) => {
      if (idx === index) {
        const nextFlagged = !msg.flagged;
        return {
          ...msg,
          flagged: nextFlagged,
          errorType: nextFlagged ? 'Sai lệch chuyên môn y tế' : ''
        };
      }
      return msg;
    });

    const derivedErrors = { medical: false, hallucination: false, tone: false, logic: false };
    updatedTranscript.forEach(m => {
      if (m.flagged) {
        if (m.errorType === 'Sai lệch chuyên môn y tế') derivedErrors.medical = true;
        if (m.errorType === 'Ảo giác hệ thống') derivedErrors.hallucination = true;
        if (m.errorType === 'Thái độ không phù hợp') derivedErrors.tone = true;
        if (m.errorType === 'Lỗi logic điều hướng kịch bản') derivedErrors.logic = true;
      }
    });

    setActiveConv({
      ...activeConv,
      transcript: updatedTranscript,
      errors: derivedErrors
    });
  };

  const handleUpdateMsgErrorType = (index, type) => {
    if (!activeConv) return;
    const updatedTranscript = (activeConv.transcript || []).map((msg, idx) => {
      if (idx === index) {
        return {
          ...msg,
          errorType: type
        };
      }
      return msg;
    });

    const derivedErrors = { medical: false, hallucination: false, tone: false, logic: false };
    updatedTranscript.forEach(m => {
      if (m.flagged) {
        if (m.errorType === 'Sai lệch chuyên môn y tế') derivedErrors.medical = true;
        if (m.errorType === 'Ảo giác hệ thống') derivedErrors.hallucination = true;
        if (m.errorType === 'Thái độ không phù hợp') derivedErrors.tone = true;
        if (m.errorType === 'Lỗi logic điều hướng kịch bản') derivedErrors.logic = true;
      }
    });

    setActiveConv({
      ...activeConv,
      transcript: updatedTranscript,
      errors: derivedErrors
    });
  };

  const handleSaveAudit = (newStatus) => {
    const updated = conversations.map((c) =>
      c.id === activeConv.id
        ? { ...activeConv, status: newStatus }
        : c
    );
    setConversations(updated);
    triggerToast(`Đã lưu kiểm duyệt cuộc hội thoại ${activeConv.id} với trạng thái: ${newStatus}`, 'success');
    onNavigate('ai-evaluation');
  };

  // --- RENDERING AUDIT TRANSCRIPTS LIST ---
  if (currentView === 'ai-evaluation') {
    const filteredConversations = conversations.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Tất cả' || c.status === statusFilter;
      const matchesRating = ratingFilter === 'Tất cả' || c.rating === ratingFilter || c.ratingNum.toString() === ratingFilter;
      
      let matchesError = true;
      if (errorFilter !== 'Tất cả') {
        if (errorFilter === 'medical') matchesError = c.errors?.medical;
        else if (errorFilter === 'hallucination') matchesError = c.errors?.hallucination;
        else if (errorFilter === 'tone') matchesError = c.errors?.tone;
        else if (errorFilter === 'logic') matchesError = c.errors?.logic;
      }
      return matchesSearch && matchesStatus && matchesRating && matchesError;
    });

    const totalItems = filteredConversations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedConversations = filteredConversations.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Đánh giá & kiểm duyệt AI</h2>

        {/* Filter bar */}
        <div className="filters-bar">
          <div className="filter-group">
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm mã, tên khách hàng, triệu chứng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '240px', padding: '4px 8px' }}
            />
          </div>

          <div className="filter-group" style={{ flexWrap: 'wrap' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Chưa duyệt">Chưa duyệt</option>
              <option value="Đã duyệt">Đã duyệt</option>
              <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Tất cả">Tất cả đánh giá</option>
              <option value="5">★★★★★ (5 sao)</option>
              <option value="4">★★★★☆ (4 sao)</option>
              <option value="3">★★★☆☆ (3 sao)</option>
              <option value="2">★★☆☆☆ (2 sao)</option>
              <option value="1">★☆☆☆☆ (1 sao)</option>
            </select>

            <select
              value={errorFilter}
              onChange={(e) => setErrorFilter(e.target.value)}
              className="filter-select"
            >
              <option value="Tất cả">Tất cả loại lỗi</option>
              <option value="medical">Sai lệch chuyên môn</option>
              <option value="hallucination">Ảo giác hệ thống</option>
              <option value="tone">Thái độ không phù hợp</option>
              <option value="logic">Lỗi logic/khác</option>
            </select>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('Tất cả');
                setRatingFilter('Tất cả');
                setErrorFilter('Tất cả');
                triggerToast('Đã xóa tất cả bộ lọc', 'info');
              }}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b', fontSize: '0.82rem' }}
            >
              <Undo2 size={12} /> Hủy
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Mã hội thoại</th>
                <th>Tên khách hàng</th>
                <th>Thời gian hội thoại</th>
                <th>Triệu chứng báo cáo</th>
                <th>Đánh giá khách hàng</th>
                <th>Trạng thái kiểm duyệt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedConversations.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.id}</td>
                  <td>{c.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.time}</td>
                  <td>{c.topic}</td>
                  <td>
                    <span className={`review-rating-badge rating-score-${c.ratingNum}`}>{c.rating}</span>
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor:
                          c.status === 'Đã duyệt'
                            ? '#d1fae5'
                            : c.status === 'Cần chỉnh sửa'
                            ? '#fef3c7'
                            : '#fee2e2',
                        color:
                          c.status === 'Đã duyệt'
                            ? '#065f46'
                            : c.status === 'Cần chỉnh sửa'
                            ? '#d97706'
                            : '#dc2626'
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        onSelectId(c.id);
                        onNavigate('ai-evaluation-analysis');
                      }}
                      className="btn btn-outline"
                      style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                    >
                      <FileText size={12} /> Kiểm duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="list-pagination-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>
              Hiển thị {Math.min(startIndex + 1, totalItems)}-
              {Math.min(startIndex + paginatedConversations.length, totalItems)} trong tổng số {totalItems}
            </span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Số bản ghi:
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="filter-select"
                style={{ padding: '2px 8px', height: 'auto', fontSize: '0.85rem' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </span>
          </div>
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

  // --- RENDERING AUDIT ANALYSIS LAYOUT (split 2 columns) ---
  if (currentView === 'ai-evaluation-analysis' && activeConv) {
    return (
      <div className="animate-fade-in">
        {/* Toolbar Header */}
        <div className="canvas-toolbar" style={{ marginBottom: '12px' }}>
          <div className="flex align-center gap-4">
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
              Phân tích hội thoại lỗi AI: {activeConv.name}
            </h2>
          </div>
          <span className={`review-rating-badge rating-score-${activeConv.ratingNum}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
            Khách hàng chấm: {activeConv.rating}
          </span>
        </div>

        {/* Audit layout (2 columns) */}
        <div className="audit-layout">
          {/* Left Column: Chat log */}
          <div className="audit-left-col">
            <div className="audit-section-header">Lịch sử hội thoại gốc</div>
            
            <div className="audit-info-summary">
              <div>
                <span className="audit-info-label">Mã cuộc gọi:</span>{' '}
                <span className="audit-info-value">{activeConv.id}</span>
              </div>
              <div>
                <span className="audit-info-label">Thời gian:</span>{' '}
                <span className="audit-info-value">{activeConv.time}</span>
              </div>
              <div>
                <span className="audit-info-label">Khách hàng:</span>{' '}
                <span className="audit-info-value">{activeConv.name}</span>
              </div>
              <div>
                <span className="audit-info-label">Trạng thái duyệt:</span>{' '}
                <span className="audit-info-value" style={{ color: activeConv.status === 'Đã duyệt' ? '#10b981' : '#ef4444' }}>
                  {activeConv.status}
                </span>
              </div>
            </div>

            {/* Scroll messages */}
            <div className="audit-chat-scroll">
              {activeConv.transcript.map((msg, index) => {
                if (msg.sender === 'bot') {
                  return (
                    <div
                      key={index}
                      className={`audit-msg-row bot ${msg.flagged ? 'flagged-error' : ''}`}
                      onClick={() => handleToggleFlagMessage(index)}
                      style={{ cursor: 'pointer' }}
                      title={msg.flagged ? "Nhấn để bỏ đánh dấu lỗi" : "Nhấn để đánh dấu lỗi"}
                    >
                      <div className="audit-msg-label">
                        <Sparkles size={10} style={{ color: 'var(--primary-light)' }} />
                        <span>Trợ lý AI</span>
                        {msg.flagged && (
                          <span className="error-badge" style={{ marginLeft: '6px', fontSize: '0.7rem' }}>
                            {msg.errorType}
                          </span>
                        )}
                      </div>
                      <div className="audit-msg-body" style={{ position: 'relative' }}>
                        {msg.text}
                        {msg.flagged && (
                          <div
                            className="inline-error-select-container"
                            style={{
                              marginTop: '8px',
                              borderTop: '1px dashed #fca5a5',
                              paddingTop: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: '600' }}>
                              Loại lỗi:
                            </span>
                            <select
                              value={msg.errorType || 'Sai lệch chuyên môn y tế'}
                              onChange={(e) => handleUpdateMsgErrorType(index, e.target.value)}
                              style={{
                                fontSize: '0.72rem',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                border: '1px solid #fca5a5',
                                backgroundColor: '#fff',
                                color: '#dc2626',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Sai lệch chuyên môn y tế">Sai lệch chuyên môn y tế</option>
                              <option value="Ảo giác hệ thống">Ảo giác hệ thống</option>
                              <option value="Thái độ không phù hợp">Thái độ không phù hợp</option>
                              <option value="Lỗi logic điều hướng kịch bản">Lỗi logic điều hướng kịch bản</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="audit-msg-row patient">
                      <div className="audit-msg-label">
                        <Heart size={10} style={{ color: 'red' }} />
                        <span>Bệnh nhân ({activeConv.name})</span>
                      </div>
                      <div className="audit-msg-body">{msg.text}</div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          {/* Right Column: Error classification and Notes */}
          <div className="audit-right-col" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px', marginBottom: '12px' }}>
              {/* Error types checklist card */}
              <div className="card" style={{ margin: 0 }}>
                <div className="audit-section-header" style={{ padding: '0 0 8px 0', borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
                  Phân loại lỗi hệ thống AI
                </div>
                <div className="error-checklist" style={{ padding: '6px 0 0 0' }}>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeConv.errors.medical}
                      onChange={() => handleUpdateCheckbox('medical')}
                    />
                    <span><strong>Sai lệch kiến thức chuyên môn y tế</strong> (Sai đơn thuốc, sai lời khuyên)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeConv.errors.hallucination}
                      onChange={() => handleUpdateCheckbox('hallucination')}
                    />
                    <span><strong>Ảo giác AI (Hallucination)</strong> (Bịa đặt thông tin thuốc)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeConv.errors.tone}
                      onChange={() => handleUpdateCheckbox('tone')}
                    />
                    <span><strong>Thái độ ứng xử không phù hợp</strong> (Lời nói thiếu lịch sự)</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={activeConv.errors.logic}
                      onChange={() => handleUpdateCheckbox('logic')}
                    />
                    <span><strong>Lỗi logic điều hướng kịch bản</strong> (Vào sai luồng bệnh án)</span>
                  </label>
                </div>
              </div>

              {/* Related scenarios card */}
              <div className="card" style={{ margin: 0 }}>
                <div className="audit-section-header" style={{ padding: '0 0 8px 0', borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
                  Kịch bản Chatbot liên quan
                </div>
                <div style={{ padding: '10px 0 0 0' }}>
                  <div className="scenario-link-box">
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tên luồng chạy:</div>
                      <div className="scenario-link-name">Tư vấn cảm cúm & đặt lịch khám</div>
                    </div>
                    <button
                      onClick={() => onNavigate('chatbot-scenario-edit')}
                      className="btn btn-outline"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Edit2 size={10} /> Sửa kịch bản
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient Feedback Details Card */}
              {(activeConv.userFeedback || (activeConv.userProblems && activeConv.userProblems.length > 0)) && (
                <div className="card" style={{ margin: 0, backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
                  <div className="audit-section-header" style={{ padding: '0 0 8px 0', borderBottom: '1px solid #bae6fd', background: 'transparent', color: '#0369a1' }}>
                    Phản hồi từ Người dùng (Bệnh nhân)
                  </div>
                  <div style={{ padding: '10px 0 0 0', fontSize: '0.82rem', color: '#0c4a6e', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeConv.userProblems && activeConv.userProblems.length > 0 && (
                      <div>
                        <strong>Các vấn đề báo cáo:</strong>{' '}
                        <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
                          {activeConv.userProblems.join(', ')}
                        </span>
                      </div>
                    )}
                    {activeConv.userFeedback && (
                      <div>
                        <strong>Nội dung nhận xét/góp ý:</strong>
                        <div style={{ fontStyle: 'italic', backgroundColor: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid #e0f2fe', marginTop: '4px' }}>
                          "{activeConv.userFeedback}"
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expert notes card */}
              <div className="card" style={{ margin: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="audit-section-header" style={{ padding: '0 0 8px 0', borderBottom: '1px solid var(--border-color)', background: 'transparent' }}>
                  Ghi chú & Chỉ thị của Chuyên gia
                </div>
                <div style={{ padding: '10px 0 0 0', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <textarea
                    value={activeConv.notes}
                    onChange={(e) => setActiveConv({ ...activeConv, notes: e.target.value })}
                    placeholder="Ghi nhận sai sót..."
                    className="form-input form-textarea"
                    style={{ width: '100%', flexGrow: 1, minHeight: '80px' }}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4" style={{ flexShrink: 0 }}>
              <button
                className="btn btn-cancel"
                onClick={() => handleSaveAudit('Cần chỉnh sửa')}
                style={{ flexGrow: 1, padding: '10px' }}
              >
                Yêu cầu sửa kịch bản
              </button>
              <button
                className="btn btn-save"
                onClick={() => handleSaveAudit('Đã duyệt')}
                style={{ flexGrow: 1, padding: '10px' }}
              >
                Duyệt thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export { INITIAL_CONVERSATIONS };
