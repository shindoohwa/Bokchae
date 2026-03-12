// ══════════════════════════════════════════════════════════════════
// 명리학 계산 유틸
// ══════════════════════════════════════════════════════════════════

export const 천간 = ["갑","을","병","정","무","기","경","신","임","계"];
export const 지지 = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
export const 천간오행 = {갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"};
export const 지지오행 = {자:"수",축:"토",인:"목",묘:"목",진:"토",사:"화",오:"화",미:"토",신:"금",유:"금",술:"토",해:"수"};
export const 천간음양 = {갑:"양",을:"음",병:"양",정:"음",무:"양",기:"음",경:"양",신:"음",임:"양",계:"음"};
export const 오행색 = {목:"#4ade80",화:"#f87171",토:"#fbbf24",금:"#e2e8f0",수:"#60a5fa"};
export const 오행이모지 = {목:"🌳",화:"🔥",토:"🌍",금:"⚙️",수:"💧"};
export const 지지동물 = {자:"쥐🐭",축:"소🐮",인:"호랑이🐯",묘:"토끼🐰",진:"용🐲",사:"뱀🐍",오:"말🐴",미:"양🐑",신:"원숭이🐵",유:"닭🐔",술:"개🐶",해:"돼지🐷"};

const 월지순서 = ["인","묘","진","사","오","미","신","유","술","해","자","축"];

export function getYearGanji(y) {
  return { 간: 천간[(y-4+100)%10], 지: 지지[(y-4+120)%12] };
}

export function getMonthGanji(y, m) {
  const 지i = (m-1)%12, yi = (y-4+100)%10, ms = [2,4,6,8,0,2,4,6,8,0][yi];
  return { 간: 천간[(ms+지i)%10], 지: 월지순서[지i] };
}

function getDateNum(y, m, d) {
  const a = Math.floor((14-m)/12), yy = y+4800-a, mm = m+12*a-3;
  return d + Math.floor((153*mm+2)/5) + 365*yy + Math.floor(yy/4) - Math.floor(yy/100) + Math.floor(yy/400) - 32045;
}

export function getDayGanji(y, m, d) {
  const jd = getDateNum(y, m, d);
  return { 간: 천간[(jd+9+100)%10], 지: 지지[(jd+1+120)%12] };
}

export function getHourGanji(h, dg) {
  const sz = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const zi = h === 23 ? 0 : Math.floor((h+1)/2)%12;
  const di = 천간.indexOf(dg), st = [0,2,4,6,8,0,2,4,6,8][di];
  return { 간: 천간[(st+zi)%10], 지: sz[zi] };
}

export function analyzeOhaeng(saju) {
  const c = {목:0,화:0,토:0,금:0,수:0};
  saju.forEach(({간,지}) => { c[천간오행[간]]++; c[지지오행[지]]++; });
  return c;
}

export function getDominantOhaeng(ohaeng) {
  return Object.entries(ohaeng).sort((a,b) => b[1]-a[1])[0][0];
}

export function getDaeun(yg, mg, gender, by) {
  const fw = (천간음양[yg.간]==="양"&&gender==="남") || (천간음양[yg.간]==="음"&&gender==="여");
  const mi = 천간.indexOf(mg.간), ji = 지지.indexOf(mg.지);
  return Array.from({length:8}, (_,i) => ({
    나이: (i+1)*10, 시작년: by+(i+1)*10,
    간: 천간[(mi+(fw?i+1:-(i+1))+100)%10],
    지: 지지[(ji+(fw?i+1:-(i+1))+120)%12],
  }));
}
