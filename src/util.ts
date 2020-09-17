
export function assign<T1, T2>(a: T1, b: T2): T1 & T2
export function assign<T1, T2, T3>(a: T1, b: T2, c: T3): T1 & T2 & T3
export function assign<T1, T2, T3, T4>(a: T1, b: T2, c: T3, d: T4): T1 & T2 & T3 & T4
export function assign(...partials: any[]): any {
  const result: any = {}

  for (const partial of partials) {
    if (!partial) {
      continue
    }

    for (const key of Object.keys(partial)) {
      const newVal = partial[key]
      if (present(newVal)) {
        console.log('overwrite', key, 'with', newVal, 'was', result[key])
        result[key] = newVal
      }
    }
  }

  return result
}

export function present<T>(value: T | null | undefined | false): value is T {
  if (typeof value == 'string') {
    return value && /\S/.test(value)
  }
  return !!value
}
