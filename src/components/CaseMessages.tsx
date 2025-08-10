import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";

interface MessageProps {
  id: string;
  content: string;
  created_at: string;
  sender_type: "client" | "admin";
  is_internal?: boolean;
  user_id: string;
}

interface CaseMessagesProps {
  caseId: string;
  messages: MessageProps[];
  isAdmin?: boolean;
}

export const CaseMessages: React.FC<CaseMessagesProps> = ({ caseId, messages, isAdmin = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from("case_messages")
        .insert({
          case_id: caseId,
          content: newMessage.trim(),
          sender_type: isAdmin ? "admin" : "client",
          is_internal: isAdmin ? isInternal : false,
          user_id: user.id,
        });

      if (error) throw error;

      setNewMessage("");
      setIsInternal(false);
      toast.success("Message sent");
      queryClient.invalidateQueries({ queryKey: ["case-messages", caseId] });
    } catch (error) {
      toast.error("Failed to send message");
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const visibleMessages = messages.filter(msg => 
    isAdmin || !msg.is_internal
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {visibleMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No messages yet</p>
          ) : (
            visibleMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 p-3 rounded-lg ${
                  message.sender_type === "admin"
                    ? "bg-trust-blue/5 border border-trust-blue/10"
                    : "bg-muted/50"
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={message.sender_type === "admin" ? "default" : "secondary"}
                      className={message.sender_type === "admin" ? "bg-trust-blue text-trust-blue-foreground" : ""}
                    >
                      {message.sender_type === "admin" ? "Support" : "You"}
                    </Badge>
                    {message.is_internal && isAdmin && (
                      <Badge variant="outline" className="text-warning-amber border-warning-amber/20">
                        Internal
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="space-y-3 border-t pt-4">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
          />
          
          {isAdmin && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="internal"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="internal" className="text-sm text-muted-foreground">
                Internal note (not visible to client)
              </label>
            </div>
          )}
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || sending}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {sending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};