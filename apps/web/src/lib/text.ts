const WORD_SEPARATORS = /([\s\-'’]+)/;

export function toTitleCase(value: string, preserved: readonly string[] = []): string {
  const keep = new Set(preserved.map((token) => token.toLowerCase()));

  return value
    .split(WORD_SEPARATORS)
    .map((part) => {
      if (part === '' || WORD_SEPARATORS.test(part)) return part;
      if (keep.has(part.toLowerCase())) return part;
      const [first, ...rest] = [...part];
      return first.toUpperCase() + rest.join('').toLowerCase();
    })
    .join('');
}
