import * as http from './http';
import * as socket from './socket';
import * as table from './table';
import * as dialog from './dialog';
import * as form from './form';
import * as field from './field';
import * as select from './select';
import * as calc from './calc';
import * as data from './data';
import * as generate from './generator';
import * as url from './url';
import * as notice from './notification';
import * as text from './text';
import * as upload from './uploader';
import { setDefaults, set, get } from './storage';
import { alert } from './misc';

import './initializer';

window.handie = {
  setDefaults, set, get, alert,
  http, socket,
  table, dialog, form, field, select,
  generate, text, calc,
  data, upload, url, notice,
  // 为了向后兼容的别名
  ajax: http,
  calculate: calc
};
