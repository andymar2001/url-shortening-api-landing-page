const menu = document.getElementById("main-menu");
const btnMenu = document.getElementById("btn-nav");
const body = document.getElementsByTagName("body")[0];

btnMenu.addEventListener("click", () => {
  menu.classList.toggle("main-menu--active");
});

body.addEventListener("click", (e) => {
  if (
    e.target.parentElement.id != "btn-nav" &&
    e.target.tagName != "path" &&
    e.target.id != "main-menu"
  ) {
    menu.classList.remove("main-menu--active");
  }
});
