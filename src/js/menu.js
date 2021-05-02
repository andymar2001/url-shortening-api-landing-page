const menu = document.getElementById("main-menu");
const btnNav = document.getElementById("btn-nav");

btnNav.addEventListener("click", () => {
  menu.classList.toggle("main-menu--active");
});
