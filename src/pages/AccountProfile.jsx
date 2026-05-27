import React, { useState, useEffect } from 'react';
import { Award, Mail, Phone, MapPin, Shield, Check, Calendar, Heart, Edit2, AlertCircle } from 'lucide-react';

export default function AccountProfile({ role, triggerToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // --- PATIENT SPECIFIC STATES ---
  const [originalPatientData, setOriginalPatientData] = useState({
    name: 'Lương Hương Giang',
    phone: '0123456789',
    dob: '05-05-2000',
    gender: 'Nữ',
    address: 'Cầu Giấy, Hà Nội',
    notes: 'Không có bệnh nền nghiêm trọng. Thỉnh thoảng bị cảm cúm theo mùa.',
    blood: 'O',
    height: 165,
    weight: 52
  });

  const convertDMYToYMD = (dmy) => {
    if (!dmy || !dmy.includes('-')) return dmy;
    const parts = dmy.split('-');
    if (parts.length === 3 && parts[0].length === 2) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dmy;
  };

  const convertYMDToDMY = (ymd) => {
    if (!ymd || !ymd.includes('-')) return ymd;
    const parts = ymd.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return ymd;
  };

  const [patientName, setPatientName] = useState(originalPatientData.name);
  const [patientPhone, setPatientPhone] = useState(originalPatientData.phone);
  const [patientDob, setPatientDob] = useState(convertDMYToYMD(originalPatientData.dob));
  const [patientGender, setPatientGender] = useState(originalPatientData.gender);
  const [patientAddress, setPatientAddress] = useState(originalPatientData.address);
  const [patientNotes, setPatientNotes] = useState(originalPatientData.notes);
  const [patientBlood, setPatientBlood] = useState(originalPatientData.blood);
  const [patientHeight, setPatientHeight] = useState(originalPatientData.height);
  const [patientWeight, setPatientWeight] = useState(originalPatientData.weight);

  const isPatientFieldModified = (field, currentVal) => {
    return originalPatientData[field] !== currentVal;
  };

  const handleSavePatientProfile = () => {
    const updated = {
      name: patientName,
      phone: patientPhone,
      dob: convertYMDToDMY(patientDob),
      gender: patientGender,
      address: patientAddress,
      notes: patientNotes,
      blood: patientBlood,
      height: patientHeight,
      weight: patientWeight
    };
    setOriginalPatientData(updated);
    setIsEditing(false);
    setIsSaved(true);
    if (triggerToast) {
      triggerToast('Đã lưu thay đổi thông tin tài khoản thành công!', 'success');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancelPatientEdit = () => {
    setPatientName(originalPatientData.name);
    setPatientPhone(originalPatientData.phone);
    setPatientDob(convertDMYToYMD(originalPatientData.dob));
    setPatientGender(originalPatientData.gender);
    setPatientAddress(originalPatientData.address);
    setPatientNotes(originalPatientData.notes);
    setPatientBlood(originalPatientData.blood);
    setPatientHeight(originalPatientData.height);
    setPatientWeight(originalPatientData.weight);
    setIsEditing(false);
    if (triggerToast) {
      triggerToast('Đã hủy bỏ các thay đổi', 'info');
    }
  };

  // --- OTHER ROLES STATES (EXPERT, MANAGER, DOCTOR) ---
  const [originalProfile, setOriginalProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialty: '',
    twoStep: true,
    notifications: {
      newError: false,
      weeklyReport: false,
      scenarioUpdate: false
    }
  });

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    specialty: '',
    twoStep: true,
    notifications: {
      newError: false,
      weeklyReport: false,
      scenarioUpdate: false
    }
  });

  const [twoStepVal, setTwoStepVal] = useState(true);

  useEffect(() => {
    let defaultProfile = {
      name: 'Mai Thùy Linh',
      email: 'linh.maithuy@mediconsult.vn',
      phone: '0987 654 321',
      address: 'Bệnh viện Đại học Y Hà Nội',
      specialty: 'Chuyên gia Tai Mũi Họng & Thẩm định AI',
      twoStep: true,
      notifications: {
        newError: true,
        weeklyReport: false,
        scenarioUpdate: true
      }
    };

    if (role === 'manager') {
      defaultProfile = {
        name: 'Nguyễn Nhật Linh',
        email: 'linh.nguyennhat@mediconsult.vn',
        phone: '0906 052 026',
        address: 'Phòng khám Đa khoa MediConsult',
        specialty: 'Quản trị nhân sự & Điều phối dịch vụ phòng khám',
        twoStep: true,
        notifications: {
          newError: true,
          weeklyReport: true,
          scenarioUpdate: false
        }
      };
    } else if (role === 'doctor') {
      defaultProfile = {
        name: 'Dương Gia Huy',
        email: 'huy.duonggia@mediconsult.vn',
        phone: '0977 889 900',
        address: 'Khoa Nội tổng quát - Phòng khám Đa khoa MediConsult',
        specialty: 'Bác sĩ chuyên khoa Nội tổng quát & Chẩn đoán hình ảnh',
        twoStep: true,
        notifications: {
          newError: true,
          weeklyReport: true,
          scenarioUpdate: false
        }
      };
    } else if (role === 'expert') {
      defaultProfile = {
        name: 'Mai Thùy Linh',
        email: 'linh.maithuy@mediconsult.vn',
        phone: '0987 654 321',
        address: 'Bệnh viện Đại học Y Hà Nội',
        specialty: 'Chuyên gia Tai Mũi Họng & Thẩm định AI',
        twoStep: true,
        notifications: {
          newError: true,
          weeklyReport: false,
          scenarioUpdate: true
        }
      };
    }

    setProfile(JSON.parse(JSON.stringify(defaultProfile)));
    setOriginalProfile(JSON.parse(JSON.stringify(defaultProfile)));
    setTwoStepVal(defaultProfile.twoStep);
    setIsEditing(false);
  }, [role]);

  const isProfileFieldModified = (field) => {
    if (field === 'twoStep') {
      return originalProfile.twoStep !== twoStepVal;
    }
    if (field.startsWith('notifications.')) {
      const subField = field.split('.')[1];
      return originalProfile.notifications[subField] !== profile.notifications[subField];
    }
    return originalProfile[field] !== profile[field];
  };

  const handleSaveProfile = () => {
    const updated = {
      ...profile,
      twoStep: twoStepVal
    };
    setOriginalProfile(JSON.parse(JSON.stringify(updated)));
    setProfile(JSON.parse(JSON.stringify(updated)));
    setIsEditing(false);
    setIsSaved(true);
    if (triggerToast) {
      triggerToast('Đã lưu thay đổi thông tin tài khoản thành công!', 'success');
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancelEdit = () => {
    setProfile(JSON.parse(JSON.stringify(originalProfile)));
    setTwoStepVal(originalProfile.twoStep);
    setIsEditing(false);
    if (triggerToast) {
      triggerToast('Đã hủy bỏ các thay đổi', 'info');
    }
  };

  // Dynamic BMI calculation: weight (kg) / (height (m) ^ 2)
  const bmi = patientHeight > 0 ? (patientWeight / ((patientHeight / 100) ** 2)).toFixed(1) : '0.0';

  // --- RENDER PATIENT ACCOUNT SETTINGS ---
  if (role === 'patient') {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: '700', color: 'var(--primary)' }}>
            Cài đặt tài khoản
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <Edit2 size={14} /> Chỉnh sửa thông tin
            </button>
          )}
        </div>
        
        {/* Double Column Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          
          {/* COLUMN 1: Basic Info & Health Notes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* THÔNG TIN CƠ BẢN */}
            <div className="card" style={{ margin: 0, padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
                Thông tin cơ bản
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Họ và tên</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className={`form-input ${isPatientFieldModified('name', patientName) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientName}</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Số điện thoại</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className={`form-input ${isPatientFieldModified('phone', patientPhone) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientPhone}</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Ngày sinh</span>
                  {isEditing ? (
                    <input
                      type="date"
                      value={patientDob}
                      onChange={(e) => setPatientDob(e.target.value)}
                      className={`form-input ${isPatientFieldModified('dob', patientDob) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{convertYMDToDMY(patientDob)}</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Giới tính</span>
                  {isEditing ? (
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className={`form-input ${isPatientFieldModified('gender', patientGender) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientGender}</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Vai trò</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-muted)' }}>Người dùng</div>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Địa chỉ</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      className={`form-input ${isPatientFieldModified('address', patientAddress) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientAddress}</div>
                  )}
                </div>
              </div>
            </div>

            {/* GHI CHÚ Y TẾ VÀ DỊ ỨNG */}
            <div className="card" style={{ margin: 0, padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
                Ghi chú y tế và dị ứng
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 10px 0', marginTop: '-10px' }}>
                Tiền sử dị ứng và ghi chú quan trọng
              </p>
              
              {isEditing ? (
                <textarea
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className={`form-input ${isPatientFieldModified('notes', patientNotes) ? 'input-modified' : 'input-unmodified'}`}
                  style={{ width: '100%', height: '80px', padding: '10px 12px', resize: 'none', lineHeight: '1.4', fontSize: '0.88rem' }}
                />
              ) : (
                <div style={{ fontSize: '0.9rem', lineHeight: '1.4', padding: '6px 0', color: 'var(--text-dark)', whiteSpace: 'pre-wrap' }}>{patientNotes}</div>
              )}
            </div>

          </div>

          {/* COLUMN 2: Health Indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* CHỈ SỐ SỨC KHỎE */}
            <div className="card" style={{ margin: 0, padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '16px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
                Chỉ số sức khỏe
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Nhóm máu</span>
                  {isEditing ? (
                    <select
                      value={patientBlood}
                      onChange={(e) => setPatientBlood(e.target.value)}
                      className={`form-input ${isPatientFieldModified('blood', patientBlood) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientBlood}</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Chiều cao (cm)</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={patientHeight}
                      onChange={(e) => setPatientHeight(Number(e.target.value))}
                      className={`form-input ${isPatientFieldModified('height', patientHeight) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientHeight} cm</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Cân nặng (kg)</span>
                  {isEditing ? (
                    <input
                      type="number"
                      value={patientWeight}
                      onChange={(e) => setPatientWeight(Number(e.target.value))}
                      className={`form-input ${isPatientFieldModified('weight', patientWeight) ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', height: '36px', padding: '6px 12px', fontSize: '0.88rem' }}
                    />
                  ) : (
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{patientWeight} kg</div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="form-group-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>BMI</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold', padding: '6px 0', color: 'var(--primary)' }}>{bmi}</div>
                </div>
              </div>
            </div>

            {/* Empty space card or help sheet */}
            <div className="card" style={{ margin: 0, padding: '20px', display: 'flex', gap: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <Heart size={24} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '4px' }}>Mách bạn:</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Giữ các chỉ số sức khỏe chiều cao, cân nặng được cập nhật thường xuyên sẽ giúp Trợ lý AI và Bác sĩ đưa ra phân tích thể trạng chính xác nhất cho bạn.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Action buttons bar (notification on the left, buttons on the right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            {isSaved && (
              <div className="flex align-center gap-2 animate-fade-in" style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>
                <Check size={16} /> Đã lưu thông tin tài khoản!
              </div>
            )}
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={handleCancelPatientEdit}
                className="btn btn-cancel animate-fade-in" 
                style={{ padding: '10px 32px', margin: 0 }}
              >
                Hủy bỏ
              </button>
              
              <button 
                type="button" 
                onClick={handleSavePatientProfile}
                className="btn btn-save animate-fade-in" 
                style={{ padding: '10px 36px', margin: 0 }}
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>

      </div>
    );
  }

  // --- RENDER ORIGINAL PROFILE DETAILS FOR OTHER ROLES (EXPERT, MANAGER, DOCTOR) ---
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
      <div className="flex flex-col gap-4" style={{ height: '100%', overflowY: 'auto', paddingRight: '4px' }}>
        {/* Profile details */}
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
              Thông tin cá nhân
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 16px', fontSize: '0.85rem' }}
              >
                <Edit2 size={14} /> Chỉnh sửa thông tin
              </button>
            )}
          </div>

          <div className="form-inputs-container">
            <div className="form-group">
              <span className="form-group-label">Họ và tên</span>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className={`form-input ${isProfileFieldModified('name') ? 'input-modified' : 'input-unmodified'}`}
                />
              ) : (
                <div style={{ fontSize: '0.9rem', fontWeight: '600', padding: '6px 0', color: 'var(--text-dark)' }}>{profile.name}</div>
              )}
            </div>

            <div className="form-group">
              <span className="form-group-label">Email công tác</span>
              <div style={{ position: 'relative' }}>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`form-input ${isProfileFieldModified('email') ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', paddingLeft: '40px' }}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                    <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <span className="form-group-label">Số điện thoại liên hệ</span>
              <div style={{ position: 'relative' }}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className={`form-input ${isProfileFieldModified('phone') ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', paddingLeft: '40px' }}
                    />
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                    <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <span className="form-group-label">Nơi công tác</span>
              <div style={{ position: 'relative' }}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className={`form-input ${isProfileFieldModified('address') ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', paddingLeft: '40px' }}
                    />
                    <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                    <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>{profile.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <span className="form-group-label">Chuyên môn học thuật / Quản trị</span>
              <div style={{ position: 'relative' }}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={profile.specialty}
                      onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
                      className={`form-input ${isProfileFieldModified('specialty') ? 'input-modified' : 'input-unmodified'}`}
                      style={{ width: '100%', paddingLeft: '40px' }}
                    />
                    <Award size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0' }}>
                    <Award size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-dark)' }}>{profile.specialty}</span>
                  </div>
                )}
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
              <input 
                type="checkbox" 
                checked={twoStepVal} 
                disabled={!isEditing}
                onChange={() => setTwoStepVal(!twoStepVal)}
                style={{ marginLeft: 'auto', width: '20px', height: '20px', cursor: isEditing ? 'pointer' : 'default' }} 
              />
              {isEditing && isProfileFieldModified('twoStep') && (
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold' }}>(Thay đổi)</span>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }} />

            <div className="form-group">
              <span className="form-group-label" style={{ marginBottom: '8px' }}>Đăng ký nhận Email hệ thống</span>
              <div className="flex flex-col gap-2">
                {role === 'expert' ? (
                  <>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.newError') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      <span>Thông báo ngay lập tức khi hội thoại AI bị khách hàng đánh giá 1 sao.</span>
                      {isEditing && isProfileFieldModified('notifications.newError') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.scenarioUpdate') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.scenarioUpdate}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, scenarioUpdate: !profile.notifications.scenarioUpdate }
                        })}
                      />
                      <span>Thông báo khi có yêu cầu chỉnh sửa kịch bản từ hội đồng y khoa.</span>
                      {isEditing && isProfileFieldModified('notifications.scenarioUpdate') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.weeklyReport') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      <span>Gửi báo cáo tổng hợp hiệu năng đàm thoại AI hàng tuần.</span>
                      {isEditing && isProfileFieldModified('notifications.weeklyReport') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                  </>
                ) : role === 'doctor' ? (
                  <>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.newError') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      <span>Thông báo khẩn cấp khi có ca hẹn khám mới hoặc yêu cầu tư vấn.</span>
                      {isEditing && isProfileFieldModified('notifications.newError') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.scenarioUpdate') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.scenarioUpdate}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, scenarioUpdate: !profile.notifications.scenarioUpdate }
                        })}
                      />
                      <span>Thông báo khi bệnh nhân gửi yêu cầu tư vấn khẩn cấp trong ca trực.</span>
                      {isEditing && isProfileFieldModified('notifications.scenarioUpdate') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.weeklyReport') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      <span>Gửi báo cáo tổng kết số lượt khám và đơn thuốc đã kê hàng tuần.</span>
                      {isEditing && isProfileFieldModified('notifications.weeklyReport') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                  </>
                ) : (
                  <>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.newError') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.newError}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, newError: !profile.notifications.newError }
                        })}
                      />
                      <span>Thông báo khi có ca trùng lịch của bác sĩ hoặc có lịch khám bị hủy.</span>
                      {isEditing && isProfileFieldModified('notifications.newError') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                    <label className="checkbox-label" style={{ cursor: isEditing ? 'pointer' : 'default', fontWeight: isProfileFieldModified('notifications.weeklyReport') ? '700' : 'normal' }}>
                      <input
                        type="checkbox"
                        checked={profile.notifications.weeklyReport}
                        disabled={!isEditing}
                        onChange={() => setProfile({
                          ...profile,
                          notifications: { ...profile.notifications, weeklyReport: !profile.notifications.weeklyReport }
                        })}
                      />
                      <span>Gửi báo cáo phân tích tài chính và doanh thu hàng tuần.</span>
                      {isEditing && isProfileFieldModified('notifications.weeklyReport') && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '4px' }}>(Thay đổi)</span>
                      )}
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons bar (notification on the left, buttons on the right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            {isSaved && (
              <div className="flex align-center gap-2 animate-fade-in" style={{ color: '#10b981', fontWeight: '600', fontSize: '0.9rem' }}>
                <Check size={16} /> Đã lưu thông tin tài khoản!
              </div>
            )}
          </div>

          {isEditing && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="btn btn-cancel animate-fade-in" 
                style={{ padding: '10px 32px', margin: 0 }}
              >
                Hủy bỏ
              </button>
              
              <button 
                type="button" 
                onClick={handleSaveProfile}
                className="btn btn-save animate-fade-in" 
                style={{ padding: '10px 36px', margin: 0 }}
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
