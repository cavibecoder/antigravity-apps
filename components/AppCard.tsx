import { App } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface AppCardProps {
    app: App;
    onEdit: (app: App) => void;
    onDelete: (id: string) => void;
}

export function AppCard({ app, onEdit, onDelete }: AppCardProps) {
    const { t, language } = useLanguage();

    const displayName = language === 'ja' && app.nameJa ? app.nameJa : app.name;
    const displayDescription = language === 'ja' && app.descriptionJa ? app.descriptionJa : app.description;

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                        <CardTitle className="text-lg font-bold leading-tight">
                            <a
                                href={app.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline decoration-primary underline-offset-4"
                            >
                                {displayName}
                            </a>
                        </CardTitle>
                        {app.category && (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                {t.categories[app.category as keyof typeof t.categories] || app.category}
                            </span>
                        )}
                    </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                    {displayDescription}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {/* Spacer or additional content if needed */}
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-3 border-t">
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(app)} title={t.edit}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(app.id)} title={t.delete} className="hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <Button asChild size="sm" className="gap-1">
                    <a href={app.url} target="_blank" rel="noopener noreferrer">
                        {t.open} <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}
