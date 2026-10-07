/**
 * Clients Native Media has worked with, shown with the logos the owner supplied.
 * plate: 'light' for logos drawn in dark colours, 'dark' for logos with white lettering.
 * Add a client: put the logo file in src/assets/clients and add a line here.
 */
import afp from '../assets/clients/afp.svg';
import afromark from '../assets/clients/afromark-communication.png';
import audience from '../assets/clients/audience-agency.png';
import fern from '../assets/clients/fern-marketing.svg';
import hesa from '../assets/clients/hesa-africa.png';
import redhill from '../assets/clients/redhill.svg';
import standard from '../assets/clients/the-standard.webp';

export const clients: { name: string; logo: ImageMetadata; plate: 'light' | 'dark' }[] = [
  { name: 'AFP', logo: afp, plate: 'light' },
  { name: 'Afromark Communication', logo: afromark, plate: 'light' },
  { name: 'Audience Agency', logo: audience, plate: 'dark' },
  { name: 'Fern Marketing', logo: fern, plate: 'dark' },
  { name: 'Hesa Africa', logo: hesa, plate: 'light' },
  { name: 'Redhill', logo: redhill, plate: 'light' },
  { name: 'The Standard', logo: standard, plate: 'light' },
];
