import Header from "@/components/header"
import Hero from "@/components/hero"
import ProductsFlowers from "@/components/products-flowers"
import ProductsKeychains from "@/components/products-keychains"
import Locations from "@/components/locations"
import Process from "@/components/process"
import About from "@/components/about"
import SocialEngagement from "@/components/social-engagement"
import Gallery from "@/components/gallery"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ProductsFlowers />
      <ProductsKeychains />
      <Locations />
      <Process />
      <About />
      <SocialEngagement />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}
