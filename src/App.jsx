import './App.css'
import { Routes, Route } from "react-router-dom";
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ScientistsSection } from './components/ScientistsSection'
import { FieldsSection } from './components/FieldsSection'
import { TimelineSection } from './components/TimelineSection'
import { Footer } from './components/Footer'
import { useParams } from "react-router-dom";
import { ScientistDetail } from './components/ScientistDetail';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ScientistsSection />
              <FieldsSection />
              <TimelineSection />
            </>
          } />
        <Route path="/scientist/:id" element={<ScientistDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
