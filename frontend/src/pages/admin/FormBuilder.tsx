import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import { useToast } from '@/hooks/use-toast';
import { FormFieldList } from '@/components/form-builder/FormFieldList';
import { FormPreview } from '@/components/form-builder/FormPreview';
import { FieldTypeSelector } from '@/components/form-builder/FieldTypeSelector';
import { 
  Save, 
  Eye, 
  Settings, 
  Plus,
  ArrowLeft,
  Palette
} from 'lucide-react';

export default function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useFormBuilder();
  const { toast } = useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formSettings, setFormSettings] = useState({
    title: state.currentForm.title,
    description: state.currentForm.description,
    submitButtonText: state.currentForm.submitButtonText,
    successMessage: state.currentForm.successMessage
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const existingForm = state.savedForms.find(form => form.id === id);
      if (existingForm) {
        dispatch({ type: 'SET_CURRENT_FORM', payload: existingForm });
        setFormSettings({
          title: existingForm.title,
          description: existingForm.description,
          submitButtonText: existingForm.submitButtonText,
          successMessage: existingForm.successMessage
        });
      }
    } else {
      // Reset to default form for new forms
      dispatch({ 
        type: 'SET_CURRENT_FORM', 
        payload: {
          title: 'Untitled Form',
          description: 'Form description',
          submitButtonText: 'Submit',
          successMessage: 'Thank you for your submission!',
          fields: [],
          theme: {
            backgroundColor: '#ffffff',
            inputColor: '#f8fafc',
            labelColor: '#1e293b',
            fontSize: '16px',
            alignment: 'left'
          }
        }
      });
    }
  }, [id, dispatch, state.savedForms]);

  const handleSaveForm = () => {
    const formToSave = {
      ...state.currentForm,
      id: id === 'new' ? `form_${Date.now()}` : id,
      ...formSettings,
      updatedAt: new Date().toISOString(),
      createdAt: state.currentForm.createdAt || new Date().toISOString()
    };

    dispatch({ type: 'SAVE_FORM', payload: formToSave });
    toast({
      title: 'Form saved successfully!',
      description: 'Your form has been saved and is ready to use.',
    });

    if (id === 'new') {
      navigate(`/admin/form/${formToSave.id}/edit`);
    }
  };

  const handleSettingsSave = () => {
    dispatch({ type: 'SET_FORM_SETTINGS', payload: formSettings });
    setIsSettingsOpen(false);
    toast({
      title: 'Settings updated',
      description: 'Form settings have been updated successfully.',
    });
  };

  return (
    <div className="min-h-screen bg-form-builder-bg">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold">{state.currentForm.title}</h1>
              <p className="text-sm text-muted-foreground">
                {state.currentForm.fields.length} fields
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_PREVIEW' })}
            >
              <Eye className="w-4 h-4 mr-2" />
              {state.isPreviewMode ? 'Edit' : 'Preview'}
            </Button>

            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Form Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Form Title</Label>
                    <Input
                      id="title"
                      value={formSettings.title}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter form title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formSettings.description}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter form description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="submitButton">Submit Button Text</Label>
                    <Input
                      id="submitButton"
                      value={formSettings.submitButtonText}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, submitButtonText: e.target.value }))}
                      placeholder="Submit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="successMessage">Success Message</Label>
                    <Textarea
                      id="successMessage"
                      value={formSettings.successMessage}
                      onChange={(e) => setFormSettings(prev => ({ ...prev, successMessage: e.target.value }))}
                      placeholder="Thank you for your submission!"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSettingsSave}>
                      Save Settings
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSaveForm} className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Form
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {state.isPreviewMode ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Form Preview</CardTitle>
                  <Badge variant="outline">Preview Mode</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <FormPreview />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Field Types Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Fields
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <FieldTypeSelector />
                </CardContent>
              </Card>
            </div>

            {/* Form Builder */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Form Builder</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {state.currentForm.fields.length} fields
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <FormFieldList />
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="scale-75 origin-top border rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                    <FormPreview compact />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}