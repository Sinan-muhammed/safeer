const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
        const isOpen = siteNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

// FAQ Accordion functionality
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
        const isExpanded = question.getAttribute("aria-expanded") === "true";
        const answerId = question.getAttribute("aria-controls");
        const answer = document.getElementById(answerId);
        const toggle = question.querySelector(".faq-toggle");

        if (!answer) return;

        // Close all other FAQ items
        faqQuestions.forEach((otherQuestion) => {
            if (otherQuestion !== question && otherQuestion.getAttribute("aria-expanded") === "true") {
                const otherAnswerId = otherQuestion.getAttribute("aria-controls");
                const otherAnswer = document.getElementById(otherAnswerId);

                if (otherAnswer) {
                    otherQuestion.setAttribute("aria-expanded", "false");
                    otherAnswer.style.display = "none";
                    const otherToggle = otherQuestion.querySelector(".faq-toggle");
                    if (otherToggle) {
                        otherToggle.textContent = "+";
                    }
                }
            }
        });

        // Toggle current item
        if (isExpanded) {
            question.setAttribute("aria-expanded", "false");
            answer.style.display = "none";
            if (toggle) toggle.textContent = "+";
        } else {
            question.setAttribute("aria-expanded", "true");
            answer.style.display = "block";
            if (toggle) toggle.textContent = "−";
        }
    });
});

const explorerOptions = document.querySelectorAll(".explorer-option");

if (explorerOptions.length) {
    const setActiveExplorerOption = (targetOption) => {
        explorerOptions.forEach((option) => {
            const isActive = option === targetOption;
            option.classList.toggle("is-active", isActive);
            option.setAttribute("aria-pressed", String(isActive));
        });
    };

    explorerOptions.forEach((option) => {
        option.addEventListener("click", () => {
            setActiveExplorerOption(option);
        });
    });
}

const heroStage = document.querySelector(".hero-stage");
const heroSurface = heroStage?.querySelector(".hero-surface");
const heroCard = heroSurface?.querySelector(".hero-card");
const heroSidebar = heroSurface?.querySelector(".sidebar-card");
const headerWrap = document.querySelector(".header-wrap");
const desktopHeroSticky = window.matchMedia("(min-width: 1181px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroStage && heroSurface && heroCard && heroSidebar) {
    let heroScrollFrame = null;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const resetHeroScroll = () => {
        heroSurface.classList.remove("hero-surface--scroll");
        heroStage.style.removeProperty("--hero-pin-top");
        heroStage.style.removeProperty("min-height");
        heroSidebar.style.removeProperty("transform");
        document.documentElement.style.removeProperty("--hero-stage-extra");
    };

    const setHeroScrollStage = () => {
        if (!desktopHeroSticky.matches || reducedMotion.matches) {
            resetHeroScroll();
            return;
        }

        const headerOffset = (headerWrap?.offsetHeight || 0) + 18;
        const availableHeight = Math.max(window.innerHeight - headerOffset, 1);
        const surfaceHeight = heroSurface.offsetHeight;
        const rightHeight = heroSidebar.offsetHeight;
        const sidebarOverflow = Math.max(rightHeight - availableHeight, 0);
        const sidebarTravel = Math.min(Math.max(sidebarOverflow + 24, 0), 320);
        const stageExtra = headerOffset + sidebarTravel;

        heroSurface.classList.add("hero-surface--scroll");
        heroStage.style.setProperty("--hero-pin-top", `${Math.round(headerOffset)}px`);
        heroStage.style.minHeight = `${Math.round(surfaceHeight + stageExtra)}px`;
        document.documentElement.style.setProperty("--hero-stage-extra", `${Math.round(stageExtra)}px`);

        const stageRect = heroStage.getBoundingClientRect();
        const stageStart = window.scrollY + stageRect.top - headerOffset;
        const stickyDistance = Math.max(heroStage.offsetHeight - surfaceHeight - headerOffset, 1);
        const progress = clamp((window.scrollY - stageStart) / stickyDistance, 0, 1);

        heroSidebar.style.transform = `translate3d(0, ${Math.round(-sidebarTravel * progress)}px, 0)`;
    };

    const requestHeroScrollUpdate = () => {
        if (heroScrollFrame !== null) {
            cancelAnimationFrame(heroScrollFrame);
        }

        heroScrollFrame = window.requestAnimationFrame(() => {
            heroScrollFrame = null;
            setHeroScrollStage();
        });
    };

    window.addEventListener("scroll", requestHeroScrollUpdate, { passive: true });
    window.addEventListener("resize", requestHeroScrollUpdate);
    desktopHeroSticky.addEventListener("change", requestHeroScrollUpdate);
    reducedMotion.addEventListener("change", requestHeroScrollUpdate);
    requestHeroScrollUpdate();
}

const nameCheckerSection = document.querySelector(".name-checker-section");
const strategicRoutesSection = document.querySelector(".strategic-routes");

const revealOnEnter = (element, motionClass, options = {}) => {
    if (!element) {
        return;
    }

    const reveal = () => {
        element.classList.add("is-visible");
    };

    element.classList.add(motionClass);

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        reveal();
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            if (!entries.some((entry) => entry.isIntersecting)) {
                return;
            }

            reveal();
            currentObserver.disconnect();
        },
        {
            threshold: options.threshold ?? 0.34,
            rootMargin: options.rootMargin ?? "0px 0px -10% 0px",
        },
    );

    observer.observe(element);

    reducedMotion.addEventListener("change", () => {
        if (!reducedMotion.matches) {
            return;
        }

        reveal();
        observer.disconnect();
    });
};

revealOnEnter(strategicRoutesSection, "strategic-routes--motion", {
    threshold: 0.22,
    rootMargin: "0px 0px -8% 0px",
});

revealOnEnter(nameCheckerSection, "name-checker-section--motion");



/// banner //
  (() => {
    const slides = document.querySelectorAll('.consultio-immigration-hero__slide');
    const dots = document.querySelectorAll('.consultio-immigration-hero__dots button');
    if (!slides.length) return;

    let current = 0;
    let timer;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });

      current = index;
    };

    const nextSlide = () => {
      showSlide((current + 1) % slides.length);
    };

    const startAuto = () => {
      timer = setInterval(nextSlide, 5000);
    };

    const resetAuto = () => {
      clearInterval(timer);
      startAuto();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAuto();
      });
    });

    showSlide(0);
    startAuto();
  })();


// counter start

  document.querySelectorAll(".consultio-counter").forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let started = false;

    const runCounter = () => {
      if (started) return;
      started = true;

      const duration = 1800;
      const startTime = performance.now();

      const update = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    observer.observe(counter);
  });


//   accordion smooth open

 document.querySelectorAll('.consultio-process__item, .consultio-fintech__accordion-item').forEach((item) => {
      const summary = item.querySelector('summary');
      const content = Array.from(item.children).find((child) => child.tagName !== 'SUMMARY');

      if (!summary || !content) return;

      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';
      content.style.maxHeight = item.hasAttribute('open') ? content.scrollHeight + 'px' : '0px';
      content.style.opacity = item.hasAttribute('open') ? '1' : '0';

      summary.addEventListener('click', (event) => {
        event.preventDefault();

        const group = item.parentElement;
        const isOpen = item.hasAttribute('open');

        group.querySelectorAll('[open]').forEach((openItem) => {
          if (openItem === item) return;
          const openContent = Array.from(openItem.children).find((child) => child.tagName !== 'SUMMARY');
          if (!openContent) return;

          openContent.style.maxHeight = openContent.scrollHeight + 'px';
          requestAnimationFrame(() => {
            openContent.style.maxHeight = '0px';
            openContent.style.opacity = '0';
          });
          openItem.removeAttribute('open');
        });

        if (isOpen) {
          content.style.maxHeight = content.scrollHeight + 'px';
          requestAnimationFrame(() => {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
          });
          item.removeAttribute('open');
          return;
        }

        item.setAttribute('open', '');
        content.style.maxHeight = '0px';
        content.style.opacity = '0';

        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
        });
      });
    });     