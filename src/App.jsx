import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MedicalData from './pages/MedicalData';
import ChatbotScenarios from './pages/ChatbotScenarios';
import AIEvaluation, { INITIAL_CONVERSATIONS } from './pages/AIEvaluation';
import AccountProfile from './pages/AccountProfile';
import { 
  SC001_NODES, SC001_CONNECTIONS, 
  SC002_NODES, SC002_CONNECTIONS, 
  SC003_NODES, SC003_CONNECTIONS 
} from './data/scenarioMockData';

// Import Manager pages
import ManagerDashboard from './pages/ManagerDashboard';
import ClinicManagement from './pages/ClinicManagement';
import DoctorCoordinator from './pages/DoctorCoordinator';
import ReminderAlerts from './pages/ReminderAlerts';
import ReportAnalytics from './pages/ReportAnalytics';

// Import Doctor pages
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorMessages from './pages/DoctorMessages';
import DoctorMedicalRecords from './pages/DoctorMedicalRecords';
import DoctorMedicines from './pages/DoctorMedicines';

// Import Patient pages
import PatientDashboard from './pages/PatientDashboard';
import PatientConsultation from './pages/PatientConsultation';
import PatientSchedule from './pages/PatientSchedule';
import PatientMedicalData from './pages/PatientMedicalData';

import { CheckCircle2, AlertTriangle, Info, Bot, Maximize2, MessageCircle } from 'lucide-react';

// Initial Mock Diseases
const INITIAL_DISEASES = [
  {
    id: 'D001',
    name: 'Cảm lạnh',
    desc: 'Nhiễm virus đường hô hấp trên, thường tự khỏi sau vài ngày.',
    danger: 'Thấp',
    department: 'Tai Mũi Họng',
    symptoms: [
      { stt: 1, name: 'Sốt mũi', desc: 'Chảy nước mũi liên tục, có thể trong hoặc đặc', duration: 'Ngày 1-3 của bệnh', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Hắt hơi', desc: 'Hắt hơi nhiều, nhất là giai đoạn đầu', duration: 'Ngày 1-2', frequency: 'Thường xuyên' },
      { stt: 3, name: 'Đau họng', desc: 'Rát họng, khó chịu khi nuốt', duration: 'Ngày 1-2', frequency: 'Trung bình' },
      { stt: 4, name: 'Ho nhẹ', desc: 'Ho khan hoặc ít đờm, xuất hiện sau', duration: 'Ngày 2-4', frequency: 'Thỉnh thoảng' }
    ]
  },
  {
    id: 'D002',
    name: 'Cúm',
    desc: 'Nhiễm virus cúm cấp tính, có thể gây sốt cao, đau đầu và mệt mỏi toàn thân.',
    danger: 'Trung bình',
    department: 'Nội tổng quát',
    symptoms: [
      { stt: 1, name: 'Sốt cao', desc: 'Sốt đột ngột từ 38.5 độ C trở lên', duration: 'Ngày 1-4', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Đau cơ', desc: 'Đau nhức các cơ khớp, mệt mỏi rã rời', duration: 'Ngày 1-5', frequency: 'Thường xuyên' },
      { stt: 3, name: 'Mệt mỏi', desc: 'Kiệt sức, không muốn ăn uống vận động', duration: 'Ngày 1-7', frequency: 'Thường xuyên' }
    ]
  },
  {
    id: 'D003',
    name: 'Viêm phổi',
    desc: 'Nhiễm trùng phế nang phổi do vi khuẩn, virus hoặc nấm gây ra, dẫn đến ho có đờm, sốt.',
    danger: 'Cao',
    department: 'Hô hấp',
    symptoms: [
      { stt: 1, name: 'Ho nặng tiếng', desc: 'Ho sâu từ ngực, có đờm xanh hoặc vàng đục', duration: 'Suốt thời gian bệnh', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Khó thở', desc: 'Thở khò khè, hụt hơi khi đi lại, tức ngực khi ho', duration: 'Ngày 2 trở đi', frequency: 'Thường xuyên' },
      { stt: 3, name: 'Sốt cao', desc: 'Sốt lạnh run kèm theo vã mồ hôi', duration: 'Ngày 1-5', frequency: 'Trung bình' }
    ]
  },
  {
    id: 'D004',
    name: 'Tiểu đường',
    desc: 'Rối loạn chuyển hóa glucose trong máu do thiếu hụt insulin hoặc đề kháng insulin kéo dài.',
    danger: 'Cao',
    department: 'Nội tiết',
    symptoms: [
      { stt: 1, name: 'Khát nước', desc: 'Cảm giác khô miệng, khát nước liên tục dù uống nhiều', duration: 'Mạn tính', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Tiểu nhiều', desc: 'Đặc biệt là đi tiểu nhiều vào ban đêm', duration: 'Mạn tính', frequency: 'Thường xuyên' }
    ]
  },
  {
    id: 'D005',
    name: 'Tăng huyết áp',
    desc: 'Huyết áp cao kéo dài, có thể dẫn đến nguy cơ đột quỵ hoặc suy tim nếu không kiểm soát.',
    danger: 'Cao',
    department: 'Tim mạch',
    symptoms: [
      { stt: 1, name: 'Đau đầu', desc: 'Đau nhức ê ẩm vùng chẩm (sau gáy) vào sáng sớm', duration: 'Thường xuyên', frequency: 'Trung bình' },
      { stt: 2, name: 'Đau đầu', desc: 'Hoa mắt, chóng mặt khi đứng lên ngồi xuống', duration: 'Thỉnh thoảng', frequency: 'Thỉnh thoảng' }
    ]
  },
  {
    id: 'D006',
    name: 'Viêm dạ dày',
    desc: 'Tổn thương niêm mạc dạ dày gây đau thượng vị, đầy hơi, ợ chua.',
    danger: 'Trung bình',
    department: 'Tiêu hóa',
    symptoms: [
      { stt: 1, name: 'Đau bụng', desc: 'Đau tức vùng thượng vị (trên rốn), đau tăng khi đói hoặc quá no', duration: 'Sau ăn 1-2 tiếng', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Phát ban', desc: 'Buồn nôn, ợ hơi chua gây rát cổ họng', duration: 'Mỗi ngày', frequency: 'Thường xuyên' }
    ]
  },
  {
    id: 'D007',
    name: 'Sốt xuất huyết',
    desc: 'Bệnh truyền nhiễm cấp tính do virus Dengue truyền qua muỗi vằn, có thể gây nguy hiểm.',
    danger: 'Cao',
    department: 'Truyền nhiễm',
    symptoms: [
      { stt: 1, name: 'Sốt cao', desc: 'Sốt cao liên tục 39-40 độ C, khó hạ sốt bằng thuốc', duration: 'Ngày 1-5', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Phát ban', desc: 'Xuất hiện các chấm xuất huyết dưới da, chảy máu cam', duration: 'Ngày 3-7', frequency: 'Trung bình' }
    ]
  },
  {
    id: 'D008',
    name: 'Sởi',
    desc: 'Bệnh truyền nhiễm cấp tính do virus sởi gây ra, phổ biến ở trẻ em.',
    danger: 'Trung bình',
    department: 'Truyền nhiễm',
    symptoms: [
      { stt: 1, name: 'Sốt', desc: 'Sốt nhẹ đến trung bình, sau đó sốt cao', duration: 'Ngày 1-4', frequency: 'Thường xuyên' },
      { stt: 2, name: 'Phát ban', desc: 'Ban đỏ dạng sẩn từ sau tai lan ra mặt và toàn thân', duration: 'Ngày 4-7', frequency: 'Thường xuyên' },
      { stt: 3, name: 'Đỏ mắt', desc: 'Viêm kết mạc đỏ mắt, sợ ánh sáng, chảy nước mắt', duration: 'Ngày 1-5', frequency: 'Trung bình' }
    ]
  }
];

// Initial Mock Medicines
const INITIAL_MEDICINES = [
  {
    id: 'M001',
    name: 'Paracetamol 500mg',
    desc: 'Thuốc hạ sốt và giảm các cơn đau từ nhẹ đến trung bình.',
    activeIngredient: 'Paracetamol',
    indication: 'Hạ sốt do mọi nguyên nhân, giảm đau đầu, đau răng, đau cơ khớp do cảm cúm.',
    contraindication: 'Bệnh nhân mẫn cảm với Paracetamol, suy gan nặng, thiếu hụt men G6PD.',
    dosage: 'Người lớn: 1-2 viên/lần, cách nhau 4-6 giờ. Tối đa 8 viên/ngày.',
    sideEffects: 'Mẩn ngứa da, tăng men gan khi sử dụng liều cao kéo dài.'
  },
  {
    id: 'M002',
    name: 'Amoxicillin 500mg',
    desc: 'Kháng sinh nhóm penicillin điều trị nhiễm khuẩn nhạy cảm.',
    activeIngredient: 'Amoxicillin',
    indication: 'Nhiễm khuẩn đường hô hấp trên (viêm họng, viêm xoang), hô hấp dưới (viêm phế quản), nhiễm khuẩn da.',
    contraindication: 'Dị ứng với kháng sinh nhóm Beta-lactam (Penicillin, Cephalosporin).',
    dosage: 'Người lớn: 1 viên/lần, ngày 3 lần. Uống sau ăn.',
    sideEffects: 'Tiêu chảy nhẹ, mẩn đỏ da, buồn nôn.'
  },
  {
    id: 'M003',
    name: 'Ibuprofen 400mg',
    desc: 'Thuốc kháng viêm không steroid (NSAID) giảm đau, hạ sốt.',
    activeIngredient: 'Ibuprofen',
    indication: 'Giảm đau xương khớp, đau răng, đau bụng kinh, hạ sốt khi dùng Paracetamol không hiệu quả.',
    contraindication: 'Loét dạ dày tá tràng tiến triển, suy thận nặng, dị ứng với Aspirin.',
    dosage: 'Người lớn: 1 viên/lần, ngày 2-3 lần. Uống ngay sau khi ăn no.',
    sideEffects: 'Kích ứng dạ dày, ợ chua, nhức đầu.'
  },
  {
    id: 'M004',
    name: 'Metformin 850mg',
    desc: 'Thuốc điều trị đái tháo đường đường uống nhóm Biguanide.',
    activeIngredient: 'Metformin',
    indication: 'Điều trị đái tháo đường tuýp 2 khi chế độ ăn uống và tập luyện không kiểm soát được đường huyết.',
    contraindication: 'Suy gan, suy thận nặng, nhiễm toan ceton cấp tính.',
    dosage: 'Uống 1 viên/ngày vào bữa ăn sáng. Có thể tăng liều theo chỉ định bác sĩ.',
    sideEffects: 'Đầy hơi, chướng bụng, rối loạn tiêu hóa nhẹ khi mới bắt đầu dùng.'
  },
  {
    id: 'M005',
    name: 'Amlodipine 5mg',
    desc: 'Thuốc hạ huyết áp nhóm chẹn kênh calci.',
    activeIngredient: 'Amlodipine',
    indication: 'Điều trị tăng huyết áp vô căn, dự phòng đau thắt ngực ổn định.',
    contraindication: 'Huyết áp quá thấp (suy tim mất bù, sốc tim).',
    dosage: 'Uống 1 viên/ngày vào một giờ cố định (thường là sáng sớm).',
    sideEffects: 'Phù cổ chân, đau đầu nhẹ, đỏ bừng mặt.'
  }
];

const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Initial Mock Appointments
const INITIAL_APPOINTMENTS = [
  // Today's appointments (May 26, 2026) for Bs. Huy
  {
    id: 'APT001',
    patientName: 'Đỗ Minh Tú',
    patientId: 'P001',
    patient: 'Đỗ Minh Tú',
    name: 'Đỗ Minh Tú',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(0), // Today
    time: '11:30 - 12:30',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Đau bụng âm ỉ vùng hố chậu phải',
    symptom: 'Đau bụng âm ỉ vùng hố chậu phải',
    fullSymptom: 'Đau bụng âm ỉ vùng hố chậu phải kéo dài',
    gender: 'Nam',
    dob: '12-04-1995',
    phone: '0987654321'
  },
  {
    id: 'APT002',
    patientName: 'Nguyễn Minh Anh',
    patientId: 'P002',
    patient: 'Nguyễn Minh Anh',
    name: 'Nguyễn Minh Anh',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(0), // Today
    time: '10:00 - 11:00',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Sốt nhẹ, đau họng',
    symptom: 'Sốt nhẹ, đau họng',
    fullSymptom: 'Sốt nhẹ, đau họng nhiều ngày',
    gender: 'Nữ',
    dob: '25-08-2000',
    phone: '0912345678'
  },
  // Tomorrow's appointments (May 27, 2026) for Bs. Huy
  {
    id: 'APT003',
    patientName: 'Văn Thị Trinh',
    patientId: 'P003',
    patient: 'Văn Thị Trinh',
    name: 'Văn Thị Trinh',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(1), // Tomorrow
    time: '14:00 - 15:00',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Mỏi mắt, nhức đầu',
    symptom: 'Mỏi mắt, nhức đầu',
    fullSymptom: 'Mỏi mắt, nhức đầu kéo dài',
    gender: 'Nữ',
    dob: '05-11-1988',
    phone: '0905554433'
  },
  // Other days (May 7, May 9, May 11, May 14) for Bs. Huy to sync with existing mock schedule
  {
    id: 'APT005',
    patientName: 'Ngô Gia Bảo',
    patientId: 'P005',
    patient: 'Ngô Gia Bảo',
    name: 'Ngô Gia Bảo',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(-19), // May 7
    time: '8:00 - 9:00',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Đau đầu, chóng mặt nhiều ngày',
    symptom: 'Đau đầu, chóng mặt nhiều ngày',
    fullSymptom: 'Đau đầu, chóng mặt nhiều ngày, buồn nôn nhẹ',
    gender: 'Nam',
    dob: '18-06-2015',
    phone: '0977889900'
  },
  {
    id: 'APT006',
    patientName: 'Lê Hải Minh',
    patientId: 'P006',
    patient: 'Lê Hải Minh',
    name: 'Lê Hải Minh',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(-17), // May 9
    time: '9:00 - 10:00',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Mỏi mắt, khô mắt',
    symptom: 'Mỏi mắt, khô mắt',
    fullSymptom: 'Mỏi mắt, nhức mỏi cơ và khô giác mạc nhẹ',
    gender: 'Nam',
    dob: '14-03-1992',
    phone: '0901223344'
  },
  {
    id: 'APT007',
    patientName: 'Trần Phương Huế',
    patientId: 'P007',
    patient: 'Trần Phương Huế',
    name: 'Trần Phương Huế',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(-12), // May 14
    time: '15:00 - 16:00',
    specialty: 'Ngoại tổng quát',
    status: 'Đã xác nhận',
    fee: '350.000',
    symptoms: 'Đau bụng thượng vị',
    symptom: 'Đau bụng thượng vị',
    fullSymptom: 'Đau tức vùng bụng thượng vị âm ỉ kéo dài',
    gender: 'Nữ',
    dob: '02-09-1985',
    phone: '0933456789'
  },
  // Pending appointments (Chờ xác nhận / Đang xử lý) to show in Doctor's pending list and dashboard count
  {
    id: 'APT008',
    patientName: 'Vũ Anh Long',
    patientId: 'P008',
    patient: 'Vũ Anh Long',
    name: 'Vũ Anh Long',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(2), // May 28
    time: '8:00 - 9:00',
    specialty: 'Ngoại tổng quát',
    status: 'Chờ xác nhận',
    fee: '350.000',
    symptoms: 'Đau tai, chảy dịch',
    symptom: 'Đau tai, chảy dịch',
    fullSymptom: 'Đau tai phải từ hôm qua, có dịch mủ vàng chảy ra kèm sốt nhẹ',
    gender: 'Nam',
    dob: '10-10-1990',
    phone: '0981112222'
  },
  {
    id: 'APT009',
    patientName: 'Lương Hương Giang',
    patientId: 'P004',
    patient: 'Lương Hương Giang',
    name: 'Lương Hương Giang',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(3), // May 29
    time: '9:00 - 10:00',
    specialty: 'Ngoại tổng quát',
    status: 'Chờ xác nhận',
    fee: '350.000',
    symptoms: 'Sốt cao, ho khan',
    symptom: 'Sốt cao, ho khan',
    fullSymptom: 'Sốt nóng lạnh 39 độ C kèm ho khan tức ngực',
    gender: 'Nữ',
    dob: '05-05-2000',
    phone: '0123456789'
  },
  {
    id: 'APT010',
    patientName: 'Phan Quốc Bảo',
    patientId: 'P010',
    patient: 'Phan Quốc Bảo',
    name: 'Phan Quốc Bảo',
    doctorName: 'Bs. Huy',
    date: getRelativeDate(4), // May 30
    time: '14:00 - 15:00',
    specialty: 'Ngoại tổng quát',
    status: 'Chờ xác nhận',
    fee: '350.000',
    symptoms: 'Ù tai lâu ngày',
    symptom: 'Ù tai lâu ngày',
    fullSymptom: 'Ù tai trái kéo dài hơn 1 tuần, nghe kém',
    gender: 'Nam',
    dob: '12-12-1993',
    phone: '0979888777'
  },
  // Other doctors' appointments
  {
    id: 'APT011',
    patientName: 'Lê Hải Minh',
    patientId: 'P006',
    patient: 'Lê Hải Minh',
    name: 'Lê Hải Minh',
    doctorName: 'BS. Nguyễn Văn B',
    date: getRelativeDate(0),
    time: '9:00 - 10:00',
    specialty: 'Khoa Nội tổng quát',
    status: 'Đã xác nhận',
    fee: '300.000',
    symptoms: 'Mỏi mắt nhức vai',
    symptom: 'Mỏi mắt nhức vai',
    fullSymptom: 'Mỏi mắt nhức vai gáy',
    gender: 'Nam',
    dob: '14-03-1992',
    phone: '0901223344'
  },
  {
    id: 'APT012',
    patientName: 'Văn Thị Trinh',
    patientId: 'P003',
    patient: 'Văn Thị Trinh',
    name: 'Văn Thị Trinh',
    doctorName: 'Bs. C',
    date: getRelativeDate(0),
    time: '14:00 - 15:00',
    specialty: 'Tai mũi họng',
    status: 'Đang xử lý',
    fee: '400.000',
    symptoms: 'Nghẹt mũi, ù tai trái',
    symptom: 'Nghẹt mũi, ù tai trái',
    fullSymptom: 'Nghẹt mũi, ù tai trái nhiều ngày',
    gender: 'Nữ',
    dob: '05-11-1988',
    phone: '0905554433'
  }
];

// Initial Mock Patients Database
const INITIAL_PATIENTS = [
  { id: 'P001', name: 'Đỗ Minh Tú', dob: '12-04-1995', gender: 'Nam', phone: '0987654321', email: 'tu.do@gmail.com', address: 'Ba Đình, Hà Nội', insurance: 'GD4019929831', medicalHistory: [
    { date: '12-04-2026', diagnosis: 'Đau dạ dày nhẹ', doctor: 'Bs. Huy', treatment: 'Khám lâm sàng, kê đơn giảm tiết acid dịch vị.' },
    { date: '10-02-2026', diagnosis: 'Viêm họng cấp', doctor: 'Bs. Huy', treatment: 'Súc họng nước muối ấm, uống siro ho thảo dược.' }
  ] },
  { id: 'P002', name: 'Nguyễn Minh Anh', dob: '25-08-2000', gender: 'Nữ', phone: '0912345678', email: 'anh.nguyen@gmail.com', address: 'Hải Châu, Đà Nẵng', insurance: 'DN4012030192', medicalHistory: [
    { date: '15-03-2026', diagnosis: 'Cảm cúm mùa', doctor: 'Bs. Huy', treatment: 'Paracetamol 500mg (10 viên) - Uống khi sốt; Amoxicillin 500mg (15 viên) - Ngày 3 viên uống sau ăn.' },
    { date: '28-12-2025', diagnosis: 'Rối loạn tiêu hóa', doctor: 'Bs. Huy', treatment: 'Bổ sung men vi sinh Probiotics, Oresol uống bù nước khi cần.' }
  ] },
  { id: 'P003', name: 'Văn Thị Trinh', dob: '05-11-1988', gender: 'Nữ', phone: '0905554433', email: 'trinh.van@gmail.com', address: 'Quận 1, TP HCM', insurance: '', medicalHistory: [
    { date: '01-05-2026', diagnosis: 'Viêm mũi dị ứng', doctor: 'Bs. C', treatment: 'Thuốc xịt mũi Corticoid, kháng histamin Loratadine 10mg trong 7 ngày.' },
    { date: '14-11-2025', diagnosis: 'Viêm phế quan nhẹ', doctor: 'Bs. Huy', treatment: 'Uống thuốc ho thảo dược, kháng viêm Alphachymotrypsin.' }
  ] },
  { id: 'P004', name: 'Lương Hương Giang', dob: '05-05-2000', gender: 'Nữ', phone: '0123456789', email: 'giang.luong@gmail.com', address: 'Cầu Giấy, Hà Nội', insurance: 'HN4015052000', medicalHistory: [
    { date: '22-04-2026', diagnosis: 'Viêm dạ dày cấp', doctor: 'Bs. Huy', treatment: 'Thuốc giảm tiết acid dịch vị (Esomeprazole 20mg), kiêng ăn đồ chua cay nóng.' },
    { date: '05-02-2026', diagnosis: 'Cảm cúm thông thường', doctor: 'BS. Nguyễn Văn B', treatment: 'Nghỉ ngơi tĩnh dưỡng, uống nhiều nước ấm, súc họng nước muối sinh lý.' }
  ] }
];

// Initial Mock Doctors
const INITIAL_DOCTORS = [
  { id: 'DOC001', name: 'Bs. Huy', specialty: 'Ngoại tổng quát', phone: '0966112233', email: 'huy.ngoai@mediconsult.vn', status: 'Đang làm việc', degree: 'Thạc sĩ Bác sĩ', biography: 'Hơn 10 năm kinh nghiệm phẫu thuật ngoại khoa và nội soi tiêu hóa tại bệnh viện Bạch Mai.' },
  { id: 'DOC002', name: 'BS. Nguyễn Văn B', specialty: 'Khoa Nội tổng quát', phone: '0977223344', email: 'binh.nhi@mediconsult.vn', status: 'Đang làm việc', degree: 'Thạc sĩ Bác sĩ', biography: 'Hơn 10 năm kinh nghiệm khám chữa bệnh nội tổng quát tại bệnh viện Bạch Mai.' },
  { id: 'DOC003', name: 'Bs. C', specialty: 'Tai mũi họng', phone: '0988334455', email: 'cuc.tmh@mediconsult.vn', status: 'Đang làm việc', degree: 'Bác sĩ chuyên khoa II', biography: 'Chuyên gia điều trị các bệnh lý đường hô hấp trên, viêm tai giữa trẻ em.' }
];

// Initial Mock Reminders
const INITIAL_REMINDERS = [
  { id: 'REM001', title: 'Nhắc lịch trước 1 ngày', target: 'Bệnh nhân', time: 'Trước 1 ngày 08:00', channel: 'SMS', status: 'Đang hoạt động', messageContent: 'MediConsult nhắc: Lịch khám của quý khách với [Tên bác sĩ] vào ngày mai lúc [Giờ khám]. Vui lòng đến trước 10 phút.' },
  { id: 'REM002', title: 'Nhắc lịch trước 2 giờ', target: 'Bệnh nhân', time: 'Trước 2 giờ 08:00', channel: 'App', status: 'Đang hoạt động', messageContent: 'Lịch khám sắp tới! Lịch hẹn của bạn sẽ bắt đầu sau 2 giờ.' },
  { id: 'REM003', title: 'Nhắc lịch trước 30 phút', target: 'Bệnh nhân', time: 'Trước 30 phút 09:30', channel: 'App', status: 'Đang hoạt động', messageContent: 'Bạn có lịch hẹn sau 30 phút tại MediConsult. Vui lòng check-in tại quầy đón tiếp.' },
  { id: 'REM004', title: 'Nhắc tái khám', target: 'Bệnh nhân', time: 'Theo ngày tái khám 09:00', channel: 'SMS', status: 'Tạm dừng', messageContent: 'MediConsult nhắc: Đến lịch hẹn tái khám của quý khách. Liên hệ 19006039 để đặt lịch.' },
  { id: 'REM005', title: 'Nhắc ca trực ngày mai', target: 'Bác sĩ', time: 'Trước 1 ngày 17:00', channel: 'App', status: 'Đang hoạt động', messageContent: 'Thông báo ca trực ngày mai: Bác sĩ có lịch trực ca ngày mai từ [Giờ khám].' },
  { id: 'REM006', title: 'Chúc mừng sinh nhật', target: 'Bệnh nhân', time: 'Đúng ngày 08:00', channel: 'SMS', status: 'Đang hoạt động', messageContent: 'Chúc mừng sinh nhật quý khách! MediConsult kính chúc quý khách nhiều sức khỏe và hạnh phúc.' },
  { id: 'REM007', title: 'Nhắc tái khám', target: 'Bệnh nhân', time: 'Theo ngày tái khám 09:00', channel: 'SMS', status: 'Đang hoạt động', messageContent: 'Nhắc lịch hẹn tái khám định kỳ.' }
];

// Initial Mock Patient Conversations
const INITIAL_PATIENT_CONVS = [
  {
    id: 'PCONV001',
    topic: 'Triệu chứng sốt, đau đầu, ho',
    date: 'Hôm nay 21:50',
    status: 'Đang tư vấn',
    messages: [
      { sender: 'bot', text: 'Chào bạn, tôi là Trợ lý sức khỏe AI. Bạn đang gặp vấn đề gì về sức khỏe?', time: '21:50 pm' },
      { sender: 'patient', text: 'Mình bị sốt từ hôm qua, người mệt mỏi với đau đầu khá rõ. Hôm nay vẫn chưa đỡ, còn đau họng với hơi ho.', time: '21:57 pm' },
      { sender: 'bot', text: 'Bạn đã đo nhiệt độ chưa, khoảng bao nhiêu độ? Ngoài ra có bị ớn lạnh hay đau nhức người không?', time: '21:58 pm' },
      { sender: 'patient', text: 'Sốt khoảng gần 39 độ, có ớn lạnh với đau người. Người khá mệt, ăn uống cũng kém.', time: '22:15 pm' },
      { sender: 'bot', text: 'Triệu chứng của bạn có thể liên quan đến cúm hoặc nhiễm virus đường hô hấp hô hấp. Do sốt cao và kéo dài, bạn nên đi khám để được kiểm tra và điều trị phù hợp. \n\nĐể hỗ trợ bạn tốt nhất, tôi khuyên bạn nên **Đặt lịch khám trực tiếp** tại phòng khám hoặc đăng ký **Tư vấn chuyên sâu trực tuyến (video/chat)** với bác sĩ chuyên khoa. Bạn muốn thực hiện phương án nào?', time: '22:16 pm' }
    ],
    symptoms: ['Sốt, đau đầu, mệt mỏi', 'Đau họng', 'Ho'],
    diagnosis: ['Nghi cúm / nhiễm virus hô hấp', 'Nên đi khám'],
    showActions: true
  },
  {
    id: 'PCONV002',
    topic: 'Khó tiêu và đau bụng thượng vị',
    date: '18-05-2026',
    status: 'Hoàn thành',
    messages: [
      { sender: 'bot', text: 'Chào bạn. Tôi có thể giúp gì cho sức khỏe của bạn?', time: '09:00 am' },
      { sender: 'patient', text: 'Tôi hay bị đầy bụng khó tiêu sau khi ăn, thi thoảng hơi đau rát vùng trên rốn.', time: '09:02 am' },
      { sender: 'bot', text: 'Triệu chứng đau rát vùng thượng vị và khó tiêu sau ăn gợi ý tình trạng kích ứng niêm mạc dạ dày hoặc trào ngược. Bạn nên hạn chế ăn đồ cay nóng, nhiều mỡ và không nằm ngay sau khi ăn.', time: '09:04 am' }
    ],
    symptoms: ['Khó tiêu', 'Đau bụng thượng vị'],
    diagnosis: ['Kích ứng dạ dày nhẹ', 'Thay đổi lối sống'],
    showActions: false
  }
];

const INITIAL_DOCTOR_THREADS = [
  {
    id: 'MSG101',
    name: 'Nguyễn Minh Anh',
    lastMsg: 'Người khá mệt, ăn uống cũng kém.',
    date: '05-05-2026',
    time: '08:15',
    unread: true,
    messages: [
      { sender: 'patient', text: 'Mình bị sốt từ hôm qua, người mệt với đau đầu khá rõ. Hôm nay vẫn chưa đỡ, còn đau họng với hơi ho.', time: '21:57' },
      { sender: 'bot', text: 'Chào bạn, tôi là AI Chatbot. Bạn đã đo nhiệt độ chưa, khoảng bao nhiêu độ? Ngoài ra có bị ớn lạnh hay đau nhức người không?', time: '21:58' },
      { sender: 'patient', text: 'Sốt khoảng gần 39 độ, có ớn lạnh với đau người. Người khá mệt, ăn uống cũng kém.', time: '22:15' },
      { sender: 'bot', text: 'Triệu chứng của bạn có thể liên quan đến cúm hoặc nhiễm virus đường hô hấp. Do sốt cao và kéo dài, bạn nên đi khám để được kiểm tra và điều trị phù hợp.', time: '22:16' }
    ]
  },
  {
    id: 'MSG102',
    name: 'Trần Phương Huế',
    lastMsg: 'Đau bụng thượng vị, buồn nôn nhiều...',
    date: '04-05-2026',
    time: '10:05',
    unread: false,
    messages: [
      { sender: 'patient', text: 'Chào bác sĩ, em bị đau bụng vùng trên rốn âm ỉ suốt từ tối qua đến giờ.', time: '09:50' },
      { sender: 'doctor', text: 'Đau có lan ra sau lưng không bạn? Bạn có cảm thấy buồn nôn hay ợ chua gì không?', time: '09:55' },
      { sender: 'patient', text: 'Đau không lan ạ, nhưng bụng ấm ách đầy hơi, thỉnh thoảng buồn nôn nhiều.', time: '10:05' }
    ]
  },
  {
    id: 'MSG103',
    name: 'Lê Hải Minh',
    lastMsg: 'Chào bác sĩ, mắt bị sưng đỏ...',
    date: '02-05-2026',
    time: '18:01',
    unread: false,
    messages: [
      { sender: 'patient', text: 'Chào bác sĩ, mắt trái em bị đỏ và sưng húp lên sau khi ngủ dậy.', time: '18:01' }
    ]
  },
  {
    id: 'MSG104',
    name: 'Văn Mai Hương',
    lastMsg: 'Nghẹt mũi, khó thở rát cổ họng...',
    date: '01-05-2026',
    time: '22:21',
    unread: false,
    messages: [
      { sender: 'patient', text: 'Chào bác sĩ, em bị ngạt mũi rát họng lâu ngày rồi, uống thuốc cảm thông thường không đỡ.', time: '22:21' }
    ]
  },
  {
    id: 'MSG105',
    name: 'Đỗ Minh Tú',
    lastMsg: 'Đau khớp gối khi vận động...',
    date: '01-05-2026',
    time: '08:23',
    unread: false,
    messages: [
      { sender: 'patient', text: 'Bác sĩ ơi, khớp gối của em cứ đi lại nhiều là bị đau nhức nhối.', time: '08:23' }
    ]
  },
  {
    id: 'MSG106',
    name: 'Đức Minh Tuan',
    lastMsg: 'Hay bị chóng mặt hoa mắt lúc sáng...',
    date: '25-04-2026',
    time: '09:15',
    unread: false,
    messages: [
      { sender: 'patient', text: 'Gần đây buổi sáng thức dậy em hay bị hoa mắt chóng mặt lắm.', time: '09:15' }
    ]
  }
];

function App() {
  const [role, setRole] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [previousView, setPreviousView] = useState(null);
  const [doctorThreads, setDoctorThreads] = useState(INITIAL_DOCTOR_THREADS);

  // Popup Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: 'Xác nhận',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const showConfirm = (message, onConfirm, title = 'Xác nhận') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Database states to make forms functional
  const [diseases, setDiseases] = useState(INITIAL_DISEASES);
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);

  // Scenarios state at App root level for CRUD functional state
  const [scenarios, setScenarios] = useState([
    { 
      id: 'SC001', 
      name: 'Tư vấn cảm cúm & đặt lịch khám', 
      status: 'Hoạt động', 
      lastUpdated: '05-05-2026 - 15:40', 
      nodeCount: 12,
      nodes: SC001_NODES,
      connections: SC001_CONNECTIONS
    },
    { 
      id: 'SC002', 
      name: 'Tra cứu thông tin thuốc & liều lượng', 
      status: 'Nháp', 
      lastUpdated: '05-05-2026 - 08:20', 
      nodeCount: 6,
      nodes: SC002_NODES,
      connections: SC002_CONNECTIONS
    },
    { 
      id: 'SC003', 
      name: 'Đăng ký khám bệnh ban đầu', 
      status: 'Hoạt động', 
      lastUpdated: '04-05-2026 - 16:17', 
      nodeCount: 8,
      nodes: SC003_NODES,
      connections: SC003_CONNECTIONS
    }
  ]);

  // Hoisted feedbacks state to synchronize dashboards and reviews
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, name: 'Trần Văn Hùng', rating: 5, comment: 'Bác sĩ tư vấn nhiệt tình, đặt lịch rất nhanh chóng.', response: 'Cảm ơn bạn đã tin tưởng dịch vụ!', date: '24-05-2026' },
    { id: 2, name: 'Lê Thị Thảo', rating: 2, comment: 'Đợi khám hơi lâu mặc dù đã đặt lịch trước.', response: '', date: '23-05-2026' },
    { id: 3, name: 'Phan Anh Tuấn', rating: 4, comment: 'Dịch vụ tốt, chatbot tư vấn ban đầu khá chính xác.', response: 'Cảm ơn bạn!', date: '22-05-2026' }
  ]);

  // Manager Specific State databases
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);

  // State to handle placeholder views for other roles
  const [underDevRole, setUnderDevRole] = useState(null);

  // Patient Conversations Shared States
  const [patientConversations, setPatientConversations] = useState(INITIAL_PATIENT_CONVS);
  const [activePatientConvId, setActivePatientConvId] = useState('PCONV001');

  // Floating Chatbot Widget states (Patient specific)
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [floatingMessages, setFloatingMessages] = useState([
    { sender: 'bot', text: 'Chào Giang! Mình có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [floatingInput, setFloatingInput] = useState('');

  // Trigger Toast popup
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleSelectRole = (selectedRole) => {
    if (selectedRole === 'expert') {
      setRole('expert');
      setCurrentView('dashboard');
      triggerToast('Đăng nhập thành công với vai trò Chuyên gia y tế', 'info');
    } else if (selectedRole === 'manager') {
      setRole('manager');
      setCurrentView('manager-dashboard');
      triggerToast('Đăng nhập thành công với vai trò Quản lý phòng khám', 'info');
    } else if (selectedRole === 'doctor') {
      setRole('doctor');
      setCurrentView('doctor-dashboard');
      triggerToast('Đăng nhập thành công với vai trò Bác sĩ', 'info');
    } else if (selectedRole === 'patient') {
      setRole('patient');
      setCurrentView('patient-dashboard');
      triggerToast('Đăng nhập thành công với vai trò Người cần tư vấn / khám bệnh', 'info');
    } else {
      setUnderDevRole(selectedRole);
    }
  };

  const handleSyncPatientConversation = (ratedConv) => {
    setConversations(prev => {
      const exists = prev.some(c => c.id === ratedConv.id);
      const transcript = (ratedConv.messages || []).map(m => ({
        sender: m.sender === 'patient' ? 'patient' : m.sender,
        text: m.text,
        flagged: false,
        errorType: ''
      }));

      const newOrUpdatedConv = {
        id: ratedConv.id,
        name: 'Lương Hương Giang',
        time: (() => {
          if (ratedConv.date && ratedConv.date !== 'Vừa xong' && ratedConv.date.includes('-') && ratedConv.date.includes(':')) {
            return ratedConv.date;
          }
          const now = new Date();
          const dd = String(now.getDate()).padStart(2, '0');
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          const yyyy = now.getFullYear();
          const hh = String(now.getHours()).padStart(2, '0');
          const min = String(now.getMinutes()).padStart(2, '0');
          return `${dd}-${mm}-${yyyy} - ${hh}:${min}`;
        })(),
        topic: ratedConv.topic || 'Triệu chứng của bệnh nhân',
        rating: ratedConv.rating,
        ratingNum: ratedConv.ratingNum,
        status: 'Chưa duyệt',
        transcript,
        errors: { medical: false, hallucination: false, tone: false, logic: false },
        userFeedback: ratedConv.feedbackComment || '',
        userProblems: ratedConv.feedbackProblems || [],
        notes: ''
      };

      if (exists) {
        return prev.map(c => c.id === ratedConv.id ? newOrUpdatedConv : c);
      } else {
        return [newOrUpdatedConv, ...prev];
      }
    });
  };

  const handleNavigate = (view, id = null) => {
    let actualView = view;
    let keepActiveConv = false;
    if (view === 'patient-consultation-keep') {
      actualView = 'patient-consultation';
      keepActiveConv = true;
    }
    
    if (actualView !== currentView) {
      setPreviousView(currentView);
    }
    
    setCurrentView(actualView);
    
    // Auto open a new conversation when clicking "Tư vấn sức khỏe" (patient-consultation)
    if (actualView === 'patient-consultation' && !keepActiveConv) {
      const newId = `PCONV${Date.now()}`;
      const newChat = {
        id: newId,
        topic: 'Cuộc trò chuyện mới',
        date: 'Vừa xong',
        status: 'Đang tư vấn',
        messages: [
          { sender: 'bot', text: 'Chào bạn, tôi là Trợ lý sức khỏe AI. Bạn đang gặp vấn đề gì về sức khỏe?', time: 'Vừa xong' }
        ],
        symptoms: [],
        diagnosis: [],
        showActions: false,
        activeDoctorConsult: false
      };
      
      // Filter out any blank conversations (where messages length <= 1) to avoid cluttering the list
      setPatientConversations(prev => [newChat, ...prev.filter(c => c.messages && c.messages.length > 1)]);
      setActivePatientConvId(newId);
    }

    if (id) {
      setSelectedId(id);
      if (actualView === 'patient-consultation' && id.startsWith('PCONV')) {
        setActivePatientConvId(id);
      }
    } else {
      // Reset selectedId only when returning to dashboards, main lists, or profiles
      if (
        actualView.endsWith('-list') || 
        actualView === 'dashboard' || 
        actualView === 'manager-dashboard' ||
        actualView === 'doctor-dashboard' ||
        actualView === 'patient-dashboard' ||
        actualView === 'patient-consultation' ||
        actualView === 'patient-schedule' ||
        actualView === 'patient-medical-data' ||
        actualView === 'profile' || 
        actualView === 'chatbot-scenarios' || 
        actualView === 'ai-evaluation' ||
        actualView === 'clinic-info' ||
        actualView === 'clinic-feedback' ||
        actualView === 'appointment-calendar' ||
        actualView === 'doctor-shifts' ||
        actualView === 'reports-analytics' ||
        actualView === 'doctor-schedule' ||
        actualView === 'doctor-appointments' ||
        actualView === 'doctor-messages' ||
        actualView === 'doctor-medicines'
      ) {
        setSelectedId(null);
      }
    }
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentView('dashboard');
    setUnderDevRole(null);
    setShowFloatingChat(false);
    triggerToast('Đã đăng xuất khỏi hệ thống', 'info');
  };

  // --- RENDERING VIEWS ---

  if (underDevRole) {
    const roleNames = {
      patient: 'Người cần tư vấn / Người cần khám bệnh',
      doctor: 'Bác sĩ'
    };
    return (
      <div className="landing-container animate-fade-in">
        <div className="card text-center" style={{ maxWidth: '500px', padding: '40px' }}>
          <div className="role-icon-wrapper" style={{ margin: '0 auto 24px auto' }}>
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="2" fill="none">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h2 style={{ marginBottom: '16px' }}>Giao diện đang được phát triển</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            Hệ thống đang ưu tiên xây dựng giao diện tối ưu cho vai trò <strong>{roleNames[underDevRole]}</strong>. 
            Vui lòng chọn vai trò <strong>Chuyên gia y tế</strong> hoặc <strong>Quản lý phòng khám</strong> để trải nghiệm toàn bộ các tính năng chuẩn UI/UX.
          </p>
          <button className="btn btn-primary" onClick={() => setUnderDevRole(null)}>
            Quay lại chọn vai trò
          </button>
        </div>
      </div>
    );
  }

  if (!role) {
    return <LandingPage onSelectRole={handleSelectRole} />;
  }

  // Choose layouts based on role
  return (
    <div className="app-wrapper">
      <Sidebar
        role={role}
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      <div className="main-content">
        <Navbar
          role={role}
          currentView={currentView}
          previousView={previousView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSelectId={setSelectedId}
          diseases={diseases}
          medicines={medicines}
          patients={patients}
          doctors={doctors}
          reminders={reminders}
          appointments={appointments}
          scenarios={scenarios}
          conversations={conversations}
          doctorThreads={doctorThreads}
          patientConversations={patientConversations}
        />
        <main className="content-body">
          
          {/* PATIENT PAGES */}
          {role === 'patient' && currentView === 'patient-dashboard' && (
            <PatientDashboard
              onNavigate={handleNavigate}
              appointments={appointments}
              diseases={diseases}
              triggerToast={triggerToast}
            />
          )}

          {role === 'patient' && currentView === 'patient-consultation' && (
            <PatientConsultation
              onNavigate={handleNavigate}
              setAppointments={setAppointments}
              triggerToast={triggerToast}
              conversations={patientConversations}
              setConversations={setPatientConversations}
              activeConvId={activePatientConvId}
              setActiveConvId={setActivePatientConvId}
              syncPatientConversation={handleSyncPatientConversation}
            />
          )}

          {role === 'patient' && (currentView === 'patient-schedule' || currentView === 'patient-schedule-create') && (
            <PatientSchedule
              appointments={appointments}
              setAppointments={setAppointments}
              triggerToast={triggerToast}
              onNavigate={handleNavigate}
              showConfirm={showConfirm}
              defaultTab={currentView === 'patient-schedule-create' ? 'create' : 'booked'}
              patientConversations={patientConversations}
              activePatientConvId={activePatientConvId}
              onBookSuccess={(aptDetails) => {
                setPatientConversations(prev => prev.map(c => {
                  if (c.id === activePatientConvId) {
                    return {
                      ...c,
                      status: 'Hoàn thành',
                      showActions: true,
                      messages: [
                        ...c.messages,
                        {
                          sender: 'bot',
                          text: `**XÁC NHẬN ĐẶT LỊCH THÀNH CÔNG**\n👨‍⚕️ Bác sĩ: ${aptDetails.doctorName}\n⏰ Thời gian: ${aptDetails.time} - ${aptDetails.date}\n📍 Địa điểm: ${aptDetails.location}\n💰 Chi phí: ${aptDetails.fee} VND`,
                          isAptCard: true,
                          time: 'Vừa xong'
                        }
                      ]
                    };
                  }
                  return c;
                }));
              }}
            />
          )}

          {role === 'patient' && currentView === 'patient-medical-data' && (
            <PatientMedicalData
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              diseases={diseases}
              medicines={medicines}
              triggerToast={triggerToast}
            />
          )}

          {/* EXPERT PAGES */}
          {role === 'expert' && currentView === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onSelectConversation={setSelectedId}
              onSelectId={setSelectedId}
              diseases={diseases}
              medicines={medicines}
              scenarios={scenarios}
              conversations={conversations}
              triggerToast={triggerToast}
            />
          )}

          {role === 'expert' && currentView.includes('disease') && (
            <MedicalData
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              diseases={diseases}
              setDiseases={setDiseases}
              medicines={medicines}
              setMedicines={setMedicines}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'expert' && currentView.includes('medicine') && (
            <MedicalData
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              diseases={diseases}
              setDiseases={setDiseases}
              medicines={medicines}
              setMedicines={setMedicines}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'expert' && currentView.includes('chatbot') && (
            <ChatbotScenarios
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              scenarios={scenarios}
              setScenarios={setScenarios}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'expert' && currentView.includes('ai-evaluation') && (
            <AIEvaluation
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              conversations={conversations}
              setConversations={setConversations}
              triggerToast={triggerToast}
            />
          )}

          {/* MANAGER PAGES */}
          {role === 'manager' && currentView === 'manager-dashboard' && (
            <ManagerDashboard
              onNavigate={handleNavigate}
              onSelectId={setSelectedId}
              appointments={appointments}
              patients={patients}
              feedbacks={feedbacks}
              triggerToast={triggerToast}
            />
          )}

          {role === 'manager' && (
            currentView === 'clinic-info' || 
            currentView === 'clinic-feedback' ||
            currentView.includes('appointment') ||
            currentView.includes('patient')
          ) && (
            <ClinicManagement
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              appointments={appointments}
              setAppointments={setAppointments}
              patients={patients}
              setPatients={setPatients}
              doctors={doctors}
              feedbacks={feedbacks}
              setFeedbacks={setFeedbacks}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'manager' && currentView.includes('doctor') && (
            <DoctorCoordinator
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              doctors={doctors}
              setDoctors={setDoctors}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'manager' && currentView.includes('reminder') && (
            <ReminderAlerts
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              reminders={reminders}
              setReminders={setReminders}
              triggerToast={triggerToast}
              showConfirm={showConfirm}
            />
          )}

          {role === 'manager' && currentView === 'reports-analytics' && (
            <ReportAnalytics
              triggerToast={triggerToast}
            />
          )}

          {/* DOCTOR PAGES */}
          {role === 'doctor' && currentView === 'doctor-dashboard' && (
            <DoctorDashboard
              onNavigate={handleNavigate}
              appointments={appointments}
              patients={patients}
              triggerToast={triggerToast}
            />
          )}

          {role === 'doctor' && currentView === 'doctor-schedule' && (
            <DoctorSchedule
              onNavigate={handleNavigate}
              appointments={appointments}
              selectedId={selectedId}
              setAppointments={setAppointments}
              triggerToast={triggerToast}
            />
          )}

          {role === 'doctor' && currentView === 'doctor-appointments' && (
            <DoctorAppointments
              onNavigate={handleNavigate}
              appointments={appointments}
              setAppointments={setAppointments}
              triggerToast={triggerToast}
            />
          )}

          {role === 'doctor' && currentView === 'doctor-messages' && (
            <DoctorMessages
              onNavigate={handleNavigate}
              patients={patients}
              setPatients={setPatients}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              triggerToast={triggerToast}
              threads={doctorThreads}
              setThreads={setDoctorThreads}
            />
          )}

          {role === 'doctor' && (
            currentView === 'doctor-medical-records' ||
            currentView === 'doctor-patient-details' ||
            currentView === 'doctor-patient-diagnose'
          ) && (
            <DoctorMedicalRecords
              currentView={currentView}
              onNavigate={handleNavigate}
              previousView={previousView}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              patients={patients}
              setPatients={setPatients}
              medicines={medicines}
              triggerToast={triggerToast}
            />
          )}

          {role === 'doctor' && (
            currentView === 'doctor-medicines' ||
            currentView === 'doctor-medicine-details'
          ) && (
            <DoctorMedicines
              currentView={currentView}
              onNavigate={handleNavigate}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              medicines={medicines}
              triggerToast={triggerToast}
            />
          )}

          {/* GLOBAL PAGES */}
          {currentView === 'profile' && (
            <AccountProfile role={role} triggerToast={triggerToast} />
          )}
        </main>
      </div>

      {/* FLOATING CHATBOT WIDGET FOR PATIENT */}
      {role === 'patient' && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {/* Chat window */}
          {showFloatingChat && (
            <div className="card animate-fade-in" style={{
              width: '320px',
              height: '420px',
              backgroundColor: '#fff',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              border: '1.5px solid var(--primary-light)',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>
              {/* Header */}
              <div style={{
                padding: '12px 14px',
                background: 'var(--primary)',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bot size={16} />
                  <strong style={{ fontSize: '0.85rem' }}>Trợ lý sức khỏe AI</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Zoom to full chat button */}
                  <button 
                    onClick={() => {
                      setShowFloatingChat(false);
                      handleNavigate('patient-consultation');
                    }}
                    title="Mở toàn màn hình"
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Maximize2 size={14} />
                  </button>
                  {/* Close button */}
                  <button 
                    onClick={() => setShowFloatingChat(false)}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}
                  >
                    &times;
                  </button>
                </div>
              </div>

              {/* Message scroll */}
              <div style={{ flexGrow: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {floatingMessages.map((m, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end',
                      backgroundColor: m.sender === 'bot' ? '#f1f5f9' : 'var(--primary)',
                      color: m.sender === 'bot' ? 'var(--text-dark)' : '#fff',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      maxWidth: '85%',
                      boxShadow: 'var(--shadow-sm)',
                      lineHeight: '1.3'
                    }}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={floatingInput}
                  onChange={(e) => setFloatingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && floatingInput.trim()) {
                      const userText = floatingInput.trim();
                      const newMsgs = [...floatingMessages, { sender: 'user', text: userText }];
                      setFloatingMessages(newMsgs);
                      setFloatingInput('');
                      
                      // AI Response simulation
                      setTimeout(() => {
                        let botResponse = 'Mình có thể giúp bạn giải đáp các vấn đề sức khỏe. Bạn hãy thử bấm nút phóng to (zoom) ở trên để cuộc hội thoại chi tiết hơn và dễ dàng chuyển kết nối tới bác sĩ nhé!';
                        if (userText.toLowerCase().includes('sốt')) {
                          botResponse = 'Bạn bị sốt từ khi nào và có cặp nhiệt độ cụ thể chưa? Hãy phóng to khung chat để tôi thu thập đầy đủ triệu chứng và kết nối bác sĩ giúp bạn nhé!';
                        }
                        setFloatingMessages([...newMsgs, { sender: 'bot', text: botResponse }]);
                      }, 1000);
                    }
                  }}
                  style={{
                    flexGrow: 1,
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => {
                    if (floatingInput.trim()) {
                      const userText = floatingInput.trim();
                      const newMsgs = [...floatingMessages, { sender: 'user', text: userText }];
                      setFloatingMessages(newMsgs);
                      setFloatingInput('');
                      setTimeout(() => {
                        setFloatingMessages([...newMsgs, { sender: 'bot', text: 'Mình có thể giúp bạn giải đáp các vấn đề sức khỏe. Bạn hãy thử bấm nút phóng to (zoom) ở trên để cuộc hội thoại chi tiết hơn và dễ dàng chuyển kết nối tới bác sĩ nhé!' }]);
                      }, 1000);
                    }
                  }}
                  style={{
                    padding: '6px 8px',
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem'
                  }}
                >
                  Gửi
                </button>
              </div>
            </div>
          )}

          {/* Floating Button */}
          <button
            onClick={() => setShowFloatingChat(!showFloatingChat)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'pulseGlow 2s infinite',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <MessageCircle size={24} />
          </button>
        </div>
      )}

      {/* Floating Popup Toast Notifications Overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-notification toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} />}
            {toast.type === 'error' && <AlertTriangle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Custom Confirm Modal Popup */}
      {confirmModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div className="card animate-fade-in" style={{
            width: '90%',
            maxWidth: '400px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            margin: 0
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 700 }}>
              {confirmModal.title}
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button 
                onClick={confirmModal.onCancel}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600 }}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmModal.onConfirm}
                className="btn"
                style={{ padding: '8px 18px', fontSize: '0.82rem', backgroundColor: '#ef4444', borderColor: '#ef4444', color: '#fff', fontWeight: 600 }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
