import './App.css'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ScientistsSection } from './components/ScientistsSection'
import { FieldsSection } from './components/FieldsSection'
import { TimelineSection } from './components/TimelineSection'
import { Footer } from './components/Footer'
<Route path="/scientist/:id" element={<ScientistDetail scientists={scientists} />} />
function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <ScientistsSection />
        <FieldsSection />
        <TimelineSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
