export const BRAND = {
  name: "Hamtunes Cakes & Bakes",
  legalName: "Hamtunes Cakes & Bakes",
  tagline: "Beautiful Cakes. Delicious Bakes. Made for Your Moments.",
  experienceYears: 16,
  foundedYear: 2010, // 16 years of baking experience
  phoneDisplay: "0904 957 1104",
  phoneTel: "tel:09049571104",
  whatsAppDisplay: "+234 803 397 6589",
  whatsAppNumber: "2348033976589",
  email: "hamtunescakesandbakes89@gmail.com",
  emailMailto: "mailto:hamtunescakesandbakes89@gmail.com",
  instagramHandle: "@hamtunescakes",
  instagramUrl: "https://www.instagram.com/hamtunescakes/",
  colors: {
    pink: "#F50057",
    pinkHover: "#D5004C",
    pinkLight: "#FFF0F5",
    chocolate: "#351207",
    chocolateDark: "#220B04",
    chocolateLight: "#5A2718",
    white: "#FFFFFF",
    ivory: "#FFF9F5",
    cream: "#F7EFE8",
    border: "#E8DDD7",
    muted: "#6F625C",
  },
};

export const DIVISIONS = {
  CAKES: "cakes",
  BAKES_AND_SMALL_CHOPS: "bakes_and_small_chops",
} as const;

export type DivisionType = (typeof DIVISIONS)[keyof typeof DIVISIONS];

export const CAKE_CATEGORIES = [
  { id: "all", label: "All Cakes" },
  { id: "birthday_cakes", label: "Birthday Cakes", description: "Vibrant, creative celebration cakes for all ages and milestones." },
  { id: "gifting_cakes", label: "Cakes for Gifting", description: "Thoughtful mini and bento cakes personalized for friends, partners, and colleagues." },
  { id: "cultural_cakes", label: "Cultural Celebration Cakes", description: "Traditional wedding, introduction, and heritage celebration designs." },
  { id: "custom_cakes", label: "Custom & Special Occasion Cakes", description: "Weddings, anniversaries, graduations, and tailored conceptual centerpieces." },
];

export const BAKES_CATEGORIES = [
  { id: "all", label: "All Bakes & Small Chops" },
  { id: "doughnuts", label: "Doughnuts", description: "Fluffy, glazed, sugar-dusted, and sprinkle-topped fresh doughnuts." },
  { id: "cupcakes", label: "Cupcakes", description: "Artisan decorated cupcakes with whipped buttercream and fondant toppers." },
  { id: "meat_pies", label: "Meat Pies & Hand Pies", description: "Flaky golden pastry filled with richly seasoned beef and savory potatoes." },
  { id: "sausage_rolls", label: "Sausage Rolls", description: "Crisp, golden puff pastry with spiced, juicy sausage filling." },
  { id: "small_chops", label: "Small Chops & Finger Foods", description: "Authentic Nigerian party favorites, puff-puff, spring rolls, samosas, and savory platters." },
  { id: "party_bulk", label: "Party & Bulk Orders", description: "Catered snack trays, gift boxes, and bulk pastries for gatherings and events." },
];

export const OCCASIONS = [
  { id: "birthday", title: "Celebrating a Birthday", division: "cakes", category: "birthday_cakes", icon: "Cake" },
  { id: "gifting", title: "Buying a Gift", division: "cakes", category: "gifting_cakes", icon: "Gift" },
  { id: "event", title: "Planning an Event / Gathering", division: "both", category: "party_bulk", icon: "Users" },
  { id: "baked_treats", title: "Want Fresh Baked Treats", division: "bakes_and_small_chops", category: "doughnuts", icon: "Coffee" },
  { id: "small_chops", title: "Need Party Small Chops", division: "bakes_and_small_chops", category: "small_chops", icon: "PartyPopper" },
  { id: "custom", title: "I Have a Custom Design", division: "cakes", category: "custom_cakes", icon: "Sparkles" },
];
