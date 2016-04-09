import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';

let service, store, owner;

moduleFor('service:api', {
    beforeEach() {
        service = this.subject();
        store = service.get('store');
        owner = Ember.getOwner(service);
        owner.register('model:user', DS.Model);
    },
    afterEach() {
        owner.unregister('model:user');
        owner = null;
        service = null;
        store = null;
    }
});

test('buildURL with path only', function(assert) {
    assert.expect(1);
    let service = this.subject();
    let url = service.buildURL('action');
    assert.equal(url, '/action', 'should return right URL.');
});

test('buildURL with path and params', function(assert) {
    assert.expect(1);
    let service = this.subject();
    let url = service.buildURL('action', {
        params: {
            test1: 1,
            test2: 2
        }
    });
    assert.equal(url, '/action?test1=1&test2=2', 'should return right URL.');
});

test('buildURL with path and custom host', function(assert) {
    assert.expect(1);
    let service = this.subject();
    service.set('host', 'http://example.com');
    let url = service.buildURL('action');
    assert.equal(url, 'http://example.com/action', 'should return right URL.');
});

test('buildURL with path and model name', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        let url = service.buildURL('action', {
            model: 'user'
        });
        assert.equal(url, '/users/action', 'should return right URL.');
    });
});

test('buildURL with path and model name and custom adapter', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.adapterFor('user').set('namespace', 'api');
        let url = service.buildURL('action', {
            model: 'user'
        });
        assert.equal(url, '/api/users/action', 'should return right URL.');
    });
});

test('buildURL with path and model instance', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.push({ data: { type: 'user', id: '1' }});
        let url = service.buildURL('action', {
            model: store.peekRecord('user', 1)
        });
        assert.equal(url, '/users/1/action', 'should return right URL.');
    });
});

test('buildURL with path and model instance without id', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        assert.throws(() => {
            service.buildURL('action', {
                model: store.createRecord('user')
            });
        }, 'should throw error.');
    });
});

test('buildURL with path and model instance and custom adapter', function(assert) {
    assert.expect(1);
    Ember.run(() => {
        store.adapterFor('user').set('namespace', 'api');
        store.push({ data: { type: 'user', id: '1' }});
        let url = service.buildURL('action', {
            model: store.peekRecord('user', 1)
        });
        assert.equal(url, '/api/users/1/action', 'should return right URL.');
    });
});