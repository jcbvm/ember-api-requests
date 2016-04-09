import Ember from 'ember';
import DS from 'ember-data';
import AjaxService from 'ember-ajax/services/ajax';

const { assert, inject } = Ember;
const { Model } = DS;

/**
 * Service for making custom requests to a backend API.
 * This service extends ember-ajax but uses ember-data for building the URL.
 *
 * @namespace ember-api-requests
 * @class ApiService
 * @extends AjaxService
 */
export default AjaxService.extend({
    store: inject.service(),

    /**
     * Build an URL based on given path and options.
     *
     * Options:
     * - model (name or instance); to create a prefix for the path
     * - requestType; type of request used for creating the path,
     *   			  defaults to 'findRecord' for instance and 'findAll' for non instance
     * - params; to add extra query parameters to the URL
     * - jsonData; to create a JSON request
     * - any other options will be passed to the native jquery ajax method
     *
     * @method buildURL
     * @param {String} path The path
     * @param {Object} options Options for building the URL (optional)
     * @return {String} The full URL
     */
	buildURL(path, options = {}) {
		return this._buildURL(this._buildApiURL(path, options));
	},

    /**
     * @method _buildApiURL
	 * @private
     * @param {String} path
     * @param {Object} options
     * @return {String}
     */
    _buildApiURL(path, options = {}) {
		let id = null,
            snapshot = null,
            requestType = null,
            modelName = null,
            model = options.model,
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

        if (options.params) {
            result += `?${Ember.$.param(options.params)}`;
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
		url = this._buildApiURL(url, options);

		if (options.jsonData) {
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