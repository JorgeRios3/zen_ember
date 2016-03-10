import resolver from './helpers/resolver';
import './helpers/responsive';

import registerSelectHelper from './helpers/register-select-helper';
registerSelectHelper();
import {
  setResolver
} from 'ember-qunit';

setResolver(resolver);
