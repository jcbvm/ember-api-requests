import Ember from 'ember';

const AjaxSettings = Ember.$.ajaxSettings;

export default function(adapter, params, traditional) {
    if (typeof params === 'string') {
        return `?${params}`;
    }
    if (typeof params === 'object') {
        if (typeof adapter.sortQueryParams === 'function') {
            params = adapter.sortQueryParams(params);
        }
        traditional = typeof traditional === 'boolean' ? traditional : !!AjaxSettings.traditional;
        return `?${Ember.$.param(params, traditional)}`;
    }
    return '';
}