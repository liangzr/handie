import { isString, isFunction, isPlainObject, arrayEach, capitalize, hasOwnProp } from "../common/helper";
import { supportWebSocket } from "../common/supports";

/**
 * 获取处理后的 WebSocket 连接地址
 *
 * @param {*} url
 */
function resolveSocketUrl( url ) {
  const isNoProtocol = url.indexOf("//") === 0;

  // 本地开发时强制替换为 ws 协议
  if ( location.hostname === "localhost" ) {
    url = isNoProtocol ? `ws:${url}` : url.replace(/^ws(s)?\:\/\//, "ws\:\/\/");
  }
  // 其他环境中无协议时采用 wss 协议
  else if ( isNoProtocol ) {
    url = `wss:${url}`;
  }

  return url;
}

/**
 * 使 WebSocket 连接保持活跃
 *
 * @param {*} ws 连接实例
 * @param {*} interval 发送信息间隔
 */
function keepSocketAlive( ws, interval ) {
  setTimeout(() => {
    ws.send("使 WebSocket 连接保持活跃");
    keepSocketAlive(ws, interval);
  }, interval);
}

/**
 * opts 的结构为：
 * {
 *   url: "",
 *   interval: 0,
 *   closeBeforeUnload: true,
 *   onOpen: $.noop,
 *   onClose: $.noop,
 *   onMessage: $.noop,
 *   onError: $.noop
 * }
 */
export function init( opts ) {
  if ( isString(opts) ) {
    opts = {url: opts};
  }

  if ( !(supportWebSocket() && isPlainObject(opts) && hasOwnProp("url", opts)) ) {
    return;
  }

  const ws = new WebSocket(resolveSocketUrl(opts.url));

  // 页面卸载时关闭连接
  if ( opts.closeBeforeUnload !== false ) {
    window.addEventListener("beforeunload", () => {
      ws.close();
    });
  }

  // 保持连接处于活跃状态
  if ( $.isNumeric(opts.interval) && opts.interval * 1 > 0 ) {
    ws.addEventListener("open", () => {
      keepSocketAlive(ws, opts.interval);
    });
  }

  // 绑定指定事件
  arrayEach(["open", "close", "message", "error"], ( evtName ) => {
    const handler = opts[`on${capitalize(evtName)}`];

    if ( isFunction(handler) ) {
      ws.addEventListener(evtName, handler);
    }
  });

  return ws;
}
