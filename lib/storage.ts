import { App } from '@/types';

const STORAGE_KEY = 'antigravity-apps';

const DEFAULT_APPS: App[] = [
    {
        id: 'pivot-homepage',
        name: 'Pivot Homepage',
        nameJa: 'ぴぼっと ホームページ',
        url: 'https://pivot-homepage-main.vercel.app/',
        description: 'Moving freely, thinking simply.',
        descriptionJa: '自由に行動し、シンプルに考える。',
        category: 'Website',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'decision-gacha-founders',
        name: 'Decision Gacha for Founders',
        nameJa: '決断ガチャ',
        url: 'https://gacha-for-founder.vercel.app/',
        description: 'Stop overthinking. Trust the moment.',
        descriptionJa: '考えすぎるのをやめよう。その瞬間を信じよう。',
        category: 'Tools',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'forest-garden-care',
        name: 'Tomoura Forest & Garden Care',
        nameJa: '友浦フォレスト＆ガーデンケア',
        url: 'https://forest-gardencare-uo1g.vercel.app/ja',
        description: 'Professional tree services from garden to forest.',
        descriptionJa: 'お庭から山林まで、プロの技術で木をケアします。',
        category: 'Website',
        createdAt: new Date().toISOString(),
    },
    {
        id: '1',
        name: 'Flight Tracker',
        nameJa: 'フライトトラッカー',
        url: 'https://flight-tracker-gamma.vercel.app/',
        description: 'Track flight information and schedules.',
        descriptionJa: 'フライト情報とスケジュールを追跡します。',
        category: 'Tools',
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Yuzu Farm Website',
        nameJa: 'ゆず農園ウェブサイト',
        url: 'https://yuzu-farm.vercel.app/',
        description: 'Simple website for a yuzu farm.',
        descriptionJa: 'ゆず農園のシンプルなウェブサイトです。',
        category: 'Website',
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Instagram BGM Memo App',
        nameJa: 'Instagram BGM メモアプリ',
        url: 'https://instagram-bgm-memoapp.vercel.app/',
        description: 'Memo app to save and manage Instagram BGM ideas.',
        descriptionJa: 'InstagramのBGMアイデアを保存・管理するメモアプリ。',
        category: 'Creator Tools',
        createdAt: new Date().toISOString(),
    },
];

export const getApps = (): App[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize with default apps if empty
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPS));
        return DEFAULT_APPS;
    }

    try {
        const parsedApps: App[] = JSON.parse(stored);
        let hasUpdates = false;
        let updatedApps = [...parsedApps];

        // 1. Check for missing default apps and add them
        const missingDefaults = DEFAULT_APPS.filter(defaultApp =>
            !updatedApps.some(app => app.id === defaultApp.id)
        );

        if (missingDefaults.length > 0) {
            // Add missing defaults (will be sorted below)
            updatedApps = [...missingDefaults, ...updatedApps];
            hasUpdates = true;
        }

        // 2. Migration: Check if default apps need updates (e.g. missing Japanese fields)
        updatedApps = updatedApps.map(app => {
            const defaultApp = DEFAULT_APPS.find(d => d.id === app.id);
            if (defaultApp) {
                // If it's a default app, ensure it has the new fields if they are missing
                if (!app.nameJa ||
                    !app.descriptionJa ||
                    (app.id === 'pivot-homepage' && app.nameJa === 'Pivot ホームページ') ||
                    (app.id === 'decision-gacha-founders' && app.nameJa === 'Decision Gacha for Founders')) {
                    hasUpdates = true;
                    return { ...app, nameJa: defaultApp.nameJa, descriptionJa: defaultApp.descriptionJa };
                }
            }
            return app;
        });

        // Cleanup: Remove duplicate Tomoura app if present (e.g. legacy manual entry)
        const prevLength = updatedApps.length;
        updatedApps = updatedApps.filter(app => {
            const isLegacyTomoura = (
                (app.url === 'https://forest-gardencare-uo1g.vercel.app/ja' || app.nameJa === '友浦フォレスト＆ガーデンケア') &&
                app.id !== 'forest-garden-care'
            );
            return !isLegacyTomoura;
        });

        if (updatedApps.length !== prevLength) {
            hasUpdates = true;
        }

        // 3. Sort: Ensure Default Apps appear in order at the top
        // Create a map for quick lookup of default app usage
        const defaultAppIndices = new Map(DEFAULT_APPS.map((app, index) => [app.id, index]));

        updatedApps.sort((a, b) => {
            // Explicitly pin Pivot Homepage to the top
            if (a.id === 'pivot-homepage') return -1;
            if (b.id === 'pivot-homepage') return 1;

            const indexA = defaultAppIndices.has(a.id) ? defaultAppIndices.get(a.id)! : -1;
            const indexB = defaultAppIndices.has(b.id) ? defaultAppIndices.get(b.id)! : -1;

            if (indexA !== -1 && indexB !== -1) return indexA - indexB; // Both default: sort by default order
            if (indexA !== -1) return -1; // Only A is default: A comes first
            if (indexB !== -1) return 1;  // Only B is default: B comes first
            return 0; // Neither default: keep original order
        });

        // Check if the order actually changed (simple check not perfect but okay for "hasUpdates" flag which saves to storage)
        // Since we re-sorted, we should probably save if there were any changes or if we messed with the array. 
        // Ideally we compare JSON stringified versions or just assume verification is enough.
        // However, `hasUpdates` controls saving. If we just sorted, we might want to save the new order.
        // Let's assume sorting means we should save to enforce it for the future.
        if (updatedApps.some((app, i) => app.id !== parsedApps[i]?.id)) {
            hasUpdates = true;
        }

        if (hasUpdates) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApps));
        }

        return updatedApps;
    } catch (e) {
        console.error('Failed to parse apps from storage', e);
        return [];
    }
};

export const saveApp = (app: App): App[] => {
    const apps = getApps();
    const existingIndex = apps.findIndex((a) => a.id === app.id);

    let newApps;
    if (existingIndex >= 0) {
        // Update
        newApps = [...apps];
        newApps[existingIndex] = app;
    } else {
        // Add
        newApps = [app, ...apps]; // Add to top
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    return newApps;
};

export const deleteApp = (id: string): App[] => {
    const apps = getApps();
    const newApps = apps.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newApps));
    return newApps;
};
