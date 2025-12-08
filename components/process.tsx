import { Heart, Eye, MessageCircle, Sparkles, MapPin } from "lucide-react"

export default function Process() {
  const steps = [
    {
      number: "1",
      title: "FOLLOW",
      description: "Follow our Facebook page to unlock 2% flower bouquet discount",
      icon: Heart,
    },
    {
      number: "2",
      title: "CONCEPT",
      description: "Browse designs & share your idea",
      icon: Eye,
    },
    {
      number: "3",
      title: "CONSULT",
      description: "Free consultation via Messenger",
      icon: MessageCircle,
    },
    {
      number: "4",
      title: "CREATE",
      description: "Handcrafting with premium materials",
      icon: Sparkles,
    },
    {
      number: "5",
      title: "PICK-UP",
      description: "Collect from convenient locations",
      icon: MapPin,
    },
  ]

  return (
    <section id="process" className="py-16 md:py-24 bg-accent-peach/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Your Vision, Handcrafted Reality
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each piece is made-to-order with 1-2 week turnaround
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-peach text-background mb-4 mx-auto">
                    <Icon size={32} />
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-2">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[40%] h-0.5 bg-accent-peach/30" />
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground italic">
            💡 Step 1 unlocks your exclusive 2% discount on flower bouquets!
          </p>
        </div>
      </div>
    </section>
  )
}
