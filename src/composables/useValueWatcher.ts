//TODO
import { watch } from 'vue'
import type { Ref, reactive } from 'vue'
import { isRef, isReactive } from 'vue'

// easier to pass values to subscribers
export function useValueWatcher(valueToWatch: Ref | Object) {
  watch(
    valueToWatch,
    (curr, prev) => {
      if (curr !== prev) {
        console.log('updated', curr, prev)
      } else if (curr && !prev) {
        console.log(curr, prev)
      }
    },
    { immediate: true }
  )

  const onValue = () => {}

  const onValueChanged = () => {}

  return [onValue, onValueChanged]
}
