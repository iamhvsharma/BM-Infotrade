import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormPreview } from '@/components/form-builder/FormPreview';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';

export default function PublicForm() {
  const { formId } = useParams();
  const { state, dispatch } = useFormBuilder();
  const { toast } = useToast();
  const [currentForm, setCurrentForm] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      const form = state.savedForms.find(f => f.id === formId);
      if (form) {
        setCurrentForm(form);
      }
    }
    setIsLoading(false);
  }, [formId, state.savedForms]);

  const handleSubmit = (formData: Record<string, any>) => {
    if (!currentForm) return;

    const submission = {
      id: `submission_${Date.now()}`,
      formId: currentForm.id,
      data: formData,
      submittedAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_SUBMISSION', payload: submission });
    
    toast({
      title: 'Form submitted successfully!',
      description: currentForm.successMessage,
    });

    setIsSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-form-builder-bg">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                <ExternalLink className="w-8 h-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Form Not Found</h2>
                <p className="text-muted-foreground">
                  The form you're looking for doesn't exist or has been removed.
                </p>
              </div>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-form-builder-bg">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Thank You!</h2>
                <p className="text-muted-foreground">
                  {currentForm.successMessage}
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  className="w-full"
                >
                  Submit Another Response
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-form-builder-bg py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-gradient-primary flex items-center justify-center">
                    <span className="text-white text-xs font-bold">FC</span>
                  </div>
                  <span className="text-sm text-muted-foreground">FormCraft</span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/dashboard">
                    Admin Panel
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <FormPreview onSubmit={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}