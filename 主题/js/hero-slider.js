(function () {
  const INTRO_FINISHED_EVENT_NAME = "siteIntroAnimationFinished";
  const SLIDE_TRANSITION_FALLBACK_MS = 1800;

  function notifyIntroAnimationFinished() {
    window.siteIntroAnimationFinished = true;
    window.dispatchEvent(new CustomEvent(INTRO_FINISHED_EVENT_NAME));
  }

  /*
   * 首页动画结束时，可以调用下面任意一个函数：
   *
   *   window.notifyIntroAnimationFinished();
   *
   * 或者：
   *
   *   window.startHeroSliderAutoplayAfterIntro();
   *
   * 这两个函数作用完全一样。
   */
  window.notifyIntroAnimationFinished = notifyIntroAnimationFinished;
  window.startHeroSliderAutoplayAfterIntro = notifyIntroAnimationFinished;

  class HeroSlider {
    constructor(root) {
      this.root = root;
      this.viewport = root.querySelector(".hero-slider-viewport");
      this.slides = Array.from(root.querySelectorAll(".hero-slide"));
      this.prevButton = root.querySelector(".hero-slider-arrow-prev");
      this.nextButton = root.querySelector(".hero-slider-arrow-next");
      this.thumbsContainer = root.querySelector(".hero-slider-thumbs");

      this.currentIndex = this.getInitialIndex();
      this.isAnimating = false;
      this.autoplayDelay = 3000;

      this.autoplayTimer = null;
      this.transitionTimer = null;

      this.isIntroAnimationFinished = window.siteIntroAnimationFinished === true;
      this.isAutoplayPaused = false;

      this.touchStartX = 0;
      this.touchCurrentX = 0;
      this.swipeThreshold = 40;

      if (this.slides.length === 0) {
        return;
      }

      this.init();
    }

    getInitialIndex() {
      const index = this.slides.findIndex((slide) => slide.classList.contains("is-current"));
      return index >= 0 ? index : 0;
    }

    init() {
      this.resetSlideClasses();
      this.slides[this.currentIndex].classList.add("is-current");

      this.buildThumbs();
      this.updateThumbs();
      this.bindEvents();

      if (this.slides.length <= 1) {
        this.hideControls();
        return;
      }

      this.waitForIntroAnimationFinished();
    }

    hideControls() {
      this.prevButton?.classList.add("is-hidden");
      this.nextButton?.classList.add("is-hidden");
      this.thumbsContainer?.classList.add("is-hidden");
    }

    buildThumbs() {
      if (!this.thumbsContainer) {
        return;
      }

      this.thumbsContainer.innerHTML = "";

      this.slides.forEach((slide, index) => {
        const image = slide.querySelector(".hero-slide-media");
        const thumbSrc = slide.dataset.thumb || image?.getAttribute("src") || "";
        const thumbAlt = image?.getAttribute("alt") || `${index + 1}枚目を表示`;

        const button = document.createElement("button");
        button.className = "hero-slider-thumb";
        button.type = "button";
        button.dataset.slideIndex = String(index);
        button.setAttribute("aria-label", `${index + 1}枚目を表示`);

        if (thumbSrc) {
          const thumbImage = document.createElement("img");
          thumbImage.src = thumbSrc;
          thumbImage.alt = thumbAlt;
          button.appendChild(thumbImage);
        } else {
          button.textContent = String(index + 1);
        }

        button.addEventListener("click", () => {
          this.goToByThumb(index);
        });

        this.thumbsContainer.appendChild(button);
      });

      this.thumbButtons = Array.from(this.thumbsContainer.querySelectorAll(".hero-slider-thumb"));
    }

    bindEvents() {
      this.prevButton?.addEventListener("click", () => {
        this.goToPrev();
      });

      this.nextButton?.addEventListener("click", () => {
        this.goToNext();
      });

      this.bindSwipe();

      this.root.addEventListener("mouseenter", () => {
        this.pauseAutoplay();
      });

      this.root.addEventListener("mouseleave", () => {
        this.resumeAutoplay();
      });

      this.root.addEventListener("focusin", () => {
        this.pauseAutoplay();
      });

      this.root.addEventListener("focusout", () => {
        this.resumeAutoplay();
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          this.pauseAutoplay();
        } else {
          this.resumeAutoplay();
        }
      });
    }

    bindSwipe() {
      if (!this.viewport) {
        return;
      }

      this.viewport.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) {
          return;
        }

        this.touchStartX = event.touches[0].clientX;
        this.touchCurrentX = this.touchStartX;
      }, { passive: true });

      this.viewport.addEventListener("touchmove", (event) => {
        if (event.touches.length !== 1) {
          return;
        }

        this.touchCurrentX = event.touches[0].clientX;
      }, { passive: true });

      this.viewport.addEventListener("touchend", () => {
        const diffX = this.touchCurrentX - this.touchStartX;

        if (Math.abs(diffX) < this.swipeThreshold) {
          return;
        }

        if (diffX < 0) {
          this.goToNext();
        } else {
          this.goToPrev();
        }

        this.touchStartX = 0;
        this.touchCurrentX = 0;
      });
    }

    waitForIntroAnimationFinished() {
      /*
        手机端不显示首页动画。
        如果还等待 intro 结束事件，手机端就永远不会自动轮播。
        所以手机端直接视为 intro 已结束，立即启动自动轮播。
      */
      const isMobile = window.matchMedia("(max-width: 767.98px)").matches;

      if (isMobile) {
        this.isIntroAnimationFinished = true;
        window.siteIntroAnimationFinished = true;
        this.startAutoplay();
        return;
      }

      /*
        桌面端：
        如果首页动画已经结束，就直接开始轮播。
      */
      if (this.isIntroAnimationFinished) {
        this.startAutoplay();
        return;
      }

      /*
        桌面端：
        等 home-intro.js 发出首页动画结束事件后，再开始轮播。
      */
      window.addEventListener(INTRO_FINISHED_EVENT_NAME, () => {
        this.handleIntroAnimationFinished();
      }, { once: true });
    }

    handleIntroAnimationFinished() {
      if (this.isIntroAnimationFinished) {
        return;
      }

      this.isIntroAnimationFinished = true;
      this.startAutoplay();
    }

    pauseAutoplay() {
      this.isAutoplayPaused = true;
      this.stopAutoplay();
    }

    resumeAutoplay() {
      this.isAutoplayPaused = false;
      this.startAutoplay();
    }

    startAutoplay() {
      if (
        this.slides.length <= 1 ||
        !this.isIntroAnimationFinished ||
        this.isAutoplayPaused ||
        this.isAnimating ||
        document.hidden
      ) {
        return;
      }

      this.stopAutoplay();

      this.autoplayTimer = window.setInterval(() => {
        this.goToNext();
      }, this.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        window.clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    restartAutoplay() {
      this.startAutoplay();
    }

    goToPrev() {
      const nextIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
      this.goTo(nextIndex, "prev");
    }

    goToNext() {
      const nextIndex = (this.currentIndex + 1) % this.slides.length;
      this.goTo(nextIndex, "next");
    }

    goToByThumb(nextIndex) {
      if (nextIndex === this.currentIndex) {
        return;
      }

      const direction = nextIndex > this.currentIndex ? "next" : "prev";
      this.goTo(nextIndex, direction);
    }

    goTo(nextIndex, direction) {
      if (this.isAnimating || nextIndex === this.currentIndex) {
        return;
      }

      this.isAnimating = true;
      this.stopAutoplay();

      const currentSlide = this.slides[this.currentIndex];
      const nextSlide = this.slides[nextIndex];

      this.clearTransitionTimer();
      this.resetSlideClasses();

      currentSlide.classList.add("is-current");

      if (direction === "next") {
        nextSlide.classList.add("is-next-ready");
      } else {
        nextSlide.classList.add("is-prev-ready");
      }

      void nextSlide.offsetWidth;

      currentSlide.classList.add("is-leaving");

      if (direction === "next") {
        currentSlide.classList.add("hero-slide-to-left");
      } else {
        currentSlide.classList.add("hero-slide-to-right");
      }

      nextSlide.classList.add("is-entering");
      nextSlide.classList.add("is-current");
      nextSlide.classList.remove("is-next-ready", "is-prev-ready");

      const finish = () => {
        this.finishTransition(nextIndex);
      };

      const onTransitionEnd = (event) => {
        if (event.target !== nextSlide || event.propertyName !== "transform") {
          return;
        }

        nextSlide.removeEventListener("transitionend", onTransitionEnd);
        finish();
      };

      nextSlide.addEventListener("transitionend", onTransitionEnd);

      this.transitionTimer = window.setTimeout(() => {
        nextSlide.removeEventListener("transitionend", onTransitionEnd);
        finish();
      }, SLIDE_TRANSITION_FALLBACK_MS);
    }

    finishTransition(nextIndex) {
      this.clearTransitionTimer();

      this.currentIndex = nextIndex;
      this.resetSlideClasses();
      this.slides[this.currentIndex].classList.add("is-current");

      this.updateThumbs();

      this.isAnimating = false;
      this.restartAutoplay();
    }

    clearTransitionTimer() {
      if (this.transitionTimer) {
        window.clearTimeout(this.transitionTimer);
        this.transitionTimer = null;
      }
    }

    resetSlideClasses() {
      this.slides.forEach((slide) => {
        slide.classList.remove(
          "is-current",
            "is-next-ready",
            "is-prev-ready",
            "is-entering",
            "is-leaving",
            "hero-slide-to-left",
            "hero-slide-to-right"
        );
      });
    }

    updateThumbs() {
      if (!this.thumbButtons) {
        return;
      }

      this.thumbButtons.forEach((button, index) => {
        const isActive = index === this.currentIndex;

        button.classList.toggle("is-active", isActive);

        if (isActive) {
          button.setAttribute("aria-current", "true");
        } else {
          button.removeAttribute("aria-current");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const sliderRoot = document.querySelector(".hero-slider");

    if (!sliderRoot) {
      return;
    }

    new HeroSlider(sliderRoot);
  });
})();