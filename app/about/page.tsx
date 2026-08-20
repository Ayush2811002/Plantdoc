import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Target, Users, Award, Heart, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Leaf className="w-4 h-4" />
              <span>About PlantDoc+</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Revolutionizing Plant Health with AI
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
              PlantDoc+ is an innovative platform that combines artificial intelligence with botanical expertise to
              protect crops and identify medicinal plants.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6 animate-slide-in-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Target className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Empowering Farmers & Researchers</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our mission is to make advanced plant disease detection and medicinal plant identification accessible to
                everyone. We believe that early detection can save crops, reduce losses, and contribute to sustainable
                agriculture.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By leveraging cutting-edge AI technology, we're helping farmers make informed decisions quickly and
                accurately, while also preserving traditional knowledge about medicinal plants.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slide-in-right">
              <Card className="border-2 hover:border-primary transition-all hover:scale-105">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-all hover:scale-105">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Plant Species</div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-all hover:scale-105">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Disease Types</div>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-all hover:scale-105">
                <CardContent className="pt-6 text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">&lt;2s</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              The principles that guide our work and innovation in agricultural technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Continuously advancing AI technology to provide better, faster, and more accurate plant health
                  solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Accessibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Making advanced agricultural technology available to farmers and researchers worldwide, regardless of
                  resources.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all hover:scale-105 hover:shadow-lg">
              <CardContent className="pt-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Sustainability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Promoting sustainable farming practices through early disease detection and reduced chemical usage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Our Technology</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Powered by Advanced AI</h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                PlantDoc+ uses state-of-the-art deep learning models trained on thousands of plant images to deliver
                accurate results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Convolutional Neural Networks</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our CNN-based models analyze plant images at multiple scales to identify subtle disease symptoms and
                    species characteristics with high precision.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Transfer Learning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We leverage pre-trained models and fine-tune them on specialized plant datasets to achieve superior
                    accuracy even with limited training data.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Real-time Processing</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Optimized inference pipelines ensure that analysis results are delivered in under 2 seconds,
                    enabling quick decision-making in the field.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-card-foreground">Continuous Learning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our models are regularly updated with new data to improve accuracy and expand coverage of plant
                    species and diseases.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              A dedicated group of researchers, developers, and agricultural experts working together to revolutionize
              plant health management.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">Minor Project Team</h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  PlantDoc+ is developed as a minor project by a team of passionate students combining expertise in
                  machine learning, web development, and agricultural sciences to create a practical solution for
                  real-world plant health challenges.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-4">
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Machine Learning
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Web Development
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    Agricultural Science
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    UI/UX Design
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
