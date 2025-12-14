import { createClient } from "@/lib/supabase/server"
import ProductActions from "@/components/products/product-actions"

export default async function ProductsKeychains() {
  const supabase = await createClient()

  const { data: keychainsData } = await supabase
    .from("keychain_products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const featuredKeychains =
    keychainsData?.map((k) => ({
      id: k.display_order,
      code: k.code,
      title: k.title,
      image: k.image_url,
      price: k.price,
      description: k.description,
    })) || []

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
                  <div className="bg-accent-brown/80 rounded-full py-2 px-3 text-center mb-2">
                    <span className="text-sm font-bold text-accent-brown">{keychain.price}</span>
                  </div>
                  <ProductActions
                    productType="keychain"
                    productCode={keychain.code}
                    productTitle={keychain.title}
                    productImage={keychain.image || "/placeholder.svg"}
                    price={keychain.price}
                    description={keychain.description}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
