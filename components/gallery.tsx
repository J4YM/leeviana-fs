import Image from "next/image"

export default function Gallery() {
  const images = [
    { id: 1, alt: "Customer with customized flower bouquet", image: "customer-testimonial-1.jpg" },
    { id: 2, alt: "Single flower gift presentation", image: "customer-testimonial-2.jpg" },
    { id: 3, alt: "Sunflower bouquet arrangement", image: "customer-testimonial-3.jpg" },
    { id: 4, alt: "Purple flower bouquet delivery", image: "customer-testimonial-4.jpg" },
    { id: 5, alt: "Customized flower arrangement with receipt", image: "customer-testimonial-5.jpg" },
    { id: 6, alt: "Big pink flower bouquet presentation", image: "customer-testimonial-6.jpg" },
    { id: 7, alt: "Single tulip gift from Leevienna FS", image: "customer-testimonial-7.jpg" },
    { id: 8, alt: "Customer testimonials and messages", image: "customer-testimonial-8.jpg" },
    { id: 9, alt: "Yellow and white flower bouquet arrangement", image: "customer-testimonial-9.jpg" },
  ]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Cherished Creations
          </h2>
          <p className="text-lg text-muted-foreground mb-4">See how customers are enjoying their Leevienna FS pieces</p>
          <p className="text-sm text-accent-peach font-medium">Share your creation with #LeeviennaFSCreations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="aspect-square bg-accent-peach/20 rounded-lg overflow-hidden border border-border cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Image
                src={`/${img.image}`}
                alt={img.alt}
                width={400}
                height={400}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
