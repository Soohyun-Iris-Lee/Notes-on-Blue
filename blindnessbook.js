document.addEventListener("DOMContentLoaded", () => {
  const paragraph = document.querySelector(".content p, .panel p");
  if (!paragraph) return;

  // 줄바꿈 기준으로 줄 분리
  const lines = paragraph.innerText.split(/\n+/).filter(Boolean);
  paragraph.innerHTML = lines.map(line => `<span class="fade-line">${line}</span>`).join("<br>");

  const spans = paragraph.querySelectorAll(".fade-line");

  // 문단 전체 높이와 각 줄의 y좌표 계산
  const rect = paragraph.getBoundingClientRect();
  const top = rect.top;
  const height = rect.height;

  spans.forEach(span => {
    const spanRect = span.getBoundingClientRect();
    const relY = (spanRect.top - top) / height; // 0 ~ 1 사이
    // 위(0) → 아래(1)로 갈수록 1 → 0.03 비율로 투명도 감소
    const opacity = 1 - (relY * 0.995);
    span.style.opacity = opacity.toFixed(2);
  });

  // 스크롤 반응으로 업데이트 (패널 내부 스크롤용)
  paragraph.parentElement.addEventListener("scroll", () => {
    const rect = paragraph.getBoundingClientRect();
    const top = rect.top;
    const height = rect.height;

    spans.forEach(span => {
      const spanRect = span.getBoundingClientRect();
      const relY = (spanRect.top - top) / height;
      const opacity = Math.max(0.03, 1 - (relY * 0.97));
      span.style.opacity = opacity.toFixed(2);
    });
  });
});
