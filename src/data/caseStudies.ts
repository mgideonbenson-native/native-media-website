/**
 * Case studies, written from the project case-study documents supplied by Native Media.
 * Wording follows those documents. Nothing here goes beyond what they state. Where a document says no audited
 * figures exist, the "measurement note" says so on the page.
 * To add one: add an entry below and put its photos in src/assets/cases.
 */
import dira1 from '../assets/cases/dira-launch.jpg';
import dira2 from '../assets/cases/dira-studio.jpg';
import dira3 from '../assets/cases/dira-media.jpg';
import un1 from '../assets/cases/uncdf-launch-stage.jpg';
import un2 from '../assets/cases/uncdf-launch-group.jpg';
import kcb1 from '../assets/cases/kcb-forum-stage.jpg';
import kcb2 from '../assets/cases/kcb-op-ed.jpg';
import kcb3 from '../assets/cases/kcb-forum-leaders.jpg';
import ec1 from '../assets/cases/ecooking-broadcast.jpg';
import ec2 from '../assets/cases/ecooking-testimonials.jpg';

export type Item = { title: string; text: string };
export type Section = {
  id: string; title: string;
  paragraphs?: string[];
  callout?: { label: string; title?: string; text: string };
  items?: Item[]; numbered?: boolean;
  stats?: { value: string; label: string }[];
  table?: { head: string[]; rows: string[][] };
  bullets?: string[];
  note?: { label: string; text: string };
  gallery?: { img: ImageMetadata; alt: string }[];
};
export type CaseStudy = {
  slug: string; title: string; sector: string; headline: string; summary: string;
  cover: ImageMetadata; coverAlt: string;
  facts: [string, string][];
  sections: Section[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dira-2050',
    title: 'DIRA 2050',
    sector: 'Public sector · National development planning',
    headline: 'Supporting the launch and public communication of Tanzania Development Vision 2050',
    summary: 'Native Media supported media understanding and visibility around DIRA 2050 by connecting journalists with government stakeholders, coordinating broadcast opportunities, and translating complex development priorities into clearer public-facing narratives.',
    cover: dira1, coverAlt: 'A speaker at a podium at the DIRA 2050 launch event',
    facts: [['Contracting partner', 'Ubunix Company Ltd'], ['Sector', 'Public sector / national development planning'], ['Geography', 'Tanzania'], ['Project period', 'April–May 2026']],
    sections: [
      { id: 'context', title: 'Context and framing', paragraphs: ['Native Media was initially engaged by the contractor earlier, in 2025, when stakeholder conversations began to launch the Vision in Dodoma.'], items: [
        { title: 'The ask', text: 'Support the launch and national visibility of Tanzania Development Vision 2050, while strengthening media and stakeholder understanding of the Vision so that its priorities could be communicated clearly and accurately to the wider public.' },
        { title: 'Strategic objective', text: 'Build strong public visibility around the launch while equipping media stakeholders with sufficient understanding of the Vision’s priorities, ambitions and implications to communicate them effectively to Tanzanian audiences.' },
        { title: 'Local intelligence', text: 'Native Media identified a gap between communications activity and narrative infrastructure. Multiple communication activities were being implemented, but there was limited execution of the overarching narrative architecture connecting the Vision’s priorities, stakeholders and public messaging. The communications environment was shaped by compressed timelines and a changing government and political calendar, requiring messages, media engagements and execution plans to be repeatedly adapted. This reinforced the need for a flexible, coordinated and intelligence-led communications approach rather than a sequence of stand-alone activities.' }] },
      { id: 'approach', title: 'Our approach', paragraphs: ['Native Media mapped and engaged relevant national and regional media outlets to strengthen both visibility and media understanding of the Vision. Working around engagements led by the Planning Commission, we supported media access and knowledge-building while creating stronger linkages between journalists and government stakeholders.'], numbered: true, items: [
        { title: 'Media intelligence and targeting', text: 'Identifying outlets with the relevance and audience profile to extend the Vision’s reach.' },
        { title: 'Stakeholder–media linkage', text: 'Coordinating access between journalists and government stakeholders for interviews and deeper explanation.' },
        { title: 'Message translation', text: 'Helping convert complex national-development priorities into clearer narratives that could travel through broadcast and digital media.' }] },
      { id: 'delivered', title: 'What we delivered', items: [
        { title: 'Media relations', text: 'Coordinated media interviews and facilitated engagement between journalists and government stakeholders.' },
        { title: 'Media tours and engagement', text: 'Supported structured media access and information-sharing around the Vision.' },
        { title: 'Launch visibility', text: 'Mobilised broadcast and digital coverage around the DIRA 2050 / Tanzania Development Vision 2050 communications period.' },
        { title: 'Message translation', text: 'Supported the conversion of complex policy and development priorities into more accessible media narratives.' }] },
      { id: 'message', title: 'The narrative', callout: { label: 'Central message', text: 'A central narrative was to position the private sector as a major driver of Tanzania’s long-term development ambitions under Vision 2050, reinforcing the importance of stronger private-sector participation in national economic transformation.' } },
      { id: 'results', title: 'Execution and results', paragraphs: ['The post-launch media engagement programme ran across April–May 2026 and combined long-form television interviews, regional radio coverage and social-media amplification. Coverage was distributed across Crown TV, TBC1, Star TV, ITV and Uvinza FM, with additional Instagram posts from Crown TV TZ and Uvinza FM.', 'The DIRA 2050 Media Coverage Report recorded the following outputs across television, radio and social media during April–May 2026.'],
        stats: [{ value: '9', label: 'Total placements' }, { value: 'TZS 69.9M', label: 'Reported AVE' }, { value: 'TZS 209.8M', label: 'Reported PR value' }, { value: '4', label: 'TV broadcasts' }, { value: '1', label: 'Radio broadcast' }, { value: '4', label: 'Instagram posts' }],
        table: { head: ['Channel', 'Placements', 'Airtime / output', 'AVE (TZS)', 'PR value (TZS)'], rows: [['Television', '4', '165 min 35 sec', '55,411,666', '166,234,998'], ['Radio', '1', '52 min 40 sec', '10,533,333', '31,599,999'], ['Social media', '4', '4 Instagram posts', '4,000,000', '12,000,000']] },
      },
      { id: 'shows', title: 'What the results show', paragraphs: ['The five television and radio placements together provided approximately 3 hours 38 minutes of broadcast airtime, calculated from the individual durations reported.'], bullets: [
        'Television delivered the largest share of reported media value, accounting for 79% of total AVE across four stations.',
        'The television interviews were long-form rather than brief mentions, with an average airtime of approximately 41 minutes per broadcast, creating more room to explain the Vision in depth.',
        'Uvinza FM added regional depth in Kigoma, reaching rural and peri-urban audiences beyond the national television footprint.',
        'Instagram activity extended the broadcast coverage into digital channels, with one Crown TV TZ post and three Uvinza FM posts.'] },
      { id: 'impact', title: 'Strategic impact', paragraphs: ['The engagement established multi-channel visibility for DIRA 2050 across national television, regional radio and social media. More importantly, the long-form broadcast format created opportunities for government stakeholders to explain the Vision beyond headlines, while Native Media’s coordination role helped connect institutional messaging with journalists and their audiences.'],
        note: { label: 'Measurement note', text: 'The evidence available demonstrates communications reach, airtime and media value. It does not, on its own, prove changes in public perception, stakeholder understanding or behaviour. Those outcomes would require additional audience or stakeholder research. AVE and PR value are media valuation indicators reported by the project media report (PR value uses a 3× multiplier of AVE).' } },
      { id: 'why', title: 'Why Native Media', paragraphs: ['Native Media brought together national and regional media relationships, local context and the ability to translate complex policy and development priorities into accessible public narratives. The role went beyond securing coverage: it helped connect institutions, media and messaging so that the Vision had stronger opportunities to be understood and communicated effectively.'] },
      { id: 'capabilities', title: 'Capabilities demonstrated', items: [
        { title: 'Policy and development communications', text: 'Translating a long-term national development agenda into clearer media-facing messages.' },
        { title: 'Media relations and local intelligence', text: 'Identifying relevant outlets and coordinating access across national and regional media.' },
        { title: 'Narrative translation and stakeholder linkage', text: 'Connecting journalists with institutional stakeholders and helping complex priorities travel through public channels.' }] },
      { id: 'learning', title: 'Strategic learning', callout: { label: 'From communications activity to narrative infrastructure', text: 'Launches, interviews and media tours can create visibility, but sustained understanding requires an overarching narrative system that connects policy priorities, stakeholders, messages, channels and timing. Building that infrastructure earlier would make communications more resilient to shifting calendars and execution windows.' } },
      { id: 'source', title: 'Evidence source', paragraphs: ['DIRA 2050 Media Coverage Report, April–May 2026, prepared for Gatsby Africa. The report records 9 placements across television, radio and Instagram, with total AVE of TZS 69,944,999 and PR value of TZS 209,834,997 using a 3× PRV/AVE multiplier.'] },
      { id: 'field', title: 'From the field', gallery: [
        { img: dira2, alt: 'A television studio interview in progress' },
        { img: dira1, alt: 'A speaker at the podium of the DIRA 2050 launch event' },
        { img: dira3, alt: 'Journalists and camera crews at a DIRA 2050 media engagement' }] },
    ],
  },
  {
    slug: 'national-clean-cooking-strategy-launch',
    title: 'National Clean Cooking Strategy launch',
    sector: 'Energy transition · Policy communications',
    headline: 'High-level media coordination: aligning government, development partners and media around one public narrative',
    summary: 'Native Media served as media coordinator around the launch of Tanzania’s National Clean Cooking Communication Strategy and Awareness Plan, helping connect institutional stakeholders with the media ecosystem needed to translate a complex national agenda into a clear, credible and public-facing communications moment.',
    cover: un2, coverAlt: 'Officials on stage holding the National Clean Cooking Strategy document at its launch',
    facts: [['Project partners', 'Ministry of Energy • UNCDF'], ['Contractor', 'Fern Company Ltd'], ['Sector', 'Energy transition / clean cooking / policy communications'], ['Geography', 'Tanzania'], ['Project period', 'May 2025 · Dodoma, Tanzania'], ['Role', 'Media coordination • strategic media relations • stakeholder–media linkage • narrative amplification'], ['Initiative context', 'National Clean Cooking Strategy 2024–2034 • EU-funded COOKFUND programme support']],
    sections: [
      { id: 'context', title: 'Context and framing', items: [
        { title: 'The ask', text: 'Support the media coordination surrounding the launch of Tanzania’s National Clean Cooking Communication Strategy and Awareness Plan, creating a credible bridge between the Ministry of Energy, UNCDF, development partners, campaign stakeholders and the media organisations responsible for taking the national clean cooking agenda into the public domain.' },
        { title: 'Strategic objective', text: 'Position the launch as the beginning of a broader national communications cycle, not simply a one-day event, by building media understanding, strengthening stakeholder alignment and creating the conditions for the clean cooking strategy to be communicated with authority, clarity and public relevance.' },
        { title: 'Local intelligence', text: 'The communications challenge was not lack of messages; it was the complexity of the stakeholder environment. Government institutions needed to communicate national ownership and policy direction. Development partners required appropriate visibility and alignment with programme objectives. Technical and private-sector actors needed space for substance. Media needed clear access to authoritative voices and a story that could be understood by wider audiences.' }],
        callout: { label: 'Core insight', title: 'From multi-stakeholder complexity to one coherent public narrative.', text: 'The strategic value of media coordination was to ensure that different institutional voices could coexist within one national communications moment without fragmenting the central clean cooking story.' } },
      { id: 'approach', title: 'Our approach', paragraphs: ['Native Media approached the assignment as a stakeholder-and-media orchestration challenge. The goal was to create an environment in which journalists could access credible voices, institutional messages remained aligned, and the public-facing narrative stayed understandable across the launch cycle.'], numbered: true, items: [
        { title: 'Media intelligence and authority', text: 'Engaging the media ecosystem as a strategic stakeholder capable of building awareness, credibility and sustained public conversation around clean cooking.' },
        { title: 'Stakeholder–message alignment', text: 'Helping government and development-partner voices operate within one coherent narrative while preserving institutional roles and appropriate visibility.' },
        { title: 'Media access and spokesperson linkage', text: 'Creating structured opportunities for journalists to engage authoritative speakers, ask questions and move coverage beyond ceremony towards explanation.' },
        { title: 'Narrative continuity', text: 'Treating pre-launch, launch-day and post-launch media engagement as one connected communications cycle rather than isolated publicity moments.' }] },
      { id: 'delivered', title: 'What we delivered', items: [
        { title: 'Media coordination', text: 'Supported the overall media-facing architecture around the launch, linking journalists, institutional stakeholders and the campaign narrative.' },
        { title: 'Stakeholder–media linkage', text: 'Helped create structured access between media and government and development-partner voices for credible explanation and interviews.' },
        { title: 'Press and media engagement', text: 'Supported a launch communications model built around pre-event press engagement, launch-day media participation and continued post-launch amplification.' },
        { title: 'Message translation', text: 'Helped frame a technically complex energy-transition agenda in language and storylines that could travel through mainstream public channels.' },
        { title: 'Launch visibility', text: 'Supported the positioning of the event as a nationally relevant policy and public-awareness moment rather than a closed institutional convening.' },
        { title: 'Narrative continuity', text: 'Reinforced the principle that the launch should open, rather than conclude, the public communications cycle around the national clean cooking strategy.' }] },
      { id: 'message', title: 'The narrative', callout: { label: 'Key message', title: '“Nishati Safi ya Kupikia, Okoa Maisha na Mazingira”', text: 'The Kiswahili framing made the clean cooking agenda more accessible and locally resonant, connecting the strategy with everyday concerns around life, wellbeing and the environment.' } },
      { id: 'environment', title: 'The execution environment', paragraphs: ['The National Clean Cooking Communication Strategy and Awareness Plan was positioned for launch in Dodoma on 26 May 2025 as a high-level national communications moment involving government, development partners, private sector, civil society and media. The wider campaign architecture was designed around pre-launch awareness-building, launch-day media coordination and post-event amplification.'], items: [
        { title: 'Government and policy', text: 'Ministry of Energy, relevant government ministries and regulatory stakeholders responsible for policy ownership and implementation.' },
        { title: 'Development partners', text: 'UNCDF, the European Union and other international development actors supporting climate, energy and community-development objectives.' },
        { title: 'Market and public ecosystem', text: 'Clean cooking enterprises, civil society, community organisations and national media responsible for innovation, adoption and public engagement.' }] },
      { id: 'impact', title: 'Qualitative impact', paragraphs: ['No audited reach or impression figures were provided for this portfolio case. The strongest evidence of value therefore sits in the strategic role media coordination played within the campaign architecture and the communications outcomes it was designed to enable.'], bullets: [
        'Media was positioned as a strategic campaign stakeholder, not simply an audience for event publicity, because journalists were expected to build awareness, credibility and longer-term public understanding.',
        'The communications model aligned government, UNCDF and wider development-partner visibility around one national clean cooking narrative, reducing the risk of fragmented institutional messaging.',
        'Structured media access and interview opportunities created the conditions for coverage to move beyond ceremony towards explanation of the strategy, its benefits and its implementation context.',
        'Using Kiswahili as the principal launch language strengthened accessibility and helped anchor a technical policy agenda in a message designed for national understanding.',
        'The pre-, during- and post-launch approach treated visibility as a narrative cycle, creating a stronger platform for continued public communication beyond the launch day.'],
        note: { label: 'Measurement note', text: 'The source material for this case study is a launch communications response and brief rather than a post-event media monitoring report. It supports the campaign objectives, stakeholder architecture, key message and media methodology, but does not independently verify every proposed outlet or post-launch activation. This case therefore presents strategic and qualitative impact only.' } },
      { id: 'demonstrates', title: 'What the case demonstrates', bullets: [
        'Complex donor and government environments require disciplined narrative coordination as much as media access.',
        'Media credibility is strongest when journalists can engage authoritative institutional voices directly rather than rely only on event messaging.',
        'High-level launches are most valuable when they are designed as the opening of a longer communications cycle.',
        'Local-language framing can make technical development agendas more inclusive, relatable and easier for media to carry into public conversation.'] },
      { id: 'why', title: 'Why Native Media', paragraphs: ['Native Media brought value where high-stakes development communication becomes difficult: at the intersection of policy, donor visibility, media authority and public meaning. Our role was not simply to invite press. It was to help coordinate the relationship between message, messenger, media and moment so that multiple institutional stakeholders could communicate through one coherent national narrative.'] },
      { id: 'capabilities', title: 'Capabilities demonstrated', items: [
        { title: 'Government and policy communications', text: 'Supporting the translation of a national policy agenda into credible media-facing communication.' },
        { title: 'Multi-donor stakeholder coordination', text: 'Operating across government, multilateral and development-partner communications requirements without fragmenting the core narrative.' },
        { title: 'Media relations and authority', text: 'Using media understanding and relationships to create credible access, explanation and public visibility.' },
        { title: 'High-level launch communications', text: 'Treating major launches as strategic narrative moments rather than stand-alone publicity events.' },
        { title: 'Stakeholder–media linkage', text: 'Connecting journalists with authoritative institutional voices and creating conditions for substantive engagement.' },
        { title: 'Narrative architecture', text: 'Aligning message, messenger, channel, timing and institutional visibility around one public-facing story.' }] },
      { id: 'learning', title: 'Strategic learning', callout: { label: 'From event visibility to narrative governance', text: 'In multi-stakeholder development campaigns, the communications challenge is not simply getting everyone seen. It is ensuring that every voice strengthens, rather than fragments, the central public narrative.' } },
      { id: 'source', title: 'Evidence source', paragraphs: ['Launch of National Clean Cooking Strategy Awareness Campaign communications response and brief (2025). The source documents the National Clean Cooking Communication Strategy and Awareness Plan context, campaign objectives, stakeholder groups, Kiswahili key message, three-phase launch approach and proposed media engagement methodology.'] },
      { id: 'field', title: 'From the field', gallery: [
        { img: un1, alt: 'Officials on stage holding the National Clean Cooking Strategy document at its launch' },
        { img: un2, alt: 'Officials and partners gathered on stage at the National Clean Cooking Strategy launch' }] },
    ],
  },
  {
    slug: 'e-cooking',
    title: 'E-cooking',
    sector: 'Energy transition · Development communications',
    headline: 'Launch and post-launch media coordination: turning coverage into public understanding and a feedback loop',
    summary: 'Native Media coordinated national and regional media engagement around Tanzania’s e-cooking agenda, connecting institutional voices with credible media, localising the story across regions, and using coverage to surface public concerns that could strengthen future campaign narratives.',
    cover: ec2, coverAlt: 'Stills from community testimonial videos about e-cooking',
    facts: [['Project partners', 'Ministry of Energy • UKAID • MECS'], ['Contractor', 'Fern Company Ltd'], ['Sector', 'Energy transition / clean cooking / development communications'], ['Geography', 'Tanzania'], ['Project period', '2025'], ['Role', 'Media coordination • strategic media relations • narrative amplification']],
    sections: [
      { id: 'context', title: 'Context and framing', items: [
        { title: 'The ask', text: 'Support the launch and post-launch visibility of Tanzania’s e-cooking agenda by coordinating media engagement, connecting journalists with the institutions and experts driving the transition, and sustaining the conversation beyond the initial national communications moment.' },
        { title: 'Strategic objective', text: 'Build authority and public understanding around e-cooking as a practical part of Tanzania’s clean-energy transition, while ensuring the media narrative could connect national policy ambition with the everyday realities influencing household and small-business adoption.' },
        { title: 'Local intelligence', text: 'The regional campaign reinforced a critical communications insight: awareness alone does not determine technology adoption. Audiences evaluate e-cooking through practical realities such as affordability, appliance suitability, the cost of traditional fuels, health concerns and the availability of locally relevant information. The media report documented recurring public concerns from communities and food vendors, including requests for larger e-stoves for Mama Ntilie businesses, high upfront costs, the need for stronger localised sensitisation, rising charcoal prices and recognition of the health risks associated with charcoal and firewood.' }],
        callout: { label: 'Core insight', title: 'From media amplification to listening infrastructure.', text: 'The strongest communications opportunity was not only to increase visibility, but to use media engagement to understand how audiences were receiving the transition, and feed those insights back into future messaging.' } },
      { id: 'approach', title: 'Our approach', paragraphs: ['Native Media coordinated a national-to-regional media ecosystem designed to make the e-cooking narrative more accessible, locally relevant and useful to the institutions leading the campaign. The approach focused on four connected functions.'], numbered: true, items: [
        { title: 'Media intelligence and localisation', text: 'Selecting national and regional outlets with the credibility, audience relevance and format needed to carry the story beyond a single launch moment.' },
        { title: 'Stakeholder–media linkage', text: 'Creating structured access between journalists and the institutions, experts and campaign representatives responsible for explaining e-cooking.' },
        { title: 'Narrative translation', text: 'Moving the conversation from technical energy language towards relatable stories about cost, health, livelihoods, convenience and adoption.' },
        { title: 'Coverage as intelligence', text: 'Using interviews, documentaries and testimonials to surface public perceptions and build a feedback loop for future communication.' }] },
      { id: 'delivered', title: 'What we delivered', items: [
        { title: 'Media relations', text: 'Coordinated journalist engagement, interviews and media access across national and regional outlets.' },
        { title: 'Regional media engagement', text: 'Extended the campaign through Arusha, Mwanza and Dodoma, using locally relevant broadcast and digital ecosystems.' },
        { title: 'Long-form broadcast', text: 'Supported radio interviews and documentary formats that created space for explanation, questions and deeper public engagement.' },
        { title: 'Digital and print amplification', text: 'Expanded the story through digital publishers, blogs, social platforms and print media.' },
        { title: 'Testimonial storytelling', text: 'Used community-facing testimonial content to capture lived experiences, barriers and expectations around clean cooking.' },
        { title: 'Post-launch narrative feedback', text: 'Converted media and community response into communications intelligence that could inform future campaign messaging.' }] },
      { id: 'message', title: 'The narrative', callout: { label: 'Key message', text: 'E-cooking is not simply a technology story. It is a practical transition shaped by household economics, public health, business realities and the everyday choices of Tanzanian consumers.' } },
      { id: 'execution', title: 'Execution', paragraphs: ['The post-launch media programme moved across three regional communications environments, Arusha, Mwanza and Dodoma, and combined radio, television, documentary, print, digital and testimonial formats. This allowed the campaign to balance national authority with regional relevance and community voice.'], items: [
        { title: 'Arusha', text: 'Regional radio, digital publishers and documentary formats. Documented examples include Sunrise FM documentary, Arusha One news and interview, IPP Media, Habari Leo and digital outlets.' },
        { title: 'Mwanza', text: 'Local digital and broadcast engagement combined with testimonial storytelling. Documented examples include RFA news, Jembe FM and Sauti FM interviews, Uhuru Newspaper and community-facing testimonial videos.' },
        { title: 'Dodoma', text: 'Policy-centre media engagement across radio, television and documentary formats. Documented examples include TBC FM documentary, AFM interviews, TBC TV, Dodoma TV and Radio documentary and DW Focus international coverage.' }] },
      { id: 'evidence', title: 'Qualitative evidence', paragraphs: ['The campaign report shows that the media programme did more than place e-cooking in public channels. It also surfaced concrete perceptions about what would influence adoption and where communications needed to work harder.'], bullets: [
        'Food vendors called for larger e-stoves that better fit commercial cooking needs.',
        'High costs were repeatedly identified as a barrier to accessing clean cooking solutions.',
        'Communities valued e-cooking outreach but asked for stronger, more localised sensitisation.',
        'Rising charcoal prices were creating economic pressure for some Mama Ntilie businesses, making alternative cooking solutions increasingly relevant.',
        'Audiences showed awareness of the health risks associated with charcoal and firewood.'] },
      { id: 'shows', title: 'What the evidence shows', bullets: [
        'Regional media helped translate a national energy-transition agenda into locally meaningful conversations.',
        'Radio interviews and documentaries created room for explanation and audience engagement beyond short news mentions.',
        'Local blogs, vlogs and digital publishers provided tailored storytelling within regional information ecosystems.',
        'Testimonials turned campaign communication into a source of public insight, revealing adoption barriers that visibility metrics alone would not capture.',
        'Documented DW Focus coverage added an international dimension to the campaign’s media environment.'] },
      { id: 'impact', title: 'Strategic impact', paragraphs: ['Native Media helped move the e-cooking story from institutional communication into a more distributed public conversation. By combining national and regional media relationships with long-form formats and community voices, the campaign created opportunities for the transition to be explained not only as an energy policy issue, but as a question of affordability, health, livelihoods and everyday practicality.', 'Just as importantly, the communications process generated local intelligence. Public feedback captured through interviews, documentaries and testimonials highlighted where campaign narratives could become more relevant, particularly around cost, appliance design and localised education.'],
        note: { label: 'Measurement note', text: 'No audited impression or reach figures were provided for this case study. Impact is therefore presented qualitatively, based on the documented media activity, channel mix and public sentiments recorded in the campaign media report. The evidence supports conclusions about media breadth, narrative depth and audience feedback, but not quantified changes in awareness or behaviour.' } },
      { id: 'why', title: 'Why Native Media', paragraphs: ['Native Media brought together media authority, regional market understanding and the ability to translate a technical development agenda into stories that could travel across different public channels. Our contribution went beyond media booking: we connected stakeholders with journalists, adapted the narrative to local contexts and used audience response to make the communications system more intelligent over time.'] },
      { id: 'capabilities', title: 'Capabilities demonstrated', items: [
        { title: 'Energy and development communications', text: 'Translating a technical clean-energy agenda into clearer public-facing narratives.' },
        { title: 'Media relations and authority', text: 'Mobilising credible national and regional media across broadcast, digital and print formats.' },
        { title: 'Regional media intelligence', text: 'Understanding how the story needs to travel differently across local information ecosystems.' },
        { title: 'Stakeholder–media coordination', text: 'Connecting institutional voices with journalists for credible interviews, explanation and access.' },
        { title: 'Narrative and sentiment intelligence', text: 'Using public feedback and testimonial content to refine future communications.' }] },
      { id: 'learning', title: 'Strategic learning', callout: { label: 'From coverage to feedback loop', text: 'Strong public-interest campaigns should not treat media only as a distribution channel. The most valuable system connects campaign message, media, community response, strategic insight and a stronger narrative.' } },
      { id: 'source', title: 'Evidence source', paragraphs: ['Smart Pika: Media Coverage Report (August 2025), Native Media. The report documents media activity across Arusha, Mwanza and Dodoma, including digital, radio, print, television and documentary formats, testimonial videos and common public sentiments.'] },
      { id: 'field', title: 'From the field', gallery: [
        { img: ec1, alt: 'Stills from regional broadcast and online coverage of e-cooking' },
        { img: ec2, alt: 'Stills from community testimonial videos about e-cooking' }] },
    ],
  },
  {
    slug: 'kcb-tanzania-kenya-business-forum-2026',
    title: 'KCB Bank at the Tanzania–Kenya Business Forum 2026',
    sector: 'Banking · Trade finance · Economic diplomacy',
    headline: 'From sponsorship visibility to regional thought leadership',
    summary: 'Contracted by Fern Company Ltd, Native Media served as media coordinator and communications adviser for KCB Bank around the Tanzania–Kenya Business Forum 2026, helping shape the media framework, sharpen executive messaging and convert a high-profile sponsorship platform into substantive corporate thought leadership.',
    cover: kcb1, coverAlt: 'The stage at the Tanzania–Kenya Business Forum 2026',
    facts: [['Contracting partner', 'Fern Company Ltd'], ['Brand client', 'KCB Bank'], ['Platform', 'Tanzania–Kenya Business Forum 2026'], ['Sector', 'Banking • trade finance • economic diplomacy • regional integration'], ['Role', 'Media coordination • communications advisory • message architecture • executive thought leadership • earned media'], ['Project period', '4–7 May 2026 · Dar es Salaam, Tanzania']],
    sections: [
      { id: 'context', title: 'Context and framing', items: [
        { title: 'The ask', text: 'Support KCB Bank’s media positioning around the Tanzania–Kenya Business Forum 2026, where the Bank was among the major sponsors, by coordinating earned media and advising on the communications framework and messaging needed to turn sponsorship presence into meaningful corporate positioning.' },
        { title: 'Strategic objective', text: 'Move KCB beyond passive sponsor visibility and position the Bank, and its Group CEO, Paul Russo, as a credible private-sector voice on cross-border trade finance, regional economic integration and the practical financial infrastructure required to deepen commerce between Tanzania, Kenya and the wider East African market.' },
        { title: 'Local intelligence', text: 'The forum offered unusually high political and business authority: it was officiated by H.E. Dr. Samia Suluhu Hassan and H.E. William Ruto and brought regional trade, investment and economic integration into the centre of the news agenda. In that environment, generic sponsor messaging would have been easy to lose. Native Media identified a stronger communications opportunity: KCB could use the forum not simply to be seen, but to own a relevant part of the policy conversation. The most credible route was executive thought leadership linking KCB’s regional footprint and trade-finance capabilities to the mechanisms shaping East African integration, including PAPSS, AfCFTA and cross-border corporate banking.' }],
        callout: { label: 'Core insight', title: 'The strongest sponsor visibility is not logo presence.', text: 'It is authoritative participation in the conversation the platform exists to advance. This reframed the assignment from event publicity into reputation-building: using the forum’s policy relevance to strengthen KCB’s regional connector positioning.' } },
      { id: 'approach', title: 'Our approach', paragraphs: ['Native Media combined communications advisory with rapid media coordination. The approach centred on message architecture, executive authorship and a disciplined earned-media cascade that could move quickly while the forum remained at the top of the regional business-news cycle.'], numbered: true, items: [
        { title: 'Message architecture', text: 'Advised the communications framework so KCB’s presence connected clearly to trade finance, regional integration, PAPSS and AfCFTA rather than generic sponsorship language.' },
        { title: 'Executive positioning', text: 'Elevated Group CEO Paul Russo as the principal voice, giving KCB direct authorship of the regional trade narrative through bylined thought leadership.' },
        { title: 'Media authority', text: 'Prioritised high-authority national print alongside fast digital amplification, balancing credibility, discoverability and speed.' },
        { title: '72-hour news cycle', text: 'Coordinated placements across the immediate post-forum window so KCB remained visible while policy and business attention around the event was still active.' }] },
      { id: 'delivered', title: 'What we delivered', items: [
        { title: 'Communications advisory', text: 'Advised on the communication framework and messaging used to position KCB’s sponsorship within the wider trade and regional-integration agenda.' },
        { title: 'Media coordination', text: 'Coordinated earned-media activity across print, online news, blogs and social media within the immediate forum news cycle.' },
        { title: 'CEO thought leadership', text: 'Helped anchor coverage around two national CEO-bylined op-eds, shifting the story from event attendance to substantive authorship.' },
        { title: 'Message translation', text: 'Connected KCB’s banking capabilities to policy-relevant themes including cross-border trade finance, PAPSS, corporate banking and AfCFTA.' },
        { title: 'Digital amplification', text: 'Extended the narrative through online news, blogs, LinkedIn and Instagram, keeping KCB visible after the forum itself had concluded.' },
        { title: 'Performance reporting', text: 'Tracked placement volume, channel mix, media value and message penetration, and identified follow-on opportunities for longer-term amplification.' }] },
      { id: 'message', title: 'The narrative', callout: { label: 'Positioning', text: 'KCB as a regional connector: an anchor financial institution helping turn East African integration from policy ambition into practical cross-border trade and commerce. The messaging consistently moved beyond “KCB attended the forum.” It linked the Bank to concrete mechanisms of regional commerce and placed its leadership alongside policy commentary on East African growth.' } },
      { id: 'results', title: 'Earned media performance', paragraphs: ['The campaign generated 11 earned placements across print, online news, blogs and social media within 72 hours of the forum. Nine of the 11 placements were digital, while two national newspaper op-eds supplied the campaign’s highest-authority editorial anchors.'],
        stats: [{ value: '11', label: 'Media placements' }, { value: '72 hrs', label: 'To full coverage' }, { value: 'TZS 12.1M', label: 'Reported AVE' }, { value: 'TZS 36.3M', label: 'Reported PR value' }],
        items: [
          { title: 'National print authority', text: 'Daily News and The Citizen published CEO-bylined op-eds on 6 May 2026. The report values the two print placements at TZS 10.8M PR value.' },
          { title: 'Searchable digital record', text: 'The Citizen carried the CEO op-ed online, creating an indexed, shareable record of KCB’s trade-finance positioning beyond the physical newspaper cycle.' },
          { title: 'Fast blog amplification', text: 'Four blog placements including Swahili-language publishers extended the story into broader digital audiences while the forum remained current.' },
          { title: 'Professional and mobile social', text: 'LinkedIn and Instagram coverage reached both professional, finance-adjacent audiences and wider mobile-first audiences through the three-day post-event period.' }] },
      { id: 'penetration', title: 'Message penetration', paragraphs: ['The strongest result was not the placement count. It was that the coverage consistently carried KCB’s substantive positioning rather than reducing the Bank to a sponsor mention.'], items: [
        { title: 'CEO as regional voice', text: 'Paul Russo was positioned as the spokesperson for regional trade integration, including through two national op-eds under his byline.' },
        { title: 'Trade finance made tangible', text: 'Coverage referenced PAPSS, trade finance and corporate banking solutions, giving the narrative direct product and business relevance.' },
        { title: 'High-authority context', text: 'KCB’s participation was consistently connected to a forum officiated by both Heads of State, strengthening the authority of the platform.' },
        { title: 'Policy-aligned framing', text: 'Messaging linked KCB to AfCFTA and wider development priorities, aligning corporate positioning with policy momentum on regional trade.' }] },
      { id: 'impact', title: 'Strategic impact', paragraphs: ['The campaign converted a short, high-profile sponsorship window into a stronger reputational asset for KCB. Rather than competing for attention through event visibility alone, the Bank secured direct authorship of the regional trade narrative through its Group CEO and extended that positioning across authoritative print and fast-moving digital channels.', 'This strengthened KCB’s positioning as more than a financial sponsor of regional dialogue. The earned-media narrative presented the Bank as a practical enabler of East African commerce, connecting policy ambitions around integration with the financial mechanisms businesses need to trade across borders.'],
        note: { label: 'Note on media values', text: 'AVE and PR value are media valuation indicators reported in the media coverage report. They are not direct measures of reach, understanding or behaviour.' } },
      { id: 'why', title: 'Why Native Media', paragraphs: ['Native Media brought together two capabilities that are often separated: strategic communications thinking and on-the-ground media coordination. Because we were involved in both the framework and the execution, we could ensure that the story pitched to media reflected the positioning KCB needed to own, not simply the activity taking place at the forum.', 'Our value was the ability to identify the reputational opportunity inside a crowded, politically significant platform; translate banking and regional-integration themes into editorially relevant narratives; and mobilise media quickly enough for that positioning to travel while attention was still concentrated on the event.'] },
      { id: 'capabilities', title: 'Capabilities demonstrated', items: [
        { title: 'Strategic communications advisory', text: 'Connecting sponsorship objectives, brand reputation and policy context into one coherent communications framework.' },
        { title: 'Executive thought leadership', text: 'Using CEO authorship to move corporate messaging from sponsor visibility into high-authority policy and business commentary.' },
        { title: 'Media relations and coordination', text: 'Securing and coordinating fast earned-media pickup across national print, online news, blogs and social platforms.' },
        { title: 'Economic diplomacy communications', text: 'Positioning a corporate client credibly within a bilateral trade and regional-integration conversation involving senior political and business stakeholders.' },
        { title: 'Message architecture', text: 'Translating technical financial themes (trade finance, PAPSS, corporate banking and AfCFTA) into media-relevant narratives.' },
        { title: 'Media intelligence and reporting', text: 'Tracking channel mix, media value and message penetration, then identifying gaps and follow-on opportunities for sustained visibility.' }] },
      { id: 'learning', title: 'Strategic learning', callout: { label: 'From sponsorship to influence', text: 'High-profile sponsorship creates access to attention. Strategic communications determines whether that attention becomes reputation, authority and influence.' } },
      { id: 'source', title: 'Evidence source', paragraphs: ['KCB Bank – Tanzania–Kenya Business Forum 2026 Media Coverage Report, 4–7 May 2026. The report documents 11 earned placements, channel mix, media valuation, timing, CEO-bylined op-eds, message penetration and strategic recommendations. Native Media’s contracting relationship with Fern Company Ltd and its advisory role on the KCB communications framework and messaging are based on project information supplied for this case study.'] },
      { id: 'field', title: 'From the field', gallery: [
        { img: kcb1, alt: 'The stage at the Tanzania–Kenya Business Forum 2026' },
        { img: kcb3, alt: 'Leaders seated at the Tanzania–Kenya Business Forum 2026' },
        { img: kcb2, alt: 'A newspaper page carrying a CEO-bylined op-ed on Tanzania–Kenya trade ties' }] },
    ],
  },
];
