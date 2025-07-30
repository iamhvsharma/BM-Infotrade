import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FormInput, 
  Zap, 
  Smartphone, 
  Users, 
  BarChart3, 
  Shield,
  ArrowRight,
  Star,
  Check
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="outline" className="mb-4">
              ✨ No-Code Form Builder
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Build Beautiful Forms
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Without Code
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional forms in minutes with our intuitive drag-and-drop builder. 
              Collect responses, analyze data, and engage your audience like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-primary hover:shadow-glow">
                <Link to="/admin/dashboard">
                  <FormInput className="w-5 h-5 mr-2" />
                  Start Building
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/admin/form/new">
                  Try Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Amazing Forms
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From simple contact forms to complex surveys, our platform has all the tools you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Create forms in minutes with our intuitive drag-and-drop interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Mobile Responsive</CardTitle>
                <CardDescription>
                  Forms look beautiful on any device - desktop, tablet, or mobile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Smart Analytics</CardTitle>
                <CardDescription>
                  Track submissions, analyze responses, and export data with ease
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together with your team to create and manage forms
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Your data is protected with enterprise-grade security features
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FormInput className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Rich Field Types</CardTitle>
                <CardDescription>
                  Text, checkboxes, dropdowns, date pickers, and more field types
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Build Your First Form?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who trust FormCraft to collect and manage their data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-primary hover:shadow-glow">
                <Link to="/admin/dashboard">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-success" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-success" />
                Free forever plan
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-2 text-success" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
