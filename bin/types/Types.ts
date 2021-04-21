export type ObjectValueType<T> = {
  [K in keyof T]: T[K];
};
