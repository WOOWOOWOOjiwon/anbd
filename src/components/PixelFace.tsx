// 직접 그린 픽셀 아트 "거지 스마일". 헝겊 기운 거지 모자를 쓰고,
// 눈물 한 방울 흘리지만 그래도 웃는 얼굴이에요. size(px)로 크기를 조절할 수 있어요.
export default function PixelFace({ size = 28 }: { size?: number }) {
  // 12칸 x 14칸 픽셀 그리드. 각 숫자가 색상 팔레트 인덱스를 가리켜요.
  // 0: 투명, 1: 외곽선(검정), 2: 얼굴(노랑), 3: 볼터치(분홍),
  // 4: 눈물(파랑), 5: 모자(갈색), 6: 기운 헝겊(초록)
  const palette = [
    "transparent",
    "#2b2b2b",
    "#ffd23f",
    "#ff7eb6",
    "#4fb6e8",
    "#a9744f",
    "#6bcb77",
  ];
  const grid = [
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0], // 모자 꼭대기
    [0, 0, 0, 1, 5, 5, 5, 5, 1, 0, 0, 0],
    [0, 0, 1, 5, 5, 6, 6, 5, 5, 1, 0, 0], // 초록 헝겊 패치
    [0, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 모자 챙
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0], // 이마
    [0, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 0], // 눈
    [0, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 0],
    [0, 1, 2, 4, 2, 2, 2, 2, 2, 3, 1, 0], // 눈물 + 볼터치
    [0, 1, 2, 4, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 1, 2, 1, 2, 2, 2, 2, 1, 2, 1, 0], // 입꼬리
    [0, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 0], // 입
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0], // 턱
  ];

  const cols = grid[0].length;
  const rows = grid.length;

  return (
    <svg
      width={size}
      height={Math.round((size * rows) / cols)}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", verticalAlign: "middle" }}
      role="img"
      aria-label="거지 스마일"
    >
      {grid.flatMap((row, y) =>
        row.map((c, x) =>
          c === 0 ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[c]} />
          )
        )
      )}
    </svg>
  );
}
