(function () {
  const intro = document.getElementById("home-intro");
  const cluster = document.getElementById("home-intro-cluster");
  const desktopMedia = window.matchMedia("(min-width: 992px)");

  if (!intro || !cluster) {
    return;
  }

  const logoFrames = Array.from(
    intro.querySelectorAll(".intro-logo-frame")
  ).sort((a, b) => {
    return Number(a.dataset.logoFrame) - Number(b.dataset.logoFrame);
  });

  const orbitItems = Array.from(
    intro.querySelectorAll(".intro-orbit-item")
  ).sort((a, b) => {
    return Number(a.dataset.orbitOrder) - Number(b.dataset.orbitOrder);
  });

  let timers = [];
  let runId = 0;
  let currentPhase = "idle";
  let isFinishing = false;

  function isDesktop() {
    return desktopMedia.matches;
  }

  function clearTimers() {
    timers.forEach((timerId) => clearTimeout(timerId));
    timers = [];
  }

  function schedule(fn, delay, currentRunId) {
    const timerId = window.setTimeout(() => {
      if (currentRunId !== runId) {
        return;
      }
      fn();
    }, delay);

    timers.push(timerId);
  }

  function fallbackTargetRect() {
    const size = 44;
    const left = Math.max(16, window.innerWidth - size - 28);

    return {
      left: left,
      top: 14,
      width: size,
      height: size
    };
  }

  function getIntroTriggerElement() {
    return document.querySelector("#site-header .intro-trigger-link");
  }

  function waitForIntroTrigger(maxTryCount = 100, intervalMs = 80) {
    return new Promise((resolve) => {
      /*
        先立即检查一次。
        如果 header 已经插入完成，直接返回按钮元素。
      */
      const firstTrigger = getIntroTriggerElement();

      if (firstTrigger) {
        resolve(firstTrigger);
        return;
      }

      let finished = false;
      let tryCount = 0;

      function finish(trigger) {
        if (finished) {
          return;
        }

        finished = true;
        window.removeEventListener("siteHeaderLoaded", handleSiteHeaderLoaded);
        resolve(trigger || null);
      }

      /*
        site-header.js 插入导航完成后，会发出 siteHeaderLoaded 事件。
        收到这个事件后，再找一次右上角动画按钮。
      */
      function handleSiteHeaderLoaded() {
        const trigger = getIntroTriggerElement();

        if (trigger) {
          finish(trigger);
        }
      }

      /*
        保险轮询：
        即使事件因为加载顺序错过了，也继续每 80ms 检查一次。
      */
      function check() {
        const trigger = getIntroTriggerElement();

        if (trigger) {
          finish(trigger);
          return;
        }

        if (tryCount >= maxTryCount) {
          finish(null);
          return;
        }

        tryCount += 1;
        window.setTimeout(check, intervalMs);
      }

      window.addEventListener("siteHeaderLoaded", handleSiteHeaderLoaded);

      /*
        如果 site-header.js 已经加载完，但事件已经错过，
        也立即再检查一次。
      */
      if (window.siteHeaderLoaded === true) {
        handleSiteHeaderLoaded();
        return;
      }

      check();
    });
  }

  function setFlyTarget(targetEl) {
    const clusterRect = cluster.getBoundingClientRect();
    const targetRect = targetEl
      ? targetEl.getBoundingClientRect()
      : fallbackTargetRect();

    const clusterCenterX = clusterRect.left + clusterRect.width / 2;
    const clusterCenterY = clusterRect.top + clusterRect.height / 2;

    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    const flyX = targetCenterX - clusterCenterX;
    const flyY = targetCenterY - clusterCenterY;

    const flyScaleRaw = targetRect.width / clusterRect.width;
    const flyScale = Math.max(0.12, Math.min(0.22, flyScaleRaw));

    cluster.style.setProperty("--fly-x", `${flyX}px`);
    cluster.style.setProperty("--fly-y", `${flyY}px`);
    cluster.style.setProperty("--fly-scale", flyScale.toFixed(3));
  }

  function hideAllLogoFrames() {
    logoFrames.forEach((img) => {
      img.classList.remove("is-visible");
    });
  }

  function showLogoFrame(frameNumber) {
    hideAllLogoFrames();

    const target = logoFrames.find((img) => {
      return Number(img.dataset.logoFrame) === frameNumber;
    });

    if (target) {
      target.classList.add("is-visible");
    }
  }

  function hideIntro() {
    clearTimers();

    document.body.classList.remove("intro-lock");
    intro.classList.remove("is-active", "is-closing");
    cluster.classList.remove("is-flying");

    hideAllLogoFrames();

    orbitItems.forEach((item) => {
      item.classList.remove("is-visible");
    });

    intro.setAttribute("aria-hidden", "true");
    intro.hidden = true;

    currentPhase = "idle";
    isFinishing = false;
  }

  function prepareIntro() {
    clearTimers();
    document.body.classList.add("intro-lock");
    intro.hidden = false;
    intro.setAttribute("aria-hidden", "false");
    intro.classList.remove("is-closing");
    cluster.classList.remove("is-flying");

    hideAllLogoFrames();

    orbitItems.forEach((item) => {
      item.classList.remove("is-visible");
    });

    currentPhase = "playing";
    isFinishing = false;

    void intro.offsetWidth;
    intro.classList.add("is-active");
  }

  function finishIntro(currentRunId) {
    if (isFinishing) {
      return;
    }

    isFinishing = true;
    currentPhase = "finishing";
    clearTimers();

    cluster.classList.add("is-flying");
    intro.classList.add("is-closing");

    const flyDuration = 1450;

    schedule(() => {
      if (currentRunId !== runId) {
        return;
      }

      hideIntro();

      window.startHeroSliderAutoplayAfterIntro?.();
    }, flyDuration, currentRunId);
  }

  async function playIntro() {
    if (!isDesktop()) {
      hideIntro();
      return;
    }

    const currentRunId = ++runId;

    prepareIntro();

    const trigger = await waitForIntroTrigger();

    if (currentRunId !== runId) {
      return;
    }

    setFlyTarget(trigger);

    /*
      电脑版才执行：
      logo 01 -> 02 -> 03 -> 04
      每隔 700ms
      然后周围小图每隔 1000ms 出现
      最后全部一起飞向右上角动画按钮
    */
    const startDelay = 220;
    const logoStep = 700;
    const orbitStep = 1000;
    const afterLogoDelay = 350;
    const afterOrbitHold = 1000;

    schedule(() => {
      showLogoFrame(1);
    }, startDelay, currentRunId);

    schedule(() => {
      showLogoFrame(2);
    }, startDelay + logoStep, currentRunId);

    schedule(() => {
      showLogoFrame(3);
    }, startDelay + logoStep * 2, currentRunId);

    schedule(() => {
      showLogoFrame(4);
    }, startDelay + logoStep * 3, currentRunId);

    const orbitStart = startDelay + logoStep * 3 + afterLogoDelay;

    orbitItems.forEach((item, index) => {
      schedule(() => {
        item.classList.add("is-visible");
      }, orbitStart + index * orbitStep, currentRunId);
    });

    const flyStart =
      orbitStart + (orbitItems.length - 1) * orbitStep + afterOrbitHold;

    schedule(() => {
      finishIntro(currentRunId);
    }, flyStart, currentRunId);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!isDesktop()) {
      hideIntro();
      return;
    }

    playIntro();
  });

  window.addEventListener("pageshow", function (event) {
    if (!isDesktop()) {
      hideIntro();
      return;
    }

    if (event.persisted) {
      playIntro();
    }
  });

  /* 首页单点左上 logo：不强制刷新 */
  document.addEventListener("click", function (event) {
    const brand = event.target.closest("#site-header .site-brand");

    if (!brand) {
      return;
    }

    if (window.currentPage === "top_page") {
      event.preventDefault();
    }
  });

  /* 右上角动画按钮：仅电脑版重播动画 */
  document.addEventListener("click", function (event) {
    const trigger = event.target.closest("#site-header .intro-trigger-link");

    if (!trigger) {
      return;
    }

    event.preventDefault();

    if (!isDesktop()) {
      return;
    }

    if (currentPhase === "playing" && !isFinishing) {
      finishIntro(runId);
      return;
    }

    playIntro();
  });

  /* 动画显示中，点击任何地方都直接飞向右上角按钮 */
  intro.addEventListener("click", function () {
    if (!isDesktop()) {
      hideIntro();
      return;
    }

    if (currentPhase !== "playing" || isFinishing) {
      return;
    }

    finishIntro(runId);
  });

  window.addEventListener("resize", function () {
    if (!isDesktop()) {
      hideIntro();
      return;
    }

    if (!intro.hidden) {
      setFlyTarget(getIntroTriggerElement());
    }
  });

  desktopMedia.addEventListener("change", function () {
    if (!isDesktop()) {
      hideIntro();
    }
  });
})();