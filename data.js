// ===========================================
// data.js – Mock dáta pre autoumyvárne Umyj.to
// ===========================================

const umyvarne = [
  {
    id: 1,
    nazov: "AquaShine Bratislava",
    mesto: "Bratislava",
    adresa: "Mlynské nivy 45, Bratislava",
    typ: "automaticka",
    lat: 48.1455,
    lng: 17.1218,
    hodnotenie: 4.5,
    pocet_recenzii: 23,
    telefon: "+421 903 123 456",
    hodiny: "Po–Ne: 07:00–21:00",
    popis: "Moderná automatická umyváreň s bezkontaktnou technológiou. Šetríme vodu aj životné prostredie.",
    // --- NOVÉ POLIA ---
    platby: ["karta", "mince", "apple_pay"],
    cena_orientacna: "7 – 20 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: false,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: null,        // null = nie je samoobslužná
    max_vyska: "2.2 m",
    // ---
    cennik: [
      { sluzba: "Základné umytie",  cena: "7 €"  },
      { sluzba: "Kompletné umytie", cena: "12 €" },
      { sluzba: "Prémiový balíček", cena: "20 €" },
      { sluzba: "Vosk + leštenie",  cena: "15 €" }
    ]
  },
  {
    id: 2,
    nazov: "Čistý voz Košice",
    mesto: "Košice",
    adresa: "Južná trieda 78, Košice",
    typ: "rucna",
    lat: 48.7120,
    lng: 21.2580,
    hodnotenie: 4.8,
    pocet_recenzii: 41,
    telefon: "+421 055 678 9012",
    hodiny: "Po–Pi: 08:00–18:00, So: 09:00–15:00",
    popis: "Ručná umyváreň s dôrazom na detaily. Každé auto ošetrujeme s láskou a profesionalitou.",
    platby: ["karta", "hotovost"],
    cena_orientacna: "15 – 80 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     false,
      kartace:      false,
      vosk:         true,
      menička:      false
    },
    pocet_boxov: null,
    max_vyska: null,
    cennik: [
      { sluzba: "Exteriér ručne",   cena: "15 €" },
      { sluzba: "Interiér vysáv.",  cena: "10 €" },
      { sluzba: "Komplet int+ext",  cena: "22 €" },
      { sluzba: "Auto detailing",   cena: "80 €" }
    ]
  },
  {
    id: 3,
    nazov: "Self Wash Žilina",
    mesto: "Žilina",
    adresa: "Bytčická 12, Žilina",
    typ: "samoobsluzna",
    lat: 49.2215,
    lng: 18.7420,
    hodnotenie: 4.1,
    pocet_recenzii: 15,
    telefon: "+421 904 567 890",
    hodiny: "24/7",
    popis: "Samoobslužná umyváreň dostupná nonstop. 6 boxov s vysokotlakovým umývaním.",
    platby: ["mince"],
    cena_orientacna: "3 – 10 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     false,
      kartace:      true,
      vosk:         false,
      menička:      true
    },
    pocet_boxov: 6,
    max_vyska: "2.5 m",
    cennik: [
      { sluzba: "1 min umývania",  cena: "0.80 €" },
      { sluzba: "Žetón 5 min",     cena: "3 €"    },
      { sluzba: "Žetón 10 min",    cena: "5.50 €" },
      { sluzba: "Vysávač (5 min)", cena: "1 €"    }
    ]
  },
  {
    id: 4,
    nazov: "Bleskové umývanie Nitra",
    mesto: "Nitra",
    adresa: "Štefánikova trieda 1, Nitra",
    typ: "automaticka",
    lat: 48.3050,
    lng: 18.0850,
    hodnotenie: 3.9,
    pocet_recenzii: 8,
    telefon: "+421 907 234 567",
    hodiny: "Po–So: 07:00–20:00",
    popis: "Rýchle automatické umývanie v centre Nitry. Ideálne pre zaneprázdnených motoristov.",
    platby: ["karta", "mince"],
    cena_orientacna: "6 – 16 €",
    vybavenie: {
      vysavac:      false,
      aktivna_pena: false,
      osusovac:     true,
      kartace:      false,
      vosk:         false,
      menička:      false
    },
    pocet_boxov: null,
    max_vyska: "2.1 m",
    cennik: [
      { sluzba: "Quick Wash",    cena: "6 €"  },
      { sluzba: "Standard Wash", cena: "10 €" },
      { sluzba: "Full Wash",     cena: "16 €" }
    ]
  },
  {
    id: 5,
    nazov: "Premium Car Spa Trnava",
    mesto: "Trnava",
    adresa: "Priemyselná 8, Trnava",
    typ: "rucna",
    lat: 48.3760,
    lng: 17.5880,
    hodnotenie: 4.7,
    pocet_recenzii: 32,
    telefon: "+421 908 345 678",
    hodiny: "Po–Pi: 07:30–19:00, So: 08:00–16:00",
    popis: "Prémiová ručná umyváreň s certifikovanými produktmi. Špecializujeme sa na luxusné vozidlá.",
    platby: ["karta", "hotovost", "apple_pay", "google_pay"],
    cena_orientacna: "18 – 150 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      false
    },
    pocet_boxov: null,
    max_vyska: null,
    cennik: [
      { sluzba: "Základný ext.",      cena: "18 €"  },
      { sluzba: "Komplet starostl.",   cena: "35 €"  },
      { sluzba: "Nano ochrana",        cena: "60 €"  },
      { sluzba: "Keramická ochrana",   cena: "150 €" }
    ]
  },
  {
    id: 6,
    nazov: "Eco Wash Banská Bystrica",
    mesto: "Banská Bystrica",
    adresa: "Mládežnícka 25, Banská Bystrica",
    typ: "samoobsluzna",
    lat: 48.7380,
    lng: 19.1520,
    hodnotenie: 4.3,
    pocet_recenzii: 19,
    telefon: "+421 915 456 789",
    hodiny: "24/7",
    popis: "Ekologická samoobslužná umyváreň. Používame biologicky rozložiteľné čistiace prostriedky.",
    platby: ["mince", "karta"],
    cena_orientacna: "2.50 – 8 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     false,
      kartace:      true,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: 4,
    max_vyska: "2.8 m",
    cennik: [
      { sluzba: "Zákl. umytie (5 min)", cena: "2.50 €" },
      { sluzba: "Rozšírené (10 min)",   cena: "4.50 €" },
      { sluzba: "Vysávač",              cena: "1.50 €" }
    ]
  },
  {
    id: 7,
    nazov: "Turbo Wash Prešov",
    mesto: "Prešov",
    adresa: "Košická 44, Prešov",
    typ: "automaticka",
    lat: 48.9980,
    lng: 21.2400,
    hodnotenie: 4.0,
    pocet_recenzii: 12,
    telefon: "+421 917 567 890",
    hodiny: "Po–Ne: 06:00–22:00",
    popis: "Moderná automatická umyváreň pri čerpacej stanici. Tankuj a umy v jednej zastávke!",
    platby: ["karta", "mince", "hotovost"],
    cena_orientacna: "5 – 13 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: false,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: null,
    max_vyska: "2.0 m",
    cennik: [
      { sluzba: "Mini Wash",  cena: "5 €"  },
      { sluzba: "Maxi Wash",  cena: "9 €"  },
      { sluzba: "Super Wash", cena: "13 €" },
      { sluzba: "Interiér",   cena: "8 €"  }
    ]
  },
  {
    id: 8,
    nazov: "Svet čistých áut Bratislava",
    mesto: "Bratislava",
    adresa: "Dúbravská cesta 14, Bratislava",
    typ: "rucna",
    lat: 48.1680,
    lng: 17.0530,
    hodnotenie: 4.6,
    pocet_recenzii: 56,
    telefon: "+421 903 789 012",
    hodiny: "Po–So: 08:00–18:00",
    popis: "Najlepšia ručná umyváreň v Bratislave podľa hodnotení zákazníkov tri roky po sebe.",
    platby: ["karta", "hotovost", "apple_pay"],
    cena_orientacna: "20 – 90 €",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      false
    },
    pocet_boxov: null,
    max_vyska: null,
    cennik: [
      { sluzba: "Zákl. ext. ručne",   cena: "20 €" },
      { sluzba: "Komplet int.+ext.",   cena: "35 €" },
      { sluzba: "Prém. detailing",     cena: "90 €" },
      { sluzba: "Ozonová dezinf.",     cena: "25 €" }
    ]
  },

  // ==========================================
  // ČESKÁ REPUBLIKA
  // ==========================================

  {
    id: 9,
    nazov: "AutoSpa Praha Holešovice",
    mesto: "Praha",
    adresa: "Komunardů 36, Praha 7",
    typ: "automaticka",
    lat: 50.1020,
    lng: 14.4480,
    hodnotenie: 4.4,
    pocet_recenzii: 38,
    telefon: "+420 777 123 456",
    hodiny: "Po–Ne: 07:00–22:00",
    popis: "Moderní automatická myčka v centru Prahy. Bezkontaktní technologie, ekologické prostředky, rychlé obsloužení.",
    platby: ["karta", "apple_pay", "google_pay"],
    cena_orientacna: "190 – 490 Kč",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: null,
    max_vyska: "2.3 m",
    cennik: [
      { sluzba: "Základní mytí",   cena: "190 Kč" },
      { sluzba: "Kompletní mytí",  cena: "290 Kč" },
      { sluzba: "Premium balíček", cena: "490 Kč" },
      { sluzba: "Vosk + leštění",  cena: "350 Kč" }
    ]
  },
  {
    id: 10,
    nazov: "Čistý vůz Brno",
    mesto: "Brno",
    adresa: "Vídeňská 89, Brno",
    typ: "rucna",
    lat: 49.1680,
    lng: 16.6100,
    hodnotenie: 4.7,
    pocet_recenzii: 29,
    telefon: "+420 775 987 654",
    hodiny: "Po–Pi: 08:00–17:00, So: 09:00–14:00",
    popis: "Profesionální ruční mytí aut v Brně. Specializujeme se na luxusní vozy a auto detailing.",
    platby: ["karta", "hotovost"],
    cena_orientacna: "250 – 1 200 Kč",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      false
    },
    pocet_boxov: null,
    max_vyska: null,
    cennik: [
      { sluzba: "Exteriér ručně",    cena: "250 Kč"   },
      { sluzba: "Komplet int.+ext.", cena: "450 Kč"   },
      { sluzba: "Nano ochrana",      cena: "750 Kč"   },
      { sluzba: "Auto detailing",    cena: "1 200 Kč" }
    ]
  },
  {
    id: 11,
    nazov: "Self Wash Ostrava",
    mesto: "Ostrava",
    adresa: "Místecká 330, Ostrava-Hrabová",
    typ: "samoobsluzna",
    lat: 49.7930,
    lng: 18.2510,
    hodnotenie: 4.0,
    pocet_recenzii: 14,
    telefon: "+420 596 123 789",
    hodiny: "24/7",
    popis: "Samoobslužná myčka dostupná nonstop. 5 boxů s vysokotlakým mytím a aktivní pěnou.",
    platby: ["mince", "karta"],
    cena_orientacna: "50 – 150 Kč",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     false,
      kartace:      true,
      vosk:         false,
      menička:      true
    },
    pocet_boxov: 5,
    max_vyska: "2.6 m",
    cennik: [
      { sluzba: "1 min mytí",      cena: "15 Kč" },
      { sluzba: "Žeton 5 min",     cena: "60 Kč" },
      { sluzba: "Žeton 10 min",    cena: "110 Kč"},
      { sluzba: "Vysavač (5 min)", cena: "20 Kč" }
    ]
  },
  {
    id: 12,
    nazov: "TopWash Plzeň",
    mesto: "Plzeň",
    adresa: "Rokycanská 15, Plzeň",
    typ: "automaticka",
    lat: 49.7480,
    lng: 13.3920,
    hodnotenie: 4.2,
    pocet_recenzii: 21,
    telefon: "+420 724 456 789",
    hodiny: "Po–So: 07:00–21:00",
    popis: "Rychlá automatická myčka u hlavní silnice v Plzni. Tankuj a umyj v jedné zastávce!",
    platby: ["karta", "mince", "hotovost"],
    cena_orientacna: "150 – 380 Kč",
    vybavenie: {
      vysavac:      false,
      aktivna_pena: false,
      osusovac:     true,
      kartace:      false,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: null,
    max_vyska: "2.2 m",
    cennik: [
      { sluzba: "Základní",  cena: "150 Kč" },
      { sluzba: "Standard",  cena: "250 Kč" },
      { sluzba: "Premium",   cena: "380 Kč" }
    ]
  },
  {
    id: 13,
    nazov: "Aqua Express Liberec",
    mesto: "Liberec",
    adresa: "Dr. Milady Horákové 5, Liberec",
    typ: "samoobsluzna",
    lat: 50.7680,
    lng: 15.0600,
    hodnotenie: 4.3,
    pocet_recenzii: 17,
    telefon: "+420 485 987 123",
    hodiny: "24/7",
    popis: "Moderní samoobslužná myčka v Liberci se 4 boxy. Přijímáme platební karty i mince.",
    platby: ["mince", "karta"],
    cena_orientacna: "40 – 120 Kč",
    vybavenie: {
      vysavac:      true,
      aktivna_pena: true,
      osusovac:     false,
      kartace:      false,
      vosk:         true,
      menička:      true
    },
    pocet_boxov: 4,
    max_vyska: "2.5 m",
    cennik: [
      { sluzba: "1 min mytí",   cena: "12 Kč" },
      { sluzba: "Žeton 5 min",  cena: "50 Kč" },
      { sluzba: "Žeton 10 min", cena: "90 Kč" },
      { sluzba: "Vysavač",      cena: "20 Kč" }
    ]
  }
];
