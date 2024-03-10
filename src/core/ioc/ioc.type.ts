export interface DependencyRegister<TResult = void, TConfig = unknown> {
  register(config?: TConfig): TResult | Promise<TResult>;
}
