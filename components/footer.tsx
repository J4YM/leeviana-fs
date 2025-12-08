import { Facebook, ArrowUp } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">Leevienna FS</h3>
            <p className="text-sm text-background/70">Handcrafted Memories, Lasting Impressions</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pick-up Locations</h4>
            <ul className="text-sm text-background/70 space-y-1">
              <li>• Catacte, Bustos, Bulacan</li>
              <li>• Plaridel (Richwell)</li>
              <li>• Baliuag</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hours</h4>
            <p className="text-sm text-background/70">Consultations: Mon-Sat, 10am-6pm</p>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61574523253260"
              target="_blank"
              className="flex items-center gap-2 bg-accent-peach text-foreground px-6 py-2 rounded-lg font-semibold text-sm hover:bg-accent-peach/90 transition"
              rel="noreferrer"
            >
              <Facebook size={18} />
              Follow for 2% Discount
            </a>

            <a href="#home" className="flex items-center gap-2 text-background/70 hover:text-background transition">
              Back to Top
              <ArrowUp size={18} />
            </a>
          </div>

          <div className="text-center text-sm text-background/60 pt-4">
            <p>© 2025 Leevienna FS. All rights reserved. | Handcrafted with ❤️ in Bulacan</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
