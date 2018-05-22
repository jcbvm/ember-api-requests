## 0.4.0

- Updated project to ember-cli 3.1.3 and moved to yarn

## 0.3.1

- Updated project to ember-cli 2.9.1 and loosened ember-ajax version

## 0.3.0

- [FEATURE] Refactor service by making use of the new ember-ajax mixin. [#1](https://github.com/jcbvm/ember-api-requests/issues/1)
- [BUGFIX] New version of ember-ajax calls `options` twice, make sure to return the right data if this happens.  [#1](https://github.com/jcbvm/ember-api-requests/issues/1)

## 0.2.3

- [BUGFIX] Fixed check for using urlencoded content type for non-get requests with only query parameters

## 0.2.2

- [BUGFIX] Use urlencoded content type for non-get requests with only query parameters

## 0.2.1

- Added support for ember-ajax ~2.1.0
- Updated ember-cli to v2.5.0

## 0.2.0

- [BUGFIX] Sort query params according to adapter setting
- [BREAKING] `params` option should now always be used for query params instead of `data` option
- Added support for ember-ajax 2.0.0
- Some internal changes

## 0.1.3

- [FEATURE] Added tests

## 0.1.2

- [FEATURE] Added BC for ember-data
- [BUG] Take host into account when building api URL

## 0.1.1

- [BUG] Fixed typo

## 0.1.0

- Initial release
