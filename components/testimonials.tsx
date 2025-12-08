import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      text: "The custom bouquet for my mother's birthday brought tears to her eyes. Exquisite craftsmanship!",
      author: "Maria T.",
      location: "Baliuag",
    },
    {
      text: "Easy pick-up at Plaridel location. Our matching keychains are perfect!",
      author: "James & Sarah",
      location: "Plaridel",
    },
    {
      text: "Professional, creative, and delivered exactly as promised. Highly recommend!",
      author: "Corporate Client",
      location: "Bustos",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-accent-peach/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground text-center mb-12">
          Customer Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-background rounded-lg border border-border p-8 space-y-4 hover:shadow-lg transition"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-accent-peach text-accent-peach" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed italic">"{testimonial.text}"</p>
              <div className="pt-4 border-t border-border">
                <p className="font-semibold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
