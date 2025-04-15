import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAuthStore = create<
  AuthState & {
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    resetPassword: (email: string) => Promise<void>;
  }
>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock validation
          if (email === 'demo@example.com' && password === 'password') {
            set({
              user: {
                id: '1',
                name: 'Demo Kullanıcı',
                email: 'demo@example.com',
              },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              error: 'Geçersiz e-posta veya şifre',
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: 'Giriş yapılırken bir hata oluştu',
            isLoading: false,
          });
        }
      },
      
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock registration
          set({
            user: {
              id: '2',
              name,
              email,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: 'Kayıt olurken bir hata oluştu',
            isLoading: false,
          });
        }
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
      
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock password reset
          set({ isLoading: false });
          return Promise.resolve();
        } catch (error) {
          set({
            error: 'Şifre sıfırlanırken bir hata oluştu',
            isLoading: false,
          });
          return Promise.reject(error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);