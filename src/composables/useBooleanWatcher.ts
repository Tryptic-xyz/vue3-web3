import { watch, ref, isRef } from 'vue'
import type { Ref } from 'vue'
import type { WatcherArray, WatcherOptions } from '../types/watcher'

export function useBooleanWatcher(value?: Boolean | Ref<Boolean>) {
  const onTrueWatchers: WatcherArray = []
  const onFalseWatchers: WatcherArray = []
  const refToWatch = isRef(value) ? value : ref(value)

  const addBooleanTrueWatcher = (watcher: Function, opts?: WatcherOptions) => {
    if (refToWatch.value) {
      watcher(refToWatch.value)
    } else {
      onTrueWatchers.push({ fn: watcher, options: { once: false, ...opts } })
    }
  }

  const addBooleanFalseWatcher = (watcher: Function, opts?: WatcherOptions) => {
    onFalseWatchers.push({ fn: watcher, options: { once: false, ...opts } })
  }

  const toggle = () => (refToWatch.value = !refToWatch.value)

  watch(
    () => refToWatch.value,
    (curr, prev) => {
      const watcherArr = curr && !prev ? onTrueWatchers : onFalseWatchers

      for (let i = 0; i < watcherArr.length; i++) {
        const element = watcherArr[i]
        element.fn(refToWatch.value)

        if (element.options.once) {
          watcherArr.splice(i, 1)
        }
      }
    }
  )

  // this creates typescript issues because it's and array of different types
  // return [addBooleanTrueWatcher, addBooleanFalseWatcher, toggle, refToWatch]

  // returning an object here allows for type inference w/o a hassle
  return { onTrue: addBooleanTrueWatcher, onFalse: addBooleanFalseWatcher, toggle, ref: refToWatch }
}
