export interface Cache<key, value> {
  resolve(key: key, callback: () => value): value

  resolveAsync(key: key, callback: () => Promise<value>): Promise<value>
}
