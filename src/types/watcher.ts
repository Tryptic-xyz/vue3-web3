export interface WatcherOptions {
  once?: Boolean
}

export interface WatcherItem {
  fn: Function
  options: WatcherOptions
}

export interface WatcherArray extends Array<WatcherItem> {}
