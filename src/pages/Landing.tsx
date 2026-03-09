import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Target, TrendingUp, BookOpen } from 'lucide-react'

export function Landing() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center mb-16 animate-slide-up">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          CareerLens
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI-Powered Resume Analysis Platform
        </p>
        <p className="text-lg text-foreground/80 mb-8">
          Get instant ATS scoring, identify skill gaps, and receive personalized learning recommendations
          to land your dream job.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary">Login</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <Card className="animate-fade-in">
          <Target className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">ATS Scoring</h3>
          <p className="text-muted-foreground">
            Get detailed analysis of how well your resume matches job requirements with our advanced ATS engine.
          </p>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <TrendingUp className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Skill Gap Analysis</h3>
          <p className="text-muted-foreground">
            Identify missing skills and get actionable suggestions to improve your resume for target roles.
          </p>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <BookOpen className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
          <p className="text-muted-foreground">
            Access curated courses, tutorials, and documentation to bridge your skill gaps.
          </p>
        </Card>
      </div>
    </div>
  )
}
