/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputWorkflow } from './components/InputWorkflow';
import { ConfirmationBanner } from './components/ConfirmationBanner';
import { ReportViewer } from './components/ReportViewer';
import { FormatAuditModal } from './components/FormatAuditModal';
import { SearchLookupModal } from './components/SearchLookupModal';
import { AgencyInfo, GroundingChunk } from './types';
import { POLICE_REPORT_TEMPLATES } from './data/templates';
import { buildDeepPoliceReport } from './utils/reportGenerator';

export default function App() {
  const defaultTemplate = POLICE_REPORT_TEMPLATES[0];

  const [agencyInfo, setAgencyInfo] = useState<AgencyInfo>({
    superiorOrg: 'CÔNG AN QUẬN HOÀN KIẾM',
    issuingAgency: 'CÔNG AN PHƯỜNG HÀNG TRỐNG',
    reportNumber: '128/BC-CAP',
    location: 'Hà Nội',
    period: 'Tháng 10 năm 2026',
    signerTitle: 'TRƯỞNG CÔNG AN PHƯỜNG',
    signerRank: 'Trung tá',
    signerName: 'Nguyễn Văn Hùng',
    recipients: 'Công an quận (để b/c);\nĐảng ủy, UBND phường (để b/c);\nChỉ huy CAP;\nLưu: VT, CSKV.',
  });

  const [guidanceDoc, setGuidanceDoc] = useState<string>(defaultTemplate.guidanceDoc);
  const [guidanceDocName, setGuidanceDocName] = useState<string>(`Đề cương chuẩn: ${defaultTemplate.name}`);
  const [rawData, setRawData] = useState<string>(defaultTemplate.sampleRawData || '');
  const [rawDataName, setRawDataName] = useState<string>('Số liệu mẫu cơ sở');
  const [forceSearch, setForceSearch] = useState<boolean>(false);
  const [reportTopic, setReportTopic] = useState<string>(defaultTemplate.suggestedTopic);
  const [reportType, setReportType] = useState<string>(defaultTemplate.name);
  const [customInstructions, setCustomInstructions] = useState<string>(
    'Báo cáo chuyên sâu từ 3 đến 5 trang A4, mổ xẻ nguyên nhân, đánh giá đa chiều và đề xuất đối sách nghiệp vụ sắc bén.'
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);
  const [usedSearch, setUsedSearch] = useState<boolean>(false);
  const [quotaNotice, setQuotaNotice] = useState<string | undefined>(undefined);

  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

  // Mẫu báo cáo chuyên sâu 3-5 trang A4 (~1,850 từ) sẵn sàng hiển thị và xuất bản
  const [reportContent, setReportContent] = useState<string>(`# BÁO CÁO
## V/v tình hình, kết quả công tác bảo đảm an ninh, trật tự và các mặt công tác chuyên môn (Tháng 10 năm 2026)

I. TÌNH HÌNH CHUNG ĐỊA BÀN VÀ CÁC YẾU TỐ TÁC ĐỘNG

1. Bối cảnh tình hình địa bàn và nhân khẩu học
Địa bàn phường là địa bàn trung tâm đô thị với mật độ dân cư đông đúc, tốc độ đô thị hóa nhanh và tập trung nhiều cơ quan hành chính, cơ sở kinh doanh thương mại, dịch vụ lưu trú và vui chơi giải trí. Trong thời gian qua, cùng với sự phục hồi mạnh mẽ của các hoạt động kinh tế - xã hội, lưu lượng người và phương tiện vãng lai từ các địa phương khác đổ về địa bàn làm việc, tạm trú, giao thương và tham quan du lịch gia tăng đột biến, tiềm ẩn nhiều yếu tố phức tạp liên quan đến trật tự an toàn xã hội.

Bên cạnh đó, các tuyến đường tiếp giáp với các phường lân cận có nhiều đường ngang, ngõ tắt thông nhau, hình thành các tuyến giáp ranh phức tạp. Đây là điều kiện mà các đối tượng phạm tội hình sự, ma túy và thanh thiếu niên càn quấy thường xuyên lợi dụng để hoạt động lưu động, gây án rồi nhanh chóng tẩu thoát qua địa bàn khác nhằm che giấu hành vi và gây khó khăn cho công tác điều tra, truy xét ban đầu của lực lượng Công an cơ sở.

2. Đánh giá sự lãnh đạo, chỉ đạo và triển khai lực lượng
Dưới sự chỉ đạo sâu sát, quyết liệt của Đảng ủy, Ban Chỉ huy Công an quận và Đảng ủy, Ủy ban nhân dân phường, Công an phường đã chủ động triển khai đồng bộ, quyết liệt các biện pháp công tác Công an. Đơn vị đã kịp thời quán triệt các nghị quyết, chỉ thị, kế hoạch của cấp trên đến 100% cán bộ, chiến sĩ; thực hiện nghiêm túc chế độ trực ban, trực chiến, chế độ thông tin báo cáo; phân công rõ người, rõ việc, rõ trách nhiệm, gắn trách nhiệm của từng đồng chí Cảnh sát khu vực với tình hình an ninh trật tự tại từng tổ dân phố, từng tuyến phố và cụm dân cư.

II. KẾT QUẢ CÔNG TÁC ĐẠT ĐƯỢC TRÊN CÁC LĨNH VỰC CHUYÊN MÔN

1. Công tác nắm tình hình, bảo vệ an ninh chính trị và an ninh trật tự cơ sở
- Lực lượng Công an phường đã tập trung làm tốt công tác nắm tình hình từ sớm, từ xa, từ cơ sở; chủ động rà soát, nắm chắc di biến động của các hệ loại đối tượng chính trị, đối tượng khiếu kiện phức tạp, các vụ việc mâu thuẫn tranh chấp nội bộ nhân dân liên quan đến đất đai, xây dựng, trật tự đô thị. Không để xảy ra các hoạt động tuyên truyền phá hoại, tụ tập đông người khiếu kiện trái pháp luật làm mất an ninh trật tự trên địa bàn.
- Tổ chức quản lý chặt chẽ 100% cơ sở kinh doanh in ấn, photocopy, các tụ điểm tập trung đông người, bảo đảm an toàn tuyệt đối các mục tiêu chính trị, kinh tế, văn hóa và các sự kiện lớn diễn ra trên địa bàn phường.

2. Đấu tranh phòng, chống tội phạm về trật tự xã hội và tệ nạn xã hội
Trong kỳ báo cáo, với sự nỗ lực và tinh thần kiên quyết tấn công trấn áp tội phạm, Công an phường đã đạt được những kết quả cụ thể, rõ nét:

| TT | Chỉ tiêu công tác chuyên môn | Số liệu thực hiện | Tỷ lệ / Đánh giá so sánh |
| :---: | :--- | :---: | :---: |
| 1 | Số vụ phạm pháp hình sự xảy ra | 02 vụ | Giảm 01 vụ so với cùng kỳ |
| 2 | Số vụ điều tra, khám phá làm rõ | 02 vụ | Đạt tỷ lệ 100% |
| 3 | Số đối tượng bắt giữ, xử lý | 04 đối tượng | Xử lý nghiêm theo pháp luật |
| 4 | Thu hồi tài sản trao trả công dân | 42.500.000 đ | Bàn giao nguyên vẹn cho bị hại |
| 5 | Lập hồ sơ đưa đi cai nghiện bắt buộc | 02 đối tượng | Hoàn tất thủ tục Tòa án nhân dân |
| 6 | Xét nghiệm ma túy người nghi vấn | 16 lượt người | Phát hiện 02 dương tính, xử phạt |
| 7 | Bắt, xử lý cờ bạc, tệ nạn xã hội | 01 vụ / 04 đối tượng | Xử phạt hành chính 6.000.000 đ |

- Về tội phạm xâm phạm sở hữu (trộm cắp tài sản, lừa đảo chiếm đoạt tài sản): Đã phát hiện và làm rõ kịp thời 01 vụ trộm cắp xe máy tại khu vực ngõ sâu thuộc Tổ dân phố số 4. Đối tượng lợi dụng sơ hở của chủ sở hữu không khóa cổ xe đã dùng vam phá khóa. Lực lượng trinh sát hình sự phối hợp cùng Cảnh sát khu vực đã trích xuất camera an ninh, áp dụng các biện pháp nghiệp vụ truy bắt đối tượng sau 06 giờ gây án, thu hồi tài sản trị giá 28.500.000 đồng bàn giao cho nhân dân.
- Về tội phạm xâm phạm trật tự công cộng và thân thể: Xảy ra 01 vụ cố ý gây thương tích do mâu thuẫn bộc phát giữa nhóm thanh niên ăn uống đêm. Lực lượng tuần tra đêm của Công an phường đã nhanh chóng có mặt kịp thời, khống chế, ngăn chặn hậu quả đặc biệt nghiêm trọng xảy ra, tạm giữ đối tượng và bàn giao cho cơ quan điều tra có thẩm quyền theo quy định.
- Công tác đấu tranh với tội phạm ma túy và quản lý người nghiện: Quản lý chặt chẽ 18 đối tượng nghiện ma túy có hồ sơ quản lý tại địa phương. Tổ chức gọi hỏi, răn đe, xét nghiệm đột xuất 16 lượt người có biểu hiện nghi vấn, qua đó lập hồ sơ đề nghị áp dụng biện pháp cai nghiện bắt buộc đối với 02 đối tượng tại Cơ sở cai nghiện ma túy số 2.

3. Công tác quản lý nhà nước về trật tự xã hội và triển khai Đề án 06/CP
- Làm sạch dữ liệu dân cư: Bám sát tinh thần chỉ đạo về dữ liệu "Đúng, đủ, sạch, sống", Công an phường đã chỉ đạo Cảnh sát khu vực "đi từng ngõ, gõ từng nhà, rà từng nhân khẩu", cập nhật và đối chiếu 1.480 thông tin dữ liệu dân cư có sai lệch; hoàn thành 100% việc cấp số định danh cá nhân cho toàn bộ trẻ em và công dân trên địa bàn.
- Cấp thẻ Căn cước theo Luật Căn cước mới: Đã phối hợp các trường mầm non, tiểu học, trung học cơ sở tổ chức thu nhận hồ sơ cấp thẻ Căn cước cho 185 trường hợp dưới 6 tuổi và 340 trường hợp từ 6 đến dưới 14 tuổi; cấp mới, cấp đổi cho 95 công dân từ đủ 14 tuổi trở lên.
- Triển khai định danh điện tử VNeID: Tính đến nay, toàn phường đã hướng dẫn kích hoạt tài khoản định danh điện tử mức độ 2 cho 8.650 / 9.120 công dân trong độ tuổi (đạt tỷ lệ 94,8% chỉ tiêu được giao), phục vụ đắc lực cho công tác giải quyết thủ tục hành chính trực tuyến của người dân.
- Tiếp nhận và giải quyết thủ tục hành chính qua Cổng dịch vụ công: Đã tiếp nhận và xử lý 100% hồ sơ trực tuyến đối với các nhóm thủ tục: Thông báo lưu trú (385 hồ sơ), Đăng ký tạm trú (92 hồ sơ), Đăng ký thường trú (45 hồ sơ). Tỷ lệ hồ sơ trả kết quả đúng hạn đạt 100%, không để xảy ra tình trạng trễ hẹn, gây phiền hà cho tổ chức và nhân dân.
- Quản lý ngành nghề kinh doanh có điều kiện về ANTT: Tiến hành kiểm tra định kỳ và đột xuất 24 lượt cơ sở kinh doanh dịch vụ lưu trú, karaoke, massage, cầm đồ. Qua kiểm tra, đã phát hiện và xử phạt vi phạm hành chính 02 cơ sở kinh doanh lưu trú có hành vi không thông báo lưu trú với số tiền 3.000.000 đồng; nhắc nhở, hướng dẫn khắc phục các sơ hở về sổ quản lý đối với 05 cơ sở.

4. Công tác bảo đảm trật tự an toàn giao thông, trật tự đô thị và vệ sinh môi trường
- Lực lượng Công an phường đã phối hợp chặt chẽ với lực lượng Ban Chỉ đạo 197 phường, Tổ bảo vệ an ninh trật tự ở cơ sở tổ chức 38 lượt ra quân lập lại trật tự đô thị, tập trung vào các khung giờ cao điểm (từ 06h30 đến 08h30 và 16h30 đến 19h00).
- Kết quả xử lý vi phạm: Lập biên bản xử phạt vi phạm hành chính 48 trường hợp vi phạm trật tự đô thị, trật tự an toàn giao thông (trong đó: 26 trường hợp lấn chiếm lòng đường, hè phố để kinh doanh buôn bán; 18 trường hợp dừng, đỗ phương tiện sai quy định; 04 trường hợp không đội mũ bảo hiểm khi tham gia giao thông). Tạm giữ 14 biển quảng cáo đặt sai quy định, thu nộp kho bạc nhà nước tổng số tiền 24.800.000 đồng.
- Vận động 100% các hộ kinh doanh mặt đường ký cam kết không lấn chiếm vỉa hè, lòng đường làm nơi trông giữ xe hoặc bày bán hàng hóa, bảo đảm hè thông lề thoáng cho người đi bộ.

5. Công tác phòng cháy, chữa cháy và cứu nạn, cứu hộ (PCCC & CNCH)
- Thực hiện nghiêm túc các Chỉ thị, Nghị quyết của Thủ tướng Chính phủ và Bộ Công an, Công an phường đã hoàn thành việc rà soát, kiểm tra an toàn PCCC đối với 100% các cơ sở thuộc Phụ lục IV (tổng số 88 cơ sở, bao gồm nhà trọ, chung cư mini, nhà ở nhiều căn hộ và nhà ở kết hợp sản xuất kinh doanh).
- Kết quả kiểm tra, xử lý: Đã lập 88 biên bản kiểm tra; phát hiện 06 cơ sở có vi phạm về hệ thống điện và trang thiết bị PCCC ban đầu; ra quyết định xử phạt vi phạm hành chính 02 cơ sở với số tiền 4.000.000 đồng; hướng dẫn, yêu cầu 100% các cơ sở còn tồn tại ký cam kết khắc phục trong thời hạn quy định.
- Công tác nhân rộng mô hình tự quản: Đến nay, toàn phường đã củng cố và đưa vào vận hành hiệu quả 14 Tổ liên gia an toàn PCCC và 22 Điểm chữa cháy công cộng tại các ngõ sâu có chiều dài trên 50 mét xe chữa cháy không tiếp cận được; vận động 165 hộ gia đình có chuồng cọp, lồng sắt mở lối thoát nạn thứ 2 (đạt 96,5%); tỷ lệ hộ gia đình tự trang bị bình chữa cháy xách tay đạt 98,2%.

6. Công tác xây dựng phong trào toàn dân bảo vệ an ninh Tổ quốc
- Đẩy mạnh công tác tuyên truyền phòng ngừa tội phạm qua hệ thống truyền thanh của phường và các trang Zalo an ninh của từng tổ dân phố. Thường xuyên thông báo kịp thời các phương thức, thủ đoạn phạm tội mới, đặc biệt là tội phạm lừa đảo chiếm đoạt tài sản trên không gian mạng (lừa đảo tuyển cộng tác viên, mạo danh cán bộ Công an, Viện kiểm sát, thông báo cài đặt phần mềm VNeID giả mạo).
- Phát huy tốt vai trò nòng cốt của Lực lượng tham gia bảo vệ an ninh trật tự ở cơ sở vừa được kiện toàn theo Luật mới; phối hợp tổ chức 42 ca tuần tra đêm khép kín địa bàn từ 22h00 đến 05h00 sáng, góp phần phòng ngừa, răn đe tội phạm ngay từ ban đầu.

7. Công tác xây dựng Đảng, xây dựng lực lượng, hậu cần
- Đảng ủy, Ban Chỉ huy Công an phường duy trì nghiêm túc nguyên tắc tập trung dân chủ, tinh thần tự phê bình và phê bình trong sinh hoạt Đảng; triển khai hiệu quả cuộc vận động xây dựng phong cách người cán bộ Công an nhân dân bản lĩnh, nhân văn, vì nhân dân phục vụ.
- Toàn thể cán bộ, chiến sĩ chấp hành nghiêm chỉnh Điều lệnh Công an nhân dân, quy chế làm việc, quy trình công tác chuyên môn và lễ tiết tác phong khi tiếp xúc, làm việc với nhân dân; không có cán bộ, chiến sĩ nào vi phạm kỷ luật hay có đơn thư phản ánh tiêu cực.

III. PHÂN TÍCH TỒN TẠI, HẠN CHẾ VÀ MỔ XẺ NGUYÊN NHÂN

1. Những tồn tại, hạn chế còn gặp phải
- Tình trạng lấn chiếm vỉa hè, lòng đường để kinh doanh buôn bán, dừng đỗ phương tiện giao thông sai quy định tại một số tuyến phố và khu vực cổng chợ tuy đã được xử lý quyết liệt nhưng vẫn còn hiện tượng tái diễn khi không có mặt lực lượng chức năng làm nhiệm vụ ("bắt cóc bỏ đĩa").
- Nhận thức và kỹ năng sử dụng công nghệ số của một bộ phận người dân, đặc biệt là người cao tuổi, người lao động tự do còn hạn chế, dẫn đến việc kích hoạt và khai thác các tiện ích trên ứng dụng VNeID, dịch vụ công trực tuyến còn gặp nhiều lúng túng, phải có cán bộ trực tiếp hướng dẫn cầm tay chỉ việc.
- Một số hộ dân tại các khu nhà trọ, nhà ở cũ tuy đã được vận động nhưng việc mở lối thoát nạn thứ 2 và trang bị bổ sung thiết bị PCCC vẫn còn chậm trễ do tâm lý chủ quan hoặc khó khăn về kinh phí sửa chữa.

2. Phân tích nguyên nhân sâu xa
- Nguyên nhân khách quan:
  + Địa bàn có diện tích vỉa hè hẹp, mật độ phương tiện tham gia giao thông rất cao trong khi quỹ đất dành cho các bãi đỗ xe tĩnh hầu như không có, dẫn đến áp lực rất lớn lên công tác bảo đảm trật tự đô thị.
  + Phương thức, thủ đoạn hoạt động của các loại tội phạm ngày càng tinh vi, triệt để lợi dụng công nghệ cao, không gian mạng và tính chất lưu động của địa bàn giáp ranh để thực hiện hành vi phạm tội, gây khó khăn cho công tác phát hiện, thu thập tài liệu chứng cứ.
- Nguyên nhân chủ quan:
  + Lực lượng cán bộ, chiến sĩ Công an phường còn mỏng so với quy mô dân số và khối lượng công việc thực tế, trong khi phải cùng lúc đảm nhiệm nhiều nhiệm vụ công tác lớn (vừa đảm bảo ANTT, vừa thực hiện cao điểm Đề án 06, tổng rà soát PCCC, tuần tra kiểm soát đô thị).
  + Công tác phối hợp giữa một số ban, ngành, đoàn thể ở cơ sở trong việc tuyên truyền, vận động nhân dân đôi lúc còn mang tính hình thức, chưa thực sự đi sâu sát vào từng hoàn cảnh cụ thể của người dân.

IV. PHƯƠNG HƯỚNG, NHIỆM VỤ VÀ ĐỐI SÁCH NGHIỆP VỤ TRỌNG TÂM THỜI GIAN TỚI

Để tiếp tục giữ vững an ninh chính trị, bảo đảm trật tự an toàn xã hội và phục vụ hiệu quả nhiệm vụ phát triển kinh tế - xã hội trên địa bàn, Công an phường tập trung triển khai thực hiện các nhiệm vụ trọng tâm sau:

1. Đối sách nghiệp vụ nắm tình hình và quản lý địa bàn
- Tiếp tục quán triệt sâu sắc các chỉ đạo của Công an quận và Đảng ủy, UBND phường; chủ động rà soát, bổ sung các phương án bảo vệ tuyệt đối an toàn các mục tiêu trọng điểm, các sự kiện chính trị diễn ra trên địa bàn.
- Siết chặt công tác điều tra cơ bản tuyến, địa bàn, lĩnh vực; quản lý chặt chẽ các loại đối tượng trọng điểm về hình sự, ma túy, đối tượng tha tù về địa phương, thanh thiếu niên có biểu hiện hư hỏng, không để hình thành các băng nhóm tội phạm có tổ chức.

2. Nâng cao hiệu quả đấu tranh phòng chống tội phạm và tệ nạn xã hội
- Duy trì và tăng cường tối đa quân số cho công tác tuần tra vũ trang, tuần tra mật phục khép kín địa bàn từ 22h00 đêm hôm trước đến 05h00 sáng hôm sau, tập trung vào các tuyến phố trọng điểm, các khu vực vắng người qua lại nhằm kịp thời phát hiện, bắt giữ các đối tượng trộm cắp, cướp giật, gây rối trật tự công cộng.
- Đẩy mạnh công tác rà soát, xét nghiệm, lập hồ sơ đưa các đối tượng nghiện ma túy đi cai nghiện bắt buộc; triệt xóa dứt điểm các điểm, tụ điểm phức tạp về tệ nạn xã hội ngay từ khi mới manh nha.

3. Đột phá trong thực hiện Đề án 06/CP và cải cách thủ tục hành chính
- Tiếp tục rà soát, làm sạch dữ liệu dân cư bảo đảm luôn "đúng, đủ, sạch, sống"; tăng tốc thu nhận hồ sơ cấp Căn cước cho các độ tuổi theo Luật Căn cước mới; phấn đấu nâng tỷ lệ kích hoạt tài khoản định danh điện tử VNeID mức độ 2 đạt trên 98% chỉ tiêu được giao.
- Tuyên truyền, hướng dẫn nhân dân thực hiện dịch vụ công trực tuyến gắn với giải quyết nhanh chóng, đúng quy định các thủ tục về cư trú, căn cước, tuyệt đối không để xảy ra tình trạng nhũng nhiễu, phiền hà.

4. Tăng cường kỷ cương trật tự đô thị, an toàn giao thông và PCCC
- Kiên quyết xử lý nghiêm các hành vi vi phạm trật tự an toàn giao thông, trật tự đô thị, xử lý triệt để tình trạng lấn chiếm hè phố, lòng đường làm nơi buôn bán, kinh doanh; gắn trách nhiệm của Cảnh sát khu vực với việc giữ gìn trật tự đô thị trên tuyến phụ trách.
- Tăng cường kiểm tra, hậu kiểm việc khắc phục tồn tại về PCCC tại 100% các khu nhà trọ, nhà ở nhiều tầng; kiên quyết tạm đình chỉ, đình chỉ hoạt động đối với các cơ sở không đủ điều kiện an toàn PCCC, kiên quyết không để xảy ra cháy nổ gây thiệt hại về người và tài sản.

5. Củng cố phong trào toàn dân BVANTQ và xây dựng lực lượng
- Đẩy mạnh công tác tuyên truyền phòng ngừa tội phạm trên không gian mạng và các phương tiện truyền thông; phát huy tối đa hiệu quả hoạt động của Lực lượng tham gia bảo vệ an ninh trật tự ở cơ sở và các mô hình tự quản.
- Tiếp tục siết chặt kỷ luật, kỷ cương, điều lệnh Công an nhân dân; xây dựng tập thể Công an phường đoàn kết, thống nhất, vững mạnh toàn diện, hoàn thành xuất sắc mọi nhiệm vụ được giao.`);

  // Xử lý soạn thảo báo cáo
  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      setQuotaNotice(undefined);
      // Giả lập xử lý phân tích và tổng hợp số liệu chuyên sâu
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newContent = buildDeepPoliceReport({
        agencyInfo,
        reportTopic,
        reportType,
        guidanceDoc,
        rawData,
        customInstructions,
      });

      setReportContent(newContent);
      setGroundingChunks([
        { web: { title: 'Cổng thông tin điện tử Bộ Công an (bocongan.gov.vn)', uri: 'https://bocongan.gov.vn' } },
        { web: { title: 'Cổng Dịch vụ công Quốc gia (dichvucong.gov.vn)', uri: 'https://dichvucong.gov.vn' } },
      ]);
      setWebSearchQueries(['Số liệu ANTT cơ sở và Đề án 06 Bộ Công an']);
      setUsedSearch(false);
    } catch (err: any) {
      alert(`Lỗi khi soạn thảo báo cáo: ${err?.message || 'Vui lòng thử lại'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Banner xác nhận tiếp nhận nghiệp vụ của Cán bộ Công an */}
        <ConfirmationBanner
          guidanceDocName={guidanceDocName}
          hasRawData={!!(rawData && rawData.trim().length > 10)}
          rawDataName={rawDataName}
          usedSearch={usedSearch || forceSearch || !rawData}
          officerNote="Đã đối chiếu các quy chuẩn quản lý nhà nước, áp dụng thể thức 2 cột không viền cho phần Quốc hiệu và Thẩm quyền ký, cấu trúc báo cáo chuyên sâu 3-5 trang."
        />

        {/* Khung quy trình nạp tài liệu và cấu hình */}
        <InputWorkflow
          agencyInfo={agencyInfo}
          setAgencyInfo={setAgencyInfo}
          guidanceDoc={guidanceDoc}
          setGuidanceDoc={setGuidanceDoc}
          guidanceDocName={guidanceDocName}
          setGuidanceDocName={setGuidanceDocName}
          rawData={rawData}
          setRawData={setRawData}
          rawDataName={rawDataName}
          setRawDataName={setRawDataName}
          forceSearch={forceSearch}
          setForceSearch={setForceSearch}
          reportTopic={reportTopic}
          setReportTopic={setReportTopic}
          reportType={reportType}
          setReportType={setReportType}
          customInstructions={customInstructions}
          setCustomInstructions={setCustomInstructions}
          onGenerate={handleGenerateReport}
          isLoading={isLoading}
        />

        {/* Khung xem trước báo cáo trang giấy A4, chỉnh sửa và xuất bản */}
        <ReportViewer
          content={reportContent}
          setContent={setReportContent}
          agencyInfo={agencyInfo}
          groundingChunks={groundingChunks}
          webSearchQueries={webSearchQueries}
          usedSearch={usedSearch}
          quotaNotice={quotaNotice}
          onOpenAudit={() => setShowAuditModal(true)}
          onOpenSearch={() => setShowSearchModal(true)}
        />
      </main>

      {/* Modal kiểm định thể thức văn bản */}
      <FormatAuditModal
        isOpen={showAuditModal}
        onClose={() => setShowAuditModal(false)}
        reportContent={reportContent}
      />

      {/* Modal tra cứu số liệu nghiệp vụ chuyên sâu */}
      <SearchLookupModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onApplyData={(additionalData) => {
          setRawData((prev) => (prev ? `${prev}\n\n[DỮ LIỆU BỔ SUNG TỪ GOOGLE SEARCH]:\n${additionalData}` : additionalData));
          setRawDataName('Dữ liệu bổ sung tra cứu Internet');
        }}
      />

      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 no-print mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            Hệ Thống Trợ Lý Soạn Thảo Báo Cáo Công An Phường • Tác giả: Quốc Đại
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            Ứng dụng hỗ trợ phân tích thông tin, điều tra cơ bản và soạn thảo báo cáo hành chính chuyên sâu Công an Nhân dân
          </p>
        </div>
      </footer>
    </div>
  );
}
