import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, AlertTriangle, CheckCircle2, Activity, Scan, Database } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-24 pb-20 px-4">
        <div className="container mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Monitor your plant health analytics and detection history</p>
            </div>
            <Button asChild size="lg">
              <Link href="/detection">
                <Scan className="mr-2 w-4 h-4" />
                New Detection
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">1,247</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary">+12.5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Healthy Plants</CardTitle>
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">892</div>
                <p className="text-xs text-muted-foreground mt-1">71.5% of total scans</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Diseases Detected</CardTitle>
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">355</div>
                <p className="text-xs text-muted-foreground mt-1">28.5% of total scans</p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Species Identified</CardTitle>
                <Database className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">127</div>
                <p className="text-xs text-muted-foreground mt-1">Unique plant species</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Detections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Detections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Tomato Late Blight</h4>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confidence: 94.2%</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                        High Risk
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Healthy Wheat</h4>
                      <span className="text-xs text-muted-foreground">5 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confidence: 98.7%</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Healthy
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">Potato Early Blight</h4>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Confidence: 91.5%</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-chart-2/20 text-chart-2 text-xs font-medium">
                        Medium Risk
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  View All Detections
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-foreground">Common Diseases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Late Blight</span>
                      <span className="text-muted-foreground">32%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-destructive rounded-full" style={{ width: "32%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Powdery Mildew</span>
                      <span className="text-muted-foreground">24%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-chart-2 rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Leaf Spot</span>
                      <span className="text-muted-foreground">18%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-chart-3 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Rust</span>
                      <span className="text-muted-foreground">15%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-chart-4 rounded-full" style={{ width: "15%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">Others</span>
                      <span className="text-muted-foreground">11%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-chart-5 rounded-full" style={{ width: "11%" }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">15</p>
                      <p className="text-xs text-muted-foreground">Disease types detected</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-foreground">96.3%</p>
                      <p className="text-xs text-muted-foreground">Avg. confidence</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medicinal Plants Section */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-foreground">Recently Identified Medicinal Plants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                  <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Aloe Vera</h4>
                    <p className="text-sm text-muted-foreground mt-1">Used for skin healing and digestive health</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Medicinal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                  <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Tulsi (Holy Basil)</h4>
                    <p className="text-sm text-muted-foreground mt-1">Boosts immunity and reduces stress</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Medicinal
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30 border border-border space-y-3">
                  <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Neem</h4>
                    <p className="text-sm text-muted-foreground mt-1">Antibacterial and antifungal properties</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Medicinal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
