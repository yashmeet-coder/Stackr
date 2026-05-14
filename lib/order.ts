// Lexorank-style fractional ordering over [a-z]+.
//
// `between(a, b)` returns a string that sorts strictly between `a` and `b`
// lexicographically. Either bound may be `null` to mean "open end":
//   between(null, x)  -> some rank < x
//   between(x, null)  -> some rank > x
//   between(null, null) -> a seed rank in the middle of the alphabet
//
// Inserting a new item only writes one rank; neighbors are never rewritten,
// so reorder operations are O(1) data changes.

const MIN_CHAR = 'a'.charCodeAt(0)        // 97
const MAX_CHAR = 'z'.charCodeAt(0)        // 122
const MID_CHAR = Math.floor((MIN_CHAR + MAX_CHAR) / 2) // 109 -> 'm'

function charAt(s: string, i: number): number {
  // Treat positions past the end as just-below-'a' so suffixing 'a' onto a
  // shorter string produces a value greater than the shorter string itself.
  return i < s.length ? s.charCodeAt(i) : MIN_CHAR - 1
}

export function between(a: string | null, b: string | null): string {
  if (a !== null && b !== null && a >= b) {
    throw new Error(`between: expected a < b, got a=${a} b=${b}`)
  }

  let result = ''
  let i = 0

  while (true) {
    const ca = a !== null ? charAt(a, i) : MIN_CHAR - 1
    const cb = b !== null ? charAt(b, i) : MAX_CHAR + 1

    // Both bounds agree on this position — copy it and keep walking.
    if (ca === cb) {
      result += String.fromCharCode(ca)
      i++
      continue
    }

    // There's a gap. Try to land on the midpoint.
    const mid = Math.floor((ca + cb) / 2)

    if (mid > ca && mid < cb) {
      result += String.fromCharCode(mid)
      return result
    }

    // No room for a midpoint character at this position. Anchor to `a`'s
    // character (or to 'a' if a is null/exhausted) and extend the string,
    // searching for room in deeper positions.
    if (a !== null && i < a.length) {
      result += String.fromCharCode(ca)
    } else {
      // a is open below — appending 'a' would be too small; we need to
      // produce something greater than a's prefix but less than b. Pick
      // the character just below cb and keep going.
      result += String.fromCharCode(cb - 1)
      // Now we need something strictly greater than '' but the new ceiling
      // is open on the right — extend with mid-alphabet.
      result += String.fromCharCode(MID_CHAR)
      return result
    }
    i++
  }
}

// Seed a list of `count` ranks evenly distributed across [a-z].
export function initialRanks(count: number): string[] {
  if (count <= 0) return []
  if (count === 1) return [String.fromCharCode(MID_CHAR)]

  const span = MAX_CHAR - MIN_CHAR
  const step = span / (count + 1)
  const ranks: string[] = []
  for (let i = 1; i <= count; i++) {
    const code = Math.round(MIN_CHAR + step * i)
    ranks.push(String.fromCharCode(code))
  }
  return ranks
}

// Sort helper used everywhere ranked items render.
export function byOrder<T extends { order: string }>(a: T, b: T): number {
  return a.order < b.order ? -1 : a.order > b.order ? 1 : 0
}
