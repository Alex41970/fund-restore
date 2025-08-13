import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User as UserIcon, Shield, Calendar, Mail, Phone, Key, Eye } from "lucide-react";
import { format } from "date-fns";

interface UserWithRoles {
  id: string;
  email?: string;
  profiles?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    avatar_url?: string;
  };
  user_roles: { role: string }[];
}

interface AuthDetails {
  id: string;
  email: string;
  emailConfirmed: boolean;
  emailConfirmedAt: string | null;
  createdAt: string;
  lastSignIn: string | null;
  phoneNumber: string | null;
  phoneConfirmed: boolean;
  phoneConfirmedAt: string | null;
  identities: any[];
  userMetadata: any;
  appMetadata: any;
  providers: string[];
}

interface UserDetailsModalProps {
  user: UserWithRoles | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdate,
}) => {
  const [authDetails, setAuthDetails] = useState<AuthDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchAuthDetails();
      setFormData({
        email: user.email || "",
        password: "",
        firstName: user.profiles?.first_name || "",
        lastName: user.profiles?.last_name || "",
        phoneNumber: user.profiles?.phone_number || "",
      });
    }
  }, [user, isOpen]);

  const fetchAuthDetails = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-user-auth-details', {
        body: { userId: user.id }
      });

      if (error) throw error;
      setAuthDetails(data.authDetails);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user authentication details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const updateData: any = {};
      
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      
      if (formData.firstName || formData.lastName || formData.phoneNumber) {
        updateData.userData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone_number: formData.phoneNumber,
        };
      }

      const { data, error } = await supabase.functions.invoke('update-user-credentials', {
        body: { userId: user.id, ...updateData }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setEditing(false);
      onUserUpdate();
      fetchAuthDetails();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            User Details - {user.profiles?.display_name || user.email}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="edit">Edit User</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Display Name</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.profiles?.display_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">First Name</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.profiles?.first_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.profiles?.last_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.profiles?.phone_number || "Not set"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">User ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            {loading && !authDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : authDetails ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Authentication Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">Email Confirmed:</span>
                        <Badge variant={authDetails.emailConfirmed ? "default" : "destructive"}>
                          {authDetails.emailConfirmed ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">Phone Confirmed:</span>
                        <Badge variant={authDetails.phoneConfirmed ? "default" : "destructive"}>
                          {authDetails.phoneConfirmed ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Activity Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Account Created</Label>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(authDetails.createdAt), "PPpp")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Sign In</Label>
                        <p className="text-sm text-muted-foreground">
                          {authDetails.lastSignIn
                            ? format(new Date(authDetails.lastSignIn), "PPpp")
                            : "Never"}
                        </p>
                      </div>
                      {authDetails.emailConfirmedAt && (
                        <div>
                          <Label className="text-sm font-medium">Email Confirmed At</Label>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(authDetails.emailConfirmedAt), "PPpp")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Authentication Providers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {authDetails.providers.map((provider, index) => (
                        <Badge key={index} variant="outline">
                          {provider}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Failed to load authentication details</p>
            )}
          </TabsContent>

          <TabsContent value="edit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Edit User Credentials</CardTitle>
                <CardDescription>
                  Modify user authentication and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">New Password (optional)</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Leave empty to keep current password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUser} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  User Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.user_roles.map((role, index) => (
                    <Badge key={index} variant={role.role === 'admin' ? 'default' : 'secondary'}>
                      {role.role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};