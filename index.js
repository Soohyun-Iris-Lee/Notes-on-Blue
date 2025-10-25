const zone = document.getElementById("zone");
const titleEl = zone.querySelector(".hover-title");
const titlePart  = titleEl.querySelector(".t-title");
const authorPart = titleEl.querySelector(".t-author");
let toSevenTimer;

function setState(state){ zone.setAttribute("data-state", state); }

function toOneThenSeven(){
  clearTimeout(toSevenTimer);
  setState("one");
  toSevenTimer = setTimeout(() => setState("seven"), 600);
}

zone.addEventListener("mouseenter", () => {
  if (zone.getAttribute("data-state") === "five") toOneThenSeven();
});

zone.addEventListener("mouseleave", () => {
  clearTimeout(toSevenTimer);
  setState("five");
  titleEl.classList.remove("show"); // 영역 벗어나면 숨김
});

/* ▼ 각 박스에 호버/포커스 이벤트 연결 */
zone.querySelectorAll(".box").forEach(box => {
  const title  = box.dataset.title  || "";
  const author = box.dataset.author || "";

  function show(){
    if (zone.getAttribute("data-state") !== "seven") return; // 펼친 뒤에만
    // 부드러운 전환을 원하면 아래 2줄로 cross-fade도 가능:
    // titleEl.style.opacity = "0";
    // setTimeout(()=>{ ...set texts...; titleEl.style.opacity="1"; }, 200);
    titlePart.textContent  = title;
    authorPart.textContent = author;
    titleEl.classList.add("show");
  }
  function hide(){ titleEl.classList.remove("show"); }

  box.addEventListener("mouseenter", show);
  box.addEventListener("mouseleave", hide);
  box.addEventListener("focus", show);
  box.addEventListener("blur", hide);
});
// ===== About Hover 모드 토글 =====
const aboutLink = document.querySelector('.about');
const aboutDesc  = document.getElementById('about-desc');
let aboutTimer;

// 켜기
function openAbout(){
  clearTimeout(aboutTimer);
  document.body.classList.add('about-mode');
}

// 끄기 (살짝 지연으로 깜빡임 방지)
function closeAbout(){
  clearTimeout(aboutTimer);
  aboutTimer = setTimeout(()=> {
    document.body.classList.remove('about-mode');
  }, 60);
}

// About에 올리면 켜기 / 떼면 끄기
aboutLink.addEventListener('mouseenter', openAbout);
aboutLink.addEventListener('mouseleave', closeAbout);
aboutLink.addEventListener('focus', openAbout);
aboutLink.addEventListener('blur', closeAbout);

// 설명 박스 위에 있는 동안도 유지(읽을 수 있게)
aboutDesc.addEventListener('mouseenter', openAbout);
aboutDesc.addEventListener('mouseleave', closeAbout);
