import data from "../data.json" with { type: "json" };
AOS.init();
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
  document.body.classList.toggle("overflow-y-hidden");
  videoContainer.querySelector("video").pause();
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

const swipeBtn = document.querySelector("#swipeBtn")
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
      slidesPerView: 7,
      spaceBetween: 10,
    },
  }, navigation: {
    nextEl: ".swiper-button-next.categoriesSwiper",
    prevEl: ".swiper-button-prev.categoriesSwiper",
  },
});
categoriesSwiper[1]?.slideTo(categoriesSwiper[1].slides.length - 1, 0);
let isClicked = false;
swipeBtn?.addEventListener("click", () => {
  if (!isClicked) {
    categoriesSwiper[0].slideTo(categoriesSwiper[0].slides.length - 1, 1000);
    categoriesSwiper[1].slideTo(0, 1000);
    isClicked = true
  } else {
    categoriesSwiper[1].slideTo(categoriesSwiper[1].slides.length - 1, 1000);
    categoriesSwiper[0].slideTo(0, 1000);
    isClicked = false
  }

})

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

// ========== Shipment Page =============//

// Loading
const texts = ["Just wait...", "Gathering data...", "Almost ready...", "Be Patient..."];
const textEl = document.getElementById("loadingText");
let index = 0;

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

async function getHscodes() {
  let data = await fetch("https://rfq-iframe.tijarahub.com/hscodes/", {
    headers: {
      Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
    }
  })
  const hsCodes = await data.json()
  return await hsCodes
}


const selectedData = {};

async function initCountriesData() {
  // Elements
  const countriesData = await getCountries();
  const portsData = await getPorts();
  const countriesList = document.querySelector(".country-list");
  const countries = [{ name: "Egypt", id: 3 }, { name: "Turkiye", id: 4 }];
  const countriesInput = document.querySelector("#countrySearchInput");
  const countryElements = {
    countryButton: document.querySelector("#countryDropdownButton"),
    countryMenu: document.querySelector("#countryDropdownMenu"),
  };

  // Display Countries List
  countries.forEach((country) => {
    countriesList.innerHTML += `
      <li class="country-item rounded-sm p-2 hover:bg-gray-100">${country.name}</li>
      `;
  });

  // Handle Search Countries
  countriesInput.addEventListener("keyup", (e) => {
    const query = e.target.value.trim().toLowerCase();
    countriesList.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
    });
  });

  // Map on The Countries List
  countriesList.querySelectorAll("li").forEach((li) => {
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
  const portsList = document.querySelector(".port-list");
  const portsInput = document.querySelector("#portSearchInput");
  const portElements = {
    portButton: document.querySelector("#portDropdownButton"),
    portMenu: document.querySelector("#portDropdownMenu"),
  };

  // Empty The Ports List
  portsList.innerHTML = "";

  targetPorts.forEach(({ name }) => {
    portsList.innerHTML += `
      <li class="port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
      `;
  });

  // Handle Search 
  portsInput.addEventListener("keyup", (e) => {
    const query = e.target.value.trim().toLowerCase();
    portsList.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
    });
  });

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
      document.querySelector("#locationDropdownButton").querySelector("span").innerHTML = `${selectedPort[0].code}`;

      // Close The Main Menu
      document.querySelector("#locationDropdownMenu").classList.add("hidden");
    });
  });
}

async function initDestinationPortsData(targetPorts) {
  // Elements
  const portsData = await getPorts();
  const portsList = document.querySelector(".destination-port-list");
  const portsInput = document.querySelector("#destinationPortSearchInput");
  const portElements = {
    portButton: document.querySelector("#destinationPortDropdownButton"),
    portMenu: document.querySelector("#destinationPortDropdownMenu"),
  };

  // Empty The Ports List
  portsList.innerHTML = "";

  if (targetPorts.length === 0) {
    portsList.innerHTML += `
        <li class="rounded-sm p-2 hover:bg-gray-100">Not Available Yet</li>
        `;
  } else {
    targetPorts.forEach(({ name }) => {
      portsList.innerHTML += `
        <li class="destination-port-item rounded-sm p-2 hover:bg-gray-100">${name}</li>
        `;
    });

    // Handle Search 
    portsInput.addEventListener("keyup", (e) => {
      const query = e.target.value.trim().toLowerCase();
      portsList.querySelectorAll("li").forEach((li) => {
        li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
      });
    });

    // Map on The Ports List
    portsList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", (e) => {
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
        document.querySelector("#destinationDropdownButton").querySelector("span").innerHTML = `${selectedPort[0].code}`;

        // Close The Main Menu
        document.querySelector("#destinationDropdownMenu").classList.add("hidden");
      });
    });
  }
}

async function initDestinationCountriesData() {
  // Elements
  let countriesData = await getCountries();
  countriesData = countriesData.filter((country) =>
    country.type === "Country" && country.name !== "Egypt" && country.name !== "Turkiye"
  );
  let portsData = await getPorts();
  portsData = portsData.filter((port) => port.country_id !== 3 && port.country_id !== 4);

  const countriesList = document.querySelector(".destination-country-list");
  const countriesInput = document.querySelector("#destinationCountrySearchInput");
  const countryElements = {
    countryButton: document.querySelector("#destinationCountryDropdownButton"),
    countryMenu: document.querySelector("#destinationCountryDropdownMenu"),
  };

  // Display Countries List
  countriesData.forEach((country) => {
    countriesList.innerHTML += `
      <li class="destination-country-item rounded-sm p-2 hover:bg-gray-100">${country.name}</li>
      `;
  });

  // Handle Search Countries
  countriesInput.addEventListener("keyup", (e) => {
    const query = e.target.value.trim().toLowerCase();
    countriesList.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("hidden", !li.textContent.trim().toLowerCase().includes(query));
    });
  });

  // Map on The Countries List
  countriesList.querySelectorAll("li").forEach((li) => {
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
    });
  });
}

async function initHsCodesData() {
  // Elements
  const HscodesData = await getHscodes();
  const HscodesList = document.querySelector(".product-category-list");
  const HscodesInput = document.querySelector("#productCategorySearchInput");
  const HscodesElements = {
    hsCodeButton: document.querySelector("#productCategoryDropdownButton"),
    hsCodeMenu: document.querySelector("#productCategoryDropdownMenu"),
  };

  // Display HS Codes List
  HscodesData.forEach((hsCode) => {
    HscodesList.innerHTML += `
      <li class="hs-code-item rounded-sm p-2 hover:bg-gray-100">${hsCode.name}</li>
      `;
  });

  // Handle Search HS Codes
  HscodesInput.addEventListener("keyup", (e) => {
    const query = e.target.value.trim().toLowerCase();
    const allItems = HscodesList.querySelectorAll("li");
    let visibleCount = 0;

    allItems.forEach((li) => {
      const isVisible = li.textContent.trim().toLowerCase().includes(query);
      li.classList.toggle("hidden", !isVisible);
      if (isVisible) visibleCount++;
    });

    // Remove any existing "No Result Found" message
    const noResultMsg = HscodesList.querySelector(".no-result-msg");
    if (noResultMsg) {
      noResultMsg.remove();
    }

    // Add "No Result Found" message if no items are visible
    if (visibleCount === 0 && query !== "") {
      HscodesList.innerHTML += `
        <li class="no-result-msg rounded-sm p-2 hover:bg-gray-100">No Result Found for <span class="text-red-500 font-bold">${query}</span></li>
        `;
    }
  });

  // Map on The HS Codes List
  HscodesList.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", (e) => {
      // Ignore click on "No Result Found" message
      if (e.target.closest(".no-result-msg")) return;

      // Save Selected HS Code 
      const selectedHsCodes = HscodesData.filter((hsCode) =>
        hsCode.name.toLowerCase().trim() === e.target.textContent.toLowerCase().trim()
      );
      selectedData.hsCode = { ...selectedHsCodes[0] };

      // Add Selected HS Code to LocalStorage
      localStorage.setItem("selectedData", JSON.stringify(selectedData));

      // Add Selected HS Code to buttons
      HscodesElements.hsCodeButton.querySelector("span").textContent = e.target.textContent;
      document.querySelector("#shippingInfoDropdownButton").querySelector("span").textContent = e.target.textContent;

      // Handle Toggling DropdownMenu 
      HscodesElements.hsCodeMenu.classList.add("hidden");
    });
  });
}

// Initialize all data
initHsCodesData();
initDestinationCountriesData();
initCountriesData();
// Shipment Date Validation
const shipmentDateInput = document.getElementById("shipmentDate");
shipmentDateInput.addEventListener("changeDate", () => {
  const selectedDate = new Date(shipmentDateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today || shipmentDateInput.value === "") {
    toggleValidationModal();
    document.querySelector("#modalTitle").textContent = "Missing Information"
    document.querySelector("#modalDesc").textContent = "Please complete the following required fields:"
    fillValidationList(["Shipment Date (It Must be in The Future)"])
    shipmentDateInput.value = "";
    shipmentDateInput.blur()
    selectedData.shipmentDate = shipmentDateInput.value;
    localStorage.setItem("selectedData", JSON.stringify(selectedData));
    return
  }
  const [month, day, year] = shipmentDateInput.value.split("/");
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  selectedData.shipmentDate = formattedDate;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
});

// Order Value Input
const orderValueInput = document.querySelector("#orderValueInput");
orderValueInput.addEventListener("change", (e) => {
  selectedData.orderValue = e.target.value;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
});

// Toggle Mode (Cold/Dry)
const toggle = document.getElementById("toggle");
const labelText = document.getElementById("modeLabel");
toggle.addEventListener("change", (e) => {
  const mode = toggle.checked ? "Cold" : "Dry";
  labelText.textContent = mode;
  selectedData.mode = mode;
  localStorage.setItem("selectedData", JSON.stringify(selectedData));
});

// Container Size Selection
const radios = document.querySelectorAll('input[name="container-size"]');
radios.forEach((radio) => {
  radio.addEventListener('change', (e) => {
    selectedData.containerSize = e.target.value;
    localStorage.setItem("selectedData", JSON.stringify(selectedData));
  });
});

function getContainerSize() {
  const selected = JSON.parse(localStorage.getItem("selectedData"));
  if (selected?.containerSize) {
    const targetInput = document.querySelector(`input[value="${selected.containerSize}"]`);
    targetInput.checked = true
    return selected ? selected : null;
  }
}

// Initialize Current Cached Container Size When The Page is Loaded
getContainerSize()
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
form.addEventListener("submit", (e) => {
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
    date: selectedData.shipmentDate
  }
  getCardsData(requestBody)
  localStorage.removeItem("selectedData")
  form.classList.remove("z-[9999]")
})

async function getCardsData(requestBody) {
  const cardsContainer = document.querySelector(".cards-container")
  cardsContainer.innerHTML = ""
  try {
    document.querySelector("#loading").classList.remove("hidden")
    document.querySelector("#loading").classList.add("flex")
    document.body.classList.add("overflow-y-hidden");
    const res = await fetch("https://rfq-iframe.tijarahub.com/api/spot-on-quote/", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: "Token cde18c47e92a18caef9805a88ffdbf0ba73d40e06d99e6b1584c52b7ca3b96f9"
      }
    })
    document.querySelector("#loading").classList.add("hidden")
    document.querySelector("#loading").classList.remove("flex")
    document.body.classList.remove("overflow-y-hidden");
    const data = await res.json();
    // Fill The Cards Here 
    let content = "";
    if (data.length === 0) {
      content = `
      <h4 class="text-4xl font-bold">Sorry, Not Found Data</h4>
      `
      toggleValidationModal();
      document.querySelector("#modalTitle").textContent = "Something Went Wrong!";
      document.querySelector("#modalDesc").textContent = "Faild to Fetch Data";
      fillValidationList([`Sorry, No Data Found for This Ports (${selectedData.port.code} => ${selectedData.destinationPort.code}) Yet.`])
      return
    }
    if (data.status_code == 400 || data.status_code == 401 || data.status_code == 500) {
      toggleValidationModal();
      document.querySelector("#modalTitle").textContent = "Something Went Wrong!";
      document.querySelector("#modalDesc").textContent = `Faild to Fetch Data`;
      fillValidationList([`Sorry, No Data Found for This Ports (${selectedData.port.code} => ${selectedData.destinationPort.code}) Yet.`])
      return
    } else {
      data.forEach((ship, index) => {
        const colIndex = index % 3;
        content += `
        ${createAndFillCards(ship, colIndex)}`
      })
    }
    cardsContainer.insertAdjacentHTML("beforeend", content)

  } catch (error) {
    console.log("🚀 ~ getData ~ error:", error.message)
    toggleValidationModal();
    fillValidationList([`${error.message}`])
  }
}


function createAndFillCards(ship, index) {
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
                <span
                  class="rounded p-3 px-6 mx-auto font-bold bg-main text-center text-white uppercase"
                >
                  ${selectedData.destinationCountry.name}
                </span>
                <div
                  class="absolute z-10 flex flex-col gap-6 text-white transition-all duration-500 bottom-10 group-hover:-start-full start-10 content"
                >
                  <div>
                    <span class="text-lg font-bold">All in Rate</span>
                    <h3 class="text-6xl font-bold">$${ship.quoteLine.surcharges.matchingSurchargesPerEquipmentTypes[0].allInRate}</h3>
                    <h3 class="text-6xl font-bold">${ship.routingLegs[0].vesselName}</h3>
                  </div>
                  <div class="flex gap-2">
                    <span class="bg-main py-0.5 px-3 text-sm rounded-sm"
                      >${selectedData.destinationPort.code}</span
                    >
                    <span class="bg-main py-0.5 px-3 text-sm rounded-sm"
                      >${ship.arrivalDate.split("T")[0]}</span
                    >
                  </div>
                </div>
                <!-- Overlay -->
                <div
                  class="absolute size-full bg-gradient-to-b from-transparent to-black/80 z-[0] top-0 left-0"
                ></div>
              </div>
              <div
                class="flip-card-back rotate-y-180 backface-hidden absolute size-full rounded-2xl flex flex-col bg-[url('../assets/images/shipment/taj.jpg')] bg-cover p-6 overflow-hidden shadow-[0_8px_14px_0_rgba(0,_0,_0,_0.2)]"
              >
                <div class="relative z-50 space-y-4 size-full">
                  <div class="flex flex-col gap-1 card-header">
                    <span class="text-base font-medium">${selectedData.port.code} <i class="fa-solid fa-right-long"></i> ${selectedData.destinationPort.code}</span>
                    <ul
                      class="other-info flex items-center gap-2 *:py-1.5 *:px-2.5 text-xs *:flex-1 *:rounded *:bg-main text-white text-center"
                    >
                      <li><p class="truncate max-w-[160px]">${selectedData.hsCode.name}</p></li>
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
                        class="absolute py-4 -translate-x-1/2 -translate-y-1/2 bg-gray-200 -start-4 top-1/2"
                      >
                        <i class="text-4xl text-main fa-solid fa-ship"></i
                      ></span>
                    </div>
                    <span class="relative ps-2"
                      >${ship.arrivalDate.split("T")[0]}
                      <span
                        class="absolute text-xl text-gray-500 -translate-x-1/2 -translate-y-1/2 p-2 bg-gray-200 -start-4 top-1/2"
                        ><i class="fa-solid fa-location-dot ms-0.5"></i
                      ></span>
                    </span>
                  </div>
                  <span class="text-gray-500">Arrival Date</span>
                  <div class="mt-5 text-center card-cta">
                    <a
                    href="${mailtoLink}"
                      class="px-4 py-3 text-white bg-main rounded-md"
                    >
                      Send Inquiry
                    </a>
                  </div>
                </div>
                <div class="absolute top-0 bg-gray-200 size-full start-0"></div>
              </div>
            </div>
          </div>
  `

  return content
}

// Handle Click Outside 
document.body.addEventListener("click", (e) => {
  if (e.target === document.querySelector("#validationModal") || e.target === document.querySelector("#closeModalBtn") || e.target === document.querySelector("#cancelModalBtn") || e.target === document.querySelector("#closeModalBtn").querySelector("i")) {
    toggleValidationModal();
  }
})
