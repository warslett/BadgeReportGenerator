import {Cache} from "~/src/Cache/Cache";

export class InMemoryCache<key, value> implements Cache<key, value> {
  readonly cache: Map<key, value>

  constructor() {
    this.cache = new Map<key, value>()
  }

  resolve(key: key, callback: () => value): value {
    const foundItem: value|undefined = this.cache.get(key)
    if (foundItem != undefined) {
      return foundItem
    }

    const item = callback()
    this.cache.set(key, item)
    return item
  }

  async resolveAsync(key: key, callback: () => Promise<value>): Promise<value> {
    const foundItem: value|undefined = this.cache.get(key)
    if (foundItem != undefined) {
      return foundItem
    }

    const item = await callback()
    this.cache.set(key, item)
    return item
  }
}
