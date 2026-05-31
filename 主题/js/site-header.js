/*
  共通顶部导航导入脚本。

  这个文件的作用：
  1. 从 parts/site-header.html 读取共通导航 HTML。
  2. 插入到页面中的 <header id="site-header"></header>。
  3. 根据 window.currentPage 自动给当前菜单添加 active。
  4. 桌面端支持鼠标悬停后打开下拉菜单。
  5. WordPress 主题化后，自动处理主题目录路径和首页 URL。

  ============================================================
  【普通静态 HTML 阶段】
  每个页面只需要：
  1. 准备容器：
     <header id="site-header"></header>

  2. 在加载本文件前设置当前页：
     <script>
       window.currentPage = "top_page";
     </script>

  3. 引入本文件：
     <script src="./js/site-header.js" defer></script>

  ============================================================
  【WordPress 主题阶段】
  在 front-page.php 里，加载 site-header.js 之前，需要先设置：
  <script>
    window.currentPage = "top_page";
    window.tatainetThemeUri = "<?php echo esc_url(get_template_directory_uri()); ?>";
    window.tatainetSiteUrl = "<?php echo esc_url(home_url('/')); ?>";
  </script>

  然后再加载：
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/site-header.js?v=20260529_1" defer></script>

  ============================================================
  【parts/site-header.html 里的路径写法】
  因为 parts/site-header.html 是普通 HTML 文件，不会执行 PHP，
  所以里面不要写 <?php echo ... ?>。

  应该使用占位符：

  主题内图片：
  src="{{themeUri}}/imgs/logo.png"

  首页：
  href="{{siteUrl}}"

  固定ページ：
  href="{{siteUrl}}families/"
  href="{{siteUrl}}support-services/"
*/

(function () {
  /*
    ============================================================
    1. 基本路径设定
    ============================================================
  */

  /*
    从 WordPress 的 front-page.php 传过来的“当前主题目录 URL”。

    WordPress 中的例子：
    https://tatainet.great-site.net/wp-content/themes/tatainet

    如果 window.tatainetThemeUri 没有设置，说明可能还在本地静态 HTML 环境。
    这种情况下 themeUri 会是空字符串 ""。
  */
  const rawThemeUri = window.tatainetThemeUri || "";

  /*
    去掉 themeUri 最后的斜线。

    例如：
    https://example.com/wp-content/themes/tatainet/

    会变成：
    https://example.com/wp-content/themes/tatainet

    这样后面拼接：
    themeUri + "/parts/site-header.html"

    不会变成：
    https://example.com/wp-content/themes/tatainet//parts/site-header.html
  */
  const themeUri = rawThemeUri.replace(/\/$/, "");

  /*
    从 WordPress 的 front-page.php 传过来的“网站首页 URL”。

    WordPress 中的例子：
    https://tatainet.great-site.net/

    如果没有设置，默认使用 "/"。
    这样即使没有 WordPress 变量，至少不会报错。
  */
  const rawSiteUrl = window.tatainetSiteUrl || "/";

  /*
    保证 siteUrl 最后一定有一个斜线。

    例如：
    https://tatainet.great-site.net

    会变成：
    https://tatainet.great-site.net/

    这样 site-header.html 里写：
    {{siteUrl}}families/

    最终会得到：
    https://tatainet.great-site.net/families/
  */
  const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl : rawSiteUrl + "/";

  /*
    导航 HTML 文件版本号。

    目的：
    1. 修改 parts/site-header.html 后，避免浏览器或缓存插件继续读取旧文件。
    2. 如果你再次修改 site-header.html，只要把这里的版本号改一下即可。

    例：
    20260529_1
    20260529_2
    20260530_1
  */
  const navHtmlVersion = "20260529_1";

  /*
    导航 HTML 的路径。

    WordPress 主题环境：
    themeUri 有值，所以读取：
    https://example.com/wp-content/themes/tatainet/parts/site-header.html?v=20260529_1

    本地静态 HTML 环境：
    themeUri 是空字符串，所以读取：
    ./parts/site-header.html?v=20260529_1
    注意：
    ?v=20260529_1 是缓存回避参数。
    它不会影响真实文件路径，只是告诉浏览器“这是一个新版本的文件”。
  */
  const navHtmlPath = themeUri
    ? themeUri + "/parts/site-header.html?v=" + navHtmlVersion
    : "./parts/site-header.html?v=" + navHtmlVersion;

  /*
    当前页面标识。

    例如：
    top_page
    families
    supporters
    news
    reports
    about

    这个值要和 parts/site-header.html 里的 data-page 对应。
    例如：
    <a data-page="top_page" ...>ホーム</a>
  */
  const currentPage = window.currentPage || "top_page";

  /*
    导航要插入的目标容器。

    每个页面中必须有：
    <header id="site-header"></header>
  */
  const target = document.getElementById("site-header");

  /*
    桌面端鼠标悬停打开下拉菜单的延迟时间。

    hoverOpenDelayMs：
    鼠标放上去多久后打开下拉菜单。
    这里设为 1000ms，也就是 1 秒，避免鼠标随便经过就打开。
  */
  const hoverOpenDelayMs = 1000;

  /*
    鼠标离开后关闭下拉菜单的延迟时间。

    这里不要太长。
    260ms 可以让用户从主菜单移动到下拉菜单时不容易突然关闭。
  */
  const hoverCloseDelayMs = 260;

  /*
    如果页面没有 #site-header，后面的处理都没有意义。
    直接停止，避免报错。
  */
  if (!target) {
    console.warn("site-header.js: #site-header 容器が見つかりません。");
    return;
  }

  /*
    ============================================================
    2. HTML 模板占位符替换
    ============================================================

    parts/site-header.html 是普通 HTML 文件，不执行 PHP。
    所以里面用下面这种占位符：

    {{themeUri}}
    {{siteUrl}}

    读取 HTML 后，在 JS 里统一替换成实际 URL。
  */
  function replaceTemplatePlaceholders(html) {
    return html
      /*
        替换主题目录 URL。

        例如：
        <img src="{{themeUri}}/imgs/logo.png">

        会变成：
        <img src="https://example.com/wp-content/themes/tatainet/imgs/logo.png">
      */
      .replaceAll("{{themeUri}}", themeUri)

      /*
        替换网站首页 URL。

        例如：
        <a href="{{siteUrl}}families/">

        会变成：
        <a href="https://example.com/families/">
      */
      .replaceAll("{{siteUrl}}", siteUrl);
  }

  /*
    ============================================================
    3. 当前页面菜单 active 设定
    ============================================================

    根据 window.currentPage 找到相同 data-page 的菜单，
    然后添加 active class 和 aria-current="page"。
  */
  function setActiveNav() {
    const activeItem = target.querySelector(`[data-page="${currentPage}"]`);

    if (!activeItem) {
      console.warn(
        `site-header.js: currentPage="${currentPage}" に対応するメニューが見つかりません。`
      );
      return;
    }

    activeItem.classList.add("active");
    activeItem.setAttribute("aria-current", "page");
  }

  /*
    ============================================================
    4. 桌面端 hover 下拉菜单
    ============================================================

    Bootstrap 默认是点击打开 dropdown。
    这里追加桌面端 hover 打开的体验。

    注意：
    手机端不使用 hover。
    手机端仍然保持 Bootstrap 默认点击展开。
  */
  function setupHoverDropdowns() {
    /*
      Bootstrap 的 lg 断点是 992px。
      所以这里用 min-width: 992px 判断是否为桌面端。
    */
    const desktopMedia = window.matchMedia("(min-width: 992px)");

    /*
      找到所有 dropdown 菜单项。
    */
    const dropdownItems = target.querySelectorAll(".nav-item.dropdown");

    dropdownItems.forEach((dropdownItem) => {
      const toggle = dropdownItem.querySelector(".dropdown-toggle");
      const menu = dropdownItem.querySelector(".dropdown-menu");

      /*
        如果 HTML 结构不完整，就跳过。
      */
      if (!toggle || !menu) {
        return;
      }

      /*
        openTimer：
        鼠标进入后，不是马上打开，而是延迟打开。

        closeTimer：
        鼠标离开后，不是马上关闭，而是延迟关闭。
      */
      let openTimer = null;
      let closeTimer = null;

      /*
        当前是否桌面端。
      */
      function isDesktop() {
        return desktopMedia.matches;
      }

      /*
        取得 Bootstrap Dropdown 实例。

        如果 Bootstrap JS 没有加载，window.bootstrap 会不存在。
        这种情况下返回 null，不强行执行，避免报错。
      */
      function getDropdownInstance() {
        if (!window.bootstrap || !window.bootstrap.Dropdown) {
          return null;
        }

        return window.bootstrap.Dropdown.getOrCreateInstance(toggle);
      }

      /*
        清除打开定时器。
      */
      function clearOpenTimer() {
        if (openTimer) {
          clearTimeout(openTimer);
          openTimer = null;
        }
      }

      /*
        清除关闭定时器。
      */
      function clearCloseTimer() {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      }

      /*
        同时清除打开和关闭定时器。
      */
      function clearAllTimers() {
        clearOpenTimer();
        clearCloseTimer();
      }

      /*
        打开 dropdown。
      */
      function openDropdown() {
        const instance = getDropdownInstance();

        if (!instance) {
          return;
        }

        instance.show();
      }

      /*
        关闭 dropdown。
      */
      function closeDropdown() {
        const instance = getDropdownInstance();

        if (!instance) {
          return;
        }

        instance.hide();
      }

      /*
        延迟打开 dropdown。

        鼠标进入菜单项后，等待 hoverOpenDelayMs。
        如果期间鼠标离开，会取消打开。
      */
      function scheduleOpen() {
        if (!isDesktop()) {
          return;
        }

        clearCloseTimer();
        clearOpenTimer();

        openTimer = setTimeout(() => {
          openDropdown();
        }, hoverOpenDelayMs);
      }

      /*
        延迟关闭 dropdown。

        鼠标离开菜单项后，等待 hoverCloseDelayMs。
        如果期间鼠标进入下拉菜单，会取消关闭。
      */
      function scheduleClose() {
        if (!isDesktop()) {
          return;
        }

        clearOpenTimer();
        clearCloseTimer();

        closeTimer = setTimeout(() => {
          closeDropdown();
        }, hoverCloseDelayMs);
      }

      /*
        用户鼠标进入下拉菜单时，取消关闭。
        这样从主菜单移动到下拉内容时不会马上消失。
      */
      function cancelClose() {
        clearCloseTimer();
      }

      /*
        鼠标进入整个 dropdown 项目。
      */
      dropdownItem.addEventListener("mouseenter", () => {
        if (!isDesktop()) {
          return;
        }

        scheduleOpen();
      });

      /*
        鼠标离开整个 dropdown 项目。
      */
      dropdownItem.addEventListener("mouseleave", () => {
        if (!isDesktop()) {
          return;
        }

        scheduleClose();
      });

      /*
        鼠标进入下拉菜单内容区域。
      */
      menu.addEventListener("mouseenter", () => {
        if (!isDesktop()) {
          return;
        }

        cancelClose();
      });

      /*
        鼠标离开下拉菜单内容区域。
      */
      menu.addEventListener("mouseleave", () => {
        if (!isDesktop()) {
          return;
        }

        scheduleClose();
      });

      /*
        用户点击 dropdown 时，交给 Bootstrap 默认点击逻辑处理。
        同时清掉 hover 定时器，避免 hover 和 click 互相干扰。
      */
      toggle.addEventListener("click", () => {
        clearAllTimers();
      });

      /*
        画面宽度变化时，比如桌面变手机、手机变桌面，
        清除所有定时器，并关闭当前 dropdown。
      */
      if (typeof desktopMedia.addEventListener === "function") {
        desktopMedia.addEventListener("change", () => {
          clearAllTimers();
          closeDropdown();
        });
      } else if (typeof desktopMedia.addListener === "function") {
        /*
          旧浏览器兼容写法。
        */
        desktopMedia.addListener(() => {
          clearAllTimers();
          closeDropdown();
        });
      }
    });
  }

  /*
    ============================================================
    5. 插入导航 HTML
    ============================================================

    fetch 读取 HTML 后，会调用这个函数。
  */
  function insertNav(html) {
    /*
      先替换 {{themeUri}} 和 {{siteUrl}}。
    */
    const replacedHtml = replaceTemplatePlaceholders(html);

    /*
      把导航 HTML 插入页面。
    */
    target.innerHTML = replacedHtml;

    /*
      给当前页面菜单添加 active。
    */
    setActiveNav();

    /*
      设置桌面端 hover 下拉菜单。
    */
    setupHoverDropdowns();

    /*
      通知其他 JS：
      共通 Header 已经插入完成。

      home-intro.js 会等待这个事件，
      然后再计算“飞向右上角动画按钮”的目标位置。
    */
    window.siteHeaderLoaded = true;
    window.dispatchEvent(new CustomEvent("siteHeaderLoaded"));
  }

  /*
    ============================================================
    6. 读取 parts/site-header.html
    ============================================================

    注意：
    如果浏览器控制台显示 404，通常是 navHtmlPath 路径不对。
    可以在控制台里确认：
    console.log(navHtmlPath);
  */
  fetch(navHtmlPath)
    .then((response) => {
      /*
        fetch 成功发出请求，不代表文件一定存在。
        404 / 500 也会进入 then。
        所以这里必须检查 response.ok。
      */
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.text();
    })
    .then(insertNav)
    .catch((error) => {
      console.error(
        `site-header.js: ${navHtmlPath} を読み込めませんでした。`,
        error
      );
    });
})();