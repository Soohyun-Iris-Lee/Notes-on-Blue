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
  setInterval(retint, 2400); // 1.8s마다 새로운 40%
});
