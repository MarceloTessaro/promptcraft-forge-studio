export function sanitize(input, maxLength = 2048) {
  if (typeof input !== 'string') return '#';
  const escapeMap = {'<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','&':'&amp;'};
  const escapeHTML = s => s.replace(/[<>'"&]/g, m => escapeMap[m]);
  let out = escapeHTML(input.trim().slice(0, maxLength));
  let prev;
  do {
    prev = out;
    out = out
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '');
  } while (out !== prev);
  return out;
}
