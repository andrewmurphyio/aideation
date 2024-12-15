/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: unknown): boolean {
  return !!(item && typeof item === 'object' && !Array.isArray(item))
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export default function deepMerge<T extends object, R extends object>(target: T, source: R): T {
  const output = { ...target } as Record<string, object>
  const targetObject = target as Record<string, object>
  const sourceObject = source as Record<string, object>
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = (source as Record<string, unknown>)[key];
      if (isObject(sourceValue)) {
        if (!(key in target)) {
          Object.assign(output, { [key]: sourceValue })
        } else {
          output[key] = deepMerge(targetObject[key] as object, sourceObject[key])
        }
      } else {
        Object.assign(output, { [key]: sourceObject[key] })
      }
    })
  }

  return output as T
}
