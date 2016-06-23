WebDriver JS Extender
=====================

This tools extends [Selenium's javascript implementation](
https://www.npmjs.com/package/selenium-webdriver) of the WebDriver API
to include additional commands (e.g. commands required for [appium](
https://github.com/appium/appium)).

Currently, few commands are implemented.  But the groundwork has been laid,
future commands should be easy to add, and PRs are very welcome!

Usage
-----

```js
  var extendedWebdriver = require('webdriver-js-extender').extend(webdriver);

  extendedWebdriver.setNetworkConnection(5);
```
