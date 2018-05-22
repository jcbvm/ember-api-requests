import $ from 'jquery';

const AjaxSettings = $.ajaxSettings;

export function createQueryParams(adapter, params, traditional) {
    if (typeof params === 'string') {
        return `?${params}`;
    }
    if (typeof params === 'object') {
        if (typeof adapter.sortQueryParams === 'function') {
            params = adapter.sortQueryParams(params);
        }
        traditional = typeof traditional === 'boolean' ? traditional : !!AjaxSettings.traditional;
        return `?${$.param(params, traditional)}`;
    }
    return '';
}