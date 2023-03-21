interface IObjectKeys {
  [key: string]: any
}

export function useSyncReactiveWithObject(reactiveObj: IObjectKeys, obj: IObjectKeys) {
  Object.keys(obj).forEach((key) => {
    reactiveObj[key] = obj[key]
  })
}
