import React, { useState } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await User.login();
      // The user will be redirected, so no need to set isLoading to false here.
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            ElderCare Connect
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Caring together, staying connected
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Welcome to Your Care Circle
              </h3>
              <p className="text-gray-600 text-sm">
                Coordinate care, share updates, and stay connected with your family
              </p>
            </div>
            
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isLoading ? "Redirecting to Sign In..." : "Sign in with Google"}
            </Button>
            
            <div className="text-center text-sm text-gray-500">
              <p>Secure • Private • Family-focused</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}