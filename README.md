# ember-strict-warnings

Do you want to make sure your app never spews warnings? Then this addon is for you. 

It allows you to make specific Ember warnings into hard errors during development and/or test. In combination with sensible Continuous Integration testing, you can automatically reject changes to your app that would introduce warnings.

## Installation

`npm install --dev ember-strict-warnings`

## Configuring

In your ember-cli-build.js, add a strictWarnings section to your EmberApp

```js
let app = new EmberApp(defaults, {
  strictWarnings: {
    'ember-htmlbars.style-xss-warning': ['development', 'test']
  }
});
```

The keys of `strictWarnings` are Ember's IDs for each kind of warning you want to make into an error. 

The values are a list of environments. You can't use "production" in the environments, because Ember strips warnings out of production builds. (And it would be a silly thing to do anyway.)

You can also use the special key "*" for all warnings.


