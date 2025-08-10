import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth: React.FC = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  const loginForm = useForm<LoginFormValues>({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: { email: "", password: "" } 
  });
  const signupForm = useForm<SignupFormValues>({ 
    resolver: zodResolver(signupSchema), 
    defaultValues: { 
      firstName: "", 
      lastName: "", 
      phoneNumber: "", 
      email: "", 
      password: "", 
      confirmPassword: "" 
    } 
  });

  const onLogin = async (values: LoginFormValues) => {
    const { error } = await signIn(values.email, values.password) as any;
    if (error) return toast.error(error.message || "Login failed");
    toast.success("Welcome back!");
    navigate(from, { replace: true });
  };

  const onSignup = async (values: SignupFormValues) => {
    const { error } = await signUp(values.email, values.password, {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
    }) as any;
    if (error) return toast.error(error.message || "Sign up failed");
    toast.success("Account created successfully! You can now log in.");
    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Login or Sign Up | Case Manager</title>
        <meta name="description" content="Login or create an account to manage your cases securely." />
        <link rel="canonical" href={window.location.origin + "/auth"} />
      </Helmet>

      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Access your account</CardTitle>
            <CardDescription>Sign in or create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-4">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" {...loginForm.register("email")}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" {...loginForm.register("password")} />
                  </div>
                  <Button className="w-full" type="submit">Login</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        type="text" 
                        placeholder="John" 
                        {...signupForm.register("firstName")}
                      />
                      {signupForm.formState.errors.firstName && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        type="text" 
                        placeholder="Doe" 
                        {...signupForm.register("lastName")}
                      />
                      {signupForm.formState.errors.lastName && (
                        <p className="text-sm text-destructive">{signupForm.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      {...signupForm.register("phoneNumber")}
                    />
                    {signupForm.formState.errors.phoneNumber && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.phoneNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email2">Email</Label>
                    <Input 
                      id="email2" 
                      type="email" 
                      placeholder="you@example.com" 
                      {...signupForm.register("email")}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password2">Password</Label>
                    <Input 
                      id="password2" 
                      type="password" 
                      placeholder="Minimum 8 characters" 
                      {...signupForm.register("password")} 
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="Confirm your password" 
                      {...signupForm.register("confirmPassword")} 
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button className="w-full" type="submit">Create account</Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Auth;
