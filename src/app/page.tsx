import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/sections/hero'
import { Stats } from '@/components/sections/stats'
import { Services } from '@/components/sections/services'
import { About } from '@/components/sections/about'
import { Portfolio } from '@/components/sections/portfolio'
import { Contact } from '@/components/sections/contact'
import { Footer } from '@/components/footer'
import { BackgroundGradient } from '@/components/background-gradient'
import { SpaceBackground } from '@/components/space-background'
import { ScrollToTop } from '@/components/scroll-to-top'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <BackgroundGradient />
      <SpaceBackground />
      <Navigation />
      <Hero />
      <Stats />
      <Services />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
