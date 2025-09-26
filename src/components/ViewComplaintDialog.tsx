import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Calendar, User, FileText, Camera } from 'lucide-react';

interface Complaint {
  id: string;
  complaint_number: string | null;
  citizen_name: string;
  citizen_phone: string;
  address: string | null;
  description: string;
  category: string;
  status: string;
  photo_url: string | null;
  before_photo_url: string | null;
  after_photo_url: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  assigned_at: string | null;
  assigned_contractor_id: string | null;
  cities?: { name: string };
  nagars?: { name: string };
}

interface ViewComplaintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

const ViewComplaintDialog: React.FC<ViewComplaintDialogProps> = ({
  isOpen,
  onClose,
  complaint
}) => {
  if (!complaint) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      resolved: { 
        className: "bg-success/10 text-success border-success/20", 
        label: "Resolved" 
      },
      pending: { 
        className: "bg-warning/10 text-warning border-warning/20", 
        label: "Pending" 
      },
      in_progress: { 
        className: "bg-primary/10 text-primary border-primary/20", 
        label: "In Progress" 
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'roads': '🛣️',
      'sewage': '💧', 
      'sanitation': '🧹',
      'other': '⚙️'
    };
    return icons[category.toLowerCase()] || '⚙️';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Complaint Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/20 rounded-lg">
            <div>
              <h3 className="text-lg font-semibold">
                {complaint.complaint_number || `CMP-${complaint.id.slice(0, 8)}`}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg">{getCategoryIcon(complaint.category)}</span>
                <Badge variant="outline" className="text-xs font-medium">
                  {complaint.category}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(complaint.status)}
              <span className="text-xs text-muted-foreground">
                Created: {formatDate(complaint.created_at)}
              </span>
            </div>
          </div>

          {/* Citizen Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Citizen Information</h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{complaint.citizen_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{complaint.citizen_phone}</span>
              </div>
              {complaint.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{complaint.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Location</h4>
            <div className="text-sm text-muted-foreground">
              {complaint.nagars?.name || 'Unknown Nagar'}{complaint.cities?.name && `, ${complaint.cities.name}`}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
              {complaint.description}
            </p>
          </div>

          {/* Photos */}
          {(complaint.photo_url || complaint.before_photo_url || complaint.after_photo_url) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Photos
              </h4>
              <div className="grid gap-4">
                {complaint.photo_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Complaint Photo:</p>
                    <img 
                      src={complaint.photo_url} 
                      alt="Complaint"
                      className="w-full max-w-md h-auto rounded-lg border shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                {complaint.before_photo_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Before Photo:</p>
                    <img 
                      src={complaint.before_photo_url} 
                      alt="Before"
                      className="w-full max-w-md h-auto rounded-lg border shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                {complaint.after_photo_url && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">After Photo:</p>
                    <img 
                      src={complaint.after_photo_url} 
                      alt="After"
                      className="w-full max-w-md h-auto rounded-lg border shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Created: {formatDate(complaint.created_at)}</span>
              </div>
              {complaint.assigned_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Assigned: {formatDate(complaint.assigned_at)}</span>
                </div>
              )}
              {complaint.resolved_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-success" />
                  <span>Resolved: {formatDate(complaint.resolved_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewComplaintDialog;