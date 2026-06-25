// 직접 그린 픽셀 아트 이모지 모음. <PixelEmoji name="coin" size={28} /> 처럼 씁니다.
// 한 글자가 한 픽셀이고, 아래 COLORS 표의 색으로 칠해집니다. (.은 투명)

const COLORS: Record<string, string> = {
  ".": "transparent",
  K: "#2b2b2b", // 외곽선(검정)
  Y: "#ffd23f", // 노랑
  P: "#ff7eb6", // 분홍
  G: "#ffcf4f", // 금색
  g: "#e0a020", // 금색 그림자
  W: "#ffffff", // 흰색(반짝임)
  B: "#4fb6e8", // 파랑
  N: "#6bcb77", // 초록(지폐)
  O: "#ff9f45", // 주황
  R: "#ff5a5a", // 빨강
};

// 엽전(동전): 한 푼이라도
const coin = [
  "...KKKKKK...",
  "..KGGGGGGK..",
  ".KGWGGGGgGK.",
  "KGWGGGGGGgGK",
  "KGGGKKKKGGGK",
  "KGGGKggKGGGK",
  "KGGGKggKGGGK",
  "KGGGKKKKGGGK",
  "KGgGGGGGGGgK",
  ".KGgGGGGgGK.",
  "..KGggggGK..",
  "...KKKKKK...",
];

// 날아가는 돈: 텅장 짤
const moneyFly = [
  ".W........W.",
  "WWW......WWW",
  ".WWKKKKKKWW.",
  "..KNNNNNNK..",
  ".KNNNNNNNNK.",
  ".KNWNNNNWNK.",
  ".KNWWNNWWNK.",
  ".KNNWNNWNNK.",
  ".KNWWNNWWNK.",
  ".KNNNNNNNNK.",
  "..KNNNNNNK..",
  "...KKKKKK...",
];

// 라면: 거지의 주식
const ramen = [
  "..W....W....",
  "...W..W.....",
  "..W..W......",
  "............",
  "KKKKKKKKKKKK",
  "KYOYYOYOYYOK",
  "KOYOOYOYOOYK",
  ".KBBBBBBBBK.",
  "..KBBBBBBK..",
  "...KBBBBK...",
  "....KKKK....",
  "............",
];

// 불: 핫딜 / 텅장에 불남
const fire = [
  ".....KK.....",
  "....KRRK....",
  "...KRRRRK...",
  "..KRROORRK..",
  "..KROOOORK..",
  ".KROOYYOORK.",
  ".KROYYYYORK.",
  ".KROYWWYORK.",
  ".KRROYYORRK.",
  "..KRROORRK..",
  "...KKKKKK...",
  "............",
];

// 하트: 찜 / 가난한 사랑
const heart = [
  ".KK...KK....",
  "KRRK.KRRK...",
  "KRWRKKRRRK..",
  "KRWRRRRRRRK.",
  "KRRRRRRRRRK.",
  ".KRRRRRRRK..",
  "..KRRRRRK...",
  "...KRRRK....",
  "....KRK.....",
  ".....K......",
  "............",
  "............",
];

// 말풍선: 댓글
const comment = [
  ".KKKKKKKKKK.",
  "KWWWWWWWWWWK",
  "KWWWWWWWWWWK",
  "KWPWPWPWWWWK",
  "KWWWWWWWWWWK",
  "KWWWWWWWWWWK",
  "KKKKKKKKKKKK",
  "..KKK.......",
  "..KK........",
  "..K.........",
  "............",
  "............",
];

const EMOJIS: Record<string, { grid: string[]; label: string }> = {
  coin: { grid: coin, label: "엽전" },
  moneyFly: { grid: moneyFly, label: "날아가는 돈" },
  ramen: { grid: ramen, label: "라면" },
  fire: { grid: fire, label: "불" },
  heart: { grid: heart, label: "하트" },
  comment: { grid: comment, label: "댓글" },
};

export type PixelEmojiName = keyof typeof EMOJIS;

export default function PixelEmoji({
  name,
  size = 28,
}: {
  name: PixelEmojiName;
  size?: number;
}) {
  const { grid, label } = EMOJIS[name];
  const cols = grid[0].length;
  const rows = grid.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cols} ${rows}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", verticalAlign: "middle" }}
      role="img"
      aria-label={label}
    >
      {grid.flatMap((row, y) =>
        row.split("").map((ch, x) =>
          ch === "." ? null : (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={COLORS[ch]}
            />
          )
        )
      )}
    </svg>
  );
}
