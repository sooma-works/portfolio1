import Intro from '../components/Intro'
import Hero from '../components/Hero'
import ContactSheet from '../components/ContactSheet'
import About from '../components/About'
import Commissions from '../components/Commissions'
import Envelope from '../components/Envelope'

export default function Home() {
  return (
    <>
      <Intro />
      <main id="contenido">
        <Hero />
        <ContactSheet />
        <About />
        <Commissions />
        <Envelope />
      </main>
    </>
  )
}
