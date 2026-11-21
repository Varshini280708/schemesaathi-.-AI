import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { supabase, getDeviceUserId } from '@/lib/supabase';
import { fetchSchemes, Scheme } from '@/lib/schemeService';
import { SCHEMES as LOCAL_SCHEMES } from '@/data/schemes';

export type Lang = 'en' | 'te' | 'hi';
export type AppStatus = 'Not Started' | 'Preparing Documents' | 'Ready to Apply' | 'Applied';

export interface ChecklistState {
  [schemeId: string]: {
    items: { id: string; label: string; status: 'Needed' | 'Prepared' }[];
  };
}

export interface ApplicationState {
  [schemeId: string]: {
    status: AppStatus;
    completedSteps: number[];
    notes: string;
    addedDate: string;
    reminderOn: boolean;
  };
}

interface Stored {
  schemes: Scheme[];
  savedSchemes: string[];
  recentlyViewed: string[];
  checklists: ChecklistState;
  applications: ApplicationState;
  lang: Lang;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  highContrast: boolean;
}

const KEY = 'schemesaathi-state-v1';

const DEFAULT: Stored = {
  schemes: LOCAL_SCHEMES,
  savedSchemes: [],
  recentlyViewed: [],
  checklists: {},
  applications: {},
  lang: 'en',
  fontSize: 'medium',
  theme: 'light',
  highContrast: false,
};

function load(): Stored {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* corrupted storage resets to defaults */
  }
  return DEFAULT;
}

function useStoreInternal() {
  const [state, setState] = useState<Stored>(load);

  // Load the scheme catalog from the database on startup, falling back to
  // bundled mock data when the database is unreachable.
  useEffect(() => {
    let cancelled = false;
    fetchSchemes().then(({ schemes }) => {
      if (!cancelled && schemes.length > 0) {
        setState((s) => ({ ...s, schemes }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pull saved schemes and application progress for this device from the
  // database and merge over whatever localStorage already had.
  useEffect(() => {
    let cancelled = false;
    const deviceId = getDeviceUserId();
    (async () => {
      const [savedRes, appsRes] = await Promise.all([
        supabase.from('saved_schemes').select('scheme_id').eq('device_user_id', deviceId),
        supabase.from('applications').select('*').eq('device_user_id', deviceId),
      ]);
      if (cancelled) return;
      const savedIds = savedRes.data?.map((r) => r.scheme_id) ?? [];
      const apps: ApplicationState = {};
      for (const row of appsRes.data ?? []) {
        apps[row.scheme_id] = {
          status: row.status as ApplicationState[string]['status'],
          completedSteps: row.completed_steps ?? [],
          notes: row.notes ?? '',
          addedDate: row.added_date ?? '',
          reminderOn: row.reminder_on ?? false,
        };
      }
      setState((s) => ({
        ...s,
        savedSchemes: savedIds.length > 0 ? savedIds : s.savedSchemes,
        applications: Object.keys(apps).length > 0 ? apps : s.applications,
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable; app still works in-memory */
    }
  }, [state]);

  const toggleSaved = useCallback((id: string) => {
    setState((s) => {
      const isSaved = s.savedSchemes.includes(id);
      const deviceId = getDeviceUserId();
      if (isSaved) {
        supabase
          .from('saved_schemes')
          .delete()
          .eq('device_user_id', deviceId)
          .eq('scheme_id', id)
          .then(() => {}, () => {});
      } else {
        supabase
          .from('saved_schemes')
          .insert({ device_user_id: deviceId, scheme_id: id })
          .then(() => {}, () => {});
      }
      return {
        ...s,
        savedSchemes: isSaved ? s.savedSchemes.filter((x) => x !== id) : [...s.savedSchemes, id],
      };
    });
  }, []);

  const addRecent = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      recentlyViewed: [id, ...s.recentlyViewed.filter((x) => x !== id)].slice(0, 5),
    }));
  }, []);

  const getChecklist = useCallback(
    (schemeId: string, requiredDocs: string[]): ChecklistState[string] => {
      const existing = state.checklists[schemeId];
      if (existing) return existing;
      return {
        items: requiredDocs.map((doc, i) => ({
          id: `doc-${i}`,
          label: doc,
          status: 'Needed' as const,
        })),
      };
    },
    [state.checklists]
  );

  const updateChecklist = useCallback(
    (schemeId: string, items: ChecklistState[string]['items']) => {
      setState((s) => {
        const deviceId = getDeviceUserId();
        supabase
          .from('checklist_items')
          .upsert(
            items.map((item, i) => ({
              device_user_id: deviceId,
              scheme_id: schemeId,
              label: item.label,
              is_prepared: item.status === 'Prepared',
              sort_order: i,
            })),
            { onConflict: 'device_user_id,scheme_id,label' }
          )
          .then(() => {}, () => {});
        return {
          ...s,
          checklists: { ...s.checklists, [schemeId]: { items } },
        };
      });
    },
    []
  );

  const resetChecklist = useCallback((schemeId: string, requiredDocs: string[]) => {
    setState((s) => ({
      ...s,
      checklists: {
        ...s.checklists,
        [schemeId]: {
          items: requiredDocs.map((doc, i) => ({
            id: `doc-${i}`,
            label: doc,
            status: 'Needed' as const,
          })),
        },
      },
    }));
  }, []);

  const getApplication = useCallback(
    (schemeId: string): ApplicationState[string] => {
      return (
        state.applications[schemeId] ?? {
          status: 'Not Started' as AppStatus,
          completedSteps: [],
          notes: '',
          addedDate: new Date().toISOString().slice(0, 10),
          reminderOn: false,
        }
      );
    },
    [state.applications]
  );

  const updateApplication = useCallback((schemeId: string, patch: Partial<ApplicationState[string]>) => {
    setState((s) => {
      const existing = s.applications[schemeId] ?? {
        status: 'Not Started' as AppStatus,
        completedSteps: [],
        notes: '',
        addedDate: new Date().toISOString().slice(0, 10),
        reminderOn: false,
      };
      const next = { ...existing, ...patch };
      const deviceId = getDeviceUserId();
      supabase
        .from('applications')
        .upsert(
          {
            device_user_id: deviceId,
            scheme_id: schemeId,
            status: next.status,
            completed_steps: next.completedSteps,
            notes: next.notes,
            reminder_on: next.reminderOn,
            added_date: next.addedDate,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'device_user_id,scheme_id' }
        )
        .then(() => {}, () => {});
      return {
        ...s,
        applications: { ...s.applications, [schemeId]: next },
      };
    });
  }, []);

  const setLang = useCallback((lang: Lang) => setState((s) => ({ ...s, lang })), []);
  const setFontSize = useCallback((fontSize: 'small' | 'medium' | 'large') => setState((s) => ({ ...s, fontSize })), []);
  const setTheme = useCallback((theme: 'light' | 'dark') => setState((s) => ({ ...s, theme })), []);
  const setHighContrast = useCallback((highContrast: boolean) => setState((s) => ({ ...s, highContrast })), []);

  return {
    ...state,
    toggleSaved,
    addRecent,
    getChecklist,
    updateChecklist,
    resetChecklist,
    getApplication,
    updateApplication,
    setLang,
    setFontSize,
    setTheme,
    setHighContrast,
  };
}

type Store = ReturnType<typeof useStoreInternal>;
const StoreCtx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreInternal();
  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useSchemes(): Scheme[] {
  return useStore().schemes;
}
