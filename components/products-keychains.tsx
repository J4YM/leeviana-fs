export default function ProductsKeychains() {
  const featuredKeychains = [
    {
      id: 1,
      code: "A4",
      title: "Ribbon Keychain",
      image: "/keychain-code-a4.jpg",
      price: "₱15",
      description: "Good for group of friends",
    },
    {
      id: 2,
      code: "A5",
      title: "Flower Keychain Trio",
      image: "/keychain-code-a5.jpg",
      price: "₱45",
      description: "Good for trio bestie (5 pcs available only)",
    },
    {
      id: 3,
      code: "A3",
      title: "Ice Pop Keychain",
      image: "/keychain-code-a3.jpg",
      price: "₱15",
      description: "Available colors: Violet, Orange, Pink, Blue",
    },
    {
      id: 4,
      code: "A1",
      title: "Family Keychain",
      image: "/keychain-code-a1.jpg",
      price: "₱3 for 89",
      description: "Good for trio bestie",
    },
    {
      id: 5,
      code: "A8",
      title: "Mini Flower Bouquet",
      image: "/keychain-code-a8.jpg",
      price: "₱50",
      description: "Tulips & flowers (Pink/Blue/Violet)",
    },
    {
      id: 6,
      code: "A2",
      title: "Tulips Keychain",
      image: "/keychain-code-a2.jpg",
      price: "₱25",
      description: "Available: Pink, Blue, Yellow",
    },
    {
      id: 7,
      code: "A6",
      title: "Small Flower Keychain",
      image: "/keychain-code-a6.jpg",
      price: "₱10",
      description: "Good for group of friends",
    },
    {
      id: 8,
      code: "Custom",
      title: "Customize Flower",
      image: "/keychain-customize-flowers.jpg",
      price: "₱99-110",
      description: "Black ₱99, Blue ₱99, Yellow ₱110",
    },
    {
      id: 9,
      code: "A9",
      title: "Cherry Keychain",
      image: "/keychain-code-a9.jpg",
      price: "₱15",
      description: "Cute cherry pair charm",
    },
    {
      id: 10,
      code: "A7",
      title: "Mini Keychain",
      image: "/keychain-code-a7.jpg",
      price: "₱15",
      description: "Available: Orange, Blue, Pink",
    },
  ]

  const keychains = [
    { id: 1, title: "Name & Initials", image: "name-initial-keychain.jpg" },
    { id: 2, title: "Theme Designs", image: "theme-keychain-designs.jpg" },
    { id: 3, title: "Miniature Art", image: "miniature-art-keychain.jpg" },
    { id: 4, title: "Matching Sets", image: "couple-matching-keychains.jpg" },
  ]

  return (
    <section id="keychains" className="py-16 md:py-24 bg-accent-peach/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Personalized Charms Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unique keychains that tell your story. Perfect gifts for loved ones.
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Featured Designs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {featuredKeychains.map((keychain) => (
              <div key={keychain.id} className="flex flex-col">
                <div className="aspect-square bg-accent-peach/10 rounded-lg overflow-hidden border border-border mb-3 flex items-center justify-center relative min-h-48 flex-shrink-0">
                  <img
                    src={keychain.image || "/placeholder.svg"}
                    alt={keychain.title}
                    className="w-full h-full object-cover object-center hover:scale-105 transition duration-300 p-2"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <p className="text-xs font-semibold text-accent-peach uppercase tracking-wide mb-1">
                    Code {keychain.code}
                  </p>
                  <h4 className="text-sm font-semibold text-foreground mb-1 line-clamp-2">{keychain.title}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow">{keychain.description}</p>
                  <div className="bg-accent-brown/80 rounded-full py-2 px-3 text-center">
                    <span className="text-sm font-bold text-accent-ivory">{keychain.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-8 text-center">
            Customization Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keychains.map((keychain) => (
              <div key={keychain.id}>
                <div className="aspect-square bg-accent-peach/10 rounded-lg overflow-hidden border border-border mb-4 flex items-center justify-center relative">
                  <img
                    src={`/.jpg?height=400&width=400&query=${keychain.image}`}
                    alt={keychain.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <span className="text-xs text-muted-foreground font-medium">{keychain.image}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground text-center hover:text-accent-peach transition">
                  {keychain.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
