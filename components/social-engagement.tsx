import { Facebook, Check } from "lucide-react"

export default function SocialEngagement() {
  const benefits = [
    "Exclusive 2% discount on flower bouquets",
    "First access to new designs",
    "Behind-the-scenes crafting stories",
    "Special promotions and flash sales",
  ]

  return (
    <section className="py-16 md:py-24 bg-accent-peach/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-peach/20 mb-6">
              <Facebook className="text-accent-peach" size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Join Our Facebook Community
            </h2>
            <p className="text-lg text-muted-foreground">Connect with us and become part of the Leevienna FS family</p>
          </div>

          <div className="space-y-3 text-left">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-background rounded-lg border border-border">
                <Check className="text-accent-peach flex-shrink-0" size={24} />
                <span className="text-lg text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <a
            href="https://www.facebook.com/profile.php?id=61574523253260"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-accent-peach text-foreground px-12 py-4 rounded-lg font-bold text-lg hover:bg-accent-peach/90 transition"
          >
            <Facebook size={24} />
            Follow Now & Claim Your Discount
          </a>
        </div>
      </div>
    </section>
  )
}
