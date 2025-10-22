document.addEventListener("DOMContentLoaded", () => {
  const p = document.querySelector(".panel p");
  if (!p) return;

  // 텍스트를 단어 단위로 감싸기
  const words = p.textContent.split(/\s+/);
  p.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");

  const spans = p.querySelectorAll(".word");

  function randomizeBlur() {
    spans.forEach(span => {
      // hover 상태가 아닐 때만 blur 갱신
      if (!span.matches(":hover")) span.classList.remove("blur");
    });

    // 전체 중 50% 단어 선택
    const blurCount = Math.floor(spans.length * 0.5);
    const shuffled = [...spans].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, blurCount);

    selected.forEach(span => {
      if (!span.matches(":hover")) span.classList.add("blur");
    });
  }

  // 처음 실행 + 2초마다 새로운 blur 패턴
  randomizeBlur();
  setInterval(randomizeBlur, 2000);
});
