import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';

let service, store;

moduleFor('service:api', {
    beforeEach() {
        this.register('model:user', DS.Model);
        service = this.subject();
        store = service.get('store');
    },
    afterEach() {
        service = null;
        store = null;
    }
});

test('buildURL: path only', function(assert) {
    assert.expect(1);
    let url = service.buildURL('action');
    assert.strictEqual(url, '/action', 'should return right URL.');
});

test('buildURL: path and custom host', function(assert) {
    assert.expect(1);
    service.set('host', 'http://example.com');
    let url = service.buildURL('action');
    assert.strictEqual(url, 'http://example.com/action', 'should return right URL.');
});

test('buildURL: path and custom namespace', function(assert) {
	assert.expect(1);
	service.set('namespace', 'test');
	let url = service.buildURL('action');
	assert.strictEqual(url, '/test/action', 'should return right URL.');
});

test('buildURL: path and params', function(assert) {
    assert.expect(3);
    let url = service.buildURL('action', {
        params: { test2: 2, test1: 1 }
    });
    assert.strictEqual(url, '/action?test1=1&test2=2', 'should return right URL.');
    url = service.buildURL('action', {
        params: { a: [1,2,3] },
        traditional: true
    });
    assert.strictEqual(url, '/action?a=1&a=2&a=3', 'should respect jQuery traditional setting.');
    Ember.$.ajaxSettings.traditional = true;
    url = service.buildURL('action', {
        params: { a: [1,2,3] }
    });
    Ember.$.ajaxSettings.traditional = undefined;
    assert.strictEqual(url, '/action?a=1&a=2&a=3', 'should respect jQuery global traditional setting.');
});

test('buildURL: path and model name', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        let url = service.buildURL('action', {
            model: 'user'
        });
        assert.strictEqual(url, '/users/action', 'should return right URL.');
    });
});

test('buildURL: path and model name and custom adapter', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.adapterFor('user').set('namespace', 'api');
        let url = service.buildURL('action', {
            model: 'user'
        });
        assert.strictEqual(url, '/api/users/action', 'should return right URL.');
    });
});

test('buildURL: path and model instance', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.push({ data: { type: 'user', id: '1' }});
        let url = service.buildURL('action', {
            model: store.peekRecord('user', 1)
        });
        assert.strictEqual(url, '/users/1/action', 'should return right URL.');
    });
});

test('buildURL: path and model instance without id', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        assert.throws(() => {
            service.buildURL('action', {
                model: store.createRecord('user')
            });
        }, 'should throw an error.');
    });
});

test('buildURL: path and model instance and custom adapter', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.adapterFor('user').set('namespace', 'api');
        store.push({ data: { type: 'user', id: '1' }});
        let url = service.buildURL('action', {
            model: store.peekRecord('user', 1)
        });
        assert.strictEqual(url, '/api/users/1/action', 'should return right URL.');
    });
});

test('options', function(assert) {
    assert.expect(4);
    let result = service.options('action', {
        model: 'user',
        requestType: 'findAll',
        jsonData: {},
        params: {}
    });
    assert.strictEqual(typeof result.model, 'undefined', 'property model should have been deleted.');
    assert.strictEqual(typeof result.params, 'undefined', 'property params should have been deleted.');
    assert.strictEqual(typeof result.jsonData, 'undefined', 'property jsonData should have been deleted.');
    assert.strictEqual(typeof result.requestType, 'undefined', 'property requestType should have been deleted.');
});

test('options: type GET and jsonData set', function(assert) {
    assert.expect(3);
    let result = service.options('action', {
        type: 'GET',
        jsonData: { test2: 2, test1: 1 }
    });
    assert.strictEqual(typeof result.contentType, 'undefined', 'contentType should not have been set.');
    assert.strictEqual(typeof result.processData, 'undefined', 'processData should not have been set.');
    assert.deepEqual(typeof result.data, 'undefined', 'data should not have been set.');
});

test('options: type not GET and jsonData set', function(assert) {
    assert.expect(3);
    let data = { test2: 2, test1: 1 };
    let result = service.options('action', {
        jsonData: data
    });
    assert.strictEqual(result.contentType, 'application/json; charset=UTF-8', 'contentType should have been set to JSON.');
    assert.strictEqual(result.processData, false, 'processData should have been set to false.');
    assert.deepEqual(result.data,  JSON.stringify(data), 'data should equal jsonData.');
});

test('options: type GET and data set', function(assert) {
    assert.expect(1);
    assert.throws(() => {
        service.options('action', {
            type: 'GET',
            data: {}
        });
    }, 'should throw an error.');
});

test('options: calling twice', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.adapterFor('user').set('namespace', 'api');
        store.push({ data: { type: 'user', id: '1' }});
        let result1 = service.options('action', {
            model: store.peekRecord('user', 1)
        });
		let result2 = service.options('action', JSON.parse(JSON.stringify(result1)));
        assert.deepEqual(result1, result2, 'result should remain the same.');
    });
});