import React, { useState, useRef, useEffect } from 'react';
import { Bot, Play, Edit3, Trash2, Plus, Save, X, RotateCcw, AlertCircle, Send, Award, HelpCircle, ArrowLeft, Eye, Sparkles, User, FileText, Search, Filter, Undo2 } from 'lucide-react';

// Shift coordinates by X:+200px and Y:+20px to center on load
const INITIAL_NODES = [
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

const INITIAL_CONNECTIONS = [
  { from: 'start', to: 'welcome' },
  { from: 'welcome', to: 'symptom_choices' },
  { from: 'fever_check', to: 'fever_level' },
  { from: 'cough_check', to: 'cough_duration' }
];

export default function ChatbotScenarios({
  currentView,
  onNavigate,
  selectedId,
  onSelectId,
  scenarios,
  setScenarios,
  triggerToast
}) {
  // Designer Canvas States
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // --- FILTERS & PAGINATION ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Simulation States
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInputValue, setChatInputValue] = useState('');
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);

  // Center scroll pane on mount
  useEffect(() => {
    if (canvasRef.current && (currentView.includes('edit') || currentView.includes('test') || currentView.includes('details'))) {
      canvasRef.current.scrollLeft = 260; // Slightly scroll to center the nodes nicely
    }
  }, [currentView]);

  // --- DESIGNER CANVAS ACTIONS ---

  const handleNodeMouseDown = (e, nodeId) => {
    if (isSimulatorRunning || currentView.includes('details')) return;
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (!draggingNodeId) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    const x = e.clientX - canvasRect.left + scrollLeft - dragOffset.current.x;
    const y = e.clientY - canvasRect.top + scrollTop - dragOffset.current.y;

    setNodes(
      nodes.map((node) =>
        node.id === draggingNodeId
          ? { ...node, x: Math.max(0, x), y: Math.max(0, y) }
          : node
      )
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleAddNode = (type) => {
    const id = `${type}_${Date.now()}`;
    const newNode = {
      id,
      type,
      label: `Nút ${type === 'bot' ? 'Bot' : type === 'condition' ? 'Lựa chọn' : type === 'action' ? 'Hành động' : 'Bắt đầu'} mới`,
      x: 400 + Math.random() * 50,
      y: 150 + Math.random() * 50,
      content: 'Nhập nội dung tin nhắn hiển thị...',
    };
    if (type === 'condition') {
      newNode.choices = [
        { text: 'Lựa chọn A', nextNode: '' },
        { text: 'Lựa chọn B', nextNode: '' }
      ];
    }
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
    triggerToast('Đã tạo một khối kịch bản mới', 'success');
  };

  const handleDeleteNode = (nodeId) => {
    if (nodeId === 'start' || nodeId === 'welcome') {
      triggerToast('Không thể xóa nút khởi đầu hệ thống', 'error');
      return;
    }
    if (window.confirm('Bạn có chắc chắn muốn xóa nút này?')) {
      setNodes(nodes.filter((n) => n.id !== nodeId));
      setConnections(connections.filter((c) => c.from !== nodeId && c.to !== nodeId));
      setSelectedNodeId(null);
      triggerToast('Đã xóa khối kịch bản', 'info');
    }
  };

  // --- Lifted state CRUD backend mapping ---
  const handleSaveScenario = (status) => {
    const scenarioId = selectedId || `SC004`;
    const updatedScenarios = [...scenarios];
    const existingIdx = scenarios.findIndex((s) => s.id === scenarioId);
    const nodeCount = nodes.length;
    const timeString = new Date()
      .toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(',', ' -');

    if (existingIdx > -1) {
      updatedScenarios[existingIdx] = {
        ...scenarios[existingIdx],
        status,
        nodeCount,
        lastUpdated: timeString,
      };
    } else {
      updatedScenarios.unshift({
        id: scenarioId,
        name: 'Tư vấn khám bệnh tổng quát tự động',
        status,
        lastUpdated: timeString,
        nodeCount,
      });
    }

    setScenarios(updatedScenarios);
    triggerToast(
      status === 'Hoạt động'
        ? 'Đã lưu & xuất bản kịch bản thành công!'
        : 'Đã lưu kịch bản nháp thành công!',
      'success'
    );
    onNavigate('chatbot-scenarios');
  };

  const handleConnectNodes = (fromId, toId) => {
    if (fromId === toId) return;
    const exists = connections.some((c) => c.from === fromId && c.to === toId);
    if (exists) return;
    
    if (fromId === 'start') {
      setConnections(connections.filter((c) => c.from !== 'start').concat({ from: fromId, to: toId }));
    } else {
      setConnections([...connections, { from: fromId, to: toId }]);
    }
    triggerToast('Đã tạo kết nối logic giữa các khối!', 'success');
  };

  const getPortCoordinates = (nodeId, portType) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const nodeWidth = 180;
    const nodeHeight = node.type === 'condition' ? 100 : 60;
    
    if (portType === 'input') {
      return { x: node.x + nodeWidth / 2, y: node.y };
    } else {
      return { x: node.x + nodeWidth / 2, y: node.y + nodeHeight };
    }
  };

  const renderConnections = () => {
    const pathElements = [];
    
    connections.forEach((conn, index) => {
      const startPos = getPortCoordinates(conn.from, 'output');
      const endPos = getPortCoordinates(conn.to, 'input');
      const midY = (startPos.y + endPos.y) / 2;
      const pathData = `M ${startPos.x} ${startPos.y} C ${startPos.x} ${midY}, ${endPos.x} ${midY}, ${endPos.x} ${endPos.y}`;
      
      const isActive = isSimulatorRunning && (currentNodeId === conn.from || (currentNodeId === conn.to && chatMessages.length > 0));

      pathElements.push(
        <path
          key={`conn-${index}`}
          d={pathData}
          className={`flow-connection-line ${isActive ? 'active-pulse' : ''}`}
        />
      );
    });

    nodes.forEach((node) => {
      if (node.type === 'condition' && node.choices) {
        node.choices.forEach((choice, index) => {
          if (choice.nextNode) {
            const startPos = getPortCoordinates(node.id, 'output');
            const endPos = getPortCoordinates(choice.nextNode, 'input');
            
            const count = node.choices.length;
            const step = 160 / (count + 1);
            const offsetStart = {
              x: node.x + step * (index + 1),
              y: startPos.y
            };
            
            const midY = (offsetStart.y + endPos.y) / 2;
            const pathData = `M ${offsetStart.x} ${offsetStart.y} C ${offsetStart.x} ${midY}, ${endPos.x} ${midY}, ${endPos.x} ${endPos.y}`;
            const isActive = isSimulatorRunning && currentNodeId === node.id;

            pathElements.push(
              <path
                key={`choice-${node.id}-${index}`}
                d={pathData}
                className={`flow-connection-line ${isActive ? 'active-pulse' : ''}`}
                style={{ stroke: '#f59e0b', strokeDasharray: '3, 3' }}
              />
            );
          }
        });
      }
    });

    return pathElements;
  };

  // --- BOT SIMULATION ENGINE ---

  const startSimulation = () => {
    setIsSimulatorRunning(true);
    setCurrentNodeId('start');
    setChatMessages([]);
    triggerToast('Khởi động kịch bản giả lập thành công!', 'success');
    
    const conn = connections.find((c) => c.from === 'start');
    const firstBotNode = conn ? conn.to : 'welcome';
    const botNode = nodes.find((n) => n.id === firstBotNode);

    setTimeout(() => {
      setChatMessages([
        { sender: 'bot', text: 'Bắt đầu phiên mô phỏng...' }
      ]);
      if (botNode) {
        setCurrentNodeId(botNode.id);
        setTimeout(() => {
          setChatMessages((prev) => [
            ...prev,
            { sender: 'bot', text: botNode.content }
          ]);
          triggerNextBotStep(botNode.id);
        }, 1000);
      }
    }, 500);
  };

  const triggerNextBotStep = (nodeId) => {
    const nextConn = connections.find((c) => c.from === nodeId);
    if (!nextConn) return;

    const nextNode = nodes.find((n) => n.id === nextConn.to);
    if (!nextNode) return;

    setTimeout(() => {
      setCurrentNodeId(nextNode.id);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: nextNode.content }
      ]);
      if (nextNode.type === 'bot' || nextNode.type === 'action') {
        triggerNextBotStep(nextNode.id);
      }
    }, 1500);
  };

  const selectChoice = (choice) => {
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', text: choice.text }
    ]);

    const targetNodeId = choice.nextNode;
    if (!targetNodeId) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'Trợ lý AI: Nhánh kịch bản này chưa được nối đến nút tiếp theo.' }
        ]);
        triggerToast('Lỗi liên kết node trong kịch bản', 'error');
      }, 1000);
      return;
    }

    const nextNode = nodes.find((n) => n.id === targetNodeId);
    if (!nextNode) return;

    setTimeout(() => {
      setCurrentNodeId(targetNodeId);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot', text: nextNode.content }
      ]);
      if (nextNode.type === 'bot' || nextNode.type === 'action') {
        triggerNextBotStep(nextNode.id);
      }
    }, 1000);
  };

  const handleSendSimulatorMsg = () => {
    if (!chatInputValue.trim()) return;
    
    setChatMessages((prev) => [
      ...prev,
      { sender: 'patient', text: chatInputValue }
    ]);
    
    const userText = chatInputValue;
    setChatInputValue('');

    if (currentNodeId === 'medicine_check') {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: `Tôi đã tìm kiếm thông tin về thuốc "${userText}".\n\nĐây là loại thuốc giảm đau hạ sốt rất phổ biến. Vui lòng tham khảo chi tiết trong Dữ liệu y tế để biết liều lượng chính xác.` }
        ]);
        triggerToast('Bot truy xuất cơ sở dữ liệu thuốc thành công!', 'success');
      }, 1200);
    } else {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { sender: 'bot', text: `Cảm ơn bạn đã phản hồi. Trợ lý AI đang ghi nhận thông tin: "${userText}".` }
        ]);
      }, 1000);
    }
  };

  const getActiveChoices = () => {
    const currentNode = nodes.find((n) => n.id === currentNodeId);
    if (currentNode && currentNode.type === 'condition' && currentNode.choices) {
      return currentNode.choices;
    }
    return null;
  };

  // --- VIEWS ---

  if (currentView === 'chatbot-scenarios') {
    const filtered = scenarios.filter(sc => {
      const matchSearch = sc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter ? sc.status === statusFilter : true;
      return matchSearch && matchStatus;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedScenarios = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
      <div className="animate-fade-in">
        <div className="flex align-center gap-4" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Kịch bản Chatbot</h2>
          <button
            className="plus-btn-circle"
            onClick={() => onNavigate('chatbot-scenario-add')}
          >
            <Plus size={16} />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar" style={{ marginBottom: '16px' }}>
          <div className="filter-group">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Tìm kiếm kịch bản..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ width: '220px', padding: '6px 10px' }}
            />
          </div>

          <div className="filter-group">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">Trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Nháp">Nháp</option>
            </select>

            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('');
                triggerToast('Đã xóa tất cả bộ lọc kịch bản', 'info');
              }}
              className="btn btn-outline"
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '3px', color: '#ff6b6b' }}
            >
              <Undo2 size={12} /> Hủy lọc
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '0px', overflow: 'hidden' }}>
          <table className="custom-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Tên kịch bản</th>
                <th>Trạng thái</th>
                <th>Số lượng Node logic</th>
                <th>Cập nhật gần nhất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedScenarios.map((sc) => (
                <tr key={sc.id}>
                  <td
                    onClick={() => {
                      onSelectId(sc.id);
                      onNavigate('chatbot-scenario-details');
                    }}
                    style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}
                  >
                    {sc.name}
                  </td>
                  <td>
                    <span className={`badge ${sc.status === 'Hoạt động' ? 'badge-high' : 'badge-low'}`} style={{ backgroundColor: sc.status === 'Hoạt động' ? '#d1fae5' : '#f1f5f9', color: sc.status === 'Hoạt động' ? '#065f46' : '#475569' }}>
                      {sc.status}
                    </span>
                  </td>
                  <td>{sc.nodeCount}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{sc.lastUpdated}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onSelectId(sc.id);
                          onNavigate('chatbot-scenario-test');
                        }}
                        className="btn btn-outline"
                        style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.8rem', color: 'var(--primary)' }}
                      >
                        <Play size={12} fill="currentColor" /> Chạy thử
                      </button>
                      <button
                        onClick={() => {
                          onSelectId(sc.id);
                          onNavigate('chatbot-scenario-edit');
                        }}
                        className="btn btn-outline"
                        style={{ padding: '4px' }}
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Xóa kịch bản này?')) {
                            setScenarios(scenarios.filter((s) => s.id !== sc.id));
                            triggerToast('Đã xóa kịch bản', 'info');
                          }
                        }}
                        className="btn btn-outline"
                        style={{ padding: '4px', color: 'red' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
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
            {Math.min(startIndex + paginatedScenarios.length, totalItems)} trong tổng số {totalItems}
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

  // --- SCENARIO DETAILS VIEW ---
  if (currentView === 'chatbot-scenario-details') {
    const scItem = scenarios.find((s) => s.id === selectedId) || scenarios[0];
    return (
      <div className="animate-fade-in">
        <div className="canvas-toolbar">
          <div className="flex align-center gap-4">
            <button className="back-btn" onClick={() => onNavigate('chatbot-scenarios')}>
              <ArrowLeft size={16} />
            </button>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
              Chi tiết kịch bản: {scItem.name}
            </h2>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline" style={{ color: 'var(--primary)' }} onClick={() => {
              onSelectId(scItem.id);
              onNavigate('chatbot-scenario-test');
            }}>
              <Play size={14} fill="currentColor" /> Chạy thử giả lập
            </button>
            <button className="btn btn-primary" onClick={() => {
              onSelectId(scItem.id);
              onNavigate('chatbot-scenario-edit');
            }}>
              <Edit3 size={14} /> Chỉnh sửa kịch bản
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mã kịch bản:</div>
            <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{scItem.id}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Trạng thái vận hành:</div>
            <span className={`badge ${scItem.status === 'Hoạt động' ? 'badge-high' : 'badge-low'}`} style={{ backgroundColor: scItem.status === 'Hoạt động' ? '#d1fae5' : '#f1f5f9', color: scItem.status === 'Hoạt động' ? '#065f46' : '#475569', marginTop: '2px' }}>
              {scItem.status}
            </span>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng số nút logic:</div>
            <div style={{ fontWeight: 600 }}>{scItem.nodeCount} Nodes</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cập nhật gần nhất:</div>
            <div style={{ fontWeight: 600 }}>{scItem.lastUpdated}</div>
          </div>
        </div>

        <div className="canvas-container-outer" style={{ height: '400px' }}>
          <div ref={canvasRef} className="canvas-area" style={{ cursor: 'default' }}>
            <svg className="flow-svg-connections">
              {renderConnections()}
            </svg>

            {nodes.map((node) => (
              <div
                key={node.id}
                className={`canvas-node node-${node.type}`}
                style={{ left: `${node.x}px`, top: `${node.y}px`, cursor: 'default' }}
              >
                <div className="node-header">
                  <span>{node.type.toUpperCase()}</span>
                </div>
                <div className="node-body">
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{node.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{node.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- CANVAS DESIGNER VIEW (Lưu nháp vs Lưu & Xuất bản) ---
  if (currentView === 'chatbot-scenario-edit' || currentView === 'chatbot-scenario-add') {
    const activeNode = nodes.find((n) => n.id === selectedNodeId);

    return (
      <div className="animate-fade-in">
        {/* Canvas Toolbar */}
        <div className="canvas-toolbar">
          <div className="flex align-center gap-4">
            <button className="back-btn" onClick={() => onNavigate('chatbot-scenarios')}>
              <X size={16} />
            </button>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
              {currentView === 'chatbot-scenario-add' ? 'Tạo mới kịch bản chatbot' : 'Thiết kế kịch bản: Tư vấn cảm cúm'}
            </h2>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => {
              setNodes(INITIAL_NODES);
              setConnections(INITIAL_CONNECTIONS);
              setSelectedNodeId(null);
              triggerToast('Đã đặt lại canvas kịch bản', 'info');
            }}>
              <RotateCcw size={14} /> Đặt lại
            </button>
            
            {/* Draft vs Publish Buttons (As requested) */}
            <button className="btn btn-outline" style={{ border: '1px solid var(--primary-light)', color: 'var(--primary)' }} onClick={() => handleSaveScenario('Nháp')}>
              Lưu nháp
            </button>
            <button className="btn btn-primary" onClick={() => handleSaveScenario('Hoạt động')}>
              Lưu & Xuất bản
            </button>
          </div>
        </div>

        {/* Canvas grid panels */}
        <div className="canvas-container-outer">
          {/* Node templates sidebar */}
          <div className="canvas-sidebar">
            <div className="canvas-sidebar-title">Thêm Node mới</div>
            <div className="draggable-node-template" onClick={() => handleAddNode('bot')}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
              Bot Phản hồi
            </div>
            <div className="draggable-node-template" onClick={() => handleAddNode('condition')}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              Câu hỏi Lựa chọn
            </div>
            <div className="draggable-node-template" onClick={() => handleAddNode('action')}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ec4899' }} />
              Hành động
            </div>

            <div style={{ marginTop: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '6px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <AlertCircle size={12} style={{ marginBottom: '3px', color: 'var(--primary-light)' }} />
              <strong>Tip:</strong> Nhấp vào cổng tròn màu xám dưới Node rồi nhấp vào Node nhận để tạo kết nối.
            </div>
          </div>

          {/* Interactive Canvas area */}
          <div
            ref={canvasRef}
            className="canvas-area"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            <svg className="flow-svg-connections">
              {renderConnections()}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`canvas-node ${
                  selectedNodeId === node.id ? 'active-highlight' : ''
                } node-${node.type}`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                {node.type !== 'start' && (
                  <div
                    className="node-port port-input"
                    title="Cổng kết nối vào"
                    onMouseUp={() => {
                      if (selectedNodeId && selectedNodeId !== node.id) {
                        handleConnectNodes(selectedNodeId, node.id);
                      }
                    }}
                  />
                )}

                <div className="node-header">
                  <span>{node.type.toUpperCase()}</span>
                  <HelpCircle size={10} style={{ opacity: 0.5 }} />
                </div>
                <div className="node-body">
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '2px' }}>{node.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', maxHeight: '35px' }}>
                    {node.content}
                  </div>
                  
                  {node.choices && (
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {node.choices.map((c, i) => (
                        <div key={i} style={{ background: '#fef3c7', padding: '2px 4px', borderRadius: '4px', fontSize: '0.68rem', color: '#d97706', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{c.text}</span>
                          <span>→</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {node.type !== 'action' && (
                  <div
                    className="node-port port-output"
                    title="Cổng kết nối ra (Bấm để chọn cổng nguồn)"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                      triggerToast(`Đã chọn cổng ra của "${node.label}"`, 'info');
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Node Edit Sidebar config panel */}
          {activeNode && (
            <div className="canvas-config-panel">
              <div className="flex justify-between align-center" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Cấu hình Node</h4>
                <button
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'red' }}
                  onClick={() => handleDeleteNode(activeNode.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="form-group">
                <span className="form-group-label">Tiêu đề khối</span>
                <input
                  type="text"
                  value={activeNode.label}
                  onChange={(e) =>
                    setNodes(nodes.map((n) => (n.id === activeNode.id ? { ...n, label: e.target.value } : n)))
                  }
                  className="form-input"
                  style={{ padding: '6px' }}
                />
              </div>

              <div className="form-group">
                <span className="form-group-label">Nội dung hiển thị</span>
                <textarea
                  value={activeNode.content}
                  onChange={(e) =>
                    setNodes(nodes.map((n) => (n.id === activeNode.id ? { ...n, content: e.target.value } : n)))
                  }
                  className="form-input"
                  style={{ minHeight: '60px', padding: '6px' }}
                />
              </div>

              {activeNode.type === 'condition' && activeNode.choices && (
                <div className="form-group">
                  <span className="form-group-label">Các lựa chọn phản hồi</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeNode.choices.map((choice, i) => (
                      <div key={i} className="flex gap-2 align-center">
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => {
                            const updatedChoices = [...activeNode.choices];
                            updatedChoices[i].text = e.target.value;
                            setNodes(nodes.map((n) => (n.id === activeNode.id ? { ...n, choices: updatedChoices } : n)));
                          }}
                          className="form-input"
                          style={{ padding: '4px', fontSize: '0.78rem', width: '90px' }}
                        />
                        <select
                          value={choice.nextNode || ''}
                          onChange={(e) => {
                            const updatedChoices = [...activeNode.choices];
                            updatedChoices[i].nextNode = e.target.value;
                            setNodes(nodes.map((n) => (n.id === activeNode.id ? { ...n, choices: updatedChoices } : n)));
                          }}
                          className="form-select"
                          style={{ padding: '4px', fontSize: '0.78rem', flexGrow: 1 }}
                        >
                          <option value="">Nối tới nút</option>
                          {nodes.filter(n => n.id !== activeNode.id && n.id !== 'start').map(n => (
                            <option key={n.id} value={n.id}>{n.label}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- SCENARIO SIMULATOR VIEW (ChatGPT-Style layout, no phone frame) ---
  if (currentView === 'chatbot-scenario-test') {
    const activeChoices = getActiveChoices();

    return (
      <div className="animate-fade-in">
        {/* Top Header */}
        <div className="canvas-toolbar">
          <div className="flex align-center gap-4">
            <button className="back-btn" onClick={() => onNavigate('chatbot-scenarios')}>
              <ArrowLeft size={16} />
            </button>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Kiểm thử kịch bản giả lập</h2>
          </div>

          <div>
            {!isSimulatorRunning ? (
              <button className="btn btn-primary" onClick={startSimulation}>
                <Play size={14} fill="currentColor" /> Bắt đầu kiểm thử
              </button>
            ) : (
              <button className="btn btn-outline" style={{ color: 'red' }} onClick={() => {
                setIsSimulatorRunning(false);
                triggerToast('Đã dừng kịch bản giả lập', 'info');
              }}>
                Dừng kiểm thử
              </button>
            )}
          </div>
        </div>

        {/* Split screen layout */}
        <div className="simulator-layout">
          {/* Left side: Canvas flow visual */}
          <div className="canvas-container-outer" style={{ height: '100%' }}>
            <div ref={canvasRef} className="canvas-area" style={{ cursor: 'default' }}>
              <svg className="flow-svg-connections">
                {renderConnections()}
              </svg>

              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`canvas-node ${
                    currentNodeId === node.id ? 'active-highlight' : ''
                  } node-${node.type}`}
                  style={{ left: `${node.x}px`, top: `${node.y}px`, cursor: 'default' }}
                >
                  <div className="node-header">
                    <span>{node.type.toUpperCase()}</span>
                  </div>
                  <div className="node-body">
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{node.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {node.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side: ChatGPT Style Chat area (No phone mockup frame) */}
          <div className="chatgpt-mockup-container">
            <div className="chatgpt-header">
              <Bot size={18} />
              <span>Cửa sổ kiểm thử kịch bản (ChatGPT Mock)</span>
            </div>
            
            <div className="chatgpt-messages-area">
              {chatMessages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  <Sparkles size={36} style={{ margin: '0 auto 10px auto', color: 'var(--primary-light)' }} />
                  <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>Bắt đầu cuộc trò chuyện thử nghiệm</div>
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Nhấp vào nút "Bắt đầu kiểm thử" để kích hoạt cuộc gọi giả lập với Trợ lý AI y tế.</p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chatgpt-message-row ${msg.sender === 'bot' ? 'bot' : 'patient'}`}
                  >
                    <div className={`chatgpt-avatar-circle ${msg.sender === 'bot' ? 'chatgpt-avatar-bot' : 'chatgpt-avatar-patient'}`}>
                      {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="chatgpt-bubble">
                      {msg.text.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ChatGPT Pill Input box */}
            <div className="chatgpt-input-bar-container">
              {activeChoices && (
                <div className="quick-reply-options" style={{ marginBottom: '8px' }}>
                  {activeChoices.map((choice, i) => (
                    <button
                      key={i}
                      className="quick-reply-btn"
                      onClick={() => selectChoice(choice)}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}

              <div className="chatgpt-input-bar">
                <input
                  type="text"
                  placeholder={isSimulatorRunning ? "Hỏi trợ lý y khoa..." : "Nhấn bắt đầu kiểm thử để chat..."}
                  disabled={!isSimulatorRunning}
                  value={chatInputValue}
                  onChange={(e) => setChatInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendSimulatorMsg();
                  }}
                />
                <button
                  className="chatgpt-send-btn"
                  onClick={handleSendSimulatorMsg}
                  disabled={!isSimulatorRunning}
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
