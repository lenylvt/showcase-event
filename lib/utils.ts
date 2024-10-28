import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventCategory } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type pour représenter un événement avec ses sous-catégories
interface EventPattern {
  mainCategory: string;
  subCategories: string[];
  color: string;
  emoji: string;
}

// Base de connaissance des événements
const eventPatterns: EventPattern[] = [
  {
    mainCategory: 'Xbox',
    subCategories: ['Showcase', 'Games Showcase', 'ID@Xbox', 'Inside Xbox'],
    color: 'border-green-500',
    emoji: '🎮'
  },
  {
    mainCategory: 'PlayStation',
    subCategories: ['State of Play', 'Showcase'],
    color: 'border-blue-500',
    emoji: '🎮'
  },
  {
    mainCategory: 'Nintendo',
    subCategories: ['Direct', 'Treehouse'],
    color: 'border-red-500',
    emoji: '🎮'
  },
  {
    mainCategory: 'Game Awards',
    subCategories: ['Summer Game Fest', 'The Game Awards', 'Gamescom'],
    color: 'border-yellow-500',
    emoji: '🏆'
  },
  {
    mainCategory: 'Gamescom',
    subCategories: ['Opening Night Live', 'Best of Show', 'Daily Show'],
    color: 'border-yellow-500',
    emoji: '🏆'
  },
  {
    mainCategory: 'Steam',
    subCategories: ['Next Fest', 'Game Festival', 'Digital'],
    color: 'border-purple-500',
    emoji: '🎪'
  },
  {
    mainCategory: 'Ubisoft',
    subCategories: ['Forward'],
    color: 'border-indigo-500',
    emoji: '🎲'
  }
];

// Fonction pour identifier les modèles de mots consécutifs
function findConsecutiveWords(title: string, words: string[]): boolean {
  const titleWords = title.toLowerCase().split(' ');
  const searchWords = words.map(w => w.toLowerCase());
  
  for (let i = 0; i <= titleWords.length - searchWords.length; i++) {
    const slice = titleWords.slice(i, i + searchWords.length);
    if (searchWords.every((word, index) => slice[index].includes(word))) {
      return true;
    }
  }
  return false;
}

export function categorizeEvent(title: string): EventCategory {
  const lowerTitle = title.toLowerCase();
  
  // Parcourir tous les patterns d'événements
  for (const pattern of eventPatterns) {
    // Vérifier si le titre contient la catégorie principale
    if (lowerTitle.includes(pattern.mainCategory.toLowerCase())) {
      // Chercher des sous-catégories
      for (const subCategory of pattern.subCategories) {
        if (findConsecutiveWords(title, subCategory.split(' '))) {
          return {
            category: pattern.mainCategory,
            subCategory: subCategory,
            color: pattern.color,
            emoji: pattern.emoji
          };
        }
      }
      
      // Si aucune sous-catégorie n'est trouvée, retourner la catégorie principale
      return {
        category: pattern.mainCategory,
        color: pattern.color,
        emoji: pattern.emoji
      };
    }
  }
  
  // Détecter les mots qui apparaissent fréquemment ensemble
  const words = lowerTitle.split(' ');
  for (let i = 0; i < words.length - 1; i++) {
    const pair = `${words[i]} ${words[i + 1]}`;
    if (isCommonEventName(pair)) {
      return {
        category: toTitleCase(pair),
        color: 'border-gray-500',
        emoji: '🎯'
      };
    }
  }

  return { category: 'Other', color: 'border-gray-500', emoji: '🎯' };
}

// Fonction utilitaire pour convertir en titre
function toTitleCase(str: string): string {
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Cache pour stocker les noms d'événements fréquents
const eventNameCache = new Map<string, number>();

// Fonction pour détecter les noms d'événements fréquents
function isCommonEventName(wordPair: string): boolean {
  const count = eventNameCache.get(wordPair) || 0;
  eventNameCache.set(wordPair, count + 1);
  return count >= 2; // Si le même pair de mots apparaît plus de 2 fois
}

// Types mis à jour
export type { EventPattern };