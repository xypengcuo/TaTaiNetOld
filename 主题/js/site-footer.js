/*
  共通 Footer 导入脚本。

  这个文件的作用：
  1. 从 parts/site-footer.html 读取共通 Footer HTML。
  2. 插入到页面中的 <footer id="site-footer"></footer>。
  3. 自动替换 {{themeUri}}、{{siteUrl}}、{{year}}。
  4. 和 site-nav.js 一样，避免在 HTML 文件里直接写 PHP。

  ============================================================
  【WordPress 主题阶段】
  在 front-page.php 里，加载 site-footer.js 之前，需要已经设置：

  <script>
    window.tatainetThemeUri = "<?php echo esc_url(get_template_directory_uri()); ?>";
    window.tatainetSiteUrl = "<?php echo esc_url(home_url('/')); ?>";
  </script>

  然后加载：
  <script src="<?php echo esc_url(get_template_directory_uri()); ?>/js/site-footer.js?v=20260530_1" defer></script>

  ============================================================
  【parts/site-footer.html 里的路径写法】

  主题内图片：
  src="{{themeUri}}/imgs/logo.png"

  首页：
  href="{{siteUrl}}"

  固定ページ：
  href="{{siteUrl}}families/"

  当前年份：
  {{year}}
*/

(function () {
  /*
    ============================================================
    1. 基本路径设定
    ============================================================
  */

  /*
    从 WordPress 的 front-page.php 传过来的“当前主题目录 URL”。

    例：
    https://tatainet.great-site.net/wp-content/themes/tatainet
  */
  const rawThemeUri = window.tatainetThemeUri || "";

  /*
    去掉最后的斜线，避免拼接路径时出现双斜线。
  */
  const themeUri = rawThemeUri.replace(/\/$/, "");

  /*
    从 WordPress 的 front-page.php 传过来的“网站首页 URL”。

    例：
    https://tatainet.great-site.net/
  */
  const rawSiteUrl = window.tatainetSiteUrl || "/";

  /*
    保证 siteUrl 最后一定有一个斜线。
  */
  const siteUrl = rawSiteUrl.endsWith("/") ? rawSiteUrl : rawSiteUrl + "/";

  /*
    Footer HTML 文件版本号。

    修改 parts/site-footer.html 后，可以改这个版本号，
    避免浏览器或缓存插件继续读取旧文件。
  */
  const footerHtmlVersion = "20260530_1";

  /*
    Footer HTML 的路径。

    WordPress 主题环境：
    https://example.com/wp-content/themes/tatainet/parts/site-footer.html?v=20260530_1

    本地静态 HTML 环境：
    ./parts/site-footer.html?v=20260530_1
  */
  const footerHtmlPath = themeUri
    ? themeUri + "/parts/site-footer.html?v=" + footerHtmlVersion
    : "./parts/site-footer.html?v=" + footerHtmlVersion;

  /*
    Footer 要插入的目标容器。
    页面中需要有：
    <footer id="site-footer"></footer>
  */
  const target = document.getElementById("site-footer");

  /*
    当前年份。
    用于替换版权声明里的 {{year}}。
  */
  const currentYear = String(new Date().getFullYear());

  /*
    如果页面没有 #site-footer，就不处理。
  */
  if (!target) {
    console.warn("site-footer.js: #site-footer 容器が見つかりません。");
    return;
  }

  /*
    ============================================================
    2. 替换 HTML 模板占位符
    ============================================================
  */
  function replaceTemplatePlaceholders(html) {
    return html
      .replaceAll("{{themeUri}}", themeUri)
      .replaceAll("{{siteUrl}}", siteUrl)
      .replaceAll("{{year}}", currentYear);
  }

  /*
    ============================================================
    3. 插入 Footer HTML
    ============================================================
  */
  function insertFooter(html) {
    const replacedHtml = replaceTemplatePlaceholders(html);
    target.innerHTML = replacedHtml;
  }

  /*
    ============================================================
    4. 读取 parts/site-footer.html
    ============================================================
  */
  fetch(footerHtmlPath)
    .then((response) => {
      /*
        fetch 成功发出请求，不代表文件一定存在。
        所以必须检查 response.ok。
      */
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return response.text();
    })
    .then(insertFooter)
    .catch((error) => {
      console.error(
        `site-footer.js: ${footerHtmlPath} を読み込めませんでした。`,
        error
      );
    });
})();