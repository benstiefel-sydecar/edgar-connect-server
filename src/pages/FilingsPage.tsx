
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useEdgarApi } from '@/contexts/EdgarApiContext';
import edgarApi from '@/services/edgar-api';
import { Filing } from '@/types/edgar-api';
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
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Search, FileSearch } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FilingsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useEdgarApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [cik, setCik] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const { data: filings, isLoading, refetch } = useQuery({
    queryKey: ['filingHistory', cik],
    queryFn: async () => {
      if (!cik) return [];
      
      const response = await edgarApi.getFilingHistory(cik);
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch filing history');
      }
      return response.data || [];
    },
    enabled: !!cik,
  });

  const filteredFilings = filings?.filter((filing) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      filing.accessionNumber.toLowerCase().includes(searchValue) ||
      filing.formType.toLowerCase().includes(searchValue) ||
      filing.primaryDocDescription.toLowerCase().includes(searchValue)
    );
  });

  // For demo purposes, these would normally come from another API call
  const demoFilers = [
    { cik: '0000320193', name: 'APPLE INC' },
    { cik: '0001652044', name: 'ALPHABET INC' },
    { cik: '0000789019', name: 'MICROSOFT CORP' },
    { cik: '0001018724', name: 'AMAZON COM INC' },
    { cik: '0001318605', name: 'TESLA INC' },
  ];

  const handleCikChange = (value: string) => {
    setCik(value);
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-10 px-4 animate-fade-in">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Filing History</h1>
          <p className="text-muted-foreground mt-1">
            View and search your complete history of SEC filings
          </p>
        </div>

        <Card className="animate-scale-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label htmlFor="cik-select" className="text-sm font-medium block mb-2">
                  Select Filer (CIK)
                </label>
                <Select onValueChange={handleCikChange}>
                  <SelectTrigger id="cik-select">
                    <SelectValue placeholder="Select a filer" />
                  </SelectTrigger>
                  <SelectContent>
                    {demoFilers.map((filer) => (
                      <SelectItem key={filer.cik} value={filer.cik}>
                        {filer.name} ({filer.cik})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label htmlFor="search-filings" className="text-sm font-medium block mb-2">
                  Search Filings
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search-filings"
                    placeholder="Search by form type, description..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {!cik ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Select a filer to view filings</h3>
                <p className="text-muted-foreground mt-1">
                  Choose a filer (CIK) from the dropdown above to view their filing history
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-pulse text-lg">Loading filings...</div>
              </div>
            ) : filteredFilings && filteredFilings.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Accession Number</TableHead>
                      <TableHead>Form Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead className="w-[100px]">Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFilings.map((filing) => (
                      <TableRow key={filing.accessionNumber}>
                        <TableCell className="font-mono text-sm">
                          {filing.accessionNumber}
                        </TableCell>
                        <TableCell>{filing.formType}</TableCell>
                        <TableCell>{filing.primaryDocDescription}</TableCell>
                        <TableCell>
                          {format(new Date(filing.filingDate), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.open(filing.primaryDocUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No filings found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm ? 'No filings match your search criteria' : 'No filing history available for this filer'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilingsPage;
