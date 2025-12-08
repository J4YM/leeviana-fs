import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex justify-start">
              <Image
                src="/logo.jpg"
                alt="Leevienna FS Logo"
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 object-contain"
                priority
              />
            </div>

            <div className="inline-block bg-accent-blush px-4 py-2 rounded-full border border-accent-peach/30">
              <span className="text-sm font-medium text-accent-peach">Welcome to Leevienna FS</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
              Handcrafted with Love & Precision
            </h1>

            <p className="text-lg text-muted-foreground max-w-md">
              Custom handmade flowers and personalized keychains by Leevienna FS. Every piece is a masterpiece created
              just for you.
            </p>

            <div className="bg-accent-peach/20 border border-accent-peach rounded-lg p-4 my-6">
              <p className="text-sm font-semibold text-accent-peach">
                🎁 Follow us on Facebook for 2% OFF Flower Bouquets!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574523253260"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent-peach text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-accent-peach/90 transition"
              >
                Shop on Facebook
                <ArrowRight size={20} />
              </a>
              <a
                href="https://www.facebook.com/ll.analiza.1447"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 border border-accent-peach text-accent-peach px-8 py-3 rounded-lg font-semibold hover:bg-accent-peach/10 transition"
                rel="noreferrer"
              >
                Message for Custom Orders
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-accent-peach/20 rounded-2xl overflow-hidden border border-border">
              <Image
                src="/hero-flower-keychain-display.jpg"
                alt="Handmade flowers and keychains display"
                width={500}
                height={500}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
