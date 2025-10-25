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
