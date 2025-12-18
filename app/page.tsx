"use client";

import { useEffect, useState } from 'react';
import { App, AppFormData } from '@/types';
import { getApps, saveApp, deleteApp } from '@/lib/storage';
import { AppCard } from '@/components/AppCard';
import { AppForm } from '@/components/AppForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { AntigravityLogo } from '@/components/AntigravityLogo';

const CATEGORIES = ['All', 'Tools', 'Work', 'Website', 'Creator Tools', 'Other'];

export default function Home() {
  const { t } = useLanguage();
  const [apps, setApps] = useState<App[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<App | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load apps on mount
    const loadedApps = getApps();
    setApps(loadedApps);
    setIsLoaded(true);
  }, []);

  const filteredApps = apps.filter((app) => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddApp = () => {
    setEditingApp(undefined);
    setIsFormOpen(true);
  };

  const handleEditApp = (app: App) => {
    setEditingApp(app);
    setIsFormOpen(true);
  };

  const handleDeleteApp = (id: string) => {
    if (window.confirm(t.deleteConfirm)) {
      const updatedApps = deleteApp(id);
      setApps(updatedApps);
    }
  };

  const handleFormSubmit = (data: AppFormData) => {
    const newApp: App = {
      id: editingApp ? editingApp.id : crypto.randomUUID(),
      createdAt: editingApp ? editingApp.createdAt : new Date().toISOString(),
      ...data,
    };

    const updatedApps = saveApp(newApp);
    setApps(updatedApps);
    setIsFormOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background font-sans flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">{t.loading}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <AntigravityLogo />
            <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <LanguageToggle />
            <Button onClick={handleAddApp} className="w-full sm:w-auto gap-2">
              <Plus className="h-4 w-4" /> {t.addApp}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.categoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {t.categories[cat as keyof typeof t.categories] || cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* App Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onEdit={handleEditApp}
                onDelete={handleDeleteApp}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium text-muted-foreground">{t.noAppsTitle}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {apps.length === 0
                ? t.noAppsDesc
                : t.noAppsDescFilter}
            </p>
            {apps.length === 0 && (
              <Button variant="outline" onClick={handleAddApp} className="mt-4">
                {t.addFirstApp}
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingApp ? t.editApp : t.addNewApp}</DialogTitle>
          </DialogHeader>
          <AppForm
            initialData={editingApp}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
