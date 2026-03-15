"use client";

import { useRef, useState } from "react";
import type { jsPDF as JsPDFType } from "jspdf";
import SignatureCanvas from "react-signature-canvas";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface LogbookDetailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logbook: any;
  onClose: () => void;
  onSignatureSaved?: () => void;
}

export default function LogbookDetail({ logbook, onClose, onSignatureSaved }: LogbookDetailProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signatureData, setSignatureData] = useState<string>(logbook.signature || "");
  const [signing, setSigning] = useState(false);

  const [savingSignature, setSavingSignature] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);

  const handleSaveSignature = async () => {
    if (!sigCanvas.current || sigCanvas.current.isEmpty()) return;
    setSavingSignature(true);
    const sig = sigCanvas.current.toDataURL("image/png");

    const password = sessionStorage.getItem("admin_password") || "";
    const res = await fetch(`/api/logbooks`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ id: logbook.id, signature: sig }),
    });

    if (res.ok) {
      setSignatureData(sig);
      setSigning(false);
      setSignatureSaved(true);
      onSignatureSaved?.();
    }
    setSavingSignature(false);
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf: JsPDFType = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

    const fileName = `${logbook.name} ${logbook.log_number || ""}`.trim();
    pdf.save(`${fileName}.pdf`);
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
      <span className="text-[11px] text-gray-500">{label}</span>
      <span className="text-[11px] font-medium text-[#111111]">{value || "-"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-[#111111]">
              {logbook.name}의 로그북
            </h3>
            <p className="text-sm text-gray-400">
              {logbook.log_number && `#${logbook.log_number} · `}
              {logbook.date}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>

        {/* PDF로 변환될 영역 */}
        <div ref={printRef} className="p-5 space-y-3">
          {/* 헤더 */}
          <div className="text-center border-b border-gray-200 pb-2">
            <h2 className="text-lg font-black text-ocean">GoDiveKor</h2>
            <p className="text-[10px] text-gray-400">DIVE LOGBOOK</p>
          </div>

          {/* 기본 정보 + 장비 (나란히) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-ocean mb-1">기본 정보</h4>
              <InfoRow label="로그 수" value={logbook.log_number} />
              <InfoRow label="이름" value={logbook.name} />
              <InfoRow label="날짜" value={logbook.date} />
              <InfoRow label="지역" value={logbook.location} />
              <InfoRow label="포인트" value={logbook.dive_site} />
              <InfoRow label="날씨" value={logbook.weather} />
              <InfoRow label="파도" value={logbook.wave} />
              <InfoRow label="조류" value={logbook.current} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-ocean mb-1">장비</h4>
              <InfoRow label="탱크" value={logbook.tank} />
              <InfoRow label="공기" value={logbook.air_type} />
              <InfoRow label="웨이트" value={logbook.weight ? `${logbook.weight} kg` : ""} />
              <InfoRow label="슈트 두께" value={logbook.suit_thickness ? `${logbook.suit_thickness} mm` : ""} />
              <InfoRow label="슈트 종류" value={logbook.suit_type?.join(", ")} />
            </div>
          </div>

          {/* 다이빙 데이터 (3열) */}
          <div>
            <h4 className="text-xs font-bold text-ocean mb-1">다이빙 데이터</h4>
            <div className="grid grid-cols-3 gap-x-4">
              <InfoRow label="입수 시간" value={logbook.entry_time} />
              <InfoRow label="출수 시간" value={logbook.exit_time} />
              <InfoRow label="다이빙 시간" value={logbook.dive_time ? `${logbook.dive_time} min` : ""} />
              <InfoRow label="입수 잔압" value={logbook.start_bar ? `${logbook.start_bar} bar` : ""} />
              <InfoRow label="출수 잔압" value={logbook.end_bar ? `${logbook.end_bar} bar` : ""} />
              <InfoRow label="안전 정지" value={logbook.safety_stop} />
              <InfoRow label="수면 온도" value={logbook.surface_temp ? `${logbook.surface_temp}°C` : ""} />
              <InfoRow label="수중 온도" value={logbook.bottom_temp ? `${logbook.bottom_temp}°C` : ""} />
              <InfoRow label="시야" value={logbook.visibility ? `${logbook.visibility} m` : ""} />
              <InfoRow label="평균 수심" value={logbook.avg_depth ? `${logbook.avg_depth} m` : ""} />
              <InfoRow label="최대 수심" value={logbook.max_depth ? `${logbook.max_depth} m` : ""} />
              <InfoRow label="수면 휴식" value={logbook.surface_interval} />
            </div>
          </div>

          {/* 다이빙 유형 + 추가 정보 (나란히) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-ocean mb-1">다이빙 유형</h4>
              {logbook.dive_types?.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {logbook.dive_types.map((dt: string) => (
                    <span key={dt} className="px-2 py-0.5 bg-sunset/10 text-sunset-dark text-[10px] rounded-full font-medium">
                      {dt}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-gray-400">-</p>
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-ocean mb-1">추가 정보</h4>
              <InfoRow label="다이브 센터" value={logbook.dive_center} />
              <InfoRow label="버디" value={logbook.buddy} />
              <InfoRow label="강사" value={logbook.instructor} />
            </div>
          </div>

          {/* 메모 (5줄 높이 확보) */}
          <div>
            <h4 className="text-xs font-bold text-ocean mb-1">메모</h4>
            <div className="bg-gray-50 rounded-lg p-3 min-h-[90px]">
              <p className="text-[11px] text-gray-600 leading-relaxed whitespace-pre-wrap">
                {logbook.notes || ""}
              </p>
            </div>
          </div>

          {/* 서명 */}
          <div className="border-t border-gray-200 pt-2">
            <h4 className="text-xs font-bold text-ocean mb-1">강사 서명</h4>
            {signatureData ? (
              <img src={signatureData} alt="서명" className="h-16 max-w-[250px] border border-gray-200 rounded-lg bg-gray-50 p-1" />
            ) : (
              <div className="h-16 border border-dashed border-gray-300 rounded-lg bg-gray-50" />
            )}
          </div>
        </div>

        {/* 서명 패드 (PDF 영역 밖) */}
        <div className="p-6 border-t border-gray-200">
          {!signing ? (
            <button
              onClick={() => setSigning(true)}
              className="w-full py-3 bg-sunset text-white rounded-lg text-sm font-medium hover:bg-sunset-dark transition-colors"
            >
              {signatureData ? "서명 다시 하기" : "강사 서명하기"}
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-ocean">강사 서명</h4>
                <button
                  onClick={() => sigCanvas.current?.clear()}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  지우기
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                <SignatureCanvas
                  ref={sigCanvas}
                  canvasProps={{
                    className: "w-full",
                    style: { width: "100%", height: "150px" },
                  }}
                  backgroundColor="rgb(249, 250, 251)"
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setSigning(false)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleSaveSignature}
                  disabled={savingSignature}
                  className="flex-1 py-2.5 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors disabled:opacity-50"
                >
                  {savingSignature ? "저장 중..." : "서명 저장"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
