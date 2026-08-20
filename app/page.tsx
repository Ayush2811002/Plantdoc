"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Scan, Database, Brain, Shield, Zap, ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"

export default function HomePage() {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observerRef.current?.observe(el))

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-scale-in">
              <Leaf className="w-4 h-4" />
              <span>AI-Powered Plant Health Analysis</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance animate-fade-in animate-delay-100">
              Intelligent Disease Detection & Medicinal Plant Identification
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty animate-fade-in animate-delay-200">
              Harness the power of artificial intelligence to detect plant diseases early and identify medicinal plant
              species with unprecedented accuracy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in animate-delay-300">
              <Button asChild size="lg" className="text-base hover:scale-105 transition-transform">
                <Link href="/detection">
                  Start Detection <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base bg-transparent hover:scale-105 transition-transform"
              >
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Advanced Features for Plant Health</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our platform combines cutting-edge AI technology with comprehensive plant databases to deliver accurate
              results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Scan className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Disease Detection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload plant images and get instant disease diagnosis with 95%+ accuracy using deep learning models.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Species Identification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Identify medicinal plant species from our database of 500+ plants with detailed information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Smart Recommendations</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get AI-powered treatment recommendations and preventive measures for detected diseases.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Early Detection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Catch diseases in early stages before they spread, saving crops and reducing losses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Real-time Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant results within seconds, enabling quick decision-making in the field.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg scroll-animate">
              <CardContent className="pt-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center hover:animate-float">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Medicinal Properties</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access detailed information about medicinal properties and traditional uses of identified plants.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">How PlantDoc+ Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Simple three-step process to analyze your plants and get actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative scroll-animate">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto hover:scale-110 transition-transform">
                  1
                </div>
                <h3 className="text-xl font-semibold text-foreground">Upload Image</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Take a clear photo of the plant leaf or affected area and upload it to our platform.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
            </div>

            <div className="relative scroll-animate">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto hover:scale-110 transition-transform">
                  2
                </div>
                <h3 className="text-xl font-semibold text-foreground">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our advanced AI model analyzes the image and identifies diseases or species instantly.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -translate-x-1/2" />
            </div>

            <div className="text-center space-y-4 scroll-animate">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center mx-auto hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground">Get Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive detailed diagnosis, treatment recommendations, and preventive measures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground scroll-animate">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold">95%</div>
              <div className="text-sm md:text-base opacity-90">Detection Accuracy</div>
            </div>
            <div className="space-y-2 hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold">500+</div>
              <div className="text-sm md:text-base opacity-90">Plant Species</div>
            </div>
            <div className="space-y-2 hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold">50+</div>
              <div className="text-sm md:text-base opacity-90">Disease Types</div>
            </div>
            <div className="space-y-2 hover:scale-110 transition-transform">
              <div className="text-4xl md:text-5xl font-bold">&lt;2s</div>
              <div className="text-sm md:text-base opacity-90">Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent scroll-animate">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                Ready to Protect Your Plants?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Start using PlantDoc+ today and ensure the health of your crops with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="text-base hover:scale-105 transition-transform">
                  <Link href="/detection">
                    Start Free Detection <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base bg-transparent hover:scale-105 transition-transform"
                >
                  <Link href="/dashboard">Explore Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
