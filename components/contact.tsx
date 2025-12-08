import { Facebook, MessageCircle } from "lucide-react"

export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Let's Create Something Beautiful Together
            </h2>
            <p className="text-lg text-muted-foreground">
              All orders coordinated through Facebook for personalized service
            </p>
          </div>

          <div className="bg-accent-peach/10 border border-accent-peach rounded-lg p-8 space-y-6">
            <h3 className="text-2xl font-semibold text-foreground">Connect With Us</h3>

            <div className="space-y-4">
              <a
                href="https://www.facebook.com/profile.php?id=61574523253260"
                target="_blank"
                className="flex items-center justify-center gap-3 bg-accent-peach text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-accent-peach/90 transition w-full"
                rel="noreferrer"
              >
                <Facebook size={24} />
                Visit Our Facebook Page
              </a>
              <a
                href="https://www.facebook.com/ll.analiza.1447"
                target="_blank"
                className="flex items-center justify-center gap-3 border-2 border-accent-peach text-accent-peach px-8 py-4 rounded-lg font-semibold hover:bg-accent-peach/10 transition w-full"
                rel="noreferrer"
              >
                <MessageCircle size={24} />
                Message for Custom Quotes
              </a>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <h4 className="font-semibold text-foreground mb-2">📍 Pick-up Locations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Catacte, Bustos, Bulacan (Main)</li>
                  <li>• Plaridel (Richwell)</li>
                  <li>• Baliuag</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">⏰ Consultations</h4>
                <p className="text-sm text-muted-foreground">Mon-Sat, 10am-6pm</p>
              </div>
            </div>

            <div className="bg-accent-blush px-4 py-3 rounded-lg border border-accent-peach/30">
              <p className="text-sm font-semibold text-accent-peach">
                ✨ Don't forget to follow our page for exclusive 2% OFF flower bouquets!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
