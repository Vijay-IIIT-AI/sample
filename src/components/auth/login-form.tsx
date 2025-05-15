
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Mail } from "lucide-react";

// Simple inline SVG for Google icon
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Mock login logic
    console.log("Login data:", data);
    toast({
      title: "Login Successful",
      description: "Redirecting to dashboard...",
    });
    // In a real app, you'd set a token or session here
    setTimeout(() => router.push("/dashboard"), 1000);
  };

  const handleFacebookLogin = async () => {
    toast({
      title: "Facebook Login Initiated",
      description: "Connecting to Facebook...",
    });
    console.log("Simulating Facebook Login initiation...");

    // In a real app, you would initialize the Facebook SDK (usually in layout or _app.tsx)
    // and then call FB.login() here.
    // Example (conceptual):
    // FB.login(function(response) {
    //   if (response.authResponse) {
    //     const accessToken = response.authResponse.accessToken;
    //     toast({ title: "Facebook Token Received", description: "Verifying with backend..." });
    //     // Send accessToken to your backend:
    //     // fetch('/api/auth/facebook/login', { method: 'POST', body: JSON.stringify({ token: accessToken }) })
    //     //   .then(res => res.json())
    //     //   .then(data => {
    //     //     if (data.success) {
    //              toast({ title: "Facebook Login Successful", description: "Redirecting to dashboard..." });
    //              router.push("/dashboard");
    //     //     } else {
    //     //       toast({ title: "Facebook Login Failed", description: data.message, variant: "destructive" });
    //     //     }
    //     //   }).catch(err => toast({ title: "Error", description: "Could not connect to backend.", variant: "destructive" }));
    //   } else {
    //     toast({ title: "Facebook Login Cancelled", description: "User cancelled or did not authorize.", variant: "destructive"});
    //   }
    // }, {scope: 'email,public_profile'}); // Request necessary permissions

    // Mocking the success after a delay
    setTimeout(() => {
      toast({
        title: "Facebook Token Received (Mock)",
        description: "Sending token to backend for verification...",
      });
      setTimeout(() => {
        toast({
          title: "Facebook Login Successful (Mock)",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
      }, 1500);
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    toast({
      title: "Google Sign-In Initiated",
      description: "Opening Google Sign-In prompt...",
    });
    console.log("Simulating Google Sign-In initiation...");

    // In a real app, you would use the Google Identity Services library.
    // Initialize it (usually once in your app) and then trigger the sign-in.
    // Example (conceptual):
    // const client = google.accounts.oauth2.initCodeClient({
    //   client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    //   scope: 'email profile openid',
    //   callback: (response) => {
    //     if (response.code) {
    //       const authCode = response.code;
    //       toast({ title: "Google Auth Code Received", description: "Verifying with backend..." });
    //       // Send authCode to your backend:
    //       // fetch('/api/auth/google/login', { method: 'POST', body: JSON.stringify({ code: authCode }) })
    //       //   .then(res => res.json())
    //       //   .then(data => {
    //       //     if (data.success) {
    //              toast({ title: "Google Login Successful", description: "Redirecting to dashboard..." });
    //              router.push("/dashboard");
    //       //     } else {
    //       //       toast({ title: "Google Login Failed", description: data.message, variant: "destructive" });
    //       //     }
    //       //   }).catch(err => toast({ title: "Error", description: "Could not connect to backend.", variant: "destructive" }));
    //     } else {
    //       toast({ title: "Google Sign-In Failed", description: "No authorization code received.", variant: "destructive" });
    //     }
    //   },
    // });
    // client.requestCode();

    // Mocking the success after a delay
    setTimeout(() => {
      toast({
        title: "Google Auth Code Received (Mock)",
        description: "Sending code to backend for verification...",
      });
      setTimeout(() => {
        toast({
          title: "Google Login Successful (Mock)",
          description: "Redirecting to dashboard...",
        });
        router.push("/dashboard");
      }, 1500);
    }, 1500);
  };


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Sign in to your Yabily account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} icon={<Mail className="h-4 w-4 text-muted-foreground" />} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Mail className="mr-2 h-4 w-4" /> Sign In with Email
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Sign in with Google
          </Button>
          <Button variant="outline" className="w-full mt-4" onClick={handleFacebookLogin}>
            <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
            Sign in with Facebook
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <Link href="/forgot-password" passHref>
          <Button variant="link" className="text-sm">Forgot password?</Button>
        </Link>
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
