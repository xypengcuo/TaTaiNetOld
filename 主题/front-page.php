<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">

  <!-- 
  在终端中，使用python启动一个www服务器
  cd D:\CodeX_Projects\test1
  python -m http.server 8000

  然后在浏览器访问：
  http://localhost:8000/index.htm

  在终端里可以看到打开网页的访问日志，
  按 Ctrl+C 可以停止服务器。
  -->

  <!--
    viewport 是移动端页面必须写的设置。
    以后如果这个页面放进 LINE Mini App，手机宽度会按真实设备宽度计算，不会按桌面宽度缩放。
  -->
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>さいたま多胎ネット | ホーム</title>

  <!-- Bootstrap 负责导航折叠、下拉菜单和栅格布局。 -->
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
    rel="stylesheet"
  >

  <!-- Bootstrap 的折叠菜单和下拉菜单需要这个 JS。 -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <!-- 样式文件复制到了 css 文件夹，方便以后和 HTML 分开管理。 -->
  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/styles.css">

  <!-- 顶部导航样式独立放在 site-header.css，主 CSS 不再包含这些设定。 -->
  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/site-header.css">

  <!-- 角花相关样式独立放在 corner-decor.css，主 CSS 不再包含这些设定。 -->
  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/corner-decor.css">

  <!-- 英雄轮播样式 -->
  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/hero-slider.css?v=20260529_3">

  <!-- 首页介绍动画样式 -->
  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/home-intro.css">

  <link rel="stylesheet" href="<?php echo esc_url(get_template_directory_uri()); ?>/css/site-footer.css?v=20260530_1">

  <script>
    // window 是浏览器里的全局对象，在任何地方都可以访问到
    window.currentPage = "top_page";
    // get_template_directory_uri() 是 WordPress 的 PHP 函数，返回当前主题目录的 URL
    window.tatainetThemeUri = "<?php echo esc_url(get_template_directory_uri()); ?>";
    // home_url('/') 是 WordPress 的 PHP 函数，返回网站首页的 URL
    window.tatainetSiteUrl = "<?php echo esc_url(home_url('/')); ?>";
  </script>

  <!-- 根据 id 和角位置参数，用原生 JavaScript 自动在 DIV 边框四个角插入装饰图案。 defer 让它等 DOM 解析完成后再执行 -->
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/corner-decor.js" defer></script>

  <!-- 导航 JS。defer 让它等 DOM 解析完成后再执行。 -->
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/site-header.js" defer></script>

  <!-- Footer JS。defer 让它等 DOM 解析完成后再执行。 -->
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/site-footer.js?v=20260530_1" defer></script>

  <!-- 首页介绍动画 JS。defer 让它等 DOM 解析完成后再执行。 -->
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/home-intro.js" defer></script>

  <!-- 首页主视觉图轮播 JS。defer 让它等 DOM 解析完成后再执行。 -->
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/hero-slider.js?v=20260529_3" defer></script>

  <? // 必须要在主题的首页添加。WordPress 的 wp_head() 函数会输出一些必要的代码，确保主题正常工作。 ?>
  <?php wp_head(); ?>

</head>
<body>
  <!--
    共通导航插入位置。
    site-nav.js 会找到这个 id，把顶部菜单自动插入这里。
  -->
  <header id="site-header"></header>

  <div id="home-intro" class="home-intro" aria-hidden="true" hidden>
    <div class="home-intro-backdrop"></div>

    <div class="home-intro-stage">
      <div id="home-intro-cluster" class="home-intro-cluster">

        <!-- 中央 logo 动画区 -->
        <div class="intro-logo-sequence">
          <img
            class="intro-logo-frame"
            data-logo-frame="1"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/intro_img/intro_logo_01.png"
            alt=""
          >
          <img
            class="intro-logo-frame"
            data-logo-frame="2"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/intro_img/intro_logo_02.png"
            alt=""
          >
          <img
            class="intro-logo-frame"
            data-logo-frame="3"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/intro_img/intro_logo_03.png"
            alt=""
          >
          <img
            class="intro-logo-frame"
            data-logo-frame="4"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/intro_img/intro_logo_04.png"
            alt="NPO法人さいたま多胎ネット ロゴ"
          >
        </div>

        <!-- クリック終了の案内文：最初から表示 -->
        <p class="intro-skip-hint">
          画面をクリックすると、アニメーションをスキップできます
        </p>

        <!-- 周围小图：4个だけ表示 -->
        <div class="intro-orbit-items">

          <div class="intro-orbit-item intro-item-pos-1" data-orbit-order="1">
            <div class="intro-orbit-card">
              <img src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/families.jpg" alt="">
              <p>多胎家庭の方へ</p>
            </div>
          </div>

          <div class="intro-orbit-item intro-item-pos-2" data-orbit-order="2">
            <div class="intro-orbit-card">
              <img src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/members.jpg" alt="">
              <p>会員・サポーター</p>
            </div>
          </div>

          <div class="intro-orbit-item intro-item-pos-3" data-orbit-order="3">
            <div class="intro-orbit-card">
              <img src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/support.jpg" alt="">
              <p>支援制度・サービス</p>
            </div>
          </div>

          <div class="intro-orbit-item intro-item-pos-4" data-orbit-order="4">
            <div class="intro-orbit-card">
              <img src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/events/events_reiwa7_01.jpg" alt="">
              <p>イベント情報</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <!-- 首页轮播图 -->
  <section class="hero-slider" aria-label="ホームメインビジュアルスライダー">
    <div class="hero-slider-viewport">
      <ul class="hero-slider-slides" id="hero-slider-slides">
        <li class="hero-slide is-current">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_1.jpg"
            alt="多胎育児を支えるメインビジュアル"
          >

          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="main-visual-line1">
                多胎育児を「不安」から
              </p>
              <p class="main-visual-line2">
                「楽しみ」に変えよう
              </p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_2.jpg"
            alt="さいたま多胎ネット メインビジュアル 2"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_3.jpg"
            alt="さいたま多胎ネット メインビジュアル 3"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_4.jpg"
            alt="さいたま多胎ネット メインビジュアル 4"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_5.jpg"
            alt="さいたま多胎ネット メインビジュアル 5"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_6.jpg"
            alt="さいたま多胎ネット メインビジュアル 6"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

        <li class="hero-slide">
          <img
            class="hero-slide-media"
            src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/main_top_7.jpg"
            alt="さいたま多胎ネット メインビジュアル 7"
          >
          <div class="hero-slide-overlay">
            <div class="main-visual-copy">
              <p class="hero-slide-text"></p>
            </div>
          </div>
        </li>

      </ul>

      <button class="hero-slider-arrow hero-slider-arrow-prev" type="button" aria-label="前のスライド">
        <span aria-hidden="true">‹</span>
      </button>

      <button class="hero-slider-arrow hero-slider-arrow-next" type="button" aria-label="次のスライド">
        <span aria-hidden="true">›</span>
      </button>

      <div class="hero-slider-thumbs" id="hero-slider-thumbs" aria-label="スライド一覧"></div>
    </div>
  </section>

  <!-- 网页内容 -->
  <main class="container py-4 py-lg-5">
    <section class="demo-row mb-4" id="main-menu">
      <div class="row g-4 justify-content-center">

        <!-- <div class="col-12 col-lg-4"> -->
        <!-- <div class="col-4"> -->
        <div class="col-4">
          <a href="#" class="image-link-card glow-pink">
            <div class="square-card"
                style="background-image: url('<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/families.jpg');">
                <div class="card-overlay"></div>
                <div class="card-text text-pink">
                育児を<br><br>妊娠出産された方
              </div>
            </div>
          </a>
        </div>

        <div class="col-4">
          <a href="#" class="image-link-card glow-blue">
            <div class="square-card"
                style="background-image: url('<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/members.jpg');">
              <div class="card-overlay"></div>
              <div class="card-text text-blue">
                正社員・賛助会員<br><br>について
              </div>
            </div>
          </a>
        </div>

        <div class="col-4">
          <a href="#" class="image-link-card glow-orange">
            <div class="square-card"
                style="background-image: url('<?php echo esc_url(get_template_directory_uri()); ?>/imgs/thema1/support.jpg');">
              <div class="card-overlay"></div>
              <div class="card-text text-orange">
                サポーター<br><br>について
              </div>
            </div>
          </a>
        </div>

      </div>
    </section>

    <section class="demo-row mb-4">
      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div id="card-row-left-new" class="border-item-1">
            <div class="card-title">お知らせ</div>
            <div class="card-body">
              <div class="notice-list">
                <a href="#" class="notice-item notice-item-latest notice-bg-pink">
                  <span class="notice-icon" aria-hidden="true">📣</span>
                  <span class="notice-text-wrap">
                    <span class="notice-label">最新のお知らせ</span>
                    <span class="notice-text">「キックオフイベント　ふたご・みつご支援フォーラムinさいたまを開催しました」をアップしました！</span>
                    <span class="notice-date">2026.3.15</span>
                  </span>
                </a>

                <a href="#" class="notice-item notice-bg-orange">
                  <span class="notice-icon" aria-hidden="true">📣</span>
                  <span class="notice-text-wrap">
                    <span class="notice-label">お知らせ</span>
                    <span class="notice-text">「令和7年度　埼玉県多胎プレママパパ教室開催のお知らせ」をアップしました！</span>
                    <span class="notice-date">2025.10.06</span>
                  </span>
                </a>

                <a href="#" class="notice-item notice-bg-green">
                  <span class="notice-icon" aria-hidden="true">📣</span>
                  <span class="notice-text-wrap">
                    <span class="notice-label">お知らせ</span>
                    <span class="notice-text">「令和7年度　さいたま市妊娠期からのファミリー交流会開催のお知らせ」をアップしました！</span>
                    <span class="notice-date">2025.10.06</span>
                  </span>
                </a>

                <a href="#" class="notice-item notice-bg-gray">
                  <span class="notice-icon" aria-hidden="true">📣</span>
                  <span class="notice-text-wrap">
                    <span class="notice-label">お知らせ</span>
                    <span class="notice-text">「令和6年度妊娠期からの多胎ファミリー教室開催報告」をアップしました！</span>
                    <span class="notice-date">2025.2.15</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div id="card-row-right-events" class="border-item-1">
            <div class="card-title">イベント告知</div>
            <div class="card-body">
              <img class="card-fill-img" src="<?php echo esc_url(get_template_directory_uri()); ?>/imgs/events/events_reiwa7_01.jpg" alt="令和7年イベント01" />
              <a href="https://www.pref.saitama.lg.jp/a0704/librariy/tatai.html" target="_blank">詳しくは県のHPをご覧ください👌💕</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-row mb-4">
      <p class="demo-row-title">第1行：4つの角飾りのイメージがある</p>
      <div class="row g-3">
        <div class="col-12">
          <div id="card-row-1-full" class="border-item-1">
            <div class="card-title">Row 1 / Full Width</div>
            <div class="card-body">
              <p>テスト・テスト・テスト</p>
              <p>角飾りイメージはJavaScriptで自動的に<code>corner-img</code>を挿入する。</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-row mb-4">
      <p class="demo-row-title">第2行：角飾りイメージは左上、なし、右下</p>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-4">
          <div id="card-row-2-left" class="border-item-1">
            <div class="card-title">Row 2 / Left</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
              <p>第 4 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-4">
          <div id="card-row-2-center" class="border-item-1">
            <div class="card-title">Row 2 / Center</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div id="card-row-2-right" class="border-item-1">
            <div class="card-title">Row 2 / Right</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
              <p>第 4 行目：テスト・テスト・テスト</p>
              <p>第 5 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-row mb-4">
      <p class="demo-row-title">第3行：角飾りイメージは左上、なし、なし、右下</p>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-3-first" class="border-item-1">
            <div class="card-title">Row 3 / 1</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-3-second" class="border-item-1">
            <div class="card-title">Row 3 / 2</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
              <p>第 4 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-3-third" class="border-item-1">
            <div class="card-title">Row 3 / 3</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-3-fourth" class="border-item-1">
            <div class="card-title">Row 3 / 4</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-row mb-4">
      <p class="demo-row-title">第4行：角飾りイメージなし</p>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-4">
          <div id="card-row-4-first" class="border-item-1">
            <div class="card-title">Row 4 / 1</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-4">
          <div id="card-row-4-second" class="border-item-1">
            <div class="card-title">Row 4 / 2</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4">
          <div id="card-row-4-third" class="border-item-1">
            <div class="card-title">Row 4 / 3</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 第六行：4 个 DIV，完全不要角花，所以这里也不调用 setupCornerDecor。 -->
    <section class="demo-row">
      <p class="demo-row-title">第5行：角飾りイメージなし</p>
      <div class="row g-3">
        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-5-first" class="border-item-1">
            <div class="card-title">Row 5 / 1</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-5-second" class="border-item-1">
            <div class="card-title">Row 5 / 2</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-5-third" class="border-item-1">
            <div class="card-title">Row 5 / 3</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <div id="card-row-5-fourth" class="border-item-1">
            <div class="card-title">Row 5 / 4</div>
            <div class="card-body">
              <p>第 1 行目：テスト・テスト・テスト</p>
              <p>第 2 行目：テスト・テスト・テスト</p>
              <p>第 3 行目：テスト・テスト・テスト</p>
              <p>第 4 行目：テスト・テスト・テスト</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!--
    共通 Footer 插入位置。
    site-footer.js 会找到这个 id，把 Footer 自动插入这里。
  -->
  <footer id="site-footer"></footer>

  <script>

    // DOMContentLoaded 会等 HTML 结构加载完成后执行。
    document.addEventListener("DOMContentLoaded", function () {
      setupCornerDecor("#card-row-1-full", ["top_left", "top_right", "bottom_left", "bottom_right"]);
      setupCornerDecor("#card-row-2-left", ["top_left"]);
      setupCornerDecor("#card-row-2-right", ["bottom_right"]);
      setupCornerDecor("#card-row-3-first", ["bottom_left"]);
      setupCornerDecor("#card-row-3-fourth", ["top_right"]);
    });

    /*
      给所有 .card_title 元素按顺序循环添加4种背景色类，
      形成轮流的效果。
      随机设定颜色，并且和上一个不重复。
    */
    (function () {
      document.addEventListener("DOMContentLoaded", () => {
        const classes = [
          "card-title-bgcolor-pink",
          "card-title-bgcolor-blue",
          "card-title-bgcolor-green",
          "card-title-bgcolor-yellow"
        ];

        const titles = document.querySelectorAll(".card-title");

        let prevClass = null;

        titles.forEach((el) => {
          el.classList.remove(...classes);

          let available = classes;

          // 如果有上一个颜色，就排除掉，避免连续两个标题颜色一样。
          if (prevClass) {
            available = classes.filter(c => c !== prevClass);
          }

          const randomClass =
            available[Math.floor(Math.random() * available.length)];

          el.classList.add(randomClass);

          // 记录当前颜色，供下一个标题排除使用。
          prevClass = randomClass;
        });
      });
    })();

  </script>

  <? // 必须要在主题的首页添加。WordPress 的 wp_footer() 函数会输出一些必要的脚本和代码，确保主题正常工作。 ?>
  <?php wp_footer(); ?>
</body>
</html>
