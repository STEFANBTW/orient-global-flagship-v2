import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'UNIJOS Campus Navigator',
      searchPlaceholder: 'Search faculties, blocks, hostels...',
      searchBtn: 'Search',
      campusMain: 'Main Campus',
      campusNew: 'New Campus (Permanent Site)',
      switchCampus: 'Switch Campus',
      directions: 'Directions',
      origin: 'Start Point',
      destination: 'Destination',
      routeWalking: 'Walking',
      routeVehicle: 'Driving / Keke',
      findMe: 'Find Me',
      accessibleOnly: 'Wheelchair Accessible Routes',
      accessibleEntrance: 'Accessible Entrances',
      accessibleBathroom: 'Accessible Bathrooms',
      clearRoute: 'Clear Route',
      buildingInfo: 'Building Details',
      category: 'Category',
      floors: 'Floors',
      accessibility: 'Accessibility Support',
      description: 'Description',
      close: 'Close',
      notAvailable: 'Not Available',
      distance: 'Distance',
      time: 'Estimated Time',
      mins: 'mins',
      meters: 'm'
    }
  },
  ha: {
    translation: {
      appName: 'Jami\'ar Jos Campus Navigator',
      searchPlaceholder: 'Nemi makarantu, dakuna, masauki...',
      searchBtn: 'Nema',
      campusMain: 'Main Campus',
      campusNew: 'Sabuwar Campus (Permanent Site)',
      switchCampus: 'Canza Campus',
      directions: 'Kwatance',
      origin: 'Farkon Kwatance',
      destination: 'Inda Za a Je',
      routeWalking: 'Tafiya da Kafa',
      routeVehicle: 'Mota / Keke Napep',
      findMe: 'Nemo Ni',
      accessibleOnly: 'Hanyoyin Keke na Masu Buƙata',
      accessibleEntrance: 'Mashigar Masu Buƙata',
      accessibleBathroom: 'Bandaki na Masu Buƙata',
      clearRoute: 'Share Kwatance',
      buildingInfo: 'Bayanin Ginin',
      category: 'Rukuni',
      floors: 'Hawa',
      accessibility: 'Goyon Bayan Masu Buƙata',
      description: 'Bayanai',
      close: 'Kulle',
      notAvailable: 'Babu shi',
      distance: 'Nisa',
      time: 'Lokacin Tafiya',
      mins: 'minti',
      meters: 'mita'
    }
  },
  yo: {
    translation: {
      appName: 'UNIJOS Campus Navigator',
      searchPlaceholder: 'Wa awọn ẹka, awọn bulọọku, awọn ile...',
      searchBtn: 'Wa',
      campusMain: 'Main Campus',
      campusNew: 'Campus Tuntun (Permanent Site)',
      switchCampus: 'Yi Campus Pada',
      directions: 'Awọn Itọsọna',
      origin: 'Ojuami Bẹrẹ',
      destination: 'Ibi ti o Nlo',
      routeWalking: 'Rin pẹlu Ẹsẹ',
      routeVehicle: 'Mọto / Keke Marwa',
      findMe: 'Wa mi',
      accessibleOnly: 'Awọn Huna fun Kẹkẹ Awọn Ailagbara',
      accessibleEntrance: 'Awọn Ẹnu-ọna fun Ailagbara',
      accessibleBathroom: 'Awọn Baluwe fun Ailagbara',
      clearRoute: 'Pa Itọsọna Rẹ',
      buildingInfo: 'Awọn alaye Ile',
      category: 'Ẹka',
      floors: 'Awọn ilẹ ipakà',
      accessibility: 'Atilẹyin fun Awọn Ailagbara',
      description: 'Apejuwe',
      close: 'Pa a',
      notAvailable: 'Ko si fun lilo',
      distance: 'Ijinna',
      time: 'Akoko ti Afojusun',
      mins: 'iṣẹju',
      meters: 'mita'
    }
  },
  ig: {
    translation: {
      appName: 'UNIJOS Campus Navigator',
      searchPlaceholder: 'Chọọ ngalaba, hostel, ụlọ...',
      searchBtn: 'Chọọ',
      campusMain: 'Main Campus',
      campusNew: 'New Campus (Permanent Site)',
      switchCampus: 'Gbanwee Campus',
      directions: 'Ntuziaka',
      origin: 'Ebe Nmalite',
      destination: 'Ebe I Na-aga',
      routeWalking: 'Ije Ukwu',
      routeVehicle: 'Ụgbọala / Keke Napep',
      findMe: 'Chọta M',
      accessibleOnly: 'Ụzọ Keke Ndị Nwere Nkwarụ',
      accessibleEntrance: 'Ọnụ ụzọ Ndị Nwere Nkwarụ',
      accessibleBathroom: 'Ụlọ Ịsa ahụ Ndị Nwere Nkwarụ',
      clearRoute: 'Kpochapụ Ntuziaka',
      buildingInfo: 'Nkọwa Ụlọ',
      category: 'Ụdị',
      floors: 'Okpukpu ole',
      accessibility: 'Nkwado Maka Ndị Nwere Nkwarụ',
      description: 'Nkọwa',
      close: 'Mechie',
      notAvailable: 'Ọ dịghị',
      distance: 'Anya',
      time: 'Oge Ntụzịaka',
      mins: 'minti',
      meters: 'mita'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
