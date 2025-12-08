import Image from "next/image"

export default function ProductsFlowers() {
  const flowers = [
    { id: 1, title: "Tangled Decorative Flower", image: "/featured-flower-1.jpg" },
    { id: 2, title: "Purple & Blue Bouquet", image: "/featured-flower-2.jpg" },
    { id: 3, title: "Pink & White Stems", image: "/featured-flower-3.jpg" },
    { id: 4, title: "Golden Orange Daisy", image: "/featured-flower-4.jpg" },
    { id: 5, title: "Pink & Magenta Orchids", image: "/featured-flower-5.jpg" },
    { id: 6, title: "Blue Gerbera Bouquet", image: "/featured-flower-6.jpg" },
    { id: 7, title: "Pink Lily Elegance", image: "/featured-pink-lily-bouquet.jpg" },
    { id: 8, title: "Striped Pink Beauty", image: "/featured-pink-stripe-bouquet.jpg" },
    { id: 9, title: "Folded Pink Masterpiece", image: "/featured-pink-fold-bouquet.jpg" },
  ]

  const customizationOptions = [
    {
      id: 1,
      title: "Set A",
      price: "₱220",
      image: "/customize-set-a.jpg",
      description: "Pink Guamamela, White Lily & Tulips with Pink Mini Flowers",
    },
    {
      id: 2,
      title: "Set B",
      price: "₱190",
      image: "/customize-set-b.jpg",
      description: "Pink Tulips, White Lily with White Mini Flowers",
    },
    {
      id: 3,
      title: "Set C",
      price: "₱190",
      image: "/customize-set-c.jpg",
      description: "Pink & Light Pink Lily with Blue Mini Flowers",
    },
    {
      id: 4,
      title: "Set D",
      price: "₱190",
      image: "/customize-set-d.jpg",
      description: "Yellow Lilies & Tulips with White Mini Flowers",
    },
    {
      id: 5,
      title: "Set E",
      price: "₱230",
      image: "/customize-set-e.jpg",
      description: "Pink Tulips, Daisy with Rolling Flow & Mini Flowers",
    },
    {
      id: 6,
      title: "Set F",
      price: "₱220",
      image: "/customize-set-f.jpg",
      description: "Pink Tulips, Pink Lily with Pink & White Mini Flowers",
    },
    {
      id: 7,
      title: "Single Flower w/ Wrapped",
      price: "₱90 each",
      image: "/customize-single-flower.jpg",
      description: "Mini or Lily Flower - Tulips, Lily, Tiger Lily",
    },
    {
      id: 8,
      title: "Big Bouquet",
      price: "₱500",
      image: "/customize-big-bouquet.jpg",
      description: "Heart, Rolling Flow, Tulips, Tiger Lily & Mini Flowers",
    },
  ]

  return (
    <section id="flowers" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Eternal Blooms Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each bouquet is crafted with premium flowers and personalized to perfection.
          </p>

          <div className="bg-accent-peach-light/20 border border-accent-peach/50 rounded-lg p-3 mt-6 inline-block">
            <p className="text-sm font-medium text-accent-peach">
              🌹 Facebook followers get 2% discount on all bouquets!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flowers.map((flower) => (
            <div key={flower.id} className="flex flex-col">
              <div className="relative aspect-square bg-accent-peach/10 rounded-lg overflow-hidden border border-border mb-4 flex-shrink-0">
                <Image
                  src={flower.image || "/placeholder.svg"}
                  alt={flower.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center hover:text-accent-peach transition">
                {flower.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Customization Options
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our exclusive sets or create your own perfect bouquet
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {customizationOptions.map((option) => (
              <div
                key={option.id}
                className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative w-full bg-accent-peach/5 p-2 sm:p-3 aspect-square flex items-center justify-center overflow-hidden rounded-t-xl">
                  <Image
                    src={option.image || "/placeholder.svg"}
                    alt={option.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-contain hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="flex flex-col flex-grow p-3 sm:p-4">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base text-center mb-2">
                    {option.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 flex-grow leading-relaxed">
                    {option.description}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-accent-peach-deep text-center">{option.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
