// 页脚养鱼
function fish() {
  if ($("#footer-wrap").length) {
    $("#footer-wrap").css({
      position: "relative",
      "text-align": "center"
    });
  }
  if (!$("#jsi-flying-fish-container").length) {
    $("footer").append('<div class="container" id="jsi-flying-fish-container"></div>');
  }
}

// 页面加载完成
$(document).ready(function () {
  fish();

  // 延迟执行，避免覆盖版权
  setTimeout(function () {
    show_date_time();
  }, 500);
});

// 网站运行时间（另起一行，不覆盖任何内容）
function show_date_time() {
  // 如果没有运行时间容器，就新建一行放进去
  if ($("#span_dt_dt").length === 0) {
    $(".copyright").after(`
      <div style="margin-top:6px; font-size:0.9em;">
        小破站已经苟且偷生 <span id="span_dt_dt"></span>
      </div>
    `);
  }

  // 建站时间
  const BirthDay = new Date("12/12/2021 01:27:36");
  const today = new Date();
  const timeold = today.getTime() - BirthDay.getTime();
  const msPerDay = 24 * 60 * 60 * 1000;
  const e_daysold = timeold / msPerDay;
  const daysold = Math.floor(e_daysold);
  const e_hrsold = (e_daysold - daysold) * 24;
  const hrsold = Math.floor(e_hrsold);
  const e_minsold = (e_hrsold - hrsold) * 60;
  const minsold = Math.floor(e_minsold);
  const seconds = Math.floor((e_minsold - minsold) * 60);

  $("#span_dt_dt").html(
    `<span style="color:#afb4db">${daysold}</span> 天 ` +
    `<span style="color:#f391a9">${hrsold}</span> 时 ` +
    `<span style="color:#fdb933">${minsold}</span> 分 ` +
    `<span style="color:#a3cf62">${seconds}</span> 秒`
  );

  setTimeout(show_date_time, 1000);
}