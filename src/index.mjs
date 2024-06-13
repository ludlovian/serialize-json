const $DATE = '$date$'
const $UNDEFINED = '$undefined$'

export function serialize (x, opts = {}) {
  if (Array.isArray(x)) {
    return x.map(x => serialize(x, opts))
  } else if (x === undefined) {
    return opts.undef ? { [$UNDEFINED]: true } : x
  } else if (x instanceof Date) {
    return opts.date ? { [$DATE]: x.toISOString() } : x.toISOString()
  } else if (x === null || typeof x !== 'object') {
    return x
  } else {
    return Object.fromEntries(
      Object.entries(x).map(([k, v]) => [k, serialize(v, opts)])
    )
  }
}

export function deserialize (x, opts = {}) {
  if (Array.isArray(x)) {
    return x.map(x => deserialize(x, opts))
  } else if (x === null || typeof x !== 'object') {
    return x
  } else if (opts.date && $DATE in x) {
    return new Date(x[$DATE])
  } else if (opts.undef && $UNDEFINED in x) {
    return undefined
  } else {
    return Object.fromEntries(
      Object.entries(x).map(([k, v]) => [k, deserialize(v, opts)])
    )
  }
}
