
import React from 'react';
import { useEdgarApi } from '@/contexts/EdgarApiContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CredentialsForm from '@/components/auth/CredentialsForm';
import TokenForm from '@/components/auth/TokenForm';
import { Link } from 'react-router-dom';
import { FileText, Database, ServerCog, ArrowRight } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, isLoading } = useEdgarApi();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container max-w-screen-xl mx-auto py-10 px-4">
        <div className="flex flex-col items-center justify-center mb-10">
          <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in">EDGAR Connect</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl animate-fade-in delay-100">
            A modern service layer for interacting with the SEC EDGAR Filing API
          </p>
        </div>

        <div className="max-w-lg mx-auto mb-12 animate-slide-up delay-200">
          <Tabs defaultValue="credentials">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="credentials">Login with Credentials</TabsTrigger>
              <TabsTrigger value="tokens">Enter API Tokens</TabsTrigger>
            </TabsList>
            <TabsContent value="credentials">
              <CredentialsForm />
            </TabsContent>
            <TabsContent value="tokens">
              <TokenForm />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-10 animate-fade-in delay-300">
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-scale-in delay-400">
              <CardHeader>
                <CardTitle>1. Register with the SEC</CardTitle>
                <CardDescription>
                  Create an account on the SEC's EDGAR Filing website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To use the EDGAR API, you need to register for an account with the SEC. This will provide you with the credentials needed to generate API tokens.
                </p>
              </CardContent>
              <CardFooter>
                <a 
                  href="https://www.sec.gov/edgar/filer-information/current-edgar-technical-specifications" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Visit SEC website
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
            <Card className="animate-scale-in delay-500">
              <CardHeader>
                <CardTitle>2. Generate API Tokens</CardTitle>
                <CardDescription>
                  Use your SEC credentials to generate API tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once registered, you can use your credentials to generate the Filer API Token and User API Token through the SEC's token generation process.
                </p>
              </CardContent>
              <CardFooter>
                <a href="/docs" className="text-primary hover:underline inline-flex items-center">
                  Read documentation
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
            <Card className="animate-scale-in delay-600">
              <CardHeader>
                <CardTitle>3. Connect to the API</CardTitle>
                <CardDescription>
                  Enter your tokens to start using EDGAR Connect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enter your generated tokens into EDGAR Connect or use your SEC credentials to authenticate and start managing your SEC filings.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <a href="#tokens" className="inline-flex items-center">
                    Enter tokens
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-10 px-4">
      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in">EDGAR Connect Dashboard</h1>
        <p className="text-xl text-muted-foreground text-center max-w-2xl animate-fade-in delay-100">
          Your centralized hub for managing SEC EDGAR filings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="animate-scale-in delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Submissions</CardTitle>
            <FileText className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="mt-2">
            <p className="text-muted-foreground mb-6">
              Create, view, and manage your SEC filing submissions.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/submissions">Manage Submissions</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="animate-scale-in delay-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Filing History</CardTitle>
            <Database className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="mt-2">
            <p className="text-muted-foreground mb-6">
              View and search your complete history of SEC filings.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/filings">View Filings</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="animate-scale-in delay-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">API Documentation</CardTitle>
            <ServerCog className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="mt-2">
            <p className="text-muted-foreground mb-6">
              Learn how to use the EDGAR API and manage your tokens.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/docs">View Documentation</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
