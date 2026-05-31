/*
  根据 id 和角位置参数，自动在DIV边框四个角插入装饰图案
  HTML 里只需要写有语义的内容，并给每个卡片一个唯一 id。

  示例：
  <div id="homeCard01" class="border-item-1">
    <div class="card-title">标题</div>
    <div class="card-body">内容</div>
  </div>

  JS：
  setupCornerDecor("#homeCard01", ["top-left", "bottom-right"]);
*/
(function (window) {
  const cornerClassMap = {
    top_left: "corner-img-top-left",
    top_right: "corner-img-top-right",
    bottom_left: "corner-img-bottom-left",
    bottom_right: "corner-img-bottom-right"
  };

  function setupCornerDecor(selector, corners) {
    corners = corners || [];

    const target = document.querySelector(selector);
    const hasTopLeftCorner = corners.includes("top_left");

    if (!target) {
      console.warn(`corner-decor.js: ${selector} が見つかりません。`);
      return;
    }

    target.classList.add("corner-decor");
    target.classList.toggle("corner-title-offset-left", hasTopLeftCorner);

    const cardTitle = target.querySelector(".card-title");

    if (cardTitle) {
      cardTitle.style.paddingLeft = hasTopLeftCorner ? "calc(var(--corner-size) * 0.42)" : "";
    }

    target.querySelectorAll(".corner-img").forEach((cornerImg) => {
      cornerImg.remove();
    });

    corners.forEach((corner) => {
      const cornerClass = cornerClassMap[corner];

      if (!cornerClass) {
        console.warn(`corner-decor.js: 不明な角指定です: ${corner}`);
        return;
      }

      const cornerElement = document.createElement("span");

      cornerElement.className = `corner-img ${cornerClass}`;
      cornerElement.setAttribute("aria-hidden", "true");

      target.prepend(cornerElement);
    });
  }

  window.setupCornerDecor = setupCornerDecor;
})(window);
