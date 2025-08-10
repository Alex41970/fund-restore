import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, File, FileImage, FileText, FileVideo } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Attachment {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string;
  size: number;
  created_at: string;
}

interface AttachmentViewerProps {
  attachments: Attachment[];
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (contentType: string, fileName: string) => {
  if (contentType?.startsWith('image/')) {
    return <FileImage className="h-4 w-4" />;
  }
  if (contentType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf')) {
    return <FileText className="h-4 w-4" />;
  }
  if (contentType?.startsWith('video/')) {
    return <FileVideo className="h-4 w-4" />;
  }
  return <File className="h-4 w-4" />;
};

const getFileType = (contentType: string, fileName: string): string => {
  if (contentType?.startsWith('image/')) return 'Image';
  if (contentType?.includes('pdf') || fileName?.toLowerCase().endsWith('.pdf')) return 'PDF';
  if (contentType?.startsWith('video/')) return 'Video';
  if (contentType?.startsWith('text/')) return 'Text';
  if (contentType?.includes('document') || fileName?.toLowerCase().match(/\.(doc|docx)$/)) return 'Document';
  return 'File';
};

const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ attachments }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'text' | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const handleDownload = async (attachment: Attachment) => {
    if (downloadingIds.has(attachment.id)) return;
    
    setDownloadingIds(prev => new Set(prev).add(attachment.id));
    
    try {
      const { data, error } = await supabase.storage
        .from('case-attachments')
        .createSignedUrl(attachment.file_path, 3600); // 1 hour expiry

      if (error) throw error;

      // Fetch the file as a blob to force download
      const response = await fetch(data.signedUrl);
      if (!response.ok) throw new Error('Failed to fetch file');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.file_name || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `Downloading ${attachment.file_name}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Unable to download the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachment.id);
        return newSet;
      });
    }
  };

  const handlePreview = async (attachment: Attachment) => {
    try {
      const { data, error } = await supabase.storage
        .from('case-attachments')
        .createSignedUrl(attachment.file_path, 3600);

      if (error) throw error;

      const contentType = attachment.content_type;
      const fileName = attachment.file_name?.toLowerCase() || '';

      if (contentType?.startsWith('image/')) {
        setPreviewUrl(data.signedUrl);
        setPreviewType('image');
        setIsPreviewOpen(true);
      } else if (contentType?.includes('pdf') || fileName.endsWith('.pdf')) {
        setPreviewUrl(data.signedUrl);
        setPreviewType('pdf');
        setIsPreviewOpen(true);
      } else if (contentType?.startsWith('text/') && attachment.size < 1024 * 100) { // Only preview text files under 100KB
        try {
          const response = await fetch(data.signedUrl);
          const text = await response.text();
          setPreviewContent(text);
          setPreviewType('text');
          setIsPreviewOpen(true);
        } catch {
          toast({
            title: "Preview unavailable",
            description: "Cannot preview this text file.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Preview unavailable",
          description: "Preview is not available for this file type. Use download instead.",
        });
      }
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: "Preview failed",
        description: "Unable to preview the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No attachments found for this case.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-card"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              {getFileIcon(attachment.content_type, attachment.file_name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">
                {attachment.file_name}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {getFileType(attachment.content_type, attachment.file_name)}
                </Badge>
                <span>{formatFileSize(attachment.size)}</span>
                <span>•</span>
                <span>{new Date(attachment.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePreview(attachment)}
              className="flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(attachment)}
              disabled={downloadingIds.has(attachment.id)}
              className="flex items-center gap-1"
            >
              <Download className="h-3 w-3" />
              {downloadingIds.has(attachment.id) ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      ))}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>File Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[60vh]">
            {previewType === 'image' && previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto mx-auto"
              />
            )}
            {previewType === 'pdf' && previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[60vh] border-0"
                title="PDF Preview"
              />
            )}
            {previewType === 'text' && (
              <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg overflow-auto">
                {previewContent}
              </pre>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttachmentViewer;