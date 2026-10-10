import { ReportTemplate } from '../types';

export const POLICE_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'monthly-security',
    name: 'Báo cáo công tác đảm bảo ANTT định kỳ (Tháng/Quý)',
    category: 'Định kỳ',
    suggestedTopic: 'Báo cáo tình hình, kết quả công tác đảm bảo an ninh, trật tự tháng 10 năm 2026',
    description: 'Báo cáo toàn diện các mặt công tác nắm tình hình, TTATXH, trật tự giao thông - đô thị, PCCC, Đề án 06 và phong trào toàn dân BVANTQ.',
    guidanceDoc: `ĐỀ CƯƠNG BÁO CÁO CÔNG TÁC ĐẢM BẢO AN NINH TRẬT TỰ ĐỊNH KỲ:
I. TÌNH HÌNH CHUNG ĐỊA BÀN
1. Tình hình an ninh chính trị, an ninh tôn giáo, trật tự xã hội.
2. Những yếu tố tác động đến tình hình an ninh, trật tự trên địa bàn phường.

II. KẾT QUẢ CÔNG TÁC CÔNG AN ĐẠT ĐƯỢC
1. Công tác nắm tình hình, bảo vệ an ninh nội bộ, an ninh kinh tế, an ninh mạng.
2. Công tác phòng, chống tội phạm và tệ nạn xã hội (Số vụ việc phạm pháp, bắt giữ, xử lý).
3. Công tác quản lý nhà nước về ANTT và triển khai Đề án 06/CP (Đăng ký cư trú, cấp CCCD/Định danh điện tử, quản lý ngành nghề kinh doanh có điều kiện).
4. Công tác đảm bảo trật tự an toàn giao thông, trật tự đô thị, vệ sinh môi trường.
5. Công tác phòng cháy, chữa cháy và cứu nạn, cứu hộ (PCCC & CNCH).
6. Công tác xây dựng phong trào toàn dân bảo vệ an ninh Tổ quốc.
7. Công tác xây dựng Đảng, xây dựng lực lượng, hậu cần phục vụ chiến đấu.

III. TỒN TẠI, HẠN CHẾ VÀ NGUYÊN NHÂN
1. Tồn tại, hạn chế còn gặp phải.
2. Nguyên nhân chủ quan và nguyên nhân khách quan.

IV. PHƯƠNG HƯỚNG, NHIỆM VỤ TRỌNG TÂM THỜI GIAN TỚI
- Các nhiệm vụ trọng tâm, giải pháp đột phá và kiến nghị đề xuất cấp trên.`,
    sampleRawData: `Số liệu tổng hợp tại địa bàn tháng 10/2026:
- Tội phạm về trật tự xã hội: Xảy ra 02 vụ (01 vụ trộm cắp xe máy tại tổ dân phố số 4, 01 vụ cố ý gây thương tích do mâu thuẫn bộc phát tại quán ăn phố H.). Đã điều tra khám phá 02/02 vụ (đạt 100%), bắt giữ 03 đối tượng, thu hồi tài sản trị giá 28 triệu đồng trả cho bị hại.
- Tệ nạn ma túy: Lập hồ sơ đưa 01 đối tượng đi cai nghiện bắt buộc tại Trung tâm số 2; xét nghiệm ma túy 12 lượt người có biểu hiện nghi vấn, phát hiện 01 đối tượng dương tính, đã ra quyết định xử phạt hành chính.
- Triển khai Đề án 06/CP: Thu nhận 45 hồ sơ cấp thẻ Căn cước mới; kích hoạt 182 tài khoản VNeID mức độ 2 cho người dân; tiếp nhận và giải quyết trực tuyến 100% hồ sơ cư trú qua Cổng DVC Bộ Công an (215 hồ sơ thông báo lưu trú, 38 hồ sơ đăng ký thường trú).
- Quản lý cư trú & ngành nghề kinh doanh: Kiểm tra định kỳ 15 cơ sở kinh doanh dịch vụ lưu trú, karaoke, cầm đồ; phát hiện 01 cơ sở lưu trú vi phạm không thông báo lưu trú, phạt tiền 1.500.000 đồng.
- Trật tự đô thị & ATGT: Tổ chức 26 lượt tuần tra lưu động; lập biên bản xử phạt 32 trường hợp lấn chiếm vỉa hè kinh doanh, đỗ xe sai quy định, tạm giữ 08 biển quảng cáo vi phạm, thu nộp kho bạc 18.500.000 đồng.
- PCCC & CNCH: Kiểm tra an toàn PCCC tại 28 nhà ở kết hợp kinh doanh và nhà trọ; hướng dẫn 100% hộ dân ký cam kết an toàn PCCC, vận động mở lối thoát nạn thứ 2 cho 14 hộ. Không xảy ra cháy nổ.`
  },
  {
    id: 'dean-06',
    name: 'Báo cáo chuyên đề triển khai Đề án 06 & CSDL Dân cư',
    category: 'Chuyên đề',
    suggestedTopic: 'Báo cáo kết quả thực hiện Đề án 06/CP về phát triển ứng dụng dữ liệu về dân cư, định danh và xác thực điện tử',
    description: 'Báo cáo chuyên sâu công tác làm sạch dữ liệu dân cư "đúng, đủ, sạch, sống", cấp thẻ Căn cước, kích hoạt tài khoản định danh điện tử VNeID và dịch vụ công trực tuyến.',
    guidanceDoc: `ĐỀ CƯƠNG BÁO CÁO CHUYÊN ĐỀ ĐỀ ÁN 06/CP:
I. CÔNG TÁC LÃNH ĐẠO, CHỈ ĐẠO VÀ THAM MƯU TRIỂN KHAI
1. Tham mưu cho Đảng ủy, UBND phường ban hành các kế hoạch, chỉ thị.
2. Phối hợp với các ban ngành, đoàn thể, Tổ công nghệ số cộng đồng.

II. KẾT QUẢ ĐẠT ĐƯỢC
1. Công tác thu thập, cập nhật, chỉnh sửa làm sạch dữ liệu dân cư ("Đúng, đủ, sạch, sống").
2. Kết quả cấp thẻ Căn cước theo Luật Căn cước mới (đặc biệt cho lứa tuổi dưới 6 tuổi và từ 6 - 14 tuổi).
3. Kết quả tuyên truyền, hướng dẫn kích hoạt tài khoản định danh điện tử VNeID mức 2.
4. Triển khai 25 dịch vụ công thiết yếu và tiếp nhận thủ tục hành chính trực tuyến.
5. Triển khai các mô hình điểm của Đề án 06 (Khám chữa bệnh BHYT bằng thẻ CCCD, thanh toán không dùng tiền mặt, lưu trú tại bệnh viện/nhà nghỉ).

III. KHÓ KHĂN, VƯỚNG MẮC
- Về hạ tầng đường truyền, thiết bị, nhân khẩu vắng mặt khỏi địa phương, người già yếu.

IV. GIẢI PHÁP VÀ NHIỆM VỤ TRỌNG TÂM`,
    sampleRawData: `Dữ liệu Đề án 06 tại đơn vị:
- Tỷ lệ làm sạch dữ liệu dân cư đạt 99.8% (đã rà soát cập nhật 1.450 trường hợp sai lệch ngày tháng năm sinh, bổ sung số định danh cá nhân cho 100% nhân khẩu).
- Cấp thẻ Căn cước: Cấp mới cho 120 trẻ dưới 6 tuổi, 310 học sinh từ 6 - 14 tuổi, và 85 trường hợp công dân từ 14 tuổi trở lên.
- Định danh điện tử VNeID: Kích hoạt đạt 94.2% chỉ tiêu được giao (tổng số 8.420/8.940 tài khoản mức 2).
- Cổng dịch vụ công trực tuyến: Tiếp nhận 480 hồ sơ cư trú trực tuyến, tỷ lệ giải quyết đúng hạn đạt 100%, không có hồ sơ quá hạn.`
  },
  {
    id: 'cao-diem-antt',
    name: 'Báo cáo đợt cao điểm tấn công trấn áp tội phạm',
    category: 'Cao điểm',
    suggestedTopic: 'Báo cáo kết quả đợt cao điểm tấn công, trấn áp tội phạm, bảo đảm ANTT',
    description: 'Báo cáo phục vụ sơ kết, tổng kết các đợt cao điểm tấn công trấn áp tội phạm bảo vệ các sự kiện chính trị quan trọng, Tết Nguyên đán.',
    guidanceDoc: `ĐỀ CƯƠNG BÁO CÁO ĐỢT CAO ĐIỂM TẤN CÔNG TRẤN ÁP TỘI PHẠM:
I. CÔNG TÁC CHUẨN BỊ VÀ TRIỂN KHAI LỰC LƯỢNG
1. Quán triệt mệnh lệnh của Giám đốc Công an tỉnh/thành phố và Trưởng Công an quận/huyện.
2. Công tác rà soát tuyến, địa bàn trọng điểm, tuyến giáp ranh, đối tượng quản lý nghiệp vụ.

II. KẾT QUẢ ĐẠT ĐƯỢC
1. Công tác đấu tranh phòng chống tội phạm hình sự, kinh tế, ma túy, môi trường.
2. Công tác quản lý đối tượng (đối tượng tù tha, nghiện ma túy, án treo, thanh thiếu niên hư).
3. Công tác tuần tra vũ trang ban đêm, kiểm soát hành chính khép kín địa bàn.
4. Công tác thu hồi vũ khí, vật liệu nổ, công cụ hỗ trợ và pháo nổ.
5. Công tác quản lý các cơ sở kinh doanh có điều kiện về ANTT.

III. ĐÁNH GIÁ TÌNH HÌNH VÀ BÀI HỌC KINH NGHIỆM
IV. KIẾN NGHỊ VÀ PHƯƠNG HƯỚNG TIẾP THEO`,
    sampleRawData: `Số liệu đợt cao điểm 30 ngày:
- Huy động 100% cán bộ, chiến sĩ trực chiến; tổ chức 45 ca tuần tra đêm từ 22h00 đến 05h00 sáng hôm sau.
- Phát hiện xử lý: 01 vụ trộm cắp tài sản (thu giữ tang vật giao trả công dân); 01 vụ tàng trữ trái phép chất ma túy (bắt 01 đối tượng, thu giữ 0,35g heroin); triệt xóa 01 tụ điểm đánh bạc nhỏ ăn tiền (bắt 04 đối tượng, phạt hành chính 6 triệu đồng).
- Thu hồi VK-VLN-CCHT: Vận động nhân dân tự giác giao nộp 02 đao tự chế, 01 súng cồn, 03 hộp pháo hoa nổ nhập lậu.
- Xử phạt 18 trường hợp điều khiển xe máy nẹt bô, không đội mũ bảo hiểm.`
  },
  {
    id: 'pccc-cnch',
    name: 'Báo cáo công tác PCCC & Cứu nạn cứu hộ',
    category: 'Chuyên đề',
    suggestedTopic: 'Báo cáo kết quả tổng rà soát, kiểm tra an toàn PCCC và CNCH đối với nhà ở nhiều căn hộ, nhà trọ và nhà ở kết hợp kinh doanh',
    description: 'Báo cáo theo Chỉ thị của Thủ tướng Chính phủ và Bộ Công an về kiểm tra an toàn phòng cháy chữa cháy, lối thoát nạn và phong trào Tổ liên gia an toàn PCCC.',
    guidanceDoc: `ĐỀ CƯƠNG BÁO CÁO CÔNG TÁC PCCC VÀ CNCH:
I. ĐẶC ĐIỂM TÌNH HÌNH ĐỊA BÀN VỀ CÔNG TÁC PCCC
1. Quy mô số lượng nhà ở nhiều tầng, chung cư mini, nhà trọ, cơ sở sản xuất kinh doanh có nguy cơ cháy nổ cao.
2. Hạ tầng nguồn nước, đường ngõ sâu xe chữa cháy không tiếp cận được.

II. KẾT QUẢ TRIỂN KHAI VÀ THỰC HIỆN
1. Công tác điều tra cơ bản, tổng kiểm tra rà soát 100% các cơ sở thuộc diện quản lý.
2. Số lượng cơ sở được kiểm tra; các lỗi vi phạm phổ biến phát hiện được; số vụ xử phạt vi phạm hành chính, tạm đình chỉ hoạt động.
3. Kết quả khắc phục tồn tại: Mở lối thoát nạn thứ 2 qua ban công/lồng sắt ("chuồng cọp"), trang bị bình chữa cháy xách tay.
4. Xây dựng và nhân rộng mô hình "Tổ liên gia an toàn PCCC" và "Điểm chữa cháy công cộng".
5. Công tác tuyên truyền, tập huấn kỹ năng thoát nạn và diễn tập phương án chữa cháy.

III. NHỮNG TỒN TẠI, VƯỚNG MẮC
IV. KIẾN NGHỊ VÀ NHIỆM VỤ TRỌNG TÂM`,
    sampleRawData: `Số liệu PCCC trên địa bàn phường:
- Tổng số cơ sở quản lý theo Phụ lục IV Nghị định 136/2020/NĐ-CP và Nghị định 50/2024/NĐ-CP: 85 cơ sở.
- Đã kiểm tra 100% (85/85 cơ sở), lập 85 biên bản kiểm tra; phát hiện 06 cơ sở chưa trang bị đủ bình chữa cháy, 02 cơ sở dây điện chùng võng; đã xử phạt vi phạm hành chính 03 trường hợp với số tiền 4.500.000 đồng, yêu cầu khắc phục ngay.
- Vận động cắt mở lồng sắt tạo lối thoát nạn thứ 2: Đạt 142/150 nhà dân (tỷ lệ 94.6%).
- Trang bị bình chữa cháy: Đạt 98.2% số hộ gia đình có ít nhất 01 bình chữa cháy.
- Xây dựng mô hình: Đã thành lập và đưa vào hoạt động hiệu quả 12 Tổ liên gia an toàn PCCC, 18 Điểm chữa cháy công cộng tại các ngõ sâu trên 50m.`
  }
];
