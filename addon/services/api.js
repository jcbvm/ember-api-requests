import Ember from 'ember';
import DS from 'ember-data';
import AjaxService from 'ember-ajax/services/ajax';

const { assert, inject } = Ember;
const { Model } = DS;

/**
 * Service for making custom requests to a backend API.
 * This service extends ember-ajax but uses ember-data for building the URL.
 *
 * @module ember-api-requests
 * @class ApiService
 * @extends AjaxService
 */
export default AjaxService.extend({
    store: inject.service(),

    /**
     * Build an URL based on given path and options.
     *
     * The URL will by default be created by using ember data adapters.
     * When a model instance or name is defined, the corresponding adapter will be used,
     * otherwise the application adapter will be used.
     *
     * Any custom set host on this service will also be applied to the URL.
     *
     * Options:
     * - model {DS.Model|String}    used for creating a prefix for the URL
     * - params {Object}            used for adding query parameters to the URL
     * - requestType {String}       used for creating the URL using an ember data adapter,
     *                              defaults to 'findRecord' for instance and 'findAll' for non instance
     *
     * @method buildURL
     * @param {String} path The path
     * @param {Object} options Options for building the URL (optional)
     * @return {String} The full URL
     */
	buildURL(path, options = {}) {
		return this._buildURL(this._buildAdapterURL(path, options));
	},

    /**
     * @method _buildAdapterURL
	 * @private
     * @param {String} path
     * @param {Object} options
     * @return {String}
     */
    _buildAdapterURL(path, options = {}) {
		let id = null,
            snapshot = null,
            requestType = null,
            modelName = null,
            model = options.model,
            params = options.params,
            adapter = null,
            result = null;

        if (model instanceof Model) {
            id = model.get('id');
            assert('ember-api-requests expects the model instance to have an id for building an URL.', id);
            requestType = options.requestType || 'findRecord';
            snapshot = model._createSnapshot();
            modelName = model.constructor.modelName || model.constructor.typeKey;
        } else if (typeof model === 'string') {
            modelName = options.model;
            requestType = options.requestType || 'findAll';
        }

        adapter = this.get('store').adapterFor(modelName || 'application');
        result = adapter.buildURL(modelName, id, snapshot, requestType);
        result += path.charAt(0) === '/' ? path : `/${path}`;

        if (params) {
            if (typeof adapter.sortQueryParams === 'function') {
                params = adapter.sortQueryParams(params);
            }
            result += `?${Ember.$.param(params)}`;
        }

        return result;
    },

	/**
     * @method options
	 * @private
     * @param {String} url
     * @param {Object} options
     * @return {Object}
     */
	options(url, options = {}) {
        let isGetRequest = options.type ? options.type.toLowerCase() === 'get' : false;

        if (isGetRequest && options.data) {
            assert('ember-api-requests expects a params object to be set for query parameters, instead you passed a data object.');
        }

		url = this._buildAdapterURL(url, options);

		if (options.jsonData && !isGetRequest) {
            options.data = JSON.stringify(options.jsonData);
            options.contentType = options.contentType || 'application/json;charset=UTF-8';
            options.processData = !!options.processData;
        }

		['jsonData','params','model','requestType'].forEach(i => delete options[i]);

        let hasDataType = !!options.dataType;
		let result = this._super(url, options);

		// Only set dataType when defined as option, this differs from ember-ajax
        if (!hasDataType) {
            delete result.dataType;
        }

        return result;
	}
});