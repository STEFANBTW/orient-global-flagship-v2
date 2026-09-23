import React from 'react';

export interface SectionContextType {
 index: number;
 isActive: boolean;
}

export const SectionContext = React.createContext<SectionContextType>({
 index: -1,
 isActive: false,
});
