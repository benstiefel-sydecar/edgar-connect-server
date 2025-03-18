
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, FileText, Key, Book, AlertTriangle } from 'lucide-react';

const DocsPage = () => {
  return (
    <div className="container max-w-screen-xl mx-auto py-10 px-4 animate-fade-in">
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">EDGAR API Documentation</h1>
          <p className="text-muted-foreground mt-1">
            Learn how to use the SEC EDGAR Filing API and manage your tokens
          </p>
        </div>

        <Tabs defaultValue="authentication" className="animate-scale-in">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>
          
          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Generating SEC EDGAR API Tokens
                </CardTitle>
                <CardDescription>
                  Understanding the EDGAR API authentication process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Important Note</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    The token generation process described here is based on general OAuth practices. The SEC may have specific requirements that differ from this documentation.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Prerequisites</h3>
                  <p className="text-muted-foreground">
                    Before generating API tokens, you need to have:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>An active SEC.gov account with EDGAR filing access</li>
                    <li>Client ID and Secret (obtained during EDGAR API registration)</li>
                    <li>Appropriate permissions to access the API</li>
                  </ul>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Understanding the Two Tokens</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Badge variant="outline" className="mt-1 mr-2">User API Token</Badge>
                      <p className="text-muted-foreground">
                        This token is used for general API operations and user-level functions. It identifies your user account when making requests.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <Badge variant="outline" className="mt-1 mr-2">Filer API Token</Badge>
                      <p className="text-muted-foreground">
                        This token is specific to the filer entity (identified by CIK) and grants access to submission-specific operations.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Token Generation Process</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Step 1: Register for API Access</h4>
                      <p className="text-muted-foreground">
                        Register for API access through the SEC's EDGAR Filing website. This will provide you with a Client ID and Client Secret.
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Step 2: Authenticate with your Credentials</h4>
                      <p className="text-muted-foreground">
                        Make a request to the token endpoint with your username, password, client ID, and client secret.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`POST https://api-bravo.edgarfiling.sec.gov/auth/token
Content-Type: application/json

{
  "grant_type": "password",
  "username": "your-sec-username",
  "password": "your-sec-password",
  "client_id": "your-client-id",
  "client_secret": "your-client-secret"
}`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Step 3: Store Your Tokens Securely</h4>
                      <p className="text-muted-foreground">
                        The response will contain both tokens. Store these securely and use them for subsequent API requests.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`{
  "user_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "filer_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "token_type": "Bearer"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Token Lifecycle</h3>
                  <p className="text-muted-foreground">
                    Tokens typically expire after a certain period (usually 1 hour). You'll need to refresh or regenerate tokens as needed.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Token Refresh (when supported)</h4>
                    <div className="bg-secondary p-4 rounded-md overflow-auto">
                      <pre className="text-sm font-mono">
{`POST https://api-bravo.edgarfiling.sec.gov/auth/token
Content-Type: application/json

{
  "grant_type": "refresh_token",
  "refresh_token": "your-refresh-token",
  "client_id": "your-client-id",
  "client_secret": "your-client-secret"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-5 w-5" />
                  <AlertTitle>Official Documentation</AlertTitle>
                  <AlertDescription>
                    For the most accurate and up-to-date information, always refer to the{' '}
                    <a 
                      href="https://api-bravo.edgarfiling.sec.gov/#endpoints" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      official SEC EDGAR API documentation
                    </a>.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  API Endpoints
                </CardTitle>
                <CardDescription>
                  Overview of available EDGAR API endpoints
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Submission Endpoints</h3>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">GET /submissions/draft</h4>
                    <p className="text-muted-foreground">
                      Retrieves a list of all draft submissions for the authenticated user.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">GET /submissions/draft/{'{submissionId}'}</h4>
                    <p className="text-muted-foreground">
                      Retrieves details for a specific draft submission.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">POST /submissions/draft</h4>
                    <p className="text-muted-foreground">
                      Creates a new draft submission.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">DELETE /submissions/draft/{'{submissionId}'}</h4>
                    <p className="text-muted-foreground">
                      Deletes a specific draft submission.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Validation & Submission</h3>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">POST /submissions/draft/{'{submissionId}'}/validate</h4>
                    <p className="text-muted-foreground">
                      Validates a draft submission before filing.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">POST /submissions/draft/{'{submissionId}'}/submit</h4>
                    <p className="text-muted-foreground">
                      Submits a validated draft to the SEC.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">File Management</h3>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">POST /submissions/draft/{'{submissionId}'}/files</h4>
                    <p className="text-muted-foreground">
                      Uploads files to a draft submission.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">DELETE /submissions/draft/{'{submissionId}'}/files/{'{fileName}'}</h4>
                    <p className="text-muted-foreground">
                      Deletes a file from a draft submission.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Filer & Form Management</h3>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">GET /filers/{'{cik}'}</h4>
                    <p className="text-muted-foreground">
                      Retrieves information about a specific filer by CIK.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">GET /formsupport/formtypes</h4>
                    <p className="text-muted-foreground">
                      Retrieves a list of available form types.
                    </p>
                  </div>
                  
                  <div className="space-y-2 pl-2 border-l-2 border-muted">
                    <h4 className="font-medium">GET /filers/{'{cik}'}/filings</h4>
                    <p className="text-muted-foreground">
                      Retrieves filing history for a specific CIK.
                    </p>
                  </div>
                </div>

                <Alert>
                  <Info className="h-5 w-5" />
                  <AlertTitle>Authorization</AlertTitle>
                  <AlertDescription>
                    Most endpoints require authorization using one of the API tokens. Refer to each endpoint's documentation to determine which token to use.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  Implementation Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step guides for common API operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Creating and Submitting a Filing</h3>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Badge variant="outline" className="mr-2 w-6 h-6 flex items-center justify-center p-0 rounded-full">1</Badge>
                        Create a Draft Submission
                      </h4>
                      <p className="text-muted-foreground">
                        Start by creating a new draft submission with the form type and CIK.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`// Create a new submission
const response = await edgarApi.createDraftSubmission("10-K", "0001234567");
const submissionId = response.data.submissionId;`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Badge variant="outline" className="mr-2 w-6 h-6 flex items-center justify-center p-0 rounded-full">2</Badge>
                        Upload Required Files
                      </h4>
                      <p className="text-muted-foreground">
                        Upload all necessary documents and attachments for the filing.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`// Upload primary document
const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];
await edgarApi.uploadFile(submissionId, file);`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Badge variant="outline" className="mr-2 w-6 h-6 flex items-center justify-center p-0 rounded-full">3</Badge>
                        Validate the Submission
                      </h4>
                      <p className="text-muted-foreground">
                        Validate the submission to check for errors before submitting.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`// Validate the submission
const validationResult = await edgarApi.validateSubmission(submissionId);

if (!validationResult.data.valid) {
  console.error("Validation errors:", validationResult.data.errors);
  // Handle errors
}`}
                        </pre>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center">
                        <Badge variant="outline" className="mr-2 w-6 h-6 flex items-center justify-center p-0 rounded-full">4</Badge>
                        Submit to the SEC
                      </h4>
                      <p className="text-muted-foreground">
                        Submit the validated draft to the SEC for processing.
                      </p>
                      <div className="bg-secondary p-4 rounded-md overflow-auto">
                        <pre className="text-sm font-mono">
{`// Submit to the SEC
if (validationResult.data.valid) {
  const submitResult = await edgarApi.submitDraftSubmission(submissionId);
  if (submitResult.success) {
    console.log("Submission successful!");
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Retrieving Filing History</h3>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Fetch and display filing history for a specific CIK.
                    </p>
                    <div className="bg-secondary p-4 rounded-md overflow-auto">
                      <pre className="text-sm font-mono">
{`// Get filing history for a CIK
const cik = "0001234567";
const filingHistory = await edgarApi.getFilingHistory(cik);

if (filingHistory.success) {
  const filings = filingHistory.data;
  filings.forEach(filing => {
    console.log(\`\${filing.formType} filed on \${filing.filingDate}\`);
    console.log(\`Document: \${filing.primaryDocDescription}\`);
    console.log(\`URL: \${filing.primaryDocUrl}\`);
    console.log("------------------------");
  });
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Error Handling</h3>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Properly handle API errors in your application.
                    </p>
                    <div className="bg-secondary p-4 rounded-md overflow-auto">
                      <pre className="text-sm font-mono">
{`try {
  const response = await edgarApi.submitDraftSubmission(submissionId);
  
  if (!response.success) {
    // Handle API error
    console.error("API Error:", response.error);
    // Show appropriate user message
    displayErrorToUser(response.error);
    return;
  }
  
  // Handle success
  console.log("Submission successful!");
  
} catch (error) {
  // Handle network or unexpected errors
  console.error("Unexpected error:", error);
  displayErrorToUser("An unexpected error occurred. Please try again.");
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-5 w-5" />
                  <AlertTitle>Best Practices</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Always validate submissions before submitting them</li>
                      <li>Implement robust error handling for all API calls</li>
                      <li>Store and manage API tokens securely</li>
                      <li>Handle token expiration gracefully by prompting for re-authentication</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DocsPage;
