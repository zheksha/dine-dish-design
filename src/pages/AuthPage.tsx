
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { Shield, ArrowRight, Home } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin');
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    await signIn(email, password);
  };

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    await signUp(email, password);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <header className="container flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">Dine Dish Design</h1>
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <Button variant="ghost" asChild>
            <Link to="/dashboard">
              {t('adminDashboard')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> {t('backToMenu')}
            </Link>
          </Button>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="space-y-1 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t('adminPortal')}</CardTitle>
              <CardDescription>
                {t('signIn')} {t('or')} {t('signUp')} {t('toAccess')}
              </CardDescription>
              <CardDescription className="mt-2 text-sm bg-amber-100 p-2 rounded text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                You can access the dashboard directly without signing in by clicking the "Admin Dashboard" button above.
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="signin">{t('signIn')}</TabsTrigger>
                <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input 
                        id="signin-email"
                        type="email" 
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">{t('password')}</Label>
                      </div>
                      <Input 
                        id="signin-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">{t('login')}</Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('email')}</Label>
                      <Input 
                        id="signup-email"
                        type="email" 
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">{t('password')}</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full">{t('register')}</Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
      
      <footer className="container py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Dine Dish Design. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthPage;
