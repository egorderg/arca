declare namespace arka {
  type ArkaIdentifier<Value, Config> =
    | (new (container: ArkaContainer, config: Config) => Value)
    | (abstract new () => Value)
    | string;

  type ArkaContainer = <Value, Config>(use: ArkaIdentifier<Value, Config>) => Value;

  type ArkaServiceConstructor<BaseClass> = new (
    container: ArkaContainer,
    config: never
  ) => BaseClass;

  type ArkaEntry = {
    type: 'value' | 'singleton';
    use: string;
    value: ArkaServiceConstructor<unknown> | unknown;
    config?: unknown;
  };

  type ArkaEnvironmentCollection<Value> = {
    [env: string]: Value;
  };

  type ArkaServiceConfig<Config> = Partial<Config> extends Config ? [t?: Config] : [t: Config];

  type ArkaServiceParameter<Value, Config> = new (
    container: ArkaContainer,
    config: Config
  ) => Value;

  function env(key: string): string;

  function config<Value>(envs: ArkaEnvironmentCollection<Value>, defaultValue: Value): Value;

  function provider<Use, Value extends Use, Config>(
    use: abstract new () => Use,
    value: ArkaServiceParameter<Value, Config>,
    ...config: ArkaServiceConfig<Config>
  ): ArkaEntry;

  function service<Value, Config>(
    service: ArkaServiceParameter<Value, Config>,
    ...config: ArkaServiceConfig<Config>
  ): ArkaEntry;

  function value<Value>(use: string, value: Value): ArkaEntry;

  const arka: {
    (...entries: ArkaEntry[]): ArkaContainer;
    dotenv: (...entries: ArkaEntry[]) => ArkaContainer;
  };
}

export = arka;
