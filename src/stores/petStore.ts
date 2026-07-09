import { create } from 'zustand';

type PetMood = 'idle' | 'bouncing' | 'delivering';
type PetCharacter = 'active' | 'calm';
type PetSkin = 'deer' | 'fish' | 'cat';

interface PetState {
  visible: boolean;
  mood: PetMood;
  character: PetCharacter;
  skin: PetSkin;
  hasNotification: boolean;
  briefingCard: boolean;
  briefingData: { title: string; content: string; time: string } | null;
  setMood: (mood: PetMood) => void;
  setCharacter: (char: PetCharacter) => void;
  setSkin: (skin: PetSkin) => void;
  setNotification: (has: boolean) => void;
  toggleBriefing: () => void;
  setBriefingData: (data: { title: string; content: string; time: string } | null) => void;
  setVisible: (v: boolean) => void;
}

export const usePetStore = create<PetState>((set) => ({
  visible: true,
  mood: 'idle',
  character: 'active',
  skin: 'deer',
  hasNotification: false,
  briefingCard: false,
  briefingData: null,

  setMood: (mood) => set({ mood }),
  setCharacter: (character) => set({ character }),
  setSkin: (skin) => set({ skin }),
  setNotification: (hasNotification) => {
    set({ hasNotification });
    if (hasNotification) set({ mood: 'bouncing' });
  },
  toggleBriefing: () => set((s) => ({ briefingCard: !s.briefingCard, mood: s.briefingCard ? 'idle' : 'delivering', hasNotification: false })),
  setBriefingData: (data) => set({ briefingData: data }),
  setVisible: (visible) => set({ visible }),
}));