const langToggle = document.querySelector("#lang-toggle");
const langMenu = document.querySelector("#lang-menu");
const menu = document.querySelector('.menu');
const close = document.querySelector('.close');
const burgerIcon = document.querySelector("header .burger-icon");

// Mobile Nav Logic
burgerIcon?.addEventListener('click', () => {
  menu.classList.toggle('active-menu');
  document?.getElementById("page-header").classList.toggle("overflow-hidden")
  menu.classList.remove('-z-10');
  if (!menu.classList.contains("z-10")) {
    menu.classList.add('z-10');
  }
  document.body.style.overflow = "hidden"
});

close?.addEventListener('click', () => {
  menu.classList.remove("z-10");
  document?.getElementById("page-header").classList.toggle("overflow-hidden")
  if (!menu.classList.contains("-z-10")) {
    menu.classList.add("-z-10");
  }
  menu.classList.remove("active-menu");
  document.body.style.overflow = "auto"
})


// Handle the lang options toggle
const handleLangOptions = () => {
  langMenu.classList.toggle("opacity-0")
  langMenu.classList.toggle("flex");
  langMenu.classList.toggle("hidden")
  document.getElementById("page-header").classList.toggle("overflow-hidden")
}


document.body.addEventListener("click", (e) => {
  if (e.target != document.querySelector(".lang-icon") && e.target != langMenu) {
    if (!langMenu.classList.contains("opacity-0")) {
      handleLangOptions()
    }
  }
})


langToggle.addEventListener("click", handleLangOptions)
