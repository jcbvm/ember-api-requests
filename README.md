# ember-api-requests

Service for making custom requests to your backend API.

This service extends [ember-ajax](https://github.com/ember-cli/ember-ajax) but uses [ember-data](https://github.com/ember-cli/ember-data) for building the URL.<br>
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
      data: {
        username: username
      }
    });
  }
});
```

When calling above method with username `John`, a request will be made to `/api/users/check-username?username=John`.

The request takes a 'action' path as first parameter and an options object as second parameter. 
The service will create the URL from the given model name and the corresponding adapter. 
The rest of the options are simply passed to the underlying jQuery ajax method, so you may pass any additional properties you would normally pass to a jQuery ajax request.

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

#### Request options

All below options are optional.

| option | type | description | 
|:---|:---|:---|
| model | Ember Data Model name or instance | Used for constructing the URL. When passing an instance, the `id` of the instance will be added to the generated URL. The service will use the underlying Ember Data Adapter of the model to construct the URL. If this option is omitted, the application adapter will be used to construct the URL. |
| jsonData | Ojbect | Used for adding a `JSON` request body. Acts the same as defining a `data` object you would normally use when making a jQuery ajax request but additionally sets the content type of the request to `application/json;charset=UTF-8`. This option is only useful when doing a `post`, `put`, or `patch` request. |
| params | Object | Used to add extra query parameters to the URL. |
| requestType | String | Used by Ember Data to construct the URL. Defaults to `findRecord` when `model` is an instance and `findAll` when `model` is a model name. |

#### Service methods

| name | description | 
|:---|:---|
| buildURL(path, options) | The function used by the request methods mentioned above to create a request URL. |

## License

This project is released under the MIT license.
