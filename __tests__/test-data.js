class TestService {
  constructor(container, config) {
    this.container = container;
    this.config = config;
  }

  test() {
    return true;
  }
}

class BaseClass {
  test() {
    return false;
  }
}

class ImplementationClass extends BaseClass {
  constructor(container, config) {
    super();

    this.container = container;
    this.config = config;
  }

  test() {
    return true;
  }
}

module.exports = {
  TestService,
  BaseClass,
  ImplementationClass,
};
