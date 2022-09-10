function getId(use) {
  if (typeof use === 'string') {
    return use;
  }

  return use.name;
}

function env(key) {
  const value = process.env[key];

  if (value == null) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
}

function config(envs, defaultValue) {
  return envs[process.env.NODE_ENV] || defaultValue;
}

function provider(use, value, config) {
  return {
    type: 'singleton',
    use: use.name,
    value: value,
    config: config,
  };
}

function service(service, config) {
  return {
    type: 'singleton',
    use: service.name,
    value: service,
    config: config,
  };
}

function value(use, value) {
  return {
    type: 'value',
    use,
    value,
  };
}

function arka(...entries) {
  const collection = {};
  const values = {};

  for (const entry of entries) {
    if (Object.prototype.hasOwnProperty.call(collection, entry.use)) {
      throw new Error(`Duplicate key in arka container ${entry.use}`);
    }

    collection[entry.use] = entry;

    if (entry.type === 'value') {
      values[entry.use] = entry.value;
    }
  }

  const container = (use) => {
    const id = getId(use);

    if (Object.prototype.hasOwnProperty.call(values, id)) {
      return values[id];
    }

    if (!Object.prototype.hasOwnProperty.call(collection, id)) {
      throw new Error(`Service ${id} not found`);
    }

    const entry = collection[id];
    const ctor = entry.value;
    const config = entry.config;

    return (values[id] = new ctor(container, config));
  };

  return container;
}

arka.dotenv = (...entries) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
  }

  return arka(...entries);
};

module.exports = {
  env,
  config,
  provider,
  service,
  value,
  arka,
};
