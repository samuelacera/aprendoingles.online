// Coste de IA que se enseña al alumno en la práctica por voz.
// SIEMPRE el doble del real (decisión de Samuel, igual que en Brújula),
// para dejar margen y que cada llamada se valore.
// Real medido: ~0,08 €/min de voz (ElevenLabs + modelo) y ~0,03 € por corrección (Claude).
export const VOICE_EUR_PER_MIN = 0.16;
export const ANALYSIS_EUR = 0.06;

export const voiceCost = (seconds: number) => (Math.max(0, seconds) / 60) * VOICE_EUR_PER_MIN;

export const euros = (n: number) =>
  n.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
