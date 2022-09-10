> A simple and minimalistic DI container for javascript/typescript

## Install

```
npm install arka
```

## Features

- typescript support
- dotenv support
- throws error on missing environment variable
- access services with abstract classes
- supported values:
  - classes
  - scalar
  - objects
  - arrays

## Usage

Container creation

```js
const { arka, env, config, value, provider, service } = require("arka");

abstract class PaymentService {
  abstract pay();
}

class PaypalService extends PaymentService {
  constructor(container, config) {
    // Config from the creation process is passed when the Service is request
  }

  pay() {
    // Access paypal api
  }
}

class UserService {
  constructor(container) {
    console.log(container("USER")); // Output: 'abc'
    console.log(container("SECRET")); // Output: value from environment variable 'SECRET'
  }
}

// arka.dotenv for 'dotenv', is loaded when NODE_ENV is 'development'
const container = arka(
  value("USER", "abc"),
  value("SECRET", env("SECRET")),
  value('OBJ', { someObject: '' }),
  service(UserService),
  provider(PaymentService, PaypalService, {
    apiKey: config({
      production: env('PAYPAL_API_KEY')
    }, 'DEFAULT_VALUE')
  })
);


const userService = container(UserService); // class UserService
const paymentService = container(PaymentService); // class PaypalService, it's not possible to access a provider with the implementation class
const secret = container('SECRET'); // Of course you can also access static values
```

## Changelog

Please see the [Changelog](./CHANGELOG.md) for a summary of changes.

## Tests

```
$ npm test
```

## License

[MIT](https://github.com/egorderg/arka/blob/main/LICENSE)
