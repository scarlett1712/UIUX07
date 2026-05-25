import React from 'react';
import { HeartPulse, Building, Stethoscope, Award } from 'lucide-react';

export default function LandingPage({ onSelectRole }) {
  const roles = [
    {
      id: 'patient',
      title: 'Người cần tư vấn / khám bệnh',
      desc: 'Dành cho bệnh nhân cần tra cứu triệu chứng, tìm kiếm thông tin thuốc, liên hệ bác sĩ hoặc đặt lịch khám.',
      icon: HeartPulse,
    },
    {
      id: 'manager',
      title: 'Quản lý phòng khám',
      desc: 'Quản trị nhân sự, theo dõi lịch hẹn khám, điều phối bác sĩ và báo cáo tài chính của phòng khám.',
      icon: Building,
    },
    {
      id: 'doctor',
      title: 'Bác sĩ',
      desc: 'Quản lý danh sách bệnh nhân điều trị, chẩn đoán, xem hồ sơ bệnh án, kê đơn thuốc và tư vấn trực tiếp.',
      icon: Stethoscope,
    },
    {
      id: 'expert',
      title: 'Chuyên gia y tế',
      desc: 'Duyệt dữ liệu bệnh và thuốc, xây dựng kịch bản chatbot, kiểm duyệt và đánh giá chất lượng hội thoại AI.',
      icon: Award,
    },
  ];

  return (
    <div className="landing-container animate-fade-in">
      <div className="landing-header">
        <h1 className="landing-logo">
          <HeartPulse size={48} className="trend-up" style={{ animation: 'pulseGlow 2s infinite' }} />
          Medi<span>Consult</span>
        </h1>
        <p className="landing-subtitle">Hệ thống tư vấn y tế thông minh tích hợp Trợ lý ảo AI</p>
      </div>

      <h2 style={{ marginBottom: '32px', fontWeight: '500', color: 'var(--text-dark)' }}>
        Vui lòng chọn vai trò để tiếp tục
      </h2>

      <div className="role-grid">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className="role-card"
              onClick={() => onSelectRole(role.id)}
            >
              <div className="role-icon-wrapper">
                <Icon size={32} />
              </div>
              <h3 className="role-title">{role.title}</h3>
              <p className="role-desc">{role.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
