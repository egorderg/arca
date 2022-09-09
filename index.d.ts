declare namespace arca {
  type ArcaIdentifier<Value, Config> =
    | (new (container: ArcaContainer, config: Config) => Value)
    | (abstract new () => Value)
    | string;

  type ArcaContainer = <Value, Config>(
    use: ArcaIdentifier<Value, Config>
  ) => Value;

  type ArcaServiceConstructor<BaseClass> = new (
    container: ArcaContainer,
    config: never
  ) => BaseClass;

  type ArcaEntry = {
    type: "value" | "singleton";
    use: string;
    value: ArcaServiceConstructor<unknown> | unknown;
    config?: unknown;
  };

  type ArcaEnvironmentCollection<Value> = {
    [env: string]: Value;
  };

  type ArcaServiceConfig<Config> = Partial<Config> extends Config
    ? [t?: Config]
    : [t: Config];

  type ArcaServiceParameter<Value, Config> = new (
    container: ArcaContainer,
    config: Config
  ) => Value;

  function env(key: string): string;

  function config<Value>(
    envs: ArcaEnvironmentCollection<Value>,
    defaultValue: Value
  ): Value;

  function provider<Use, Value extends Use, Config>(
    use: abstract new () => Use,
    value: ArcaServiceParameter<Value, Config>,
    ...config: ArcaServiceConfig<Config>
  ): ArcaEntry;

  function service<Value, Config>(
    service: ArcaServiceParameter<Value, Config>,
    ...config: ArcaServiceConfig<Config>
  ): ArcaEntry;

  function value<Value>(use: string, value: Value): ArcaEntry;

  const arca: {
    (...entries: ArcaEntry[]): ArcaContainer;
    dotenv: (...entries: ArcaEntry[]) => ArcaContainer;
  };
}

export = arca;
