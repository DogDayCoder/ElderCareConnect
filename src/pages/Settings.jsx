
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/api/entities";
import { CareCircle } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Users, Plus, LogOut } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [careCircle, setCareCircle] = useState(null);
  const [newCircleName, setNewCircleName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const circles = await CareCircle.filter(
        { members: currentUser.email },
        "-created_date",
        1
      );
      
      if (circles.length > 0) {
        setCareCircle(circles[0]);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const toggleElderlyMode = async (enabled) => {
    try {
      await User.updateMyUserData({ is_elderly_mode: enabled });
      setUser(prev => ({ ...prev, is_elderly_mode: enabled }));
      // Refresh the page to apply layout changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating elderly mode:", error);
    }
  };

  const createCareCircle = async (e) => {
    e.preventDefault();
    if (!newCircleName.trim() || !user) return;

    try {
      const newCircle = await CareCircle.create({
        circle_name: newCircleName.trim(),
        admin_email: user.email,
        members: [user.email],
        elderly_user_email: user.email
      });
      
      setCareCircle(newCircle);
      setNewCircleName("");
    } catch (error) {
      console.error("Error creating care circle:", error);
    }
  };

  const inviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !careCircle) return;

    try {
      const updatedMembers = [...(careCircle.members || []), inviteEmail.trim()];
      await CareCircle.update(careCircle.id, { members: updatedMembers });
      
      setCareCircle(prev => ({ ...prev, members: updatedMembers }));
      setInviteEmail("");
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      // Optional: redirect to login or home
      window.location.href = createPageUrl("Dashboard");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    // Or show a message to log in
    return (
         <div className="p-4 md:p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Please Log In</h1>
            <p className="text-gray-600 mt-2">You need to be logged in to access settings.</p>
         </div>
    );
  }


  if (user?.is_elderly_mode) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto border-2 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 mr-3 text-blue-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-xl text-gray-600 mb-6">
              Your family manages these settings for you.
            </p>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="lg"
              className="text-xl px-8 py-4"
            >
              <LogOut className="w-6 h-6 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your profile and care circle</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={user?.first_name || ""}
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={user?.last_name || ""}
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ""}
                className="mt-1"
                readOnly
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <Label htmlFor="elderlyMode" className="text-base font-medium">
                  Simplified Interface
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Enable large buttons and simplified navigation
                </p>
              </div>
              <Switch
                id="elderlyMode"
                checked={user?.is_elderly_mode || false}
                onCheckedChange={toggleElderlyMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Care Circle Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Care Circle Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!careCircle ? (
              <form onSubmit={createCareCircle} className="space-y-4">
                <div>
                  <Label htmlFor="circleName">Create Care Circle</Label>
                  <Input
                    id="circleName"
                    placeholder="e.g., Mom's Care Team"
                    value={newCircleName}
                    onChange={(e) => setNewCircleName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Care Circle
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label>Circle Name</Label>
                  <div className="text-lg font-semibold text-gray-900 mt-1">
                    {careCircle.circle_name}
                  </div>
                </div>
                
                <div>
                  <Label>Members ({careCircle.members?.length || 0})</Label>
                  <div className="mt-2 space-y-2">
                    {careCircle.members?.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{email}</span>
                        {email === careCircle.admin_email && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Admin</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={inviteMember} className="space-y-4">
                  <div>
                    <Label htmlFor="inviteEmail">Invite New Member</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Send Invite
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleLogout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
