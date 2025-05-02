export function containsHangulJamo(str: string): boolean {
  return [...str].some((ch) => {
    const code = ch.charCodeAt(0);
    return code >= 0x3131 && code <= 0x318e; // 한글 자모 블록
  });
}

const bannedWords = ["fuck", "shit", "bitch", "cunt", "dick"];
export function containsProfanity(str: string): boolean {
  const lower = str.toLowerCase();
  return bannedWords.some((word) => lower.includes(word));
}
