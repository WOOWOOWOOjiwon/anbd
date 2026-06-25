// 직접 그린 픽셀 아트 웃는 얼굴. size(px)로 크기를 조절할 수 있어요.
export default function PixelFace({ size = 28 }: { size?: number }) {
  // 12x12 픽셀 그리드. 각 숫자가 색상 팔레트 인덱스를 가리켜요.
  // 0: 투명, 1: 외곽선(검정), 2: 얼굴(노랑), 3: 볼터치(분홍)
  const palette = ["transparent", "#2b2b2b", "#ffd23f", "#ff7eb6"];
  const grid = [
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 3, 2, 1, 2, 2, 2, 2, 1, 2, 3, 1],
    [1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1],
    [0, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  ];

  const cells = grid.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cells} ${cells}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", verticalAlign: "middle" }}
      role="img"
      aria-label="웃는 얼굴"
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
