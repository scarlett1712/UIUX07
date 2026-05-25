import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, FileText, Edit2, Play, ArrowLeft, Heart, Sparkles } from 'lucide-react';

const INITIAL_CONVERSATIONS = [
  {
    id: 'CONV001',
    name: 'Nguyễn Minh Anh',
    time: '05/05/2026 - 08:15',
    topic: 'Triệu chứng sốt, đau họng',
    rating: '1đ',
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
    time: '05/05/2026 - 09:40',
    topic: 'Tra cứu đơn thuốc cũ',
    rating: '2đ',
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
    time: '05/05/2026 - 10:05',
    topic: 'Đặt lịch khám',
    rating: '1đ',
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
    time: '05/05/2026 - 11:20',
    topic: 'Dị ứng da',
    rating: '1đ',
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
  const itemsPerPage = 7;

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
    const totalItems = conversations.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedConversations = conversations.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Đánh giá & kiểm duyệt AI</h2>

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
          <span>
            Hiển thị {Math.min(startIndex + 1, totalItems)}-
            {Math.min(startIndex + paginatedConversations.length, totalItems)} trong tổng số {totalItems}
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

  // --- RENDERING AUDIT ANALYSIS LAYOUT (split 2 columns) ---
  if (currentView === 'ai-evaluation-analysis' && activeConv) {
    return (
      <div className="animate-fade-in">
        {/* Toolbar Header */}
        <div className="canvas-toolbar" style={{ marginBottom: '12px' }}>
          <div className="flex align-center gap-4">
            <button className="back-btn" onClick={() => onNavigate('ai-evaluation')}>
              <ArrowLeft size={16} />
            </button>
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
              {activeConv.transcript.map((msg, index) => (
                <div key={index} className={`audit-msg-row ${msg.sender} ${msg.flagged ? 'flagged-error' : ''}`}>
                  <div className="audit-msg-label">
                    {msg.sender === 'bot' ? (
                      <>
                        <Sparkles size={10} style={{ color: 'var(--primary-light)' }} />
                        <span>Trợ lý AI</span>
                        {msg.flagged && <span className="error-badge">{msg.errorType}</span>}
                      </>
                    ) : (
                      <>
                        <Heart size={10} style={{ color: 'red' }} />
                        <span>Bệnh nhân ({activeConv.name})</span>
                      </>
                    )}
                  </div>
                  <div className="audit-msg-body">{msg.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Error classification and Notes */}
          <div className="audit-right-col">
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

            {/* Action buttons */}
            <div className="flex gap-4">
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
