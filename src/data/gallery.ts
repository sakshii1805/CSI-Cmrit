import { GalleryItem } from '../types';

export const mockGallery: GalleryItem[] = [
  {
    id: 'hl-avishkaar-poster',
    title: 'Official AVISHKAAR 2026 Hackathon Poster',
    category: 'Hackathons',
    date: '2026-09-22',
    event_date: '2026-09-22',
    imageUrl: '/images/avishkaar_poster.jpg',
    image_url: '/images/avishkaar_poster.jpg',
    images: [
      '/images/avishkaar_poster.jpg',
      '/images/avishkar_promo_! (1).png',
      '/images/avishkar_promo_! (2).png',
      '/images/avishkar_promo_! (3).png'
    ],
    description: 'Full event poster: Preliminary Round on 26 Sept 2026, Grand Finale on 9-10 Oct 2026 with 20 pre-selected industry problem statements.',
    caption: 'Full event poster: Preliminary Round on 26 Sept 2026, Grand Finale on 9-10 Oct 2026 with 20 pre-selected industry problem statements.',
    is_published: true,
    status: 'published',
    created_at: '2026-09-22T10:00:00.000Z',
    updated_at: '2026-09-22T10:00:00.000Z'
  }
];

export const chapterHighlights: GalleryItem[] = mockGallery;
export default mockGallery;
