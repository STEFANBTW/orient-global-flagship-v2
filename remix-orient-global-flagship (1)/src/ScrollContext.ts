import React from 'react';

export interface ScrollContextType {
 scrollContainerRef: React.RefObject<HTMLDivElement> | null;
 activeSectionId: string | null;
 setActiveSectionId: (id: string | null) => void;
 currentSectionIndex: number;
 setCurrentSectionIndex: (index: number) => void;
 scrollDirection: 'up' | 'down';
 setScrollDirection: (dir: 'up' | 'down') => void;
}

export const ScrollContext = React.createContext<ScrollContextType>({
 scrollContainerRef: null,
 activeSectionId: null,
 setActiveSectionId: () => {},
 currentSectionIndex: 0,
 setCurrentSectionIndex: () => {},
 scrollDirection: 'down',
 setScrollDirection: () => {},
});
