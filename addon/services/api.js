import Ember from 'ember';
import DS from 'ember-data';
import AjaxService from 'ember-ajax/services/ajax';
import createParamsString from '../utils/create-params-string';

const { assert, inject, get } = Ember;
const { Model } = DS;
const JSONContentType = 'application/json;charset=UTF-8';

function isGetRequest(type) {
    return typeof type === 'string' && type.toLowerCase() === 'get';
}

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
        let adapterURL = this._buildAdapterURL(path, options);
		return this._buildURL(adapterURL, options);
	},

    /**
     * @method _buildAdapterURL
	 * @private
     * @param {String} path
     * @param {Object} options
     * @return {String}
     */
    _buildAdapterURL(path, options = {}) {
        let modelName, id, snapshot,
            requestType = options.requestType,
            model = options.model;

        if (model instanceof Model) {
            id = get(model, 'id');
            assert('ember-api-requests expects a model instance to have an `id` set.', id !== null);
            modelName = model.constructor.modelName || model.constructor.typeKey;
            snapshot = model._createSnapshot();
            requestType = requestType || 'findRecord';
        } else if (typeof model === 'string') {
            modelName = model;
            requestType = requestType || 'findAll';
        }

        let adapter = get(this, 'store').adapterFor(modelName || 'application');
        let result = adapter.buildURL(modelName, id, snapshot, requestType);

        result += path.charAt(0) === '/' ? path : `/${path}`;
        result += createParamsString(adapter, options.params, options.traditional);

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
        let isGetType = isGetRequest(options.type);

        if (isGetType && options.data) {
            assert("ember-api-requests does not allow the `data` property for `GET` requests, instead use the `params` property.");
        }

		url = this._buildAdapterURL(url, options);

		if (!isGetType && typeof options.jsonData === 'object') {
            options.data = JSON.stringify(options.jsonData);
            options.contentType = JSONContentType;
            options.processData = false;
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