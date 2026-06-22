"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Que nivel de ingles necesito para empezar?",
    answer:
      "Nuestros cursos especializados parten desde un nivel A2. Si apenas entiendes ingles basico, te recomendamos empezar por nuestro modulo de fundamentos antes de elegir especialidad. El test gratuito te indica exactamente donde empezar.",
  },
  {
    question: "En que se diferencia de un curso de ingles normal?",
    answer:
      "En un curso generico aprendes a pedir comida en un restaurante. Aqui aprendes a cerrar una venta con un cliente americano, defender tu codigo en un code review o presentar resultados financieros a un board internacional. Todo el contenido es especifico de tu sector.",
  },
  {
    question: "Cuanto tiempo necesito dedicar?",
    answer:
      "Las lecciones duran 15-20 minutos y estan disenadas para profesionales con poco tiempo. Recomendamos 3-4 sesiones por semana para ver resultados en 8-12 semanas.",
  },
  {
    question: "Recibo algun certificado?",
    answer:
      "Si. Al completar cada nivel recibes un certificado digital que puedes anadir a tu LinkedIn. El certificado especifica tu nivel y tu especialidad profesional.",
  },
  {
    question: "Puedo cambiar de especialidad?",
    answer:
      "Si, puedes combinar especialidades o cambiar en cualquier momento. Muchos alumnos hacen Business English + su especialidad tecnica.",
  },
  {
    question: "Hay profesores o es todo contenido grabado?",
    answer:
      "Los cursos combinan lecciones grabadas de alta calidad con ejercicios interactivos. Los planes avanzados incluyen sesiones en vivo con profesores especializados en tu sector.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Preguntas frecuentes</h2>
          <p className="text-gray-500 mt-4">
            Todo lo que necesitas saber antes de empezar.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
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
