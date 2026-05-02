export function numberToWordsUz(num: number): string {
  if (num === 0) return "nol";

  const ones = ["", "bir", "ikki", "uch", "to'rt", "besh", "olti", "yetti", "sakkiz", "to'qqiz"];
  const tens = ["", "o'n", "yigirma", "o'ttiz", "qirq", "ellik", "oltmish", "yetmish", "sakson", "to'qson"];
  const scales = ["", "ming", "million", "milliard", "trillion"];

  function getHundreds(n: number): string {
    let result = "";
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const o = n % 10;

    if (h > 0) result += ones[h] + " yuz ";
    if (t > 0) result += tens[t] + " ";
    if (o > 0) result += ones[o] + " ";

    return result.trim();
  }

  let result = "";
  let scaleIndex = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const chunkWords = getHundreds(chunk);
      result = chunkWords + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + " " + result;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}
