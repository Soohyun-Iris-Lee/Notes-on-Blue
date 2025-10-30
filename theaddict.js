document.addEventListener("DOMContentLoaded", () => {
  // 타깃 문단 (필요하면 selector 조정)
  const p = document.querySelector(".panel p");
  if (!p) return;

  // 원문 추출 후 문자 단위로 분해(줄바꿈/공백 보존)
  const text = p.textContent;
  const chars = Array.from(text);

  // HTML 다시 구성: 문자 → span.char
  // 줄바꿈은 <br>로, 나머지는 그대로 출력
  p.innerHTML = chars.map(ch => {
    if (ch === "\n") return "<br>";
    // 그대로 출력(공백 포함). 안전하게 이스케이프 필요시 추가 가능.
    return `<span class="char">${ch}</span>`;
  }).join("");

  const all = Array.from(p.querySelectorAll(".char"));
  // 틴트를 적용할 **대상(가시 문자)**: 공백 제외
  const eligible = all.filter(span => !/^\s$/.test(span.textContent));

  function retint() {
    // 1) 전체 초기화 (다만 hover 중이면 건드리지 않음)
    eligible.forEach(s => {
      if (!s.matches(":hover")) s.classList.remove("tinted");
    });

    // 2) 40% 무작위 선택
    const targetCount = Math.max(1, Math.floor(eligible.length * 0.4));
    const shuffled = eligible.slice().sort(() => Math.random() - 0.5);

    // 3) hover 중인 글자는 제외하고 채움
    let applied = 0;
    for (const s of shuffled) {
      if (s.matches(":hover")) continue;        // 사용자가 읽는 중이면 건너뛰기
      s.classList.add("tinted");
      if (++applied >= targetCount) break;
    }
  }

  // 최초 1회 + 주기적 갱신 (리듬은 원하는 값으로 조절)
  retint();
  setInterval(retint, 2000); // 1.8s마다 새로운 40%
});

const a1 = document.getElementById('audio1');
const a2 = document.getElementById('audio2');
const overlay = document.getElementById('playOverlay');
const playBtn = document.getElementById('playBtn');

function showOverlay() { overlay.style.display = 'flex'; }
function hideOverlay() { overlay.style.display = 'none'; }

/** 두 트랙을 동시에 플레이 시도 */
async function playBoth() {
  try {
    // 시작점 맞추고 동시에 재생
    a1.currentTime = 0;
    a2.currentTime = 0;

    const results = await Promise.allSettled([a1.play(), a2.play()]);
    const anyRejected = results.some(r => r.status === 'rejected');

    if (anyRejected) showOverlay(); else hideOverlay();
  } catch {
    showOverlay();
  }
}

/** 포커스 복귀 시 멈춰 있으면 재시도 */
function retryIfPaused() {
  if (!document.hidden && (a1.paused || a2.paused)) playBoth();
}

// 1) 페이지 로드 때 1차 시도 (일부 브라우저에서 무음이 아니면 실패 가능)
window.addEventListener('load', playBoth);

// 2) 사용자 제스처 시 재시도 (한 번만)
['click', 'touchstart', 'keydown'].forEach(evt => {
  document.addEventListener(evt, () => playBoth(), { once: true });
});

// 3) 오버레이 버튼으로 수동 재생
playBtn.addEventListener('click', playBoth);

// 4) 탭 전환 후 복귀 시 재시도
document.addEventListener('visibilitychange', retryIfPaused);

/* (선택) 루프 중 드리프트가 느껴지면 간단 재동기화 */
function resync() {
  // 두 트랙 중 더 많이 진행된 쪽에 맞춤
  const t = Math.max(a1.currentTime, a2.currentTime);
  a1.currentTime = t;
  a2.currentTime = t;
}
setInterval(() => {
  // 0.25초 이상 벌어지면 보정
  if (Math.abs(a1.currentTime - a2.currentTime) > 0.25) resync();
}, 5000);
