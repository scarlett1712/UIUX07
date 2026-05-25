import React, { useState, useEffect } from 'react';
import { Award, Mail, Phone, MapPin, Shield, Check } from 'lucide-react';

export default function AccountProfile({ role }) {
  const [profile, setProfile] = useState({
    name: 'Mai Thùy Linh',
    email: 'linh.maithuy@mediconsult.vn',
    phone: '0987 654 321',
    address: 'Bệnh viện Đại học Y Hà Nội',
    specialty: 'Chuyên gia Tai Mũi Họng & Thẩm định AI',
    notifications: {
      newError: true,
      weeklyReport: false,
      scenarioUpdate: true
    }
  });

  useEffect(() => {
    if (role === 'manager') {
      setProfile({
        name: 'Nguyễn Nhật Linh',
        email: 'linh.nguyennhat@mediconsult.vn',
        phone: '0906 052 026',
        address: 'Phòng khám Đa khoa MediConsult',
        specialty: 'Quản trị nhân sự & Điều phối dịch vụ phòng khám',
        notifications: {
          newError: true,
          weeklyReport: true,
          scenarioUpdate: false
        }
      });
    } else if (role === 'doctor') {
      setProfile({
        name: 'Dương Gia Huy',
        email: 'huy.duonggia@mediconsult.vn',
        phone: '0977 889 900',
        address: 'Khoa Nội tổng quát - Phòng khám Đa khoa MediConsult',
        specialty: 'Bác sĩ chuyên khoa Nội tổng quát & Chẩn đoán hình ảnh',
        notifications: {
          newError: true,
          weeklyReport: true,
          scenarioUpdate: false
        }
      });
    } else {
      setProfile({
        name: 'Mai Thùy Linh',
        email: 'linh.maithuy@mediconsult.vn',
        phone: '0987 654 321',
        address: 'Bệnh viện Đại học Y Hà Nội',
        specialty: 'Chuyên gia Tai Mũi Họng & Thẩm định AI',
        notifications: {
          newError: true,
          weeklyReport: false,
          scenarioUpdate: true
        }
      });
    }
  }, [role]);

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="profile-container animate-fade-in">
      {/* Left side info card */}
      <div className="profile-sidebar">
        <div className="profile-large-avatar">
          {role === 'expert' ? (
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="50" fill="#fbcfe8" />
              <circle cx="50" cy="40" r="20" fill="#db2777" />
              <path d="M20,80 C20,60 80,60 80,80" fill="#db2777" />
            </svg>
          ) : role === 'doctor' ? (
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="50" fill="#e0f2fe" />
              <circle cx="50" cy="40" r="20" fill="#0284c7" />
              <path d="M20,80 C20,60 80,60 80,80" fill="#0284c7" />
            </svg>
          ) : (
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              <circle cx="50" cy="50" r="50" fill="#fef3c7" />
              <circle cx="50" cy="40" r="20" fill="#d97706" />
              <path d="M20,80 C20,60 80,60 80,80" fill="#d97706" />
            </svg>
          )}
        </div>
        <div className="profile-username">{profile.name}</div>
        <div className="profile-user-role">
          {role === 'expert' ? 'Chuyên gia Y tế' : role === 'doctor' ? 'Bác sĩ chuyên khoa' : 'Quản lý phòng khám'}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
          {role === 'expert'
            ? 'Mã số chứng chỉ hành nghề: CCHN-17122023'
            : role === 'doctor'
            ? 'Mã số chứng chỉ hành nghề: CCHN-09778899'
            : 'Mã số quản lý: MSQL-20236039'}
        </div>

        {role === 'expert' ? (
          <div className="profile-stats-mini">
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">12</span>
              <span className="profile-stat-label">Kịch bản vẽ</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">86</span>
              <span className="profile-stat-label">Bệnh đã duyệt</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">45</span>
              <span className="profile-stat-label">Đánh giá AI</span>
            </div>
          </div>
        ) : role === 'doctor' ? (
          <div className="profile-stats-mini">
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">8</span>
              <span className="profile-stat-label">Ca trực tháng</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">142</span>
              <span className="profile-stat-label">Đã khám</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">120</span>
              <span className="profile-stat-label">Đơn thuốc kê</span>
            </div>
          </div>
        ) : (
          <div className="profile-stats-mini">
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">14</span>
              <span className="profile-stat-label">Lịch trực</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">27</span>
              <span className="profile-stat-label">Hẹn duyệt</span>
            </div>
            <div style={{ width: '1px', backgroundColor: 'var(--border-color)' }} />
            <div className="profile-stat-item-mini">
              <span className="profile-stat-number">15</span>
              <span className="profile-stat-label">Nhắc lịch</span>
            </div>
          </div>
        )}
      </div>

      {/* Right side forms and configurations */}
      <div className="flex flex-col gap-4">
        {/* Profile details */}
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
            Thông tin cá nhân
          </h3>

          <div className="form-inputs-container">
            <div className="form-group">
              <span className="form-group-label">Họ và tên</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <span className="form-group-label">Email công tác</span>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <span className="form-group-label">Số điện thoại liên hệ</span>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group">
              <span className="form-group-label">Nơi công tác</span>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-group-label">Chuyên môn học thuật / Quản trị</span>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={profile.specialty}
                  onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '40px' }}
                />
                <Award size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Security & System Notifications settings */}
        <div className="card" style={{ margin: 0 }}>
          <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
            Thiết lập bảo mật & Nhận thông báo
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="flex align-center gap-4">
              <Shield size={20} style={{ color: 'var(--primary-light)' }} />
              <div>
                <strong>Chế độ phê duyệt hai bước</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Yêu cầu mật khẩu xác thực OTP khi thay đổi các cấu hình hệ thống ảnh hưởng diện rộng.
                </p>
              </div>
              <input type="checkbox" defaultChecked style={{ marginLeft: 'auto', width: '20px', height: '20px' }} />
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} />

            <div className="form-group">
              <span className="form-group-label" style={{ marginBottom: '8px' }}>Đăng ký nhận Email hệ thống</span>
              <div className="flex flex-col gap-2">
                {role === 'expert' ? (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      Thông báo ngay lập tức khi hội thoại AI bị khách hàng đánh giá 1 sao.
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.scenarioUpdate}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, scenarioUpdate: !profile.notifications.scenarioUpdate }
                        })}
                      />
                      Thông báo khi có yêu cầu chỉnh sửa kịch bản từ hội đồng y khoa.
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      Gửi báo cáo tổng hợp hiệu năng đàm thoại AI hàng tuần.
                    </label>
                  </>
                ) : role === 'doctor' ? (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      Thông báo khẩn cấp khi có ca hẹn khám mới hoặc yêu cầu tư vấn.
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.scenarioUpdate}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, scenarioUpdate: !profile.notifications.scenarioUpdate }
                        })}
                      />
                      Thông báo khi bệnh nhân gửi yêu cầu tư vấn khẩn cấp trong ca trực.
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      Gửi báo cáo tổng kết số lượt khám và đơn thuốc đã kê hàng tuần.
                    </label>
                  </>
                ) : (
                  <>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      Thông báo khi có ca trùng lịch của bác sĩ hoặc có lịch khám bị hủy.
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      Gửi báo cáo phân tích tài chính và doanh thu hàng tuần.
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-4" style={{ marginTop: '10px' }}>
          {isSaved && (
            <div className="flex align-center gap-2" style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>
              <Check size={16} /> Đã lưu thông tin tài khoản!
            </div>
          )}
          <button className="btn btn-primary animate-pulse" onClick={handleSaveProfile} style={{ padding: '12px 32px' }}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
