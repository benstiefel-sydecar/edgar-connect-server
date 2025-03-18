
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEdgarApi } from '@/contexts/EdgarApiContext';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const tokenSchema = z.object({
  filerApiToken: z.string().min(10, 'Filer API token must be at least 10 characters'),
  userApiToken: z.string().min(10, 'User API token must be at least 10 characters'),
});

type TokenFormValues = z.infer<typeof tokenSchema>;

const TokenForm: React.FC = () => {
  const { setTokensManually } = useEdgarApi();

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      filerApiToken: '',
      userApiToken: '',
    },
  });

  const onSubmit = (values: TokenFormValues) => {
    setTokensManually({
      filerApiToken: values.filerApiToken,
      userApiToken: values.userApiToken,
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Enter API Tokens</CardTitle>
        <CardDescription>
          Enter your EDGAR Filer API Token and User API Token to connect to the service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="filerApiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filer API Token</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your Filer API token" 
                      {...field} 
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userApiToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User API Token</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your User API token" 
                      {...field} 
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Connect to EDGAR API
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-center text-sm text-muted-foreground">
        <p>
          Need to generate tokens? See our documentation on{' '}
          <a href="/docs" className="text-primary hover:underline">
            how to generate EDGAR API tokens
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default TokenForm;
