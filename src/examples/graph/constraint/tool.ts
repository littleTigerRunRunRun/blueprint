// @ts-nocheck
export function toggleFullscreen() {
  // 获取当前处于全屏状态的元素
  // 兼容不同浏览器的属性名
  const fullscreenElement = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement || 
                            document.msFullscreenElement;

  if (!fullscreenElement) {
    // 如果当前没有元素处于全屏状态，则请求全屏
    enterFullscreen();
  } else {
    // 如果已有元素处于全屏状态，则退出全屏
    exitFullscreen();
  }
}

/**
 * 进入全屏模式
 * 默认让整个页面 (document.documentElement) 进入全屏
 */
function enterFullscreen() {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) { /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) { /* IE11 */
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) { /* Firefox */
    element.mozRequestFullScreen();
  } else {
    console.warn('当前浏览器不支持全屏 API');
  }
}

/**
 * 退出全屏模式
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else {
    console.warn('当前浏览器不支持退出全屏 API');
  }
}