export type SomethingIrrelevant = {}
export type Producer<T, A extends unknown[]> = (...args: A) => T | Promise<T>
export type DefaultFn<T, R, A extends unknown[]> = Producer<T, A>
export type ExtendedFn<T, R, A extends unknown[]> =
  DefaultFn<T, R, A>
  | SomethingIrrelevant
export type DefaultShape = Record<string, Record<string, any>>
export interface Api<T extends unknown, R extends unknown, A extends unknown[]> {
  fn: ExtendedFn<T, R, A>,
  eager?: boolean,
  producer?: Producer<T, A>,
}

export type AppEntry<T extends DefaultShape> = {
  [resource in keyof T]: {
    [api in keyof T[resource]]: Api<
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? T : never,
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? R : never,
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? A : never
    >
  }
}

export type Application<T extends DefaultShape> = {
  [resource in keyof T]: {
    [api in keyof T[resource]]: Token<
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? T : never,
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? R : never,
      T[resource][api]["fn"] extends ExtendedFn<infer T, infer R, infer A extends unknown[]> ? A : never
    >
  }
}

export type PendingState<T, A extends unknown[]> = {
  args: A,
  data: Promise<T>,
  status: "pending",
  promise: Promise<T>,
}
export type SuccessState<T, A extends unknown[]> = {
  args: A,
  data: T,
  status: "fulfilled",
  promise: Promise<T>,
}
export type ErrorState<T, R, A extends unknown[]> = {
  args: A,
  data: R,
  status: "rejected",
  promise: Promise<T>,
}
// T: data type, R: reason of rejection, A args!
export type State<T, R, A extends unknown[]> =
  PendingState<T, A>
  | SuccessState<T, A>
  | ErrorState<T, R, A>

export type Token<T, R, A extends unknown[]> = {
  (...args: A): T | Promise<T>,

  evict(...args: A): void,
  inject(fn: (...args: A) => (T | Promise<T>)): void,
  subscribe(cb: (t: T | Promise<T> | any) => void): (() => void),
}
