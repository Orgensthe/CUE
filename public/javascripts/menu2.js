

/* ========== Menu 2 ========== */
const menu2 = document.querySelector(".menu2");
const menuBox = document.querySelector(".menu-box");
menu2.addEventListener("click", function() {
  menu2.classList.toggle("active");
  menuBox.classList.toggle("show");
  menuBox.classList.toggle("active");
});
