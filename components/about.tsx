import Image from "next/image"

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-accent-peach flex items-center justify-center bg-accent-peach/10">
              <Image
                src="/artist-leevienna-portrait.jpg"
                alt="Artist Leevienna portrait"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground">
              About Leevienna FS
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Leevienna combines traditional craftsmanship with contemporary design to create lasting keepsakes. Each
              piece tells a story and carries the attention to detail that only handcrafted art can provide.
            </p>

            <div className="space-y-3">
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-peach mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Handmade with Precision</h4>
                  <p className="text-sm text-muted-foreground">Every detail matters in our craft</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-peach mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Premium Quality Materials</h4>
                  <p className="text-sm text-muted-foreground">Only the finest materials are used</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-peach mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Fully Customizable</h4>
                  <p className="text-sm text-muted-foreground">Your vision, our execution</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full bg-accent-peach mt-2 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground">Multiple Pick-up Locations</h4>
                  <p className="text-sm text-muted-foreground">Convenient access in Bulacan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
