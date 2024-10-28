// lib/types.ts

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    status: string;
  }
  
  export interface EventCategory {
    category: string;
    subCategory?: string; // Ajout de la propriété subCategory optionnelle
    color: string;
    emoji: string;
  }
