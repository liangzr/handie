import { isString, isFunction, isPlainObject } from '../is/type';
import { mixin } from '../collection';
import { setDefaults, getDefaults } from '../storage/helper';
import { invoke } from '../../adapters/bridge';

import NOTIFICATION_DEFAULTS from './defaults';

setDefaults('notification', NOTIFICATION_DEFAULTS);

function generateNoticeUtil( icon ) {
  return ( text, callback ) => {
    const opts = mixin({
        text: '',
        duration: getDefaults('notification.duration')
      }, isPlainObject(text) ? text : {text}, {icon, callback});
    
    if ( !isFunction(opts.callback) ) {
      opts.callback = () => {};
    }

    invoke('notice.toast', opts);
  };
}

export const info = generateNoticeUtil('info');

export const success = generateNoticeUtil('success');

export const fail = generateNoticeUtil('fail');

export function loading( text, callback ) {
  if ( isFunction(text) ) {
    callback = text;
  }

  if ( !isString(text) ) {
    text = '加载中...';
  }

  return invoke('notice.loading.show', {text, callback});
}

export function hide( callback ) {
  return invoke('notice.loading.hide', callback);
}
