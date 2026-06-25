"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Qué nivel de inglés necesito para empezar?",
    answer:
      "Nuestros cursos especializados parten desde un nivel A2. Si apenas entiendes inglés básico, te recomendamos empezar por nuestro módulo de fundamentos antes de elegir especialidad. El test gratuito te indica exactamente dónde empezar.",
  },
  {
    question: "¿En qué se diferencia de un curso de inglés normal?",
    answer:
      "En un curso genérico aprendes a pedir comida en un restaurante. Aquí aprendes a cerrar una venta con un cliente americano, defender tu código en un code review o presentar resultados financieros a un board internacional. Todo el contenido es específico de tu sector.",
  },
  {
    question: "¿Cuánto tiempo necesito dedicar?",
    answer:
      "Las lecciones duran 15-20 minutos y están diseñadas para profesionales con poco tiempo. Recomendamos 3-4 sesiones por semana para ver resultados en 8-12 semanas.",
  },
  {
    question: "¿Recibo algún certificado?",
    answer:
      "Sí. Al completar cada nivel recibes un certificado digital que puedes añadir a tu LinkedIn. El certificado especifica tu nivel y tu especialidad profesional.",
  },
  {
    question: "¿Puedo cambiar de especialidad?",
    answer:
      "Sí, puedes combinar especialidades o cambiar en cualquier momento. Muchos alumnos hacen Business English + su especialidad técnica.",
  },
  {
    question: "¿Hay profesores o es todo contenido grabado?",
    answer:
      "Los cursos combinan lecciones grabadas de alta calidad con ejercicios interactivos. Los planes avanzados incluyen sesiones en vivo con profesores especializados en tu sector.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl font-bold">Preguntas frecuentes</h2>
          <p className="text-foreground/60 mt-4 text-lg">
            Todo lo que necesitas saber antes de empezar.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-line rounded-xl overflow-hidden bg-surface">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-overlay transition-colors"
              >
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gold shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-sm text-foreground/60 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
