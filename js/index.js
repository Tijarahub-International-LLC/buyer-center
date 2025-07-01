import data from "../data.json" with { type: "json" };
const { faqs } = data;
const langToggle = document.querySelector("#lang-toggle");
const langMenu = document.querySelector("#lang-menu");
const menu = document.querySelector('.menu');
const close = document.querySelector('.close');
const burgerIcon = document.querySelector("header .burger-icon");
const pageHeader = document.querySelector("#page-header");
const playVideo = document.querySelector("#playVideo");
const closeVideo = document.querySelector("#closeVideo");
const videoContainer = document.querySelector("#videoContainer");

// Mobile Nav Logic
burgerIcon?.addEventListener('click', () => {
  menu.classList.toggle('active-menu');
  pageHeader.classList.toggle("overflow-hidden");
  document.querySelector("#navlinks").classList.add("text-white");
  menu.classList.remove('-z-10');
  if (!menu.classList.contains("z-10")) {
    menu.classList.add('z-10');
  }
  document.body.style.overflow = "hidden"
});

close?.addEventListener('click', () => {
  menu.classList.remove("z-10");
  pageHeader.classList.toggle("overflow-hidden");
  document.querySelector("#navlinks").classList.remove("text-white");
  if (!menu.classList.contains("-z-10")) {
    menu.classList.add("-z-10");
  }
  menu.classList.remove("active-menu");
  document.body.style.overflow = "auto"
})

// Scroll Toggle Navbar Background
function toggleHeaderBackground() {
  let headerHeight = document.querySelector("#hero").scrollHeight


  if (scrollY > headerHeight) {
    pageHeader.classList.remove("text-white");
    pageHeader.classList.add("text-night");
    pageHeader.classList.add("bg-white");
    pageHeader.classList.add("border-b");
    pageHeader.classList.add("border-main/10");

  } else {
    pageHeader.classList.add("text-white");
    pageHeader.classList.remove("text-night");
    pageHeader.classList.remove("bg-white");
    pageHeader.classList.remove("border-b");
    pageHeader.classList.remove("border-main/10");
  }
}

window.addEventListener("load", toggleHeaderBackground)
window.addEventListener("scroll", toggleHeaderBackground)



// Handle the lang options toggle
const handleLangOptions = () => {
  langMenu.classList.toggle("opacity-0")
  langMenu.classList.toggle("flex");
  langMenu.classList.toggle("hidden")
  pageHeader.classList.toggle("overflow-hidden")
}


// Fire Toggling Function
langToggle.addEventListener("click", handleLangOptions)


//Video Toggle

playVideo.addEventListener("click", () => {
  videoContainer.classList.toggle("hidden");
  videoContainer.classList.toggle("flex");
  document.body.classList.toggle("overflow-y-hidden")
})

closeVideo.addEventListener("click", () => {
  videoContainer.classList.toggle("hidden");
  videoContainer.classList.toggle("flex");
  document.body.classList.toggle("overflow-y-hidden");
  videoContainer.querySelector("video").pause();
})


// FAQs Toggler
const initialFAQs = faqs.filter((item) => item.cat === "Corporate Information");
// Toggle Answer Function
function toggleAnswer() {
  const buttons = document.querySelectorAll(".toggleAnswer");
  const answers = document.querySelectorAll(".faq-answer");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const currentAnswer = button.parentElement.nextElementSibling;
      const currentIcon = button.querySelector("i");
      // Close all other answers
      answers.forEach((answerEl) => {
        if (answerEl !== currentAnswer) {
          answerEl.style.maxHeight = null;
          answerEl.classList.remove("border-t");
        }
      });
      buttons.forEach((btn) => {
        const icon = btn.querySelector("i");
        if (btn !== button) {
          icon.classList.remove("rotate-180");
        }
      });
      // Toggle current one
      const isOpen = currentAnswer.style.maxHeight;
      if (isOpen) {
        currentAnswer.style.maxHeight = null;
        currentIcon.classList.remove("rotate-180");
        currentAnswer.classList.remove("border-t");
      } else {
        currentAnswer.style.maxHeight = `${currentAnswer.scrollHeight}px`;
        currentIcon.classList.add("rotate-180");
        currentAnswer.classList.add("border-t");
      }
    });
  });
}
// Inject Dom With Data
function displayFaqs(data) {
  let container = "";
  for (let i = 0; i < data.length; i++) {
    let { question, answer } = data[i]
    container += `
      <div class="bg-white border ${i === data.length - 1 ? "border-t-transparent" : ""} ${i === 0 ? "" : "border-t-transparent"} rounded-lg  border-main/10">
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center text-2xl text-center rounded-full size-12 bg-main/10 text-main"
                >
                <i class="fa-solid fa-question"></i>
                </div>
                  <h4 class="body">
                    ${question.en}
                  </h4>
                  </div>
                  <button  class="text-xl toggleAnswer text-main">
                    <i
                      class="transition-transform duration-300 fa-solid fa-chevron-down"
                    ></i>
                  </button>
              </div>
            <div
              class="px-6 faq-answer overflow-hidden transition-all border-main/10 max-h-0"
                >
                <p class="py-6">
                  ${answer.en}
                </p>
            </div>
      </div>
    `
  }
  document.querySelector("#faqsContainer").insertAdjacentHTML("beforeend", container);
  toggleAnswer();
}
// Fire Display Function
displayFaqs(initialFAQs)

// Handle Search FAQs
document.getElementById("search").addEventListener("keyup", (e) => {
  // Get Filterd Data
  const filterdData = faqs.filter(({ cat, question, answer }) => cat.toLowerCase() === e.target.value.toLowerCase() || question.en.toLowerCase().includes(e.target.value.toLowerCase()) || answer.en.toLowerCase().includes(e.target.value.toLowerCase()))

  // Empty Container
  document.querySelector("#faqsContainer").innerHTML = "";

  // Handle No FAQs Founded
  if (!filterdData.length) {
    document.querySelector("#faqsContainer").innerHTML = `<h4 class="h4 text-center">No Result Found for <span class="text-red-800">${e.target.value}</span></h4>`;
  } else {
    document.querySelector("#faqsContainer").innerHTML = "";
  }

  // Handle The Default FAQs
  if (e.target.value === "") {
    displayFaqs(initialFAQs)
  } else {
    displayFaqs(filterdData);
  }
})



//Handle Click Outside
document.body.addEventListener("click", (e) => {
  if (e.target != document.querySelector(".lang-icon") && e.target != langMenu) {
    if (!langMenu.classList.contains("opacity-0")) {
      handleLangOptions()
    }
  }
})