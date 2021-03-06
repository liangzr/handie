import { hasOwnProp } from '../common/helper';
import { isString, isFunction, isPlainObject } from '../is/type';
import { getDefaults } from '../storage/helper';
import { invoke } from '../../adapters/bridge';

export default {
  // 用于相对路径的基础 URL
  baseURL: '',
  // 服务器错误（HTTP 状态码 5xx）时的提示
  serverErrorText: '服务器开小差啦～',
  /**
   * 将请求参数转换为 JSON
   */
  jsonify( params ) {
    return params;
  },
  /**
   * 判断是否为一个 RESTful 的请求响应
   * 
   * @param {*} res 请求返回
   */
  isRestful( res ) {
    return !(res !== undefined && hasOwnProp('success', res) && hasOwnProp('message', res));
  },
  /**
   * 请求发生错误时的处理
   */
  errorHandler( res ) {
    const code = res.status;

    if ( code >= 500 ) {
      invoke('notice.alert', getDefaults('http.serverErrorText'));
    }
    else if ( code >= 400 ) {
      let resText = res.responseText;
      let resJson;

      if ( hasOwnProp('responseJSON', res) ) {
        resJson = res.responseJSON;
      }
      else {
        try {
          resJson = JSON.parse(resText);
        }
        catch ( err ) {
          resJson = null;
        }
      }

      // 支持 {"message": ""} 形式的错误信息
      if ( isPlainObject(resJson) && hasOwnProp('message', resJson) ) {
        resText = resJson.message;
      }

      invoke('notice.alert', resText);
    }
  },
  /**
   * 对请求返回数据的处理
   */
  responseHandler( res, callback ) {
    const hasCallback = isFunction(callback);

    // RESTful 请求的情况
    if ( getDefaults('http.isRestful')(res) ) {
      if ( isString(res) && res !== '' ) {
        invoke('notice.alert', res);
      }
      else if ( hasCallback ) {
        callback.call(null, res);
      }
    }
    // 返回结构为 {success: true, message: ""} 的情况
    else {
      if ( !res.success ) {
        invoke('notice.alert', res.message);
      }
      else if ( hasCallback ) {
        callback.call(null, res.data);
      }
    }
  },
  /**
   * 请求完成时的处理
   */
  completeHandler() {}
}
