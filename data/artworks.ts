export interface Artwork {
  id: string;
  image: string;
  title: string;
  price: number;
  description?: string;
  artist?: string;
  year?: number;
  medium?: string;
  dimensions?: string;
}

export const artworks: Artwork[] = [
  {
    id: "1",
    image: "/img_01.jpg",
    title: "Color of Folks",
    price: 850,
    description: "A vibrant exploration of human connection through bold colors and expressive forms. This piece captures the essence of community and shared experiences.",
    artist: "Contemporary Artist",
    year: 2024,
    medium: "Acrylic on Canvas",
    dimensions: "60 x 80 cm"
  },
  {
    id: "2",
    image: "/img_02.jpg",
    title: "Abstract Dreams",
    price: 1200,
    description: "An ethereal composition that blurs the line between reality and imagination. This abstract work invites viewers to interpret their own narratives.",
    artist: "Contemporary Artist",
    year: 2024,
    medium: "Mixed Media",
    dimensions: "80 x 100 cm"
  },
  {
    id: "3",
    image: "/img_03.jpg",
    title: "Urban Symphony",
    price: 950,
    description: "A dynamic representation of city life, where architecture and movement converge in a harmonious visual rhythm.",
    artist: "Contemporary Artist",
    year: 2024,
    medium: "Oil on Canvas",
    dimensions: "70 x 90 cm"
  },
  {
    id: "4",
    image: "/img_04.jpg",
    title: "Nature's Whisper",
    price: 1100,
    description: "A serene meditation on the natural world, capturing the quiet beauty and subtle details of the environment around us.",
    artist: "Contemporary Artist",
    year: 2024,
    medium: "Watercolor on Paper",
    dimensions: "50 x 70 cm"
  }
];

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find(artwork => artwork.id === id);
}
