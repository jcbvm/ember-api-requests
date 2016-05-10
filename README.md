# ember-api-requests [![Build Status](https://travis-ci.org/jcbvm/ember-api-requests.svg?branch=master)](https://travis-ci.org/jcbvm/ember-api-requests) [![Ember Observer Score](https://emberobserver.com/badges/ember-api-requests.svg)](https://emberobserver.com/addons/ember-api-requests) [![Code Climate](https://codeclimate.com/github/jcbvm/ember-api-requests/badges/gpa.svg)](https://codeclimate.com/github/jcbvm/ember-api-requests)

Service for making custom requests to your backend API.

This service extends [ember-ajax](https://github.com/ember-cli/ember-ajax) but uses [ember-data](https://github.com/ember-cli/ember-data) for building the URL.<br>
So instead of having to manually create a request URL which may point to one of your model endpoints on the backend, you can pass a model name or instance and this service will generate the right URL prefix for you.<br>
This way you can make custom requests to your backend API the easy way.

For basic understanding please refer to the ember-ajax [documentation](https://github.com/ember-cli/ember-ajax) first.

## Usage

To use the service, inject it into your route, component, service or other part of your app.

Suppose your application adapter has `/api` as namespace and you have a model called `user` and you want to check if an username already exists:

```javascript
import Ember from 'ember';

export default Ember.Service.extend({
  api: Ember.inject.service(),
  
  usernameExists(username) {
    return this.get('api').request('check-username', {
      model: 'user',
      params: {
        username: username
      }
    });
  }
});
```

When calling above method with username `john`, a request will be made to `/api/users/check-username?username=john`.

The request takes a path as first parameter and an options object as second parameter. 
The options object is the object you would normally pass to a jQuery ajax request, but has some additional reserved properties (see API section below).
The service will create the URL from the given model name and the corresponding adapter. The params object will be used to add additional query parameters to the URL.

#### HTTP methods

All basic HTTP methods are supported:

```javascript
request('action', { model: 'user' }) // GET request to /users/action
request('action', { model: user })   // GET request to /users/1/action
post('action', { model: 'user' })    // POST request to /users/action
put('action', { model: user })       // PUT request to /users/1/action (asuming user is a model with id 1)
patch('action', { model: user })     // PATCH request to /users/1/action (asuming user is a model with id 1)
del('action', { model: user })       // DELETE request to /users/1/action (asuming user is a model with id 1)
```

## API

Because this service extends ember-ajax. You are able to do anything ember-ajax can do, like setting a custom host or custom request headers. See the ember-ajax [documentation](https://github.com/ember-cli/ember-ajax) for more details. Below follows the extra API this service provides.

#### Request options

All below options are optional.

| option | type | description | 
|:---|:---|:---|
| model | Ember Data Model name or instance | Used for constructing the URL. When passing an instance, the `id` of the instance will be added to the generated URL. The service will use the underlying Ember Data Adapter of the model to construct the URL. If this option is omitted, the application adapter will be used to construct the URL. |
| jsonData | Ojbect | Used for adding a `JSON` request body. Acts the same as defining a `data` object you would normally use when making a jQuery ajax request but additionally sets the content type of the request to `application/json;charset=UTF-8`. This option is only useful when doing a `post`, `put`, or `patch` request. |
| params | Object | Used to add extra query parameters to the URL. Always use this property when you want to add query parameters to the URL. This differs from jQuery ajax requests, where a `data` property may be set for `GET` requests to add query parameters to the URL. |
| requestType | String | Used by Ember Data to construct the URL. Defaults to `findRecord` when `model` is an instance and `findAll` when `model` is a model name.

#### Service methods

| name | description | 
|:---|:---|
| buildURL(path, options) | The function used by the request methods mentioned above to create a request URL. |

## Examples

```javascript
this.get('api').request('authenticate', {
  params: {
	username: 'john',
	password: 'password'
  }
});
```
`GET` request to `/authenticate?username=john&password=password`

```javascript
this.get('api').request('logout');
```
`GET` request to `/logout`

```javascript
this.get('api').post('notify', {
  model: user,
  jsonData: {
	text: 'Hello'
  }
});
```
`POST` request to `/users/1/notify` with content type `application/json;charset=UTF-8` and body `{"text":"Hello"}`

```javascript
this.get('api').put('split', {
  model: document,
  params: {
	page: [2, 4]
  }
});
```
`PUT` request to `/documents/1/split?page[]=2&page[]=4`

## License

This project is released under the MIT license.
