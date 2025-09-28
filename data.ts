
import type { User, Story, Artwork } from './types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'Amelia_Writes',
    profilePicture: 'https://picsum.photos/seed/user1/200/200',
    following: ['user-2'],
    followers: ['user-3'],
  },
  {
    id: 'user-2',
    username: 'BenTheBard',
    profilePicture: 'https://picsum.photos/seed/user2/200/200',
    following: [],
    followers: ['user-1', 'user-3'],
  },
  {
    id: 'user-3',
    username: 'CreativeCora',
    profilePicture: 'https://picsum.photos/seed/user3/200/200',
    following: ['user-1', 'user-2'],
    followers: [],
  },
];

export const mockStories: Story[] = [
  {
    id: 'story-1',
    title: 'The Clockwork City',
    content: `In the heart of a forgotten desert, the Clockwork City ticked on, its gears grinding a symphony of forgotten time. Elara, a scavenger with gears for eyes, was the only one who dared to venture inside. She sought the city's heart, a legendary power source said to grant a single wish. The journey was perilous, guarded by automatons of brass and steam, their movements as precise as the city's grand clock tower. Each tick echoed in the silence, a constant reminder that time was both her enemy and her guide. She navigated the intricate pathways, solved riddles etched in rust, and outsmarted guardians who had not seen a human in centuries. Finally, she stood before the heart, a pulsating orb of light, and whispered her wish not for treasure, but for the city to feel the sun once more.`,
    coverImage: 'https://picsum.photos/seed/story1/800/600',
    authorId: 'user-1',
    ratings: [{ userId: 'user-2', score: 8 }, { userId: 'user-3', score: 9 }],
    likes: ['user-2', 'user-3'],
  },
  {
    id: 'story-2',
    title: 'Whispers of the Deep',
    content: `The ocean's whispers were not of wind and waves, but of ancient secrets. Kael, a lighthouse keeper with a past as murky as the depths, heard them every night. They spoke of a sunken kingdom and a cursed crown. Drawn by the siren call of adventure, he built a submersible from salvaged parts and plunged into the abyss. Bioluminescent creatures illuminated his path, revealing a world of breathtaking and terrifying beauty. He found the kingdom, a majestic ruin guarded by the ghosts of its drowned citizens. At its center, on a throne of coral, sat the crown. As he reached for it, the whispers intensified, warning him that some secrets are best left submerged. He chose to listen, leaving the crown and its curse behind, returning to his lighthouse with a story no one would ever believe.`,
    coverImage: 'https://picsum.photos/seed/story2/800/600',
    authorId: 'user-2',
    ratings: [{ userId: 'user-1', score: 10 }],
    likes: ['user-1', 'user-3'],
  },
  {
    id: 'story-3',
    title: 'The Star-Painter\'s Apprentice',
    content: `In a world where stars were painted into the sky each night, old Orion was the master Star-Painter. His apprentice, a young girl named Lyra, was more curious than skilled. One night, she wondered what would happen if she used a color not from Orion's palette. She found a pigment made from a fallen moon-petal, a shimmering silver that glowed with an inner light. While Orion slept, she painted a new constellation, a swirling, dancing fox. The world awoke to a sky they had never seen. The fox seemed to leap between the other stars, its silver light bringing dreams of joy and wonder to those below. Orion was not angry; he was proud. He knew the sky was now in the hands of an artist who painted not just with light, but with imagination.`,
    coverImage: 'https://picsum.photos/seed/story3/800/600',
    authorId: 'user-1',
    ratings: [{ userId: 'user-3', score: 7 }],
    likes: ['user-2'],
  },
  {
    id: 'story-4',
    title: 'The Last Bookstore',
    content: `It was called 'The Last Bookstore,' and it was the only place in the city where stories still lived on paper. The owner, a man named Silas, was as ancient as his collection. He knew every book not by its title, but by the soul of its story. One day, a tech-baron offered him a fortune to digitize his collection and tear the store down. Silas refused. He believed that the feel of a page, the smell of old paper, was part of the magic. To prove it, he challenged the baron to find a story on his endless data streams that could make him cry. The baron searched for days, through terabytes of data, but found nothing. Then Silas handed him a worn copy of a children's book. The baron read, and as the simple tale of a lost toy unfolded, a tear traced a path down his cheek. The bookstore was saved, a bastion of paper and ink in a world of pixels and code.`,
    coverImage: 'https://picsum.photos/seed/story4/800/600',
    authorId: 'user-3',
    ratings: [{ userId: 'user-1', score: 9 }, { userId: 'user-2', score: 9 }],
    likes: ['user-1', 'user-2'],
  },
];

export const mockArtworks: Artwork[] = [
  {
    id: 'art-1',
    title: 'Clockwork City Blueprint',
    description: 'An early concept sketch for the main city from my story.',
    imageUrl: 'https://picsum.photos/seed/art1/800/1200',
    authorId: 'user-1',
    likes: ['user-2', 'user-3'],
  },
  {
    id: 'art-2',
    title: 'The Drowned King',
    description: 'A portrait of the cursed king from "Whispers of the Deep".',
    imageUrl: 'https://picsum.photos/seed/art2/1000/800',
    authorId: 'user-2',
    likes: ['user-1'],
  },
  {
    id: 'art-3',
    title: 'The Silver Fox Constellation',
    description: 'How I imagined Lyra\'s creation in the night sky.',
    imageUrl: 'https://picsum.photos/seed/art3/1200/800',
    authorId: 'user-1',
    likes: ['user-3'],
  },
];
