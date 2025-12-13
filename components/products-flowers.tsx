import Image from "next/image"
import { createClient } from "@/lib/supabase/server"

export default async function ProductsFlowers() {
  const supabase = await createClient()

  const { data: flowersData } = await supabase
    .from("flower_products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const { data: customizationData } = await supabase
    .from("flower_customization")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  const flowers =
    flowersData?.map((f) => ({
      id: f.display_order,
      title: f.title,
      image: f.image_url,
      price: f.price,
    })) || []

  const customizationOptions =
    customizationData?.map((c) => ({
      id: c.display_order,
      title: c.title,
      price: c.price,
      image: c.image_url,
      description: c.description,
    })) || []

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
              {flower.price && (
                <p className="text-base font-bold text-accent-peach-deep text-center mt-2">{flower.price}</p>
              )}
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
