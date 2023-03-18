interface IObjectKeys {
  [key: string]: string | number | undefined
}

export function useSyncReactiveWithObject(reactiveObj: IObjectKeys, obj: IObjectKeys) {
  Object.keys(obj).forEach((key) => {
    reactiveObj[key] = obj[key]
  })
}
