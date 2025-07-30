import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  MoreVertical,
  Edit,
  Copy,
  Trash,
  Eye,
  BarChart3,
  Calendar,
  Users,
} from "lucide-react";

export default function Dashboard() {
  const { state, dispatch } = useFormBuilder();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<string | null>(null);

  const handleDeleteForm = (formId: string) => {
    dispatch({ type: "DELETE_FORM", payload: formId });
    toast({
      title: "Form deleted",
      description: "The form has been successfully deleted.",
    });
    setDeleteDialogOpen(false);
    setFormToDelete(null);
  };

  const handleDuplicateForm = (form: any) => {
    const duplicatedForm = {
      ...form,
      id: `form_${Date.now()}`,
      title: `${form.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "SAVE_FORM", payload: duplicatedForm });
    toast({
      title: "Form duplicated",
      description: "The form has been successfully duplicated.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your forms and view submissions
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:shadow-glow">
          <Link to="/admin/form/new">
            <Plus className="w-4 h-4 mr-2" />
            Create New Form
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.savedForms.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Submissions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.submissions.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">New submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Forms Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Forms</h2>
        {state.savedForms.length === 0 ? (
          <Card className="border-dashed border-2 border-muted p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No forms yet</h3>
                <p className="text-muted-foreground">
                  Get started by creating your first form
                </p>
              </div>
              <Button asChild className="bg-gradient-primary">
                <Link to="/admin/form/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Form
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.savedForms.map((form) => (
              <Card
                key={form.id}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {form.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {form.description}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/form/${form.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/form/${form.id}`} target="_blank">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDuplicateForm(form)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/form/${form.id}/responses`}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Responses
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setFormToDelete(form.id!);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {form.fields.length} fields
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {
                        state.submissions.filter(
                          (sub) => sub.formId === form.id
                        ).length
                      }{" "}
                      submissions
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <Badge variant="secondary">Active</Badge>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/form/${form.id}/edit`}>Edit Form</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Are you sure you want to delete this form? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => formToDelete && handleDeleteForm(formToDelete)}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
