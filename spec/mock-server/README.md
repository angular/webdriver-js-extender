Mock Server
===========


Here we define a mock selenium standalone server, which supports all the commands we will need for
unit-testing all the commands we're adding to the webdriver instance.

This allows us to use `selenium-webdriver`'s actual `Builder` API to create our client, and
therefore run all our tests though `selenium-webdriver`'s real codebase.  Additionally, since we're
using our own server, this allows us to verify that the server is receiving the parameters we expect
to send, at the URL we expect to be sending to.

In `./index.ts`, we instance the mock server and add all our custom commands.


In `./interfaces.ts`, we define the custom interfaces needed for mocking out a selenium server,
including an interface for all the extra information we'll be putting into the webdriver session
and a list of all the custom command's we'll be implementing.

In `./commands/`, we define all the custom commands.
