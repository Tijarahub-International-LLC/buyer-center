import data from "../data.json" with { type: "json" };
AOS.init();
const { faqs, banks } = data;
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

// Lang Checker 
const isEnglishVersion = () => {
  return document.documentElement.lang === "en" ? true : false
}
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
  let headerHeight = document.querySelector("#hero")?.scrollHeight

  if (pageHeader) {

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
}

toggleHeaderBackground();
window.addEventListener("scroll", toggleHeaderBackground)



// Handle the lang options toggle
const handleLangOptions = () => {
  langMenu.classList.toggle("opacity-0")
  langMenu.classList.toggle("flex");
  langMenu.classList.toggle("hidden")
  pageHeader?.classList.toggle("overflow-hidden")
}
langToggle.addEventListener("click", handleLangOptions)

function toggleVideoModal() {
  videoContainer.classList.toggle("hidden");
  videoContainer.classList.toggle("flex");
  scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  })
  document.body.classList.toggle("overflow-y-hidden");
  isVideoOpened = !isVideoOpened;
}
//Video Toggle
playVideo?.addEventListener("click", toggleVideoModal)
closeVideo?.addEventListener("click", toggleVideoModal)

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
let initialFAQs = faqs.filter((item) => item.cat === "Corporate Information");

if (location.pathname === "/contact-us.html") {
  initialFAQs = faqs.filter((item) => item.cat === "Contract Information");
} else if (location.pathname === "/payment.html") {
  initialFAQs = faqs.filter((item) => item.cat === "Payment Methods");
}

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
function processPhoneNumbers(data) {
  const whatsappIndicators = [
    // English
    'via WhatsApp', 'WhatsApp at', 'WhatsApp on', 'via whatsapp', 'whatsapp at', 'whatsapp on',
    'WhatsApp message to', 'send a WhatsApp message to', 'message via WhatsApp',
    // Arabic
    'عبر واتساب', 'على واتساب', 'رسالة واتساب', 'أرسل رسالة واتساب', 'واتساب على'
  ];

  // Regex patterns
  const phoneRegex = /(?:\+|00)(?:\d\s*){10,15}/g;
  const whatsappIndicatorRegex = new RegExp(
    `(${whatsappIndicators.join('|')})\\s*((\\+|00)(?:\\d\\s*){10,15})`,
    'gi'
  );

  function processText(text, lang) {
    // Replace WhatsApp numbers with WhatsApp links
    text = text.replace(whatsappIndicatorRegex, (match, indicator, fullNumber) => {
      const number = fullNumber.replace(/\s+/g, '');
      return `<a href="https://wa.me/${number}">${indicator} ${fullNumber.trim()}</a>`;
    });

    // Replace remaining phone numbers with tel: links, skipping already-wrapped numbers
    text = text.replace(phoneRegex, match => {
      const number = match.replace(/\s+/g, '');

      // Skip if this number is already inside an anchor tag (WhatsApp or tel)
      if (text.includes(`https://wa.me/${number}`) || text.includes(`tel:${number}`)) {
        return match;
      }

      return `<a href="tel:${number}">${match.trim()}</a>`;
    });

    return text;
  }

  // Process each FAQ item
  // let resData =
  data.forEach(faq => {
    if (faq.answer?.en) {
      faq.answer.en = processText(faq.answer.en, 'en');
    }
    if (faq.answer?.ar) {
      faq.answer.ar = processText(faq.answer.ar, 'ar');
    }
  });


  return data;
}

// Inject Dom With Data
function displayFaqs(data) {
  processPhoneNumbers(data)
  let container = "";
  for (let i = 0; i < data.length; i++) {
    let { question, answer } = data[i]
    container += `
      <div data-aos="fade-up" class="bg-white border ${i === data.length - 1 ? "border-t-transparent" : ""} ${i === 0 ? "" : "border-t-transparent"} rounded-lg  border-main/10">
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <div class="flex items-center gap-4">
            <div
              class="flex items-center justify-center text-2xl text-center rounded-full size-12 bg-main/10 text-main"
                >
                <i class="fa-solid fa-question"></i>
                </div>
                  <h4 class="body">
                    ${isEnglishVersion() ? question.en : question.ar}
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
                  ${isEnglishVersion() ? answer.en : answer.ar}
                </p>
            </div>
      </div>
    `
  }
  document.querySelector("#faqsContainer")?.insertAdjacentHTML("beforeend", container);
  toggleAnswer();
}
// Fire Display Function
displayFaqs(initialFAQs)

// Handle Search FAQs
document.getElementById("search")?.addEventListener("keyup", (e) => {
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

if (location.pathname !== "/shipv3.html") {
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

  const categoriesSwiper = new Swiper(".categoriesSwiper", {
    spaceBetween: 0,
    freeMode: true,
    pagination: false,
    autoplay: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      620: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 8,
        spaceBetween: 10,
      },
    }, navigation: {
      nextEl: ".swiper-button-next.categoriesSwiper",
      prevEl: ".swiper-button-prev.categoriesSwiper",
    },
  });


  const agentsSwiper = new Swiper(".agentsSwiper", {
    spaceBetween: 0,
    freeMode: true,
    pagination: false,
    autoplay: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      620: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 6,
        spaceBetween: 30,
      },
    }, navigation: {
      nextEl: ".swiper-button-next.categoriesSwiper",
      prevEl: ".swiper-button-prev.categoriesSwiper",
    },
  });
}


// ========== Payment Page =============//
let currentbanks = banks.filter((bank) => bank.cat === "uae");
const banksContainer = document.querySelector("#banks-container")
const tabsContainer = document.querySelector("#tabs-container");
// displaySelectedBanks(currentbanks)
tabsContainer?.querySelectorAll("li button")?.forEach((btn) => {
  btn?.addEventListener("click", () => {
    tabsContainer?.querySelectorAll("li button").forEach((btn) => {
      btn.classList.remove("active-bank-tab");
    })
    btn.classList.add("active-bank-tab");
    if (btn.id === "uae") {
      currentbanks = banks.filter((bank) => bank.cat === "uae");
      displaySelectedBanks(currentbanks);
    } else if (btn.id === "sa") {
      currentbanks = banks.filter((bank) => bank.cat === "sa");
      displaySelectedBanks(currentbanks);
    } else if (btn.id === "jordan") {
      currentbanks = banks.filter((bank) => bank.cat === "jordan");
      displaySelectedBanks(currentbanks);
    } else if (btn.id === "kuwait") {
      currentbanks = banks.filter((bank) => bank.cat === "kuwait");
      displaySelectedBanks(currentbanks);
    }
  })
})
function displaySelectedBanks(selectedBanks) {
  let content = ""
  selectedBanks.forEach(({ name, img, alt }) => {
    content += `
  <div data-aos="fade-right">
    <img
      src="${img}"
      alt="${alt}"
    />
    <h4 class="body font-semibold">${name}</h4>
  </div>
  `})
  banksContainer.innerHTML = "";
  banksContainer?.insertAdjacentHTML("beforeend", content)
}
// ========== Shipment Page =============//

// Loading
const texts = ["Just wait...", "Gathering data...", "Almost ready...", "Be Patient..."];
const textEl = document.getElementById("loadingText");
let index = 0;
function toggleLoading() {
  document.querySelector("#loading").classList.toggle("hidden")
  document.querySelector("#loading").classList.toggle("flex")
  document.body.classList.toggle("overflow-y-hidden");
}

function animateText() {
  // Fade out
  textEl.classList.remove("opacity-100", "scale-100");
  textEl.classList.add("opacity-0", "scale-90");

  setTimeout(() => {
    // Change text
    index = (index + 1) % texts.length;
    textEl.textContent = texts[index];

    // Fade in with spring effect
    textEl.classList.remove("opacity-0", "scale-90");
    textEl.classList.add("opacity-100", "scale-100");
  }, 300);
}


if (textEl) {
  // Initial fade in
  setTimeout(() => {
    textEl.classList.add("opacity-100", "scale-100");
  }, 200);

  // Loop every 2.5s
  setInterval(animateText, 2500);
}

// Fetch Data 
async function getCountries() {
  let data = await fetch("https://rfq-iframe.tijarahub.com/countries/", {
    headers: {
      Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
    }
  })
  const countries = await data.json()
  return await countries
}
async function getPorts() {
  let data = await fetch("https://rfq-iframe.tijarahub.com/ports/", {
    headers: {
      Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
    }
  })
  const ports = await data.json()
  return await ports
}

async function getProducts() {
  try {
    const res = await fetch("https://rfq-iframe.tijarahub.com/products", {
      method: "GET",
      headers: {
        Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
      }
    })
    const data = await res.json();
    return data.products
  } catch (error) {
    console.log("🚀 ~ getProducts ~ error:", error)
  }
}
async function getSingleProduct(productId) {
  try {
    const res = await fetch(`https://rfq-iframe.tijarahub.com/products/${productId}`, {
      method: "GET",
      headers: {
        Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
      }
    })
    const data = await res.json();
    return data
  } catch (error) {
    console.log("🚀 ~ getProducts ~ error:", error)
  }
}
const selectedData = {};

async function initCountriesData() {
  // Elements
  const countriesData = await getCountries();
  const portsData = await getPorts();
  const countriesList = document.querySelector(".countries-list");
  const countriesList2 = document.querySelector(".countries-list2");
  const countries = [{ name: "Egypt", id: 3 }, { name: "Turkiye", id: 4 }];
  const countriesInput = document.querySelector("#countriesListSearch");
  const countriesInput2 = document.querySelector("#countriesListSearch2");
  const countryElements = {
    countryButton: document.querySelector("#countriesList"),
    countryMenu: document.querySelector("#countriesListMenu"),
    countryButton2: document.querySelector("#countriesList2"),
    countryMenu2: document.querySelector("#countriesListMenu2"),
  };

  // Display Countries List
  countries?.forEach((country) => {
    if (countriesList) {
      countriesList.innerHTML += `
      <li class="country-item rounded-sm p-2 hover:bg-gray-100">${country.name}</li>
      `;
    }
    if (countriesList2) {
      countriesList2.innerHTML += `
      <li class="country-item rounded-sm p-2 text-white hover:text-night hover:bg-gray-100">${country.name}</li>
      `;
    }
  });

  // Handle Search Countries
  [countriesInput, countriesInput2]?.forEach((input) => {
    input?.addEventListener("keyup", (e) => {
      const query = e.target.value.trim().toLowerCase();
      countriesList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
      });
    });
  })

  // Map on The Countries List
  countriesList?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Country 
      const selectedCountry = countriesData.filter((country) =>
        country.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.country = { ...selectedCountry[0] };

      // Add Selected Country to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      countryElements.countryButton.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      countryElements.countryMenu.classList.add("hidden");

      // Initialize Ports Based on Selected Country
      const targetPorts = portsData.filter((port) => port.country_id === selectedCountry[0].id);
      initPortsData(targetPorts);
    });
  });
  countriesList2?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Country 
      const selectedCountry = countriesData.filter((country) =>
        country.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.country = { ...selectedCountry[0] };

      // Add Selected Country to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      countryElements.countryButton.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      countryElements.countryMenu.classList.add("hidden");

      // Initialize Ports Based on Selected Country
      const targetPorts = portsData.filter((port) => port.country_id === selectedCountry[0].id);
      initPortsData(targetPorts);
    });
  });
}

async function initPortsData(targetPorts) {
  // Elements
  const portsData = await getPorts();
  const portsList = document.querySelector(".ports-list");
  const portsList2 = document.querySelector(".ports-list2");
  const portsInput = document.querySelector("#portsListSearch");
  const portsInput2 = document.querySelector("#portsList2Search");
  const portElements = {
    portButton: document.querySelector("#portsList"),
    portMenu: document.querySelector("#portsListMenu"),
    portButton2: document.querySelector("#portsList2"),
    portMenu2: document.querySelector("#portsList2Menu"),
  };

  // Empty The Ports List
  portsList.innerHTML = "";
  portsList2.innerHTML = "";

  targetPorts.forEach(({ name }) => {
    portsList.innerHTML += `
      <li class="port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
      `;
    portsList2.innerHTML += `
      <li class="port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
      `;
  });

  // Handle Search 
  [portsInput, portsInput2]?.forEach((input) => {
    input?.addEventListener("keyup", (e) => {
      const query = e.target.value.trim().toLowerCase();
      portsList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
      });
    });
  })

  // Map on The Ports List
  portsList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Port 
      const selectedPort = portsData.filter((port) =>
        port.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.port = { ...selectedPort[0] };

      // Add Selected Port to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Port to Port Button
      portElements.portButton.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      portElements.portMenu.classList.add("hidden");

      // Add The Selected Port Code to The Main Button
      document.querySelector("#location").querySelector("span").innerHTML = `${selectedPort[0].code}`;

      // Close The Main Menu
      document.querySelector("#locationMenu").classList.add("hidden");
    });
  });
  portsList2.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Port 
      const selectedPort = portsData.filter((port) =>
        port.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.port = { ...selectedPort[0] };

      // Add Selected Port to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Port to Port Button
      portElements.portButton2.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      portElements.portMenu2.classList.add("hidden");

      // Add The Selected Port Code to The Main Button
      document.querySelector("#location2").querySelector("span").innerHTML = `${selectedPort[0].code}`;

      // Close The Main Menu
      document.querySelector("#location2Menu").classList.add("hidden");
    });
  });
}

async function initDestinationPortsData(targetPorts) {
  // Elements
  const portsData = await getPorts();
  const portsList = document.querySelector(".destination-ports-list");
  const portsList2 = document.querySelector(".destination-ports-list2");
  const portsInput = document.querySelector("#destinationPortsListSearch");
  const portsInput2 = document.querySelector("#destinationPortsList2Search");
  const portElements = {
    portButton: document.querySelector("#destinationPortsList"),
    portMenu: document.querySelector("#destinationPortsListMenu"),
    portButton2: document.querySelector("#destinationPortsList2"),
    portMenu2: document.querySelector("#destinationPortsList2Menu"),
  };

  // Empty The Ports List
  if (portsList || portsList2) {
    portsList.innerHTML = "";
    portsList2.innerHTML = "";
  }

  if (targetPorts.length === 0) {
    portsList.innerHTML += `
        <li class="rounded-sm p-2 hover:bg-gray-100">Not Available Yet</li>
        `;
    portsList2.innerHTML += `
        <li class="rounded-sm p-2 hover:bg-gray-100">Not Available Yet</li>
        `;
  } else {
    targetPorts.forEach(({ name }) => {
      portsList.innerHTML += `
        <li class="destination-port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
        `;
      portsList2.innerHTML += `
        <li class="destination-port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
        `;
    });

    // Handle Search 
    [portsInput, portsInput2]?.forEach((input) => {
      input.addEventListener("keyup", (e) => {
        const query = e.target.value.trim().toLowerCase();
        portsList.querySelectorAll("li").forEach((li) => {
          li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
        });
      });
    })


    // Map on The Ports List
    portsList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", async (e) => {
        // Save Selected Port 
        const selectedPort = portsData.filter((port) =>
          port.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
        );
        selectedData.destinationPort = { ...selectedPort[0] };

        // Add Selected Port to LocalStorage
        localStorage.setItem("selectedData", JSON.stringify(selectedData));

        // Add Selected Port to Port Button
        portElements.portButton.querySelector("span").textContent = e.target.textContent;

        // Handle Toggling DropdownMenu 
        portElements.portMenu.classList.add("hidden");

        // Add The Selected Port Code to The Main Button
        document.querySelector("#destination").querySelector("span").innerHTML = `${selectedPort[0].code}`;
      });
    });
    portsList2.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
        // Save Selected Port 
        const selectedPort = portsData.filter((port) =>
          port.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
        );
        selectedData.destinationPort = { ...selectedPort[0] };

        // Add Selected Port to LocalStorage
        localStorage.setItem("selectedData", JSON.stringify(selectedData));

        // Add Selected Port to Port Button
        portElements.portButton2.querySelector("span").textContent = e.target.textContent;

        // Handle Toggling DropdownMenu 
        portElements.portMenu2.classList.add("hidden");

        // Add The Selected Port Code to The Main Button
        document.querySelector("#destination2").querySelector("span").innerHTML = `${selectedPort[0].code}`;
      });
    });
  }
}

async function initDestinationCountriesData() {
  // Elements
  let data = await getCountries();
  let countriesData = data
  countriesData = countriesData.filter((country) =>
    country.type === "Country" && country.name !== "Egypt" && country.name !== "Turkiye"
  );
  let portsData = await getPorts();
  portsData = portsData.filter((port) => port.country_id !== 3 && port.country_id !== 4);

  const countriesList = document.querySelector(".destination-countries-list");
  const countriesList2 = document.querySelector(".destination-countries-list2");
  const countriesInput = document.querySelector("#destinationCountriesListSearch");
  const countriesInput2 = document.querySelector("#destinationCountriesList2Search");
  const countryElements = {
    countryButton: document.querySelector("#destinationCountriesList"),
    countryMenu: document.querySelector("#destinationCountriesListMenu"),
    countryButton2: document.querySelector("#destinationCountriesList2"),
    countryMenu2: document.querySelector("#destinationCountriesList2Menu"),
  };

  // Display Countries List
  if (countriesData) {
    countriesData.forEach((country) => {
      if (countriesList) {
        countriesList.innerHTML += `
          <li class="destination-country-item rounded-sm p-2 hover:bg-gray-100">${country.name}</li>
          `;
      }
      if (countriesList2) {
        countriesList2.innerHTML += `
          <li class="destination-country-item rounded-sm p-2 hover:bg-gray-100">${country.name}</li>
          `;
      }
    });
  }

  // Handle Search Countries
  [countriesInput, countriesInput2]?.forEach((input) => {
    input?.addEventListener("keyup", (e) => {
      const query = e.target.value.trim().toLowerCase();
      countriesList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
      });
    });
  })

  // Map on The Countries List
  countriesList?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Country 
      const selectedCountry = countriesData.filter((country) =>
        country.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.destinationCountry = { ...selectedCountry[0] };

      // Add Selected Country to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      countryElements.countryButton.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      countryElements.countryMenu.classList.add("hidden");

      // Initialize Ports Based on Selected Country
      const targetPorts = portsData.filter((port) => port.country_id === selectedCountry[0].id);
      initDestinationPortsData(targetPorts);

      // Initialize Cities Based on Selected Country
      const targetCities = data.filter((item) => item.type === "City");
      const displayedCities = targetCities.filter((city) => city.parent_id === selectedData.destinationCountry.id)
      initDestinationCitiesData(displayedCities)
    });
  });

  countriesList2?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected Country 
      const selectedCountry = countriesData.filter((country) =>
        country.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.destinationCountry = { ...selectedCountry[0] };

      // Add Selected Country to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      countryElements.countryButton2.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      countryElements.countryMenu2.classList.add("hidden");

      // Initialize Ports Based on Selected Country
      const targetPorts = portsData.filter((port) => port.country_id === selectedCountry[0].id);
      initDestinationPortsData(targetPorts);

      // Initialize Cities Based on Selected Country
      const targetCities = data.filter((item) => item.type === "City");
      const displayedCities = targetCities.filter((city) => city.parent_id === selectedData.destinationCountry.id)
      initDestinationCitiesData(displayedCities)
    });
  });
}
async function initDestinationCitiesData(citiesData) {
  // Elements
  const citiesList = document.querySelector(".destination-cities-list");
  const citiesList2 = document.querySelector(".destination-cities-list2");
  const citiesInput = document.querySelector("#destinationCitiesSearch");
  const citiesInput2 = document.querySelector("#destinationCities2Search");
  const cityElements = {
    cityButton: document.querySelector("#destinationCitiesList"),
    cityMenu: document.querySelector("#destinationCitiesListMenu"),
    cityButton2: document.querySelector("#destinationCitiesList2"),
    cityMenu2: document.querySelector("#destinationCitiesList2Menu"),
  };

  // Display Countries List
  if (citiesData) {
    citiesList.innerHTML = ""
    citiesList2.innerHTML = ""
    citiesData.forEach((city) => {
      if (citiesList) {
        citiesList.innerHTML += `
          <li class="destination-country-item rounded-sm p-2 hover:bg-gray-100">${city.name}</li>
          `;
      }
      if (citiesList2) {
        citiesList2.innerHTML += `
          <li class="destination-country-item rounded-sm p-2 hover:bg-gray-100">${city.name}</li>
          `;
      }
    });
  }

  // Handle Search Cities

  [citiesInput, citiesInput2]?.forEach((input) => {
    input?.addEventListener("keyup", (e) => {
      const query = e.target.value.trim().toLowerCase();
      citiesList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
      });
    });
  })

  // Map on The Cities List
  citiesList?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected City 
      const selectedCity = citiesData.filter((city) =>
        city.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.destinationCity = { ...selectedCity[0] };

      // Add Selected City to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      cityElements.cityButton.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      cityElements.cityMenu.classList.add("hidden");
      // Close The Main Menu
      document.querySelector("#destinationMenu").classList.add("hidden")
    });
  });
  citiesList2?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Save Selected City 
      const selectedCity = citiesData.filter((city) =>
        city.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.destinationCity = { ...selectedCity[0] };

      // Add Selected City to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected Country to Country Button
      cityElements.cityButton2.querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      cityElements.cityMenu2.classList.add("hidden");
      // Close The Main Menu
      document.querySelector("#destination2Menu").classList.add("hidden")
    });
  });
}

async function initHsCodesData() {
  // Elements
  const productsData = await getProducts();
  const producstList = document.querySelector(".products-list");
  const productsInput = document.querySelector("#productsListsSearch");
  const productsElements = {
    hsCodeButton: document.querySelector("#productsList"),
    hsCodeMenu: document.querySelector("#productsListMenu"),
  };

  // Display HS Codes List
  if (productsData) {
    if (producstList) {
      producstList.innerHTML = ""
      productsData.forEach((product) => {
        producstList.innerHTML += `
            <li data-id="${product.product_id}" data-hscode="${product.srx_hs_code}" data-seo="${product.seo_name}" data-code="${product.product_code}" class="rounded-sm p-2 cursor-pointer hover:bg-gray-100 text-sm">${product.product}</li>
            `;
      });
    }
  }

  // Handle Search HS Codes
  productsInput?.addEventListener("keyup", (e) => {
    let query = e.target.value.toLowerCase().trim();
    const allItems = producstList.querySelectorAll("li");
    if (query.startsWith("http")) {
      query = query.split('/')[query.split('/').length - 1] == "" ? query.split('/')[query.split('/').length - 2] : query.split('/')[query.split('/').length - 1];
    }
    allItems.forEach((li) => {
      if (li.textContent.toLowerCase().trim().includes(query) || li.dataset.seo.toLowerCase().trim().includes(query) || li.dataset.code.toLowerCase().trim().includes(query) || li.dataset.hscode.includes(query) || li.dataset.seo.toLowerCase().trim().includes(query)) {
        li.classList.remove("hidden");
      } else {
        li.classList.add("hidden")
      }
    })
  });

  // Map on The HS Codes List
  producstList?.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", async (e) => {
      // Ignore click on "No Result Found" message
      if (e.target.closest(".no-result-msg")) return;
      // Save Selected HS Code 
      const selectedHsCodes = productsData.filter((product) =>
        product.product.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );

      // Add Selected HS Code to buttons
      productsElements.hsCodeButton.querySelector("span").textContent = e.target.textContent;
      document.querySelector("#productInfo").querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      productsElements.hsCodeMenu.classList.add("hidden")
      // Get Selected Product Data
      const singleProduct = await getSingleProduct(selectedHsCodes[0].product_id)
      // Implement Order Value
      if (singleProduct.prices.length === 1) {
        radios.forEach(radio => {
          radio.disabled = true;
          radio.checked = false;
        });
        orderValueInput.disabled = false;
        orderValueInput.value = "";
      } else {
        selectedData.mode = "Dry"
        localStorage.setItem("selectedData", JSON.stringify(selectedData))
        const ft20 = singleProduct.prices.find(price => price.container_name.includes("20"));
        const ft40 = singleProduct.prices.find(price => price.container_name.includes("40"));

        radios.forEach(radio => {
          radio.disabled = false;
          radio.checked = false;
        });

        if (ft20 && !ft40) {
          radios[1].disabled = true; // Disable 40ft option if not available
          radios[0].checked = true;  // Auto-select 20ft
          orderValueInput.value = ft20.price * ft20.lower_limit;
          orderValueInput.disabled = true;
          selectedData.orderValue = orderValueInput.value;
          selectedData.containerSize = radios[0].value;
          localStorage.setItem("selectedData", JSON.stringify(selectedData));
        } else if (!ft20 && ft40) {
          radios[0].disabled = true; // Disable 20ft option if not available
          radios[1].checked = true;  // Auto-select 40ft
          orderValueInput.value = ft40.price * ft40.lower_limit;
          orderValueInput.disabled = true;
          selectedData.orderValue = orderValueInput.value;
          selectedData.containerSize = radios[1].value;
          localStorage.setItem("selectedData", JSON.stringify(selectedData));
        } else if (ft20 && ft40) {
          radios[0].checked = true;  // Default to 20ft
          orderValueInput.value = ft20.price * ft20.lower_limit;
          orderValueInput.disabled = true;
          selectedData.orderValue = orderValueInput.value;
          selectedData.containerSize = radios[0].value;
          localStorage.setItem("selectedData", JSON.stringify(selectedData));
        }
      }
      const countriesData = await getCountries();
      const portsData = await getPorts();
      const selectedCountry = countriesData.filter((country) =>
        country.code.toLowerCase().trim() === singleProduct.srx_made_country_code.toLowerCase().trim()
      );
      selectedData.country = { ...selectedCountry[0] };
      // Disable Country List 
      document.querySelector("#countriesList").dataset.disabled = true;
      document.querySelector("#countriesList").disabled = true;
      // Disable Country List2 
      document.querySelector("#countriesList2").dataset.disabled = true;
      document.querySelector("#countriesList2").disabled = true;
      // Add Selected Country to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
      // Add Selected Country to Country Button
      document.querySelector("#location").querySelector("span").textContent = selectedCountry[0]?.code;
      document.querySelector("#countriesList").querySelector("span").textContent = selectedCountry[0]?.name;
      document.querySelector("#location2").querySelector("span").textContent = selectedCountry[0]?.code;
      document.querySelector("#countriesList2").querySelector("span").textContent = selectedCountry[0]?.name;
      const targetPorts = portsData.filter((port) => port.country_id === selectedCountry[0]?.id);
      initPortsData(targetPorts);
      selectedData.hsCode = { ...singleProduct };

      // Add Selected HS Code to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));
    });
  });
}

// Initialize all data
initHsCodesData();
initDestinationCountriesData();
initCountriesData();
// Shipment Date Validation
const shipmentDateInput = document.getElementById("shipmentDate");
const shipmentDateInput2 = document.getElementById("shipmentDate2");
[shipmentDateInput, shipmentDateInput2].forEach((input) => {
  input?.addEventListener("change", (e) => {
    selectedData.shipmentDate = e.target.value;
    localStorage.setItem("selectedData", JSON.stringify(selectedData));
  });
})

// Order Value Input
const orderValueInput = document.querySelector("#orderValueInput");
orderValueInput?.addEventListener("change", (e) => {
  selectedData.orderValue = e.target.value;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
});

// Toggle Mode (Cold/Dry)
const toggle = document.getElementById("toggle");
const labelText = document.getElementById("modeLabel");
toggle?.addEventListener("change", (e) => {
  const mode = toggle.checked ? "Cold" : "Dry";
  labelText.textContent = mode;
  selectedData.mode = mode;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
});

// Container Size Selection
const radios = document.querySelectorAll('input[name="container-size"]');
radios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    if (selectedData.hsCode) {
      const product = selectedData.hsCode;
      const ft20 = product.prices.find((price) => price.container_name.includes("20"))
      const ft40 = product.prices.find((price) => price.container_name.includes("40"))
      if (ft20) {
        if (e.target.value === ft20.container + "ft") {
          selectedData.containerSize = e.target.value;
          orderValueInput.value = ft20.price * ft20.lower_limit;
          selectedData.orderValue = orderValueInput.value;
          localStorage.setItem("selectedData", JSON.stringify(selectedData));
          fillProductCard(selectedData.hsCode)
        }
      }
      if (ft40) {
        if (e.target.value === ft40.container + "ft") {
          selectedData.containerSize = e.target.value;
          orderValueInput.value = ft40.price * ft40.lower_limit;
          selectedData.orderValue = orderValueInput.value;
          localStorage.setItem("selectedData", JSON.stringify(selectedData));
          fillProductCard(selectedData.hsCode)
        }
      }
    }

  });
});

// function getContainerSize() {
//   const selected = JSON.parse(localStorage.getItem("selectedData"));
//   if (selected?.containerSize) {
//     const targetInput = document.querySelector(`input[value="${selected.containerSize}"]`);
//     targetInput.checked = true
//     return selected ? selected : null;
//   }
// }

// // Initialize Current Cached Container Size When The Page is Loaded
// getContainerSize()



// Toggle Modal
function toggleValidationModal() {
  const modal = document.querySelector("#validationModal");
  modal.classList.toggle("hidden");
  document.body.classList.toggle("overflow-y-hidden");
}
// Fill Validation List
function fillValidationList(notVaildElementList) {
  const container = document.querySelector("#invalidFieldsList")
  container.innerHTML = ""
  let list = ""
  notVaildElementList.forEach((eleName) => {
    list = `
            <li>
              <p class="flex items-center gap-2">
                <span
                  class="size-5 flex items-center justify-center rounded-full p-2 transition-colors text-xs bg-red-100 text-red-500"
                  aria-label="Close"
                >
                  <i class="fa-solid fa-exclamation"></i>
                </span>
                ${eleName}
              </p>
            </li>
  `
    container.insertAdjacentHTML("beforeend", list)
  })
}


// Handle Form Submtion
const form = document.querySelector("#shipmentForm")
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const requiredFields = [
    { key: "hsCode", label: "Product Category (HS Code)" },
    { key: "orderValue", label: "Order Value" },
    { key: "containerSize", label: "Container Size (20ft or 40ft)" },
    { key: "mode", label: "Product Type (Dry or Cold)" },
    { key: "country", label: "Origin Country" },
    { key: "port", label: "Origin Port" },
    { key: "destinationCountry", label: "Destination Country (Must support ports)" },
    { key: "destinationPort", label: "Destination Port (Select a country that supports ports)" },
    { key: "destinationCity", label: "Destination City (Select Country First)" },
    { key: "shipmentDate", label: "Shipment Date (Must be in the future)" },
  ];

  const missingFields = [];

  requiredFields.forEach(({ key, label }) => {
    const value = selectedData[key];
    if (
      !value ||
      (key === "shipmentDate" && new Date(value) < new Date().setHours(0, 0, 0, 0))
    ) {
      missingFields.push(label);
    }
  });
  if (!document.querySelector("#valShipmentForm").classList.contains("hidden")) {
    document.querySelector("#valShipmentForm").classList.add("hidden")
  }

  if (missingFields.length > 0) {
    toggleValidationModal();
    fillValidationList(missingFields);
    return;
  }

  // Send Selected Data to The backend
  const requestBody = {
    origin_port: selectedData.port.code,
    destination_port: selectedData.destinationPort.code,
    container_size: selectedData.containerSize,
    container_type: selectedData.mode,
    destination_country: selectedData.destinationCity,
    date: selectedData.shipmentDate
  }
  getCardsData(requestBody);

  const calcRequest = {
    container_size: selectedData.containerSize,
    container_type: selectedData.mode,
    currency: "USD",
    destination_city: selectedData.destinationCity?.code,
    destination_country: selectedData.destinationCountry?.code,
    destination_port: selectedData.destinationPort?.code,
    hs_code: selectedData.hsCode?.srx_hs_code,
    imageSrc: selectedData.hsCode?.main_pair.detailed.image_path,
    origin_country: selectedData.hsCode?.srx_made_country_code,
    origin_port: `${selectedData.port?.code}`,
    product_name: selectedData.hsCode?.product,
    product_value: selectedData.orderValue,
    quantity: selectedData.hsCode?.prices[1].lower_limit,
    service_type: "DTD",
    shipment_mode: "Sea",
    srxMasterUnit: selectedData.hsCode?.srx_master_unit,
    unitName: selectedData.hsCode?.unit_name,
    unitsInProduct: selectedData.hsCode?.units_in_product
  }
  const calcData = await getCalcData(calcRequest);
  selectedData.deliveryToOriginPort = calcData.internal_shipment_cost.origin;
  selectedData.originCustomHandling = calcData.customs_cost.origin;
  selectedData.insurance = calcData.insurance_cost;
  selectedData.destinationCustomHandling = calcData.customs_cost.destination;
  selectedData.customDuties = calcData.duty_cost;
  selectedData.tax = calcData.vat_cost;
  selectedData.shippingToStore = calcData.internal_shipment_cost.destination;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
  fillProductCard(selectedData.hsCode)
})

async function getCardsData(requestBody) {
  const cardsContainer = document.querySelector(".cards-container")
  cardsContainer.innerHTML = ""
  try {
    toggleLoading();
    const res = await fetch("https://rfq-iframe.tijarahub.com/api/spot-on-quote/", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
      }
    })
    toggleLoading();
    const data = await res.json();
    // Fill The Cards Here 
    let content = "";
    if (data.length === 0) {
      content = `
      <h4 class="text-4xl font-bold">Sorry, Not Found Data</h4>
      `
      selectedData.cmaLength = data.length
      localStorage.setItem("selectedData", JSON.stringify(selectedData))
      document.querySelector("#modalTitle").textContent = "Faild to Fetch";
      document.querySelector("#modalDesc").textContent = `We couldn’t find any shipment data for the route from ${selectedData.port.code} to ${selectedData.destinationPort.code}. choose an option from the dropdowns below to see the information.`;
      fillValidationList([]);
      document.querySelector("#cancelModalBtn").classList.add("hidden")

    }
    if (data.status_code == 400 || data.status_code == 401 || data.status_code == 500) {
      selectedData.status_code = data.status_code
      localStorage.setItem("selectedData", JSON.stringify(selectedData))
      document.querySelector("#modalTitle").textContent = "Something Went Wrong!";
      document.querySelector("#modalDesc").textContent = `Faild to Fetch Data`;
      fillValidationList([`Sorry, No Data Found for This Ports (${selectedData.port.code} => ${selectedData.destinationPort.code}) Yet.`])
    } else {
      selectedData.cmaLength = data.length
      localStorage.setItem("selectedData", JSON.stringify(selectedData))
      data.forEach((ship, index) => {
        const colIndex = index % 3;
        content += `
        ${createAndFillShipCard(ship, colIndex)}`
        document.querySelector("#productInfoCard").classList.remove("hidden");
        // document.querySelector("#getQoute").classList.remove("hidden");
      })
    }
    cardsContainer.insertAdjacentHTML("beforeend", content)
    // Handle Cards Containers
    document.querySelectorAll(".ship-card-cta").forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        const selectedShipCardData = {
          shipName: data[i].routingLegs[0].vesselName,
          depDate: data[i].departureDate.split("T")[0],
          duration: data[i].transitTime.length > 1 ? `${data[i].transitTime} Days` : `${data[i].transitTime} Day`,
          durationMethod: data[i].routingLegs.length > 1 ? "Transit" : "Direct",
          allInRate: data[i].quoteLine.surcharges.matchingSurchargesPerEquipmentTypes[0].allInRate,
        }
        localStorage.setItem("selectedShipCardData", JSON.stringify(selectedShipCardData))
        selectedData.allInRate = data[i].quoteLine.surcharges.matchingSurchargesPerEquipmentTypes[0].allInRate
        localStorage.setItem("selectedData", JSON.stringify(selectedData))
        fillProductCard(selectedData.hsCode)
        const shipName = document.querySelector(".cif-ship-name").querySelector("span");
        const shipInfo = document.querySelector(".cif-ship-info").querySelector("span");
        const shipAllInRate = document.querySelector(".cif-ship-allinrate").querySelector("span");
        shipName.textContent = selectedShipCardData.shipName;
        shipInfo.textContent = `${selectedShipCardData.depDate} - ${selectedShipCardData.duration} - ${selectedShipCardData.durationMethod}`;
        shipAllInRate.textContent = "$" + selectedShipCardData.allInRate;
      })
    })
  }
  catch (error) {
    console.log("🚀 ~ getData ~ error:", error.message)
    fillValidationList([`${error.message}`])
  }
}

function createAndFillShipCard(ship, index) {

  const emailVariables = {
    country: ship.routingLegs[0].legTo.placeCountry.name,
    allInRate: ship.quoteLine.surcharges.matchingSurchargesPerEquipmentTypes[0].allInRate,
    vesselName: ship.routingLegs[0].vesselName,
    arrivalDate: ship.arrivalDate.split("T")[0],
    portCode: ship.routingLegs[0].legTo.place.internalCode,
    departureDate: ship.departureDate.split("T")[0],
    transitTime: ship.transitTime,
    routeType: ship.routingLegs.length > 1 ? "Transit" : "Direct",
    originPort: selectedData.port.code,
    destinationPort: selectedData.destinationPort.code,
    hscode: selectedData.hsCode,
    orderValue: selectedData.orderValue,
    containerSize: selectedData.containerSize,
    // Add transshipment vessels if they exist
    transshipments: ship.routingLegs.length > 1 ?
      ship.routingLegs.slice(1).map(leg => leg.vesselName).join(", ") : "None"
  };

  // Create mailto link
  const body = `
        Main Vessel: ${emailVariables.vesselName}
        Departure: ${emailVariables.departureDate}
        Arrival: ${emailVariables.arrivalDate}
        Transit Time: ${emailVariables.transitTime} days
        Route Type: ${emailVariables.routeType}
        All-in Rate: $${emailVariables.allInRate}

        Additional Vessels: ${emailVariables.transshipments}

        Ports:
        - Origin: ${emailVariables.originPort}
        - Destination: ${emailVariables.destinationPort}
        - Discharge Port Code: ${emailVariables.portCode}

        Cargo Details:
        - HS Code: ${emailVariables.hscode.code}
        - Order Value: $${emailVariables.orderValue}
        - Container Size: ${emailVariables.containerSize}
        `;

  const mailtoLink = `https://wa.me/+201555943415?text=${encodeURIComponent(body)}`;
  let content = ` 
      <div data-aos="${index === 0 ? "fade-right" : index === 1 ? "fade-up" : "fade-left"}" class="w-[350px] xl:w-[360px] max-[350px]:w-[260px] h-[540px] group perspective-[1000px]">
            <div
              class="relative transition-transform duration-700 flip-card-inner group-hover:rotate-y-180 transform-3d size-full"
            >
              <div
                class="flip-card-front backface-hidden absolute size-full rounded-2xl flex flex-col bg-[url('../assets/images/shipment/taj.jpg')] bg-cover bg-top p-6 overflow-hidden shadow-[0_8px_14px_0_rgba(0,_0,_0,_0.2)]"
              >
                <div class="flex-1 text-center">
                  <span
                    class="rounded p-3 px-6 mx-auto font-bold bg-main text-center text-white uppercase"
                  >
                    ${selectedData.destinationCountry.name}
                  </span>
                </div>
                <div class="group-hover:z-auto z-10 self-end">
                  <div
                  class="flex absolute flex-col gap-6 text-white transition-all duration-500 bottom-10 group-hover:-start-full start-10 content"
                          >
                    <div>
                      <span class="text-lg font-bold">All in Rate</span>
                      <h3 class="text-6xl font-bold">$${ship.quoteLine.surcharges.matchingSurchargesPerEquipmentTypes[0].allInRate}</h3>
                      <h3 class="text-6xl font-bold">${ship.routingLegs[0].vesselName}</h3>
                    </div>
                    <div class="flex gap-2">
                      <span class="bg-main py-0.5 px-3 text-sm rounded-sm">
                        ${selectedData.destinationPort.code}
                      </span>
                      <span class="bg-main py-0.5 px-3 text-sm rounded-sm">
                      ${ship.arrivalDate.split("T")[0]}
                      </span>
                    </div>
                  </div>
                </div>
                <!-- Overlay -->
                <div
                  class="absolute size-full bg-gradient-to-b from-transparent to-black/80  top-0 left-0"
                >
                </div>
              </div>
              <div
                class="flip-card-back rotate-y-180 backface-hidden absolute size-full text-night rounded-2xl flex flex-col  p-6 overflow-hidden shadow-[0_8px_14px_0_rgba(0,_0,_0,_0.2)]"
              >
                <div class="relative z-50 space-y-4 size-full">
                  <div class="flex flex-col gap-1 card-header">
                    <span class="text-base font-medium">${selectedData.port.code} <i class="fa-solid fa-right-long"></i> ${selectedData.destinationPort.code}</span>
                    <ul
                      class="other-info flex items-center gap-2 *:py-1.5 *:px-2.5 text-xs *:flex-1 *:rounded *:bg-main text-white text-center"
                    >
                      <li><p class="truncate max-w-[160px]">${selectedData.hsCode.product}</p></li>
                      <li><p>$${selectedData.orderValue}</p></li>
                      <li><p>${selectedData.containerSize}</p></li>
                    </ul>
                    <span class="text-gray-500 mt-4">Departure Date</span>
                  </div>
                  <div
                    class="relative card-body ps-8 before:absolute before:h-full before:w-0.5 before:start-4 before:top-1.5 before:bg-gray-500 flex flex-col gap-4"
                  >
                    <span
                      class="relative ps-2 before:translate-x-[calc(-50%_+_(0.125rem_/_2))] departure-date before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-full before:-start-4 before:size-3.5 before:bg-gray-500"
                      >${ship.departureDate.split("T")[0]}</span
                    >
                    <div class="relative mb-3 ps-4">
                    ${ship.routingLegs[0].vesselName.split("").length > 10 ?
      `<h4 class="mt-2 mb-3 h3 font-bold">${ship.routingLegs[0].vesselName}</h4>` : `<h4 class="mt-2 mb-3 h3 font-bold max-w-[150px]">${ship.routingLegs[0].vesselName}</h4>`}
                      <ul
                        class="flex flex-wrap  items-center gap-x-2 gap-y-0.5 text-sm text-gray-500"
                      >
                      ${ship.routingLegs.length > 1 ? ship.routingLegs.slice(1).map((leg) => {

        return `<li><p>${leg.vesselName}</p></li>`
      }).join(" ") : ""}
                      
                      </ul>
                      <div
                        class="flex flex-wrap mt-4 items-center gap-2 *:py-1.5 *:px-4 *:rounded text-sm *:bg-main text-white text-center"
                      >
                        <p>${ship.transitTime} ${ship.transitTime > 1 ? "Days" : "Day"} </p>
                        <p>${ship.routingLegs.length > 1 ? "Transit" : "Direct"}</p>
                      </div>
                      <span
                        class="absolute py-4 -translate-x-1/2 -translate-y-1/2 bg-white -start-4 top-1/2"
                      >
                        <i class="text-4xl text-main fa-solid fa-ship"></i
                      ></span>
                    </div>
                    <span class="relative ps-2"
                      >${ship.arrivalDate.split("T")[0]}
                      <span
                        class="absolute text-xl text-gray-500 -translate-x-1/2 -translate-y-1/2 p-2 bg-white -start-4 top-1/2"
                        ><i class="fa-solid fa-location-dot ms-0.5"></i
                      ></span>
                    </span>
                  </div>
                  <span class="text-gray-500">Arrival Date</span>
                  <div class="mt-5 text-center ">
                    <button
                      class="ship-card-cta w-full relative p-4 text-white bg-main rounded-lg"
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div class="absolute top-0 bg-white size-full start-0"></div>
              </div>
            </div>
          </div>
  `
  return content
}


// Handle Custom Dropdown Menus 
const menus = document.querySelectorAll("[role='menu']")

function closeAllMenus(except = null) {
  menus.forEach((menu) => {
    if (menu !== except && !menu.contains(except)) {
      menu.classList.add("hidden");
      menu.classList.remove("flex");
    }
  });
}
function isNestedMenu(menu) {
  return !!menu.closest("[role='menu']:not(#" + menu.id + ")");
}
function toggleTargetMenu(menu) {
  const isOpen = !menu.classList.contains("hidden");

  if (isOpen) {
    menu.classList.add("hidden");
    menu.classList.remove("flex");
  } else {
    const isNested = isNestedMenu(menu)
    if (!isNested) {
      closeAllMenus(menu);
    } else {
      closeSiblingMenus(menu)
    }
    menu.classList.remove("hidden");
    menu.classList.add("flex");
  }
}
function closeSiblingMenus(menu) {
  const parentMenu = menu.parentElement.closest("[role='menu']");
  if (parentMenu) {
    const siblings = parentMenu.querySelectorAll("[role='menu']");
    siblings.forEach((sibling) => {
      if (sibling !== menu) {
        sibling.classList.add("hidden");
        sibling.classList.remove("flex");
      }
    });
  }
}
menus.forEach((menu) => {
  const buttonId = menu.id.replace("Menu", "");
  const button = document.getElementById(buttonId);

  if (button) {
    button.addEventListener("click", (e) => {
      if (button.dataset.disabled === "true") {
        return;
      }
      e.stopPropagation();
      toggleTargetMenu(menu);
    });
  }
})
// Date Picker
flatpickr("#shipmentDate", {
  dateFormat: "Y-m-d",  // Specify the date format
  minDate: "today",  // Disable past dates (optional)
  disableMobile: true  // Disable mobile-specific UI (optional)
});
flatpickr("#shipmentDate2", {
  dateFormat: "Y-m-d",  // Specify the date format
  minDate: "today",  // Disable past dates (optional)
  disableMobile: true  // Disable mobile-specific UI (optional)
});
// Handle Click Outside 
document.body.addEventListener("click", (e) => {
  if (e.target === document.querySelector("#validationModal") || e.target === document.querySelector("#closeModalBtn") || e.target === document.querySelector("#cancelModalBtn") || e.target === document.querySelector("#closeModalBtn")?.querySelector("i")) {
    toggleValidationModal();
  }
  if (!e.target.closest("[role='menu']") && !e.target.closest("button")) {
    closeAllMenus();
  }
})

document.querySelector("#shipmentCardsModal").addEventListener("click", (e) => {
  e.stopPropagation()
  if (e.target === document.querySelector("#shipmentCardsModal").querySelector("#closeShipmentModal") || e.target === document.querySelector("#shipmentCardsModal").querySelector("#closeShipmentModal").querySelector("i")) {
    toggleShipmentCardModal();
  }
})

// Product Card 
function fillProductCard(card) {
  const { product, prices, srx_hs_code, product_code, srx_master_unit, main_pair, units_in_product, unit_name } = card;
  const { detailed: { image_path, alt } } = main_pair;
  const ft20 = prices[1];
  const ft40 = prices[2];

  let content = `
          <div class="flex flex-col lg:flex-row lg:justify-between gap-3">
  <div class="flex flex-col lg:flex-row lg:items-center gap-5">
    <img src="${image_path}" class="rounded-xl size-40" alt="${alt}" />
    <div class="flex flex-col space-y-2.5">
      <h4 class="h4">${product}</h4>
      <div>
        <p class="h4 text-main">$${selectedData.containerSize === "20ft" ? ft20.price : ft40.price} per ${srx_master_unit}</p>
        <span class="text-sm text-gray-400">Quantity discount applied </span>
      </div>

      <p class="italic text-gray-400">HS-Code: ${srx_hs_code}</p>
    </div>
  </div>
  <div class="flex flex-col text-end">
    <h4>${product_code}</h4>
    ${ft20 ? `
    <p class="flex items-center justify-end gap-2">
      <span>20ft</span> <i class="fa-solid fa-right-long"></i>
      <span>${ft20.lower_limit} ${srx_master_unit} </span>
    </p>
    ` : ""} ${ft40 ? `
    <p class="flex items-center justify-end gap-2">
      <span>40ft</span> <i class="fa-solid fa-right-long"></i>
      <span>${ft40.lower_limit} ${srx_master_unit}</span>
    </p>
    ` : ""}
  </div>
</div>
<div class="flex flex-col lg:flex-row gap-5">
  <div
    class="logistic-card active flex flex-col lg:flex-row lg:items-center group gap-0 hover:gap-5 relative"
  >
    <div class="flex-1 space-y-2">
      <p class="price h3">$${(selectedData.orderValue).toLocaleString()}</p>
      <div>
        <h3 class="h4">Ex Work</h3>
        <p class="text-[10px] italic text-gray-400">Order Value</p>
      </div>
      <button class="cta">Select</button>
    </div>
    <div
      class="lg:w-0 lg:overflow-hidden text-center transition-all duration-300 lg:opacity-0 lg:group-hover:flex-2 lg:group-hover:opacity-100 lg:group-hover:delay-300"
    >
      <div class="flex flex-col gap-2 text-sm">
        <div
          class="flex flex-col *:w-full md:flex-row *:md:w-[calc(50%_-_0.25rem)] text-start gap-2 items-center"
        >
          <div class="flex flex-col gap-2">
            <label for="carton-price">Price Per ${srx_master_unit}</label>
            <div class="relative">
              <input
                id="carton-price"
                type="number"
                name="carton-price"
                placeholder="$14000"
                disabled
                value="${ft20.price}"
                class="w-full ps-8 p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-0"
              />
              <i class="fa-solid fa-dollar-sign absolute start-4 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label for="carton-piece">Price Per ${unit_name}</label>
            <div class="relative">
              <input
                id="carton-piece"
                type="number"
                name="carton-piece"
                value="${Number(ft20.price / units_in_product).toFixed(2)}"
                placeholder="$2.38"
                disabled
                class="w-full ps-8 p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-0"
              />
              <i class="fa-solid fa-dollar-sign absolute start-4 top-1/2 -translate-y-1/2"></i>
            </div>
          </div>
        </div>
        <div>
          <input
            type="text"
            name="neg-price"
            placeholder="Negotiation"
            class="w-full p-3 bg-transparent border border-gray-400 rounded-lg focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="logistic-card flex flex-col lg:flex-row lg:items-center group gap-0 hover:gap-5 relative">
    <div class="flex-1 space-y-2">
      <p class="price h3">
        $${(+selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling).toLocaleString()}
      </p>
      <div>
        <h3 class="h4">FOB</h3>
        <p class="text-[10px] italic text-gray-400">Free on Board</p>
      </div>
      <button class="p-3 cta">Select</button>
    </div>
    <div
      class="lg:w-0 lg:overflow-hidden text-center transition-all duration-300 lg:opacity-0 lg:group-hover:flex-2 lg:group-hover:opacity-100 lg:group-hover:delay-300"
    >
      <div
        class="space-y-1.5 text-start text-sm *:flex *:items-center *:justify-between"
      >
        <p class="italic">
          EX Work
          <span class="font-bold text-main">$${selectedData.orderValue}</span>
        </p>
        <p class="italic">
          Delivery to Origin Port
          <span class="font-bold text-main"
            >$${selectedData.deliveryToOriginPort}</span
          >
        </p>
        <p class="italic">
          Origin customs & handling
          <span class="font-bold text-main"
            >$${selectedData.originCustomHandling}</span
          >
        </p>
      </div>
    </div>
  </div>
  <div class="logistic-card flex flex-col lg:flex-row lg:items-center group gap-0 hover:gap-5 relative">
    <div class="flex-1 space-y-2">
      <p id="cif-total" class="price h3">
        $${(selectedData.allInRate ? +selectedData.allInRate + +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance : +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance).toLocaleString()}
      </p>
      <div>
        <h3 class="h4">CIF</h3>
        <p class="text-[10px] italic text-gray-400">Cost, Insurance, Freight</p>
      </div>
      <button class="cta cta-cif">Freight Rate</button>
    </div>
    <div
      class="lg:w-0 lg:overflow-hidden text-center transition-all duration-300 lg:opacity-0 lg:group-hover:flex-2 lg:group-hover:opacity-100 lg:group-hover:delay-300"
    >
      <div
        class="space-y-1.5 text-start text-sm *:flex *:items-center *:justify-between"
      >
        <p class="italic">
          FOB
          <span class="font-bold text-main"
            >$${(+selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling).toLocaleString()}</span
          >
        </p>
        <p class="italic">
          <span
            >Insurance - <span class="text-xs text-main">Optional</span></span
          >
          <span class="font-bold text-main">$${selectedData.insurance}</span>
        </p>
        <p class="italic cif-ship-name">
          Ship Name
          <span class="font-bold text-main">Ship Name</span>
        </p>
        <p class="italic cif-ship-info">
          Ship Info
          <span class="font-bold text-main"> Ship Info</span>
        </p>
        <p class="italic cif-ship-allinrate">
          All in Rate
          <span class="font-bold text-main">All in Rate</span>
        </p>
        <button id="cta-cif-change" class="underline rounded ms-auto p-">
          <p class="italic">Change Freight Rate</p>
        </button>
      </div>
    </div>
  </div>
  <div class="logistic-card flex flex-col lg:flex-row lg:items-center group  gap-0 hover:gap-5 relative">
    <div class="flex-1 space-y-2">
      <p class="price h3">
        $${(selectedData.allInRate ? +selectedData.allInRate + +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance +
      +selectedData.destinationCustomHandling + +selectedData.customDuties +
      +selectedData.tax + +selectedData.shippingToStore : +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance +
      +selectedData.destinationCustomHandling + +selectedData.customDuties +
      +selectedData.tax + +selectedData.shippingToStore).toLocaleString()}
      </p>
      <div>
        <h3 class="h4">DDP</h3>
        <p class="text-[10px] italic text-gray-400">Delivery Duty Paid</p>
      </div>
      <button class="cta cta-ddp">Get Freight Rate</button>
    </div>
    <div
      class="lg:w-0 lg:overflow-hidden text-center transition-all duration-300 lg:opacity-0 lg:group-hover:flex-2 lg:group-hover:opacity-100  lg:group-hover:delay-300"
    >
      <div
        class="space-y-1.5 text-start text-sm *:flex *:items-center *:justify-between"
      >
        <p class="italic" id="cif-cif">
          CIF
          <span class="font-bold text-main"
            >$${(selectedData.allInRate ? +selectedData.allInRate + +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance : +selectedData.orderValue + +selectedData.deliveryToOriginPort +
      +selectedData.originCustomHandling + +selectedData.insurance).toLocaleString()}</span
          >
        </p>
        <p class="italic" id="cif-dch">
          Destination Customs & Handling
          <span class="font-bold text-main"
            >$${selectedData.destinationCustomHandling}</span
          >
        </p>
        <p class="italic" id="cif-cd">
          Customs Duties
          <span class="font-bold text-main">$${selectedData.customDuties}</span>
        </p>
        <p class="italic" id="cif-tax">
          Tax
          <span class="font-bold text-main">$${selectedData.tax}</span>
        </p>
        <p class="italic" id="cif-sts">
          Shipping to Store
          <span class="font-bold text-main"
            >$${selectedData.shippingToStore}</span
          >
        </p>
      </div>
    </div>
  </div>
</div>
<div class="md:text-center mt-6">
            <button class="cta-get-quote max-md:w-full p-4 h4 rounded-lg bg-main text-white text-center">Get a Qoute</button>
</div>
  `

  document.querySelector("#productInfoCard").innerHTML = ""
  document.querySelector("#productInfoCard").insertAdjacentHTML("beforeend", content)
  document.querySelector(".cta-cif")?.addEventListener("click", (e) => {
    if (selectedData.cmaLength === 0) {
      document.querySelector("#modalTitle").textContent = "Faild to Fetch";
      document.querySelector("#modalDesc").textContent = `We couldn’t find any shipment data for the route from ${selectedData.port.code} to ${selectedData.destinationPort.code}. choose an option from the dropdowns below to see the information.`;
      fillValidationList([]);
      document.querySelector("#cancelModalBtn").classList.add("hidden")
      toggleValidationModal();
      if (document.querySelector("#valShipmentForm").classList.contains("hidden")) {
        document.querySelector("#valShipmentForm").classList.remove("hidden")
      }
      return
    }
    toggleShipmentCardModal();
    e.target.textContent = "Select";
    document.querySelector(".cta-ddp").textContent = "Select";

  })
  document.querySelector("#cta-cif-change")?.addEventListener("click", (e) => {
    document.querySelector("#modalTitle").textContent = "Select to Get Result";
    document.querySelector("#modalDesc").textContent = "select location and destination information below:";
    fillValidationList([])
    document.querySelector("#cancelModalBtn").classList.add("hidden")
    toggleValidationModal();
    if (document.querySelector("#valShipmentForm").classList.contains("hidden")) {
      document.querySelector("#valShipmentForm").classList.remove("hidden")
    }
  })

  document.querySelectorAll(".cta").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".logistic-card").forEach((card) => {
        card.classList.remove("active")
      })
      document.querySelectorAll(".logistic-card")[i].classList.add("active")
    })
  })
  document.querySelector(".cta-get-quote").addEventListener("click", () => {
    const shipmentInformation = JSON.parse(localStorage.getItem("selectedShipCardData"));
    if (shipmentInformation) {
      const messageContent = `
    From (${selectedData.country.name} - ${selectedData.port.name}) to (${selectedData.destinationCountry.name} - ${selectedData.destinationPort.name} ${selectedData.destinationCity.name}) 
    Product HS-CODE: ${selectedData.hsCode.srx_hs_code}
    Order Value: $${selectedData.orderValue}
    Ship Name: ${shipmentInformation.shipName}
    Ship Type: ${shipmentInformation.durationMethod}
    Ship Duration: ${shipmentInformation.duration}
    Departure Date: ${shipmentInformation.depDate}
    `
      location.href = `https://wa.me/+201555943415?text=${encodeURIComponent(messageContent)}`
    } else {
      alert("Get Frieght Rate First")
    }
  })

}

function toggleShipmentCardModal() {
  document.querySelector("#shipmentCardsModal").classList.toggle("hidden");
  document.querySelector("#shipmentCardsModal").classList.toggle("flex");
}

document.querySelector("#valShipmentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  // Send Selected Data to The backend
  const requestBody = {
    origin_port: selectedData.port.code,
    destination_port: selectedData.destinationPort.code,
    container_size: selectedData.containerSize,
    container_type: selectedData.mode,
    destination_country: selectedData.destinationCity,
    date: selectedData.shipmentDate
  }
  await getCardsData(requestBody);
  if (selectedData.cmaLength > 0) {
    toggleShipmentCardModal()
  }
})



/// Get Calculator Data 
async function getCalcData(requestBody) {
  try {
    const res = await fetch("https://rfq-iframe.tijarahub.com/calculate/", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
      }
    })
    const data = await res.json();
    return await data
  } catch (error) {
    console.log("🚀 ~ getCalcData ~ error:", error)
  }
}
// getCalcData({
//   container_size: "20ft",
//   container_type: "Dry",
//   currency: "USD",
//   destination_city: "QADOH",
//   destination_country: "QA",
//   destination_port: "SAJED",
//   hs_code: "3305.20.000000",
//   imageSrc: "https://ik.imagekit.io/tijarahub/images/detailed/56/Protien_100_ml.jpg",
//   origin_country: "EG",
//   origin_port: "EGAIS",
//   product_name: "Silky Smoothing System 1000ml |  Wholesale - MJ Hair",
//   product_value: 4000,
//   quantity: 10,
//   service_type: "DTD",
//   shipment_mode: "Sea",
//   srxMasterUnit: "Carton",
//   unitName: "Piece",
//   unitsInProduct: 6.000
// })
