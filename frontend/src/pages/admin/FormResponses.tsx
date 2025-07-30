import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFormBuilder } from "@/contexts/FormBuilderContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Download,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: string;
  userAgent?: string;
  ipAddress?: string;
}

export default function FormResponses() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { state } = useFormBuilder();
  const { toast } = useToast();

  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<FormResponse[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<FormResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const currentForm = state.savedForms.find((form) => form.id === formId);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchResponses = async () => {
    //   const response = await fetch(`/api/forms/${formId}/responses`);
    //   const data = await response.json();
    //   setResponses(data);
    // };

    // Simulate API call
    setTimeout(() => {
      const mockResponses: FormResponse[] = [
        {
          id: "1",
          formId: formId!,
          data: {
            name: "John Doe",
            email: "john@example.com",
            phone: "+1234567890",
            message: "This is a test submission",
          },
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          ipAddress: "192.168.1.1",
        },
        {
          id: "2",
          formId: formId!,
          data: {
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+0987654321",
            message: "Another test submission",
          },
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          ipAddress: "192.168.1.2",
        },
      ];
      setResponses(mockResponses);
      setFilteredResponses(mockResponses);
      setIsLoading(false);
    }, 1000);
  }, [formId]);

  useEffect(() => {
    const filtered = responses.filter((response) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        Object.values(response.data).some((value) =>
          String(value).toLowerCase().includes(searchLower)
        ) || response.submittedAt.toLowerCase().includes(searchLower)
      );
    });
    setFilteredResponses(filtered);
  }, [responses, searchTerm]);

  const handleExport = () => {
    const csvContent = [
      ["Submission Date", "Name", "Email", "Phone", "Message"],
      ...filteredResponses.map((response) => [
        new Date(response.submittedAt).toLocaleDateString(),
        response.data.name || "",
        response.data.email || "",
        response.data.phone || "",
        response.data.message || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentForm?.title || "form"}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Responses have been exported to CSV.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Form not found</h2>
          <p className="text-muted-foreground mb-4">
            The form you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold">Form Responses</h1>
              <p className="text-sm text-muted-foreground">
                {currentForm.title} • {filteredResponses.length} responses
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={filteredResponses.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search responses</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name, email, or content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label htmlFor="sort">Sort by</Label>
                  <Select defaultValue="newest">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="oldest">Oldest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses List */}
          {isLoading ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">
                    Loading responses...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : filteredResponses.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No responses found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Try adjusting your search terms."
                      : "No responses have been submitted to this form yet."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredResponses.map((response) => (
                <Card
                  key={response.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {response.data.name || "Anonymous"}
                            </span>
                          </div>
                          {response.data.email && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {response.data.email}
                              </span>
                            </div>
                          )}
                          {response.data.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {response.data.phone}
                              </span>
                            </div>
                          )}
                        </div>

                        {response.data.message && (
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                Message:
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground pl-6">
                              {response.data.message}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(response.submittedAt)}</span>
                          </div>
                          {response.ipAddress && (
                            <span>IP: {response.ipAddress}</span>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResponse(response)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Response Detail Dialog */}
      <Dialog
        open={!!selectedResponse}
        onOpenChange={(open) => !open && setSelectedResponse(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Response Details</DialogTitle>
          </DialogHeader>
          {selectedResponse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Submission Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedResponse.submittedAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Response ID</Label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedResponse.id}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Form Data</Label>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  {Object.entries(selectedResponse.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedResponse.userAgent && (
                <div>
                  <Label className="text-sm font-medium">User Agent</Label>
                  <p className="text-xs text-muted-foreground font-mono bg-muted p-2 rounded">
                    {selectedResponse.userAgent}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
