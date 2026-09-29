export enum AppView {
 LANDING = 'LANDING',
 PROFILE = 'PROFILE',
 ARENA = 'ARENA',
 TOURNAMENT = 'TOURNAMENT',
 HARDWARE = 'HARDWARE',
 VR = 'VR',
 ODYSSEY = 'ODYSSEY'
}

export interface NavItem {
 id: AppView;
 label: string;
 icon: string;
}
