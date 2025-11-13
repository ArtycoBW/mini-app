export const onlyDigits = (s: string) => s.replace(/\D/g, "")
export const ensure8 = (digits: string) => (digits.startsWith("8") ? digits : "8" + digits.replace(/^7/, ""))
export const format8 = (input: string) => {
  const d = ensure8(onlyDigits(input)).slice(0, 11)
  const p1 = d.slice(0, 1)
  const p2 = d.slice(1, 4)
  const p3 = d.slice(4, 7)
  const p4 = d.slice(7, 9)
  const p5 = d.slice(9, 11)
  const parts = [p1, p2 && "-" + p2, p3 && "-" + p3, p4 && "-" + p4, p5 && "-" + p5].filter(Boolean).join("")
  return { formatted: parts, digits: d }
}
