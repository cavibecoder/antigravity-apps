import { useState, useEffect } from 'react';
import { App, AppFormData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/components/LanguageProvider';

interface AppFormProps {
    initialData?: App;
    onSubmit: (data: AppFormData) => void;
    onCancel: () => void;
}

const CATEGORIES = ['Tools', 'Work', 'Website', 'Creator Tools', 'Other'];

export function AppForm({ initialData, onSubmit, onCancel }: AppFormProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<AppFormData>({
        name: '',
        url: '',
        description: '',
        category: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (initialData) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                name: initialData.name,
                nameJa: initialData.nameJa || '',
                url: initialData.url,
                description: initialData.description || '',
                descriptionJa: initialData.descriptionJa || '',
                category: initialData.category || '',
            });
        }
    }, [initialData]);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = t.validation.nameRequired;
        if (!formData.url.trim()) {
            newErrors.url = t.validation.urlRequired;
        } else if (!/^https?:\/\//.test(formData.url)) {
            newErrors.url = t.validation.urlInvalid;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">{t.appName} *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Flight Tracker"
                    className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="nameJa">{t.appNameJa}</Label>
                <Input
                    id="nameJa"
                    value={formData.nameJa || ''}
                    onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
                    placeholder="e.g. フライトトラッカー"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">{t.url} *</Label>
                <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    className={errors.url ? 'border-destructive' : ''}
                />
                {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="category">{t.category}</Label>
                <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
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

            <div className="space-y-2">
                <Label htmlFor="description">{t.description}</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t.description}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="descriptionJa">{t.descriptionJa}</Label>
                <Textarea
                    id="descriptionJa"
                    value={formData.descriptionJa || ''}
                    onChange={(e) => setFormData({ ...formData, descriptionJa: e.target.value })}
                    placeholder={t.descriptionJa}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    {t.cancel}
                </Button>
                <Button type="submit">
                    {initialData ? t.saveChanges : t.addAppBtn}
                </Button>
            </div>
        </form>
    );
}
