// 等待页面元素出现（专治 Butterfly 页脚不显示）
function waitForElement(id, callback) {
  const interval = setInterval(() => {
    if (document.getElementById(id)) {
      clearInterval(interval);
      callback();
    }
  }, 100);
}

// 运行时间逻辑
function updateRuntime() {
  const createTime = new Date('2025-09-26T00:00:00').getTime();
  const now = new Date().getTime();
  let totalSeconds = Math.floor((now - createTime) / 1000);
  const daysInYear = 365;
  const years = Math.floor(totalSeconds / (daysInYear * 24 * 3600));
  totalSeconds %= (daysInYear * 24 * 3600);

  const days = Math.floor(totalSeconds / (24 * 3600));
  totalSeconds %= (24 * 3600);

  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatZero = (num) => num > 9 ? num : '0' + num;

  const currentHour = new Date().getHours();
  let statusHtml = "";

  if (currentHour >= 8 && currentHour < 22) {
    statusHtml = "<span class='boardsign-text'>🌞 小窝营业中 — </span>";
  } else {
    statusHtml = "<span class='boardsign-text'>🌙 小窝打烊了 — </span>";
  }

  const timeHtml = `已度过 ${years} 年 ${days} 天 ${formatZero(hours)} : ${formatZero(minutes)} : ${formatZero(seconds)}`;
  const currentTimeHtml = `<div id='runtime'>${statusHtml}${timeHtml}</div>`;

  const workboard = document.getElementById("workboard");
  if (workboard) {
    workboard.innerHTML = currentTimeHtml;
  }
}

// 等待 #workboard 出现后再执行！
waitForElement("workboard", function () {
  updateRuntime();
  setInterval(updateRuntime, 1000);
});