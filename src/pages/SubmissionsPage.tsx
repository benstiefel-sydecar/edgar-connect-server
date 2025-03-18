
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEdgarApi } from '@/contexts/EdgarApiContext';
import edgarApi from '@/services/edgar-api';
import { DraftSubmission } from '@/types/edgar-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileText, MoreHorizontal, Search, Plus } from 'lucide-react';

const SubmissionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useEdgarApi();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { data: submissions, isLoading, refetch } = useQuery({
    queryKey: ['draftSubmissions'],
    queryFn: async () => {
      const response = await edgarApi.getDraftSubmissions();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch submissions');
      }
      return response.data || [];
    },
  });

  const filteredSubmissions = submissions?.filter((submission) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      submission.submissionID.toLowerCase().includes(searchValue) ||
      submission.formType.toLowerCase().includes(searchValue) ||
      submission.cik.toLowerCase().includes(searchValue) ||
      submission.submissionStatus.toLowerCase().includes(searchValue)
    );
  });

  const handleCreateSubmission = () => {
    // This would typically open a dialog to create a new submission
    toast.info('Create submission functionality coming soon!');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DRAFT':
        return 'secondary';
      case 'SUBMITTED':
        return 'default';
      case 'ACCEPTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-pulse text-xl">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl mx-auto py-10 px-4 animate-fade-in">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your EDGAR filing submissions
            </p>
          </div>
          <Button onClick={handleCreateSubmission} className="md:w-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Submission
          </Button>
        </div>

        <Card className="animate-scale-in">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search submissions..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredSubmissions && filteredSubmissions.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submission ID</TableHead>
                      <TableHead>Form Type</TableHead>
                      <TableHead>CIK</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.submissionID}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                            {submission.submissionID}
                          </div>
                        </TableCell>
                        <TableCell>{submission.formType}</TableCell>
                        <TableCell>{submission.cik}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(submission.submissionStatus)}>
                            {submission.submissionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(submission.modifiedAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Submission</DropdownMenuItem>
                              <DropdownMenuItem>Validate</DropdownMenuItem>
                              <DropdownMenuItem>Submit to SEC</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No submissions found</h3>
                <p className="text-muted-foreground mt-1 mb-4">
                  {searchTerm ? 'No submissions match your search criteria' : 'Get started by creating your first submission'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleCreateSubmission}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Submission
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionsPage;
