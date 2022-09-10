const { isValidArkaEntry } = require('./test-helper');

describe('env', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.TEST_ENV = 'value';
  });

  test('should return env variable', () => {
    const { env } = require('../index');

    expect(env('TEST_ENV')).toBe('value');
  });

  test('should throw when env variable not found', () => {
    expect(() => {
      env('TEST_ENV_2');
    }).toThrow();
  });
});

describe('config', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'staging';
  });

  test('should return value based on current NODE_ENV', () => {
    const { config } = require('../index');

    const testValue = config(
      {
        staging: 'test',
        production: 'test2',
      },
      'default'
    );

    expect(testValue).toBe('test');
  });

  test('should return default value when current NODE_ENV is not passed', () => {
    const { config } = require('../index');

    const testValue = config(
      {
        development: 'test',
        production: 'test2',
      },
      'default'
    );

    expect(testValue).toBe('default');
  });
});

describe('value', () => {
  test('should return a valid entry', () => {
    const { value } = require('../index');

    const testEntry = value('key', 'value');

    expect(isValidArkaEntry(testEntry)).toBeTruthy();
    expect(testEntry.use).toBe('key');
    expect(testEntry.value).toBe('value');
  });
});

describe('service', () => {
  test('should return a valid entry', () => {
    const { TestService } = require('./test-data');
    const { service } = require('../index');

    const testEntry = service(TestService);

    expect(isValidArkaEntry(testEntry)).toBeTruthy();
    expect(testEntry.use).toBe(TestService.name);
    expect(testEntry.value).toBe(TestService);
  });
});

describe('provider', () => {
  test('should return a valid entry', () => {
    const { BaseClass, ImplementationClass } = require('./test-data');
    const { provider } = require('../index');

    const testEntry = provider(BaseClass, ImplementationClass);

    expect(isValidArkaEntry(testEntry)).toBeTruthy();
    expect(testEntry.use).toBe(BaseClass.name);
    expect(testEntry.value).toBe(ImplementationClass);
  });
});

describe('arka', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('should return container as function', () => {
    const { arka } = require('../index');

    expect(typeof arka).toBe('function');
  });

  test('should return services and values', () => {
    const { TestService, BaseClass, ImplementationClass } = require('./test-data');
    const { arka, value, service, provider } = require('../index');

    const container = arka(
      value('key', 'value'),
      service(TestService),
      provider(BaseClass, ImplementationClass)
    );

    const testService = container(TestService);
    const impService = container(BaseClass);

    expect(container('key')).toBe('value');
    expect(testService instanceof TestService).toBeTruthy();
    expect(impService instanceof ImplementationClass).toBeTruthy();

    expect(testService.test()).toBeTruthy();
    expect(impService.test()).toBeTruthy();
  });

  test('should throw when service not found', () => {
    const { TestService, BaseClass, ImplementationClass } = require('./test-data');
    const { arka, value, service, provider } = require('../index');

    expect(() => {
      arka(value('key', 'value'))('key1');
    }).toThrow();

    expect(() => {
      arka(service(BaseClass))(TestService);
    }).toThrow();

    expect(() => {
      arka(provider(TestService, ImplementationClass))(BaseClass);
    }).toThrow();
  });

  test('should throw on duplicated keys', () => {
    const { TestService, BaseClass, ImplementationClass } = require('./test-data');
    const { arka, value, service, provider } = require('../index');

    expect(() => {
      arka(value('key', 'value'), value('key', 'value2'));
    }).toThrow();

    expect(() => {
      arka(service(TestService), service(TestService));
    }).toThrow();

    expect(() => {
      arka(provider(BaseClass, ImplementationClass), provider(BaseClass, ImplementationClass));
    }).toThrow();
  });

  test('should provide container and config to service classes', () => {
    const { TestService, BaseClass, ImplementationClass } = require('./test-data');
    const { arka, service, provider } = require('../index');

    const testConfig = { test: 'value' };
    const impConfig = { value: 'test' };

    const container = arka(
      service(TestService, testConfig),
      provider(BaseClass, ImplementationClass, impConfig)
    );

    const testService = container(TestService);
    const impService = container(BaseClass);

    expect(testService.container).toBe(container);
    expect(impService.container).toBe(container);
    expect(testService.config).toBe(testConfig);
    expect(impService.config).toBe(impConfig);
  });

  test('should cache services', () => {
    jest.mock('./test-data');

    const { TestService, BaseClass, ImplementationClass } = require('./test-data');
    const { arka, service, provider } = require('../index');

    const testConfig = { test: 'value' };
    const impConfig = { value: 'test' };

    const container = arka(
      service(TestService, testConfig),
      provider(BaseClass, ImplementationClass, impConfig)
    );

    container(TestService);
    container(BaseClass);
    container(TestService);
    container(BaseClass);

    expect(TestService).toHaveBeenCalledTimes(1);
    expect(ImplementationClass).toHaveBeenCalledTimes(1);
  });
});

describe('arka.dotenv', () => {
  test('should call dotenv when NODE_ENV = "development" and return a container', () => {
    jest.mock('dotenv');

    process.env.NODE_ENV = 'staging';

    const dotenv = require('dotenv');
    const { arka } = require('../index');

    expect(typeof arka.dotenv()).toBe('function');
    expect(dotenv.config).toHaveBeenCalledTimes(0);

    process.env.NODE_ENV = 'development';

    expect(typeof arka.dotenv()).toBe('function');
    expect(dotenv.config).toHaveBeenCalledTimes(1);
  });
});
