export interface PreferencesState {
    theme: 'light' | 'dark';
  }
  
  export interface RootState {
    preferences: PreferencesState;
  }
  