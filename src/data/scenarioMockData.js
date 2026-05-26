export const SC001_NODES = [
  { id: 'start', type: 'start', label: 'Bắt đầu', x: 450, y: 50, content: 'Bắt đầu luồng kịch bản' },
  { id: 'welcome', type: 'bot', label: 'Chào mừng', x: 450, y: 140, content: 'Xin chào! Tôi là Trợ lý AI của MediConsult. Tôi có thể giúp gì cho bạn hôm nay?' },
  { 
    id: 'symptom_choices', 
    type: 'condition', 
    label: 'Lựa chọn Triệu chứng', 
    x: 450, 
    y: 240, 
    content: 'Bạn đang gặp triệu chứng nào dưới đây?',
    choices: [
      { text: 'Sốt & Đau đầu', nextNode: 'fever_check' },
      { text: 'Ho & Đau họng', nextNode: 'cough_check' },
      { text: 'Tra cứu thuốc', nextNode: 'medicine_check' }
    ]
  },
  
  // Fever Path
  { id: 'fever_check', type: 'bot', label: 'Tư vấn sốt', x: 220, y: 380, content: 'Sốt kèm đau đầu có thể là dấu hiệu cảm lạnh hoặc nhiễm trùng. Bạn có sốt cao trên 38.5 độ C không?' },
  {
    id: 'fever_level',
    type: 'condition',
    label: 'Mức độ sốt',
    x: 220,
    y: 490,
    content: 'Hãy chọn nhiệt độ cơ thể hiện tại:',
    choices: [
      { text: 'Sốt cao (>38.5 độ C)', nextNode: 'high_fever_action' },
      { text: 'Sốt nhẹ (<38.5 độ C)', nextNode: 'low_fever_action' }
    ]
  },
  { id: 'high_fever_action', type: 'action', label: 'Đặt lịch khám', x: 100, y: 620, content: 'Bạn sốt cao, có nguy cơ nhiễm trùng hoặc sốt xuất huyết. Tôi khuyến nghị bạn nên đặt lịch khám nhanh với Bác sĩ Nội khoa.' },
  { id: 'low_fever_action', type: 'bot', label: 'Nghỉ ngơi', x: 320, y: 620, content: 'Nhiệt độ này chưa quá nguy hiểm. Hãy uống nhiều nước, chườm ấm và sử dụng Paracetamol nếu cần thiết.' },

  // Cough Path
  { id: 'cough_check', type: 'bot', label: 'Tư vấn ho', x: 580, y: 380, content: 'Ho kèm đau họng thường là viêm đường hô hấp. Triệu chứng của bạn kéo dài bao lâu rồi?' },
  {
    id: 'cough_duration',
    type: 'condition',
    label: 'Thời gian ho',
    x: 580,
    y: 490,
    content: 'Chọn khoảng thời gian triệu chứng xuất hiện:',
    choices: [
      { text: 'Dưới 3 ngày', nextNode: 'cough_short' },
      { text: 'Trên 3 ngày', nextNode: 'cough_long' }
    ]
  },
  { id: 'cough_short', type: 'bot', label: 'Theo dõi ho', x: 480, y: 620, content: 'Triệu chứng mới xuất hiện. Bạn có thể sử dụng siro ho thảo dược, súc họng nước muối ấm.' },
  { id: 'cough_long', type: 'action', label: 'Đặt lịch Hô hấp', x: 700, y: 620, content: 'Ho kéo dài trên 3 ngày cần được bác sĩ chuyên khoa Hô hấp kiểm tra nghe phổi để tránh viêm phế quản/viêm phổi.' },

  // Medicine Path
  { id: 'medicine_check', type: 'bot', label: 'Tra cứu thuốc', x: 950, y: 380, content: 'Bạn cần tra cứu thông tin của loại thuốc nào? Hãy nhập tên thuốc (Ví dụ: Paracetamol, Ibuprofen,...)' }
];

export const SC001_CONNECTIONS = [
  { from: 'start', to: 'welcome' },
  { from: 'welcome', to: 'symptom_choices' },
  { from: 'fever_check', to: 'fever_level' },
  { from: 'cough_check', to: 'cough_duration' }
];

export const SC002_NODES = [
  { id: 'start', type: 'start', label: 'Bắt đầu', x: 450, y: 50, content: 'Bắt đầu luồng kịch bản' },
  { id: 'welcome_med', type: 'bot', label: 'Chào mừng thuốc', x: 450, y: 150, content: 'Xin chào! Bạn muốn tra cứu thông tin hay liều dùng của loại thuốc nào?' },
  { 
    id: 'med_choices', 
    type: 'condition', 
    label: 'Chọn loại thuốc', 
    x: 450, 
    y: 260, 
    content: 'Vui lòng chọn loại thuốc phổ biến bên dưới:',
    choices: [
      { text: 'Paracetamol', nextNode: 'para_info' },
      { text: 'Amoxicillin', nextNode: 'amox_info' }
    ]
  },
  { id: 'para_info', type: 'bot', label: 'Thông tin Paracetamol', x: 250, y: 400, content: 'Paracetamol 500mg: Dùng hạ sốt, giảm các cơn đau nhẹ đến trung bình. Liều: 1-2 viên/lần.' },
  { id: 'amox_info', type: 'bot', label: 'Thông tin Amoxicillin', x: 650, y: 400, content: 'Amoxicillin 500mg: Kháng sinh điều trị nhiễm khuẩn hô hấp. Liều: 1 viên/lần, ngày 3 lần.' },
  { id: 'custom_med', type: 'action', label: 'Tìm thuốc khác', x: 450, y: 520, content: 'Hệ thống sẵn sàng hỗ trợ tìm các thuốc khác trong danh mục của MediConsult.' }
];

export const SC002_CONNECTIONS = [
  { from: 'start', to: 'welcome_med' },
  { from: 'welcome_med', to: 'med_choices' },
  { from: 'para_info', to: 'custom_med' },
  { from: 'amox_info', to: 'custom_med' }
];

export const SC003_NODES = [
  { id: 'start', type: 'start', label: 'Bắt đầu', x: 450, y: 50, content: 'Bắt đầu luồng kịch bản' },
  { id: 'welcome_reg', type: 'bot', label: 'Chào mừng đăng ký', x: 450, y: 140, content: 'Chào mừng bạn! Tôi có thể hỗ trợ bạn đăng ký lịch khám bệnh tại MediConsult.' },
  { 
    id: 'dept_choices', 
    type: 'condition', 
    label: 'Chọn chuyên khoa', 
    x: 450, 
    y: 240, 
    content: 'Vui lòng chọn chuyên khoa cần khám:',
    choices: [
      { text: 'Nội tổng quát', nextNode: 'internal_dept' },
      { text: 'Tai Mũi Họng', nextNode: 'ent_dept' }
    ]
  },
  { id: 'internal_dept', type: 'bot', label: 'Khoa Nội tổng quát', x: 250, y: 380, content: 'Khoa Nội có bác sĩ trực: BS. Nguyễn Văn B. Phí dịch vụ: 350.000 VNĐ.' },
  { id: 'ent_dept', type: 'bot', label: 'Khoa Tai Mũi Họng', x: 650, y: 380, content: 'Khoa Tai Mũi Họng có bác sĩ trực: BS. C. Phí dịch vụ: 300.000 VNĐ.' },
  { 
    id: 'time_choices', 
    type: 'condition', 
    label: 'Khung giờ khám', 
    x: 450, 
    y: 500, 
    content: 'Vui lòng chọn ca khám phù hợp trong ngày:',
    choices: [
      { text: 'Ca sáng (08:00 - 11:30)', nextNode: 'finish_node' },
      { text: 'Ca chiều (13:30 - 17:00)', nextNode: 'finish_node' }
    ]
  },
  { id: 'finish_node', type: 'action', label: 'Xác nhận đặt lịch', x: 450, y: 620, content: 'Yêu cầu của bạn đã được tiếp nhận thành công. Vui lòng check-in tại phòng đón tiếp.' },
  { id: 'dummy_node', type: 'bot', label: 'Hướng dẫn di chuyển', x: 450, y: 720, content: 'Vui lòng mang theo CMT/BHYT để làm thủ tục thuận tiện hơn.' }
];

export const SC003_CONNECTIONS = [
  { from: 'start', to: 'welcome_reg' },
  { from: 'welcome_reg', to: 'dept_choices' },
  { from: 'internal_dept', to: 'time_choices' },
  { from: 'ent_dept', to: 'time_choices' },
  { from: 'finish_node', to: 'dummy_node' }
];
