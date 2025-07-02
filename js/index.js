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


let isVideoOpened = false;
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


  if (scrollY > headerHeight - 150) {
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
langToggle.addEventListener("click", handleLangOptions)

function toggleVideoModal() {
  videoContainer.classList.toggle("hidden");
  videoContainer.classList.toggle("flex");
  document.body.classList.toggle("overflow-y-hidden");
  isVideoOpened = !isVideoOpened;
}
//Video Toggle
playVideo.addEventListener("click", toggleVideoModal)
closeVideo.addEventListener("click", toggleVideoModal)

document.addEventListener("keyup", (e) => {
  if (e.code === "Escape") {
    if (isVideoOpened) {
      toggleVideoModal();
    }
  }
})


// Insights Counter 
const insightsBoxes = document.querySelectorAll('.insights-box');
const options = { threshold: 0.5 };

const formatK = (num) => {
  const value = num / 1000;
  return value.toFixed(value % 1 === 0 ? 0 : 1) + 'K';
};

const animateCount = (el, target) => {
  let start = 0;
  const duration = 1500;
  const frameRate = 1000 / 60;
  const steps = duration / frameRate;
  const increment = target / steps;

  const update = () => {
    start += increment;
    if (start < target) {
      el.textContent = formatK(start);
      requestAnimationFrame(update);
    } else {
      el.textContent = formatK(target);
    }
  };

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver((entries, obs) => {

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const box = entry.target;
      box.classList.remove('opacity-0', 'translate-y-5');
      box.classList.add('opacity-100', 'translate-y-0');

      const numberEl = box.querySelector('.insights-num');
      const target = parseInt(numberEl.dataset.target);
      animateCount(numberEl, target);

      obs.unobserve(box);
    }
  });
}, options);

insightsBoxes.forEach(box => observer.observe(box));


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
  // Lang Menu
  if (e.target != document.querySelector(".lang-icon") && e.target != langMenu) {
    if (!langMenu.classList.contains("opacity-0")) {
      handleLangOptions()
    }
  }

  // Video Modal
  if (isVideoOpened) {
    if (e.target !== playVideo.querySelector("i")) {
      if (e.target !== videoContainer.querySelector("video")) {
        toggleVideoModal()
      }
    }
  }
})



// Sliders
new Swiper(".servicesSwiper", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  initialSlide: 4,
  loop: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 20,
    stretch: 0,
    depth: 320,
    modifier: 1,
    slideShadows: false,
  },
  pagination: false,
});

new Swiper(".categoriesSwiper", {
  spaceBetween: 0,
  freeMode: true,
  pagination: false,
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    620: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  }, navigation: {
    nextEl: ".swiper-button-next.categoriesSwiper",
    prevEl: ".swiper-button-prev.categoriesSwiper",
  },
});


new Swiper(".categoriesSwiper2", {
  spaceBetween: 0,
  freeMode: true,
  pagination: false,
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    320: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    620: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 50,
    },
  }, navigation: {
    nextEl: ".swiper-button-next.categoriesSwiper2",
    prevEl: ".swiper-button-prev.categoriesSwiper2",
  },
});

