/**
 * Clients Native Media has worked with, shown with the logos the owner supplied.
 * plate: 'light' for logos drawn in dark colours, 'dark' for logos with white lettering, 'navy' for the Afromark logo, which is drawn on its own navy background.
 * Add a client: put the logo file in src/assets/clients and add a line here.
 */
import afp from '../assets/clients/afp.svg';
import afromark from '../assets/clients/afromark-communication.png';
import audience from '../assets/clients/audience-agency.png';
import fern from '../assets/clients/fern-marketing.svg';
import hesa from '../assets/clients/hesa-africa.png';
import redhill from '../assets/clients/redhill.svg';
import standard from '../assets/clients/the-standard.webp';
import ubunix from '../assets/clients/ubunix.png';
import africaPrWeek from '../assets/clients/africa-pr-week.png';
import commsAvenue from '../assets/clients/the-comms-avenue.png';

export const clients: { name: string; logo: ImageMetadata; plate: 'light' | 'dark' | 'navy' }[] = [
  { name: 'AFP', logo: afp, plate: 'light' },
  { name: 'Afromark Communication', logo: afromark, plate: 'navy' },
  { name: 'Audience Agency', logo: audience, plate: 'dark' },
  { name: 'Fern Marketing', logo: fern, plate: 'dark' },
  { name: 'Hesa Africa', logo: hesa, plate: 'light' },
  { name: 'Redhill', logo: redhill, plate: 'light' },
  { name: 'The Standard', logo: standard, plate: 'light' },
  { name: 'Ubunix', logo: ubunix, plate: 'light' },
  { name: 'Africa PR Week', logo: africaPrWeek, plate: 'dark' },
  { name: 'The Comms Avenue', logo: commsAvenue, plate: 'light' },
];
