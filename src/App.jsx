import './App.css'
import { Routes, Route } from "react-router-dom";
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ScientistsSection } from './components/ScientistsSection'
import { FieldsSection } from './components/FieldsSection'
import { TimelineSection } from './components/TimelineSection'
import { Footer } from './components/Footer'
import { ScientistDetail } from './components/ScientistDetail';
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { BooksPage } from '/pages/BooksPage';

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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/books" element={<BooksPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
