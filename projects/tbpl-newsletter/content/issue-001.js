/*
 * TBPL Newsletter, Issue 001 (October 2026): structured content.
 *
 * The original PDF (source/TBPL_NEWSLETTER-V2.pdf) is the authoritative source.
 * Article text below is VERBATIM from the source, including its errors. Known problems
 * are not corrected here; they are marked inline as [[FLAG-ID|text]] and listed in `flags`.
 * Any copy written by the redesign team (standfirsts, chart titles, captions) is held in
 * fields named `new*` / `draft*` so it can be approved separately from source text.
 *
 * Loaded as a plain script (sets window.TBPL_ISSUE) so pages open directly from disk.
 */
window.TBPL_ISSUE = {
  meta: {
    organisation: 'Tanzania Biotech Products Limited',
    short: 'TBPL',
    parent: 'National Development Corporation (NDC)',
    publication: 'Newsletter',
    tagline: 'Driving One Health Solution',
    logoTagline: 'Bioproducts for Better Lives', // as it appears inside the supplied logo artwork
    issue: '001',
    volume: '001',
    date: 'October 2026',
    edition: 'First Edition 26/27',
    // Editor-review edition (client instruction, 30 Oct 2026): every flag with an `ask` prints as a placeholder.
    // Errors are replaced by a placeholder quoting the source text; missing labels get a placeholder in their slot.
    editorPlaceholders: true,
    // Corrections marked [[ID|original=>fix]]: approved ones always apply; proposed ones apply only when this is true.
    applyProposedCorrections: false,
    approvedCorrections: ['F1'],
    contact: {
      title: 'Managing Director',
      address: ['P.O Box 2669', 'Development House', 'Kivukoni Front, Ohio St', 'Dar es Salaam'],
      email: 'info@tanzaniabiotech.co.tz',
      web: 'www.tanzaniabiotech.co.tz',
      social: 'tbpltanzania',
      socialNetworks: ['Facebook', 'Instagram', 'X', 'LinkedIn'],
      qr: { file: 'src/assets/brand/qr-code-extracted.png', decodesTo: 'https://ndc.go.tz/wp-content/uploads/2026/10/NEWSLETTER-OCT-2026.pdf' }
    },
    board: {
      chiefEditor: 'Samwel Mziray',
      editor: 'Innocent Msuha',
      reporters: ['[[F12|Aisha Mohamed]]', 'Jackson Kelvin', 'Miriam Chavalla', 'Upendo Kessy', 'Joyce Mgaya'],
      originalLayout: 'Kimwaga Ramadhani'
    }
  },

  brand: {
    // Sampled from the source artwork (masthead fills and logo pixels). Confirm against official brand guidelines (flag F18).
    blue: '#066AB5',
    yellow: '#FDC902',
    green: '#009236',
    ink: '#231F20',
    sourceFonts: ['Graphik (body, headings)', 'Akira Expanded (display)', 'Futura BT', 'Calisto MT']
  },

  /*
   * Statistics registry. status:
   *   reported    exact figure stated in the source as reported by TBPL/NDC; not independently verified
   *   approximate the source itself qualifies the figure ("approximately", "about", "nearly")
   *   projected   a plan or expectation, not an outcome
   *   quoted      a figure that appears only inside a direct quotation, without a stated source or period
   *   derived     calculated by the redesign team from reported figures (must be approved)
   * No figure in this issue can be marked "confirmed" until checked against the underlying report.
   */
  stats: {
    salesCumulative: { value: 19.50, unit: 'TZS bn', label: 'Cumulative sales, past three financial years', status: 'approximate', page: 4, flags: ['F3'] },
    salesDomestic: { value: 18.79, unit: 'TZS bn', label: 'Domestic sales', status: 'reported', page: 4, flags: ['F4'] },
    salesExport: { value: 0.71, unit: 'TZS bn', display: 'TZS 710 million', label: 'Exports', status: 'reported', page: 4, flags: ['F4'] },
    salesAnnual: {
      label: 'Annual sales', unit: 'TZS bn', status: 'approximate', page: 4, flags: ['F3'],
      series: [
        { period: '2023/24', value: 0.6, qualifier: 'approximately' },
        { period: '2024/25', value: 6.2, qualifier: 'about' },
        { period: '2025/26', value: 12, qualifier: 'nearly' }
      ]
    },
    biopesticideVolume: { value: 13131, unit: 'litres', label: 'Biological pesticide sales, by June 2026', status: 'reported', page: 2, flags: ['F2'] },
    biopesticideValue: { value: 131.31, unit: 'TZS million', label: 'Value of biological pesticide sales', status: 'reported', page: 2, flags: ['F2'] },
    distributed: { value: 751870, unit: 'litres', label: 'Biological products distributed', status: 'reported', page: 3, flags: ['F6'] },
    councils: {
      label: 'Councils served', unit: 'councils', status: 'reported', page: 3, flags: ['F5'],
      series: [{ period: '2024/25', value: 178 }, { period: '2025/26', value: 149 }]
    },
    biofertiliserTrial: { value: 3475, unit: 'litres', label: 'Fosforina and Dimargon produced on a trial basis', status: 'reported', page: 3 },
    biofertiliserLaunch: { value: 'Early January 2027', label: 'Expected market entry of Fosforina and Dimargon', status: 'projected', page: 13, flags: ['F26'] },
    regionalSamples: { value: ['Mozambique', 'Kenya', 'Malawi'], label: 'Countries where product samples were sent', status: 'reported', page: 4, flags: ['F7'] },
    regionalExports: { value: ['Kenya', 'Uganda'], label: 'Export markets ("include")', status: 'reported', page: 4, flags: ['F7'] },
    morogoroCouncils: { value: 9, unit: 'councils', label: 'Morogoro councils receiving pumps, protective boots and Biolarvicides', status: 'reported', page: 6, flags: ['F23'] },
    malariaPrevalence: { from: 14.3, to: 5.5, unit: '%', label: 'National malaria prevalence', status: 'quoted', page: 18, flags: ['F8'] },
    malariaLowRegions: { value: ['Arusha', 'Njombe'], label: 'Regions with prevalence below 1%', status: 'quoted', page: 18, flags: ['F8'] },
    malariaTarget: { value: 2030, label: 'National and WHO global target for malaria elimination', status: 'quoted', page: 18, flags: ['F8'] },
    worldFoodDay: { value: '10–16 October 2026', label: 'World Food Day Exhibition, Usagara Secondary School Grounds, Tanga', status: 'reported', page: 13 },
    domesticShare: { value: 96.4, unit: '%', label: 'Domestic share of cumulative sales (18.79 ÷ 19.50)', status: 'derived', page: 4 }
  },

  /* Editorial review flags. severity: critical | high | medium | low */
  flags: {
    F1: { severity: 'critical', page: '2, 11, 12', text: 'Contents and headline say "Denmark Embassy"; the body text names the "Embassy of Canada" three times. Confirm which embassy was visited.',
      resolution: 'Client confirmed Embassy of Canada (30 Oct 2026). Headline and contents corrected; original headline kept in articles.embassy.sourceTitle.' },
    F2: { kind: 'error', ask: 'Confirm reporting period', severity: 'high', page: 2, text: 'Article says progress was recorded "during the 2026/2027 financial year", but the pesticide sales figure is "by June 2026", which falls in FY 2025/26 if the financial year runs July–June. Confirm the reporting period.' },
    F3: { severity: 'high', page: 4, text: 'The three annual figures (≈0.6 + ≈6.2 + ≈12) total ≈TZS 18.8 bn, which matches domestic sales (18.79) rather than the cumulative total (19.50). Confirm whether the annual series is domestic-only, and supply exact annual values.',
      resolution: 'Exact figures unavailable (client, 30 Oct 2026). Publish as approximate with the source qualifiers, and note that the annual figures do not sum exactly to the total. Do not show growth multiples.' },
    F4: { kind: 'label', ask: 'Period to be confirmed', severity: 'medium', page: 4, text: 'Domestic (18.79) and export (0.71) sales sum exactly to 19.50, but the period they cover is not stated explicitly. Confirm they are three-year totals.' },
    F5: { kind: 'error', ask: 'Subhead conflicts with the data (178 → 149 councils)', severity: 'high', page: 3, text: 'Subhead says the "distribution network expands across the country", but councils served fell from 178 (2024/25) to 149 (2025/26). Headline and data point in different directions; editor to resolve wording or explain.' },
    F6: { kind: 'label', ask: 'Period and scope to be supplied', severity: 'medium', page: 3, text: '751,870 litres "distributed": no period, product mix or relationship to the 13,131 litres sold is given (distribution volume is ~57× sales volume). Clarify scope before visualising alongside sales.' },
    F7: { severity: 'low', page: 4, text: 'Two different country lists: samples sent to Mozambique, Kenya and Malawi; export markets "include" Kenya and Uganda. Not contradictory, but the map must keep the categories distinct. Is the export list complete?' },
    F8: { kind: 'label', ask: 'Source and survey years to be supplied', severity: 'high', page: 18, text: 'Malaria prevalence 14.3% → 5.5%, Arusha/Njombe <1%: appears only within a quotation, with no years or survey source. Present as a quote, not a chart, unless an official source and survey years are supplied.' },
    F9: { kind: 'error', ask: 'Confirm product name', severity: 'medium', page: '12–14', text: 'Product name variants: "Thurisave-24", "Thurisave" and "Thurisave 24"; "Griselesf" (spelling unverified); "Biolarvicides" capitalised as a product name. Supply the official product-name list.' },
    F10: { kind: 'error', ask: 'Confirm company name', severity: 'low', page: 'multiple', text: 'Company name appears as both "Tanzania Biotech Products Limited" and "Tanzania Biotech Product Limited".' },
    F11: { kind: 'error', ask: 'Confirm publication name', severity: 'low', page: '2, 1', text: 'Contents lists "Message from the Chief Editor"; the page is headed "Message from the Editor". The editor\'s letter calls the publication a "Magazine"; the masthead says "Newsletter".' },
    F12: { kind: 'error', ask: 'Confirm spelling of name', severity: 'low', page: '2, 15, 17', text: 'Reporter spelled "Aisha Mohamed" (editorial board) and "Aisha Mohammed" (bylines).' },
    F13: { kind: 'label', ask: 'Ending to be supplied (source stops here)', severity: 'critical', page: 10, text: 'Liuka Gold Mine article ends mid-sentence ("…strengthening preventive public health") with no closing text. It also has no byline and no date for the visit.',
      resolution: 'Placeholder for editors (client, 30 Oct 2026): byline, date and ending to be supplied.' },
    F14: { kind: 'label', ask: 'Attribution to be supplied', severity: 'medium', page: 8, text: 'Nanenane pull quote ("Empowering young people…") is unattributed.' },
    F15: { kind: 'error', ask: 'Confirm spelling', severity: 'low', page: 'multiple', text: 'Typos and style: "Ecological Agricultur" (cover), "commitee" (p3), "equipment\'s" (p7), "Pg.." (cover); mixed UK/US spelling (fertiliser/fertilizer, neighbour/neighbor); "El Nino" vs "El Niño". Agree a house style.' },
    F16: { kind: 'label', ask: 'Names of people pictured and photo credit to be supplied', severity: 'high', page: 'all', text: 'No photograph has a caption or photographer credit, and people pictured are not identified. A caption and credit sheet is needed before publication; draft captions in this project are marked "to confirm".',
      resolution: 'Placeholder for editors (client, 30 Oct 2026). Context captions (place and event) stay; names of people pictured and credits are placeholders.' },
    F17: { severity: 'high', page: 'all', text: 'Embedded photos are 1,000–1,700 px wide (one at 3,271 px). Full-page print needs ~2,500–3,500 px. Supply original camera files.',
      resolution: 'No originals available. Use the images embedded in the PDF (already extracted at full embedded resolution) and size each one to its resolution; see docs/02-design-system.md > Asset rules. Possible source: the original InDesign package from the layout designer.' },
    F18: { severity: 'medium', page: 'all', text: 'Logo is only available as a 345×145 px raster extracted from the PDF. Supply vector master files and brand guidelines (Pantone/CMYK values). Colours in this project are sampled from the artwork.',
      resolution: 'No vector logo available. Use the extracted raster as supplied, never redrawn or traced, at 30 mm wide or less (about 290 ppi), always on a light background.' },
    F19: { severity: 'low', page: '3, 5', text: 'Stray text fragments in the right margin ("P o o", "D J m p"): overset or hidden text frames in the source InDesign file. Check nothing was meant to appear there.' },
    F20: { severity: 'low', page: 'all', text: 'Page background is a pink tint (#FEF7FC), probably unintended.' },
    F21: { severity: 'low', page: '1, 6, 18', text: 'The Chief Editor (Samwel Mziray) is also quoted and pictured as TBPL Marketing Manager (Samwel Paul Mziray). Confirm the preferred name form.' },
    F22: { kind: 'label', ask: 'Date to be supplied', severity: 'medium', page: '6–18', text: 'Dates missing for most events (Morogoro handover, Liuka visit, Embassy visit, Njombe visit, Radio One broadcast, Nanenane). Only the Tanga exhibition is dated.',
      resolution: 'Placeholder for editors (client, 30 Oct 2026) wherever a date belongs.' },
    F23: { kind: 'label', ask: 'Quantities to be supplied', severity: 'medium', page: 6, text: 'Morogoro handover: quantities of pumps, boots and Biolarvicides, and the names of the nine councils, are not stated. Cannot be visualised without them.' },
    F24: { severity: 'low', page: 1, text: 'Cover QR code resolves to https://ndc.go.tz/wp-content/uploads/2026/10/NEWSLETTER-OCT-2026.pdf. If the redesigned PDF replaces the original, the hosted file or the QR must be updated.' },
    F26: { severity: 'medium', page: '3, 13–14', text: 'Fosforina and Dimargon are "expected to enter the market in early January 2027", while engagement with the regulator (TFRA) is described as "ongoing". Keep the launch framed as projected and confirm regulatory status.' }
  },

  articles: {
    sales: {
      title: 'TBPL Expands Agricultural and Pest Control Solutions, Strengthens Market Reach',
      byline: 'Jackson Kelvin',
      sourcePages: '2–5',
      newKicker: 'Performance',
      newStandfirst: 'In a performance update presented to Parliament, TBPL reported cumulative sales of approximately TZS 19.5 billion over three financial years, with annual sales rising from about TZS 0.6 billion to nearly TZS 12 billion.',
      body: [
        { p: 'Tanzania Biotech Products Limited (TBPL), a subsidiary of the National Development Corporation (NDC), is expanding access to biological pesticides and strengthening its agricultural and pest control services, with progress recorded in production, distribution, technology transfer and market development during the [[F2|2026/2027 financial year]].' },
        { p: 'The progress was presented by NDC Managing Director, Dr Nicolaus Shombe, on behalf of the Minister for Industry and Trade, Hon. Judith Salvio Kapinga (MP), to the Parliamentary Standing Committee on Industries, Trade, Agriculture and Livestock. According to the performance update, TBPL continues to advance its role in promoting biological pest control solutions while broadening access to its products in Tanzania and exploring opportunities in regional markets.' },
        { h: 'Biological pesticides sales reach 13,131 litres' },
        { p: 'In the area of biological pesticides, TBPL recorded sales of 13,131 litres [[F2|by June 2026]], valued at TZS 131.31 million. The performance reflects the company’s contribution to expanding the availability and use of biological pest control products in the agricultural sector.' },
        { p: 'Biological pesticides offer an alternative approach to pest management and can support efforts to promote more sustainable agricultural practices when used appropriately and in accordance with recommended guidelines.' },
        { p: 'The continued promotion and distribution of these products is expected to strengthen farmers’ access to pest management solutions and contribute to agricultural productivity.' },
        { h: 'Progress in biological fertiliser technology' },
        { p: 'TBPL has also made progress in biological fertilizer technology, with the production of 3,475 litres of Fosforina and Dimargon reported as being undertaken on a trial basis.' },
        { p: 'The trials form part of efforts to advance the use of biological products in agriculture. The [[F15|commitee=>committee]] was informed that engagement with the Tanzania Fertilizer Regulatory Authority (TFRA) was ongoing.' },
        { p: 'The development of biological fertilizer products could create additional opportunities for TBPL to diversify its product portfolio and support farmers seeking solutions to improve agricultural production.' },
        { h: '[[F5|Distribution network expands across the country]]' },
        { p: 'On product distribution, TBPL reported that [[F6|751,870 litres of biological products had been distributed]]. The company further reported that 178 councils were served during the 2024/2025 financial year, while 149 councils were served in 2025/2026.' },
        { p: 'These figures highlight the company’s distribution activities across local government areas and its efforts to improve access to biological pest control solutions.' },
        { p: 'An expanded distribution network is important in ensuring that agricultural products reach intended users, particularly farmers and other stakeholders who depend on effective pest management to protect crops and improve yields.' },
        { h: 'Regional market expansion' },
        { p: 'Beyond the domestic market, TBPL is pursuing opportunities to extend its reach into neighbor countries. According to the performance update, samples of its products had been sent to Mozambique, Kenya and Malawi as part of its market development efforts.' },
        { p: 'The company is also continuing engagement with the Tanzania Fertilizer Company (TFC), with the aim of strengthening cooperation in the development of its market.' },
        { p: 'Regional market development presents an opportunity for TBPL to increase the visibility of its biological products, establish commercial partnerships and explore additional sources of revenue.' },
        { h: 'Strengthening TBPL’s contribution to national development' },
        { p: 'As an NDC subsidiary, TBPL’s progress in production, distribution and market development forms part of the wider contribution of NDC’s investments to Tanzania’s industrial and agricultural development.' },
        { p: 'The company’s focus on biological pesticides and fertiliser technologies aligns with efforts to promote locally available solutions for agricultural production and pest management. Continued investment in product development, market access and distribution will be important in translating the reported progress into sustainable commercial growth.' },
        { p: 'The presentation to the Parliamentary Standing Committee on Industries, Trade, Agriculture and Livestock provided an opportunity to share the company’s performance and ongoing initiatives as part of the broader assessment of NDC’s activities.' },
        { p: 'As TBPL continues to develop its products and expand its market reach, effective technology development, regulatory compliance, stronger distribution partnerships and sustained engagement with farmers will remain important to its long-term performance.' },
        { h: 'TBPL records TZS 19.5 billion in sales over three years' },
        { p: 'TBPL has recorded cumulative sales of [[F3|approximately TZS 19.50 billion]] over the past three financial years, reflecting the company’s growing commercial activities and contribution to the agricultural and pest control sectors.' },
        { p: 'According to the performance report presented to the Parliamentary Standing Committee on Industries, Trade, Agriculture and Livestock, the company’s domestic sales reached TZS 18.79 billion, while exports accounted for TZS 710 million.' },
        { p: 'The company’s export markets include Kenya and Uganda, demonstrating its efforts to expand beyond Tanzania and strengthen its presence in regional markets.' },
        { p: 'The performance trend shows a significant increase in annual sales, rising from approximately TZS 0.6 billion in 2023/2024 to about TZS 6.2 billion in 2024/2025, before reaching nearly TZS 12 billion in 2025/2026. This upward trend highlights the company’s expanding commercial performance and the growing importance of its products in the market.' },
        { p: 'The growth in sales provides an important indicator of TBPL’s business development and its potential to contribute further to national industrial development, employment creation and the expansion of locally produced agricultural solutions. Continued efforts to strengthen domestic distribution, improve product awareness and penetrate additional regional markets could further enhance the company’s commercial performance.' }
      ],
      images: [
        { file: 'src/assets/photos/p03-performance-presenter.jpg', px: [1558, 953], sourcePage: 3,
          caption: 'Presenting TBPL’s performance update.', credit: null, flags: ['F16'] }
      ]
    },

    liuka: {
      title: 'TBPL Assesses Mosquito Breeding Sites at New Liuka Gold Mine In Chunya',
      byline: null, // F13: none in source
      sourcePages: '9–10',
      newKicker: 'Field report',
      newStandfirst: 'At New Liuka Gold Mine in Chunya District, Mbeya Region, TBPL specialists inspected the site for conditions that could encourage mosquito breeding, to inform recommendations for control.',
      location: { site: 'New Liuka Gold Mine', district: 'Chunya District', region: 'Mbeya Region' },
      body: [
        { p: 'Tanzania Biotech Products Limited (TBPL) has stepped up efforts to strengthen mosquito control through an environmental assessment visit to New Liuka Gold Mine in Chunya District, Mbeya Region, aimed at identifying potential mosquito breeding sites and recommending appropriate control measures.' },
        { p: 'During the visit, TBPL specialists inspected various areas within the mining site to identify environmental conditions that could encourage mosquito breeding. The team also collected important information to support the preparation of technical recommendations for effective mosquito control and the reduction of breeding grounds.' },
        { p: 'Mining environments can present particular challenges in mosquito control, especially where stagnant water accumulates in excavated areas, drainage channels, or other water-holding locations. Identifying such potential breeding sites is an important step towards developing targeted interventions to minimize mosquito populations and reduce the risk of mosquito-borne diseases.' },
        { p: 'The assessment at New Liuka Gold Mine reflects TBPL’s commitment to applying technical expertise in identifying environmental risks and supporting practical, evidence-based approaches to mosquito control.' },
        { p: 'Information gathered during the exercise will inform the development of professional recommendations tailored to the conditions observed at the mine. These recommendations are expected to guide appropriate interventions aimed at managing potential mosquito breeding sites and improving environmental health.' },
        { p: 'TBPL continues to collaborate with various stakeholders to strengthen mosquito control initiatives and promote environments that are less conducive to mosquito breeding. Through such partnerships, the company seeks to contribute to broader efforts to reduce the spread of mosquito-borne diseases and protect public health.' },
        { p: 'The visit also highlights the importance of collaboration between industrial operators and specialized institutions in addressing environmental health challenges. By identifying potential breeding grounds early and developing appropriate control strategies, stakeholders can take proactive steps towards creating safer and healthier working and surrounding environments.' },
        { p: 'As Tanzania continues to intensify efforts to combat mosquito-borne diseases, TBPL’s engagement with institutions and other stakeholders remains an important part of promoting sustainable mosquito control and strengthening preventive public health[[F13|=>.]]' }
      ],
      // Process steps paraphrase the article's own sequence; every step maps to a sentence above.
      process: [
        { step: 'Inspect', text: 'Specialists inspect areas within the mining site.' },
        { step: 'Identify', text: 'Note conditions that could encourage breeding: stagnant water in excavated areas, drainage channels and other water-holding locations.' },
        { step: 'Collect', text: 'Gather information on the conditions observed.' },
        { step: 'Recommend', text: 'Prepare technical recommendations tailored to the site.' },
        { step: 'Intervene', text: 'Recommendations guide interventions to manage breeding sites and improve environmental health.' }
      ],
      images: [
        { file: 'src/assets/photos/p09-liuka-mine-assessment.jpg', px: [1404, 1363], sourcePage: 9,
          caption: 'The environmental assessment at New Liuka Gold Mine, Chunya District.', credit: null, flags: ['F16'] }
      ]
    },

    editor: {
      title: 'A New Chapter in Innovation, Growth and Impact',
      kicker: 'Message from the Editor',
      byline: 'Samwel Mziray',
      role: 'Chief Editor, TBPL Newsletter',
      sourcePages: '1',
      pullQuote: 'Driving innovation, empowering communities, advancing sustainability, and shaping a prosperous future through biotechnology.',
      body: [
        { p: 'It is with great pleasure and pride that I welcome you to the inaugural edition of the [[F10|Tanzania Biotech Product Limited]] [[F11|Magazine]].' },
        { p: 'This first edition marks an important milestone in our corporate journey. It represents the beginning of a new platform through which we will share our story, celebrate our achievements, communicate our vision, and highlight the people and partnerships contributing to our growth and development.' },
        { p: 'At [[F10|Tanzania Biotech Product Limited]], we recognize the important role that biotechnology, innovation, and scientific advancement can play in addressing today’s challenges and creating opportunities for a more productive and sustainable future. Through our work, we aspire to contribute meaningfully to agricultural development, improved productivity, and the well-being of the communities we serve.' },
        { p: 'This magazine is more than a publication; it is a reflection of our identity, our values, our ambitions, and our collective commitment to excellence. It will provide a space to showcase our initiatives, share knowledge, recognize the dedication of our employees, and strengthen relationships with our customers, partners, stakeholders, and the wider community.' },
        { p: 'As we launch this first edition, we acknowledge the leadership, guidance, dedication, and teamwork that continue to support our company’s progress. We also appreciate the trust and cooperation of our stakeholders, whose contributions are essential to our continued development.' },
        { p: 'We look forward to making this magazine a regular channel for communication, learning, inspiration, and engagement. With every edition, we hope to bring you closer to our work, our people, our achievements, and our aspirations for the future.' },
        { p: 'On behalf of the editorial team, I extend my sincere appreciation to everyone who has contributed to making this first edition possible. Your support and commitment have helped turn this vision into reality.' }
      ],
      images: [{ file: 'src/assets/photos/p01-editor-portrait.jpg', px: [385, 368], caption: 'Samwel Mziray' }]
    },

    morogoro: {
      title: 'TBPL Hands Over Malaria Control Equipment to Nine Morogoro Councils',
      byline: 'Miriam Chavalla',
      sourcePages: '6–7',
      newKicker: 'Field report · Morogoro Region',
      handedOver: '[[F9|Biolarvicides]]',
      newStandfirst: 'Pumps, protective boots and Biolarvicides were handed over to nine councils in Morogoro Region to support malaria prevention and control.',
      body: [
        { p: 'Tanzania Biotech Products Limited (TBPL), a subsidiary of the National Development Corporation (NDC), has handed over pumps, protective boots and [[F9|Biolarvicides]] to nine councils in Morogoro Region as part of efforts to strengthen the fight against malaria.' },
        { p: 'The support is a result of collaboration between TBPL and the Morogoro Regional Government, aimed at strengthening malaria prevention and control interventions and improving the capacity of local authorities to respond effectively to the disease.' },
        { p: 'The equipment was formally handed over by TBPL Marketing Manager at Morogoro Region, Mr. Samwel Paul Mziray, to Morogoro Regional Commissioner, Hon. Queen Sendiga, during an event attended by senior government officials and health authorities.' },
        { p: 'The handover was witnessed by District Commissioners, Council Directors, Administrative Secretaries, the Regional Medical Officer, the Regional Administrative Secretary and other government officials.' },
        { p: 'The intervention is expected to enhance the capacity of the beneficiary councils to undertake malaria control activities, particularly interventions aimed at reducing mosquito breeding sites and controlling the spread of malaria within communities.' },
        { p: 'Speaking during the handover ceremony, Hon. Sendiga underscored the importance of collaboration between government institutions and local industries in addressing public health challenges. She noted that partnerships of this nature are important in complementing government efforts to protect communities from preventable diseases.' },
        { p: 'The initiative also demonstrates the growing contribution of locally produced biological and vector-control products in addressing health and environmental challenges facing Tanzanian communities.' },
        { p: 'As a subsidiary of NDC, TBPL plays an important role in the production and promotion of biological vector-control products. Through such interventions, the company continues to contribute to national development by supporting initiatives that improve public health while promoting local industrial capacity.' },
        { p: 'Malaria remains a significant public health concern in Tanzania, requiring sustained efforts in prevention, early detection and treatment, as well as effective vector control measures. The availability of appropriate [[F15|equipment’s=>equipment]] at the local government level is therefore critical to ensuring that malaria control interventions reach communities effectively.' },
        { p: 'The support to the nine councils is consequently expected to strengthen ongoing malaria prevention activities across Morogoro Region and contribute to broader national efforts to reduce the burden of malaria.' },
        { p: 'The TBPL–Morogoro Regional Government partnership further demonstrates the importance of cooperation between public institutions, local industries and communities in addressing national development challenges.' },
        { p: 'Through continued collaboration and investment in locally available solutions, stakeholders can strengthen malaria control interventions and contribute to the national goal of building healthier and more productive communities.' }
      ],
      images: [
        { file: 'src/assets/photos/p06-morogoro-handover.jpg', px: [1693, 1035], caption: 'The equipment handover in Morogoro Region.' },
        { file: 'src/assets/photos/p07-morogoro-handover-group.jpg', px: [1055, 510], caption: 'Equipment for the nine councils at the handover.' }
      ]
    },

    nanenane: {
      title: 'TBPL Promotes Biotechnology Solutions and Youth Participation in Ecological Agriculture',
      byline: 'Upendo Kessy',
      sourcePages: '8–9',
      newKicker: 'Field report · Dodoma',
      // Unattributed in the source (F14); printed as it appears there.
      pullQuote: 'Empowering young people with knowledge, technology and practical opportunities in agriculture is essential for building a productive and sustainable agricultural sector. When young people are equipped to embrace innovation and value addition, agriculture becomes not only a source of food, but also a pathway to entrepreneurship, employment and economic transformation.',
      body: [
        { p: 'Tanzania Biotech Products Limited (TBPL), a subsidiary of the National Development Corporation (NDC), used the 2026 Nanenane Exhibition in Dodoma to promote biotechnology-based solutions and encourage greater participation of young people in ecological agriculture.' },
        { p: 'During the exhibition, held under the Youth Conference on Ecological Agriculture 2026, TBPL showcased its biological products and engaged young people on the use of knowledge and technology to improve agricultural productivity, reduce crop losses and create opportunities along the agricultural value chain.' },
        { p: 'The engagement provided an opportunity for TBPL to create awareness of biological solutions that support sustainable agriculture while encouraging young people to explore opportunities in agribusiness, innovation and value addition.' },
        { p: 'Through its participation, TBPL continues to demonstrate NDC’s commitment to promoting strategic investments, technology and industrial solutions that contribute to sustainable development and improved livelihoods.' }
      ],
      images: [{ file: 'src/assets/photos/p08-nanenane-dodoma.jpg', px: [1319, 743], caption: 'TBPL’s products on show at the 2026 Nanenane Exhibition, Dodoma.' }]
    },

    embassy: {
      title: 'TBPL Takes Biological Solutions to the Embassy of Canada: Promoting a Healthier and Safer Environment',
      sourceTitle: 'TBPL Takes Biological Solutions to the Denmark Embassy: Promoting a Healthier and Safer Environment',
      byline: 'Joyce Mgaya',
      sourcePages: '11–12',
      flags: ['F1'],
      newKicker: 'Field report · Engagement',
      // Each item restates an activity named in the article.
      activities: [
        { step: 'Educate', text: 'Education on the proper use of biological products in environmental management and mosquito control.' },
        { step: 'Inspect', text: 'Inspection of mosquito breeding sites within the Embassy premises.' },
        { step: 'Introduce', text: 'Information on three products: [[F9|Thurisave-24]], Bactivec and [[F9|Griselesf]].' }
      ],
      body: [
        { p: 'In its continued commitment to promoting biological solutions and creating awareness about the importance of a clean, healthy, and safe environment, [[F10|Tanzania Biotech Product Limited]] (TBPL) conducted an educational visit to the Embassy of Canada.' },
        { p: 'The visit provided an important opportunity for TBPL to engage with the Embassy on the use and benefits of biological products, while highlighting practical approaches to mosquito control and environmental management.' },
        { h: 'Turning Knowledge into Action' },
        { p: 'During the visit, the TBPL team provided education on the proper use of biological products, emphasizing the importance of understanding how these solutions can be applied appropriately as part of environmental management and mosquito control efforts.' },
        { p: 'A key activity was the inspection of mosquito breeding sites within the premises. This exercise helped draw attention to the importance of identifying areas where mosquitoes may breed and understanding how appropriate control measures can help reduce mosquito populations.' },
        { p: 'By combining practical inspection with educational engagement, TBPL demonstrated the value of an informed and proactive approach to mosquito management. The activity also reinforced the importance of addressing potential breeding sites alongside the appropriate use of biological control products.' },
        { h: 'Introducing TBPL’s Biological Products' },
        { p: 'As part of the educational session, the team introduced and provided information about three products: [[F9|Thurisave-24]], Bactivec, and [[F9|Griselesf]].' },
        { p: 'The discussion focused on building awareness of these products and helping the audience understand their intended uses and the importance of following the appropriate application instructions.' },
        { p: 'Through this engagement, TBPL sought to encourage informed decision-making and responsible product use. Such education is essential in helping institutions and communities understand the available biological solutions and how they may contribute to effective environmental management when used correctly.' },
        { h: 'Building Partnerships Through Education' },
        { p: 'The visit to the Embassy of Canada reflects the importance of collaboration, professional engagement, and knowledge-sharing in advancing awareness of biological products.' },
        { p: 'For TBPL, this initiative was more than a routine visit. It was an opportunity to demonstrate its commitment to education, practical environmental assessment, and the promotion of biological approaches to mosquito management.' },
        { p: 'Engaging with institutions and stakeholders creates opportunities to exchange knowledge, address environmental concerns, and encourage the adoption of appropriate solutions tailored to specific needs.' },
        { h: 'A Step Towards a Healthier Environment' },
        { p: 'As [[F10|Tanzania Biotech Product Limited]] continues to expand awareness of its biological products and their applications, initiatives such as this visit demonstrate the value of taking knowledge beyond the workplace and into real-world settings.' },
        { p: 'By combining education, inspection, and product awareness, TBPL continues to promote informed approaches to environmental management and mosquito control.' },
        { p: 'The visit to the Embassy of Canada stands as an example of the company’s commitment to sharing knowledge, strengthening stakeholder engagement, and contributing to efforts aimed at creating healthier and safer environments.' }
      ],
      images: [{ file: 'src/assets/photos/p11-embassy-visit.jpg', px: [1045, 656], caption: 'The TBPL team’s visit to the Embassy of Canada.' }]
    },

    tanga: {
      title: 'TBPL Showcases Agricultural Biotechnology Innovations at World Food Day Exhibition In Tanga',
      byline: 'Joyce Mgaya',
      sourcePages: '13–14',
      newKicker: 'Products · Tanga',
      newStandfirst: 'At the World Food Day Exhibition in Tanga, TBPL presented its biological crop-protection product Thurisave and introduced two bio-fertilisers expected on the market in early January 2027.',
      quote: { text: 'The World Food Day Exhibition provided TBPL with an important platform to showcase our agricultural biotechnology products and raise awareness of biological solutions for crop protection and soil health. We are also looking forward to introducing Fosforina and Dimargon to the market in early January 2027, as we continue working to make biological agricultural inputs available to farmers in Tanzania.', who: 'Magdalena Uisso', role: 'Marketing Officer, TBPL' },
      body: [
        { p: 'Tanzania Biotech Products Limited (TBPL) showcased its agricultural biotechnology products at the World Food Day Exhibition held at Usagara Secondary School Grounds in Tanga Region from 10 to 16 October 2026, highlighting biological solutions aimed at supporting crop protection and sustainable agricultural production.' },
        { p: 'During the exhibition, TBPL presented [[F9|Thurisave]], a biological crop-protection product intended for use on maize, vegetables and cashew crops. The company also introduced visitors to Fosforina and Dimargon, two bio-fertiliser products expected to enter the market in early January 2027.' },
        { p: 'The exhibition provided TBPL with an opportunity to engage farmers, agricultural stakeholders and members of the public on the potential uses of biological agricultural products and their role in supporting farming activities.' },
        { p: 'The Deputy Permanent Secretary of the Ministry of Agriculture, Prof. Peter Msoffe, visited TBPL’s exhibition booth, where he was briefed on the products on display, including the planned introduction of Fosforina and Dimargon. He showed interest in the products presented during the visit, although no formal commitment was made regarding support for their market introduction.' },
        { p: 'Speaking about TBPL’s participation in the exhibition, the company’s Marketing Officer, Ms. Magdalena Uisso, said the event provided an important opportunity to introduce the company’s products to farmers and other stakeholders.' },
        { p: '“The World Food Day Exhibition provided TBPL with an important platform to showcase our agricultural biotechnology products and raise awareness of biological solutions for crop protection and soil health. We are also looking forward to introducing Fosforina and Dimargon to the market in early January 2027, as we continue working to make biological agricultural inputs available to farmers in Tanzania,” said Ms. Uisso.' },
        { p: 'The planned introduction of Fosforina and Dimargon is part of TBPL’s efforts to expand its agricultural product portfolio and provide farmers with additional options for supporting crop production. Through its technological collaboration with LABIOFAM, the company continues to pursue the development and promotion of biotechnology-based products for agricultural use.' },
        { p: 'As the two bio-fertilizers approach their expected market introduction, farmer education, product quality assurance and guidance on proper application will be important in helping users understand their intended benefits and use the products appropriately.' },
        { p: 'TBPL’s participation in the World Food Day Exhibition reflects its continued efforts to increase awareness of its agricultural products and strengthen engagement with farmers, distributors and other stakeholders. By showcasing [[F9|Thurisave 24]], Fosforina and Dimargon, the company highlighted its growing range of biological agricultural solutions and its contribution to discussions on sustainable agricultural production in Tanzania.' }
      ],
      images: [{ file: 'src/assets/photos/p13-world-food-day-tanga.jpg', px: [1076, 712], caption: 'At TBPL’s booth, World Food Day Exhibition, Tanga.' }]
    },

    njombe: {
      title: 'Njombe Regional Councillors Visit TBPL in Kibaha to Learn About Biological Products',
      byline: '[[F12|Aisha Mohammed]]',
      sourcePages: '15–16',
      newKicker: 'Field report · Kibaha, Pwani',
      newStandfirst: 'A delegation of councillors from Njombe Region visited TBPL’s premises in Kibaha to learn about biological products and their uses.',
      body: [
        { p: '[[F10|Tanzania Biotech Product Limited]] (TBPL) welcomed a delegation of councillors from Njombe Region to its premises in Kibaha, Pwani, for an educational visit aimed at increasing their understanding of biological products and their applications.' },
        { p: 'The delegation was warmly received by Mr. Gaspar Kimbi, Acting General Manager of TBPL, who welcomed the visitors and introduced them to the company’s work in promoting biological solutions.' },
        { p: 'During the visit, the councillors had an opportunity to learn about different biological products, their intended uses, and their potential role in addressing agricultural and environmental challenges.' },
        { p: 'The educational session provided a platform for sharing knowledge, exchanging ideas, and increasing awareness of the importance of using biological products appropriately and responsibly.' },
        { p: 'The visit also highlighted the importance of connecting local government leaders with organisations that promote innovation and sustainable solutions. As representatives of their respective communities, the councillors have an important role in sharing knowledge, raising awareness, and supporting initiatives that contribute to community development.' },
        { p: 'Through their engagement with TBPL, the delegation gained an opportunity to learn more about the contribution of biological products to agricultural development and environmental management. The visit also created room for meaningful interaction between the company and local leaders, reinforcing the importance of collaboration between the private sector and local government authorities.' },
        { p: 'For TBPL, hosting the delegation was an opportunity to share knowledge, introduce its biological products, and strengthen relationships with leaders who can help extend awareness to communities across their areas of responsibility.' },
        { p: 'The visit from Njombe Region to Kibaha marked another step towards building stronger connections between innovation and communities. It demonstrated how educational visits can create opportunities for learning, encourage dialogue, and promote a better understanding of biological solutions.' },
        { p: 'As Tanzania continues to explore innovative approaches to agriculture and environmental management, TBPL remains committed to promoting awareness and knowledge-sharing among stakeholders. The engagement with the Njombe councillors reflected the value of working together to bring knowledge and innovative solutions closer to the people.' }
      ],
      images: [{ file: 'src/assets/photos/p15-kibaha-laboratory.jpg', px: [3271, 2187], caption: 'Councillors from Njombe Region during their visit to TBPL in Kibaha.' }]
    },

    elnino: {
      title: 'NDC Through TBPL Strengthens Malaria Control Efforts Ahead of Expected [[F15|El Nino=>El Niño]]',
      byline: '[[F12|Aisha Mohammed]]',
      sourcePages: '17–18',
      newKicker: 'Explainer · Malaria control',
      newStandfirst: 'On Radio One’s Kumepambazuka programme, TBPL set out how targeting mosquito larvae at breeding sites supports malaria prevention during heavy rains.',
      quote: { text: 'We believe that by continuing to effectively use these interventions, Tanzania can make further progress towards the national goal and the World Health Organization’s global target of eliminating malaria by 2030. National malaria prevalence has declined from 14.3 per cent to 5.5 per cent, while Arusha and Njombe have recorded prevalence levels below one per cent, alongside similar progress in Zanzibar.', who: 'Samwel Paul Mziray', role: 'Marketing Manager, TBPL' },
      // Chain of cause and effect, each link stated in the article.
      chain: [
        { step: 'Heavy rainfall', text: 'Expected El Nino-related rainfall.' },
        { step: 'Stagnant water', text: 'Increased rainfall can lead to the accumulation of stagnant water.' },
        { step: 'Breeding sites', text: 'Creating favourable breeding conditions; breeding sites can increase in rainy periods.' },
        { step: 'Larvae', text: 'TBPL’s approach targets mosquito larvae at breeding sites…', intervene: true },
        { step: 'Adult mosquitoes', text: '…before they develop into adult mosquitoes capable of transmitting malaria.' }
      ],
      body: [
        { p: 'The National Development Corporation (NDC), through its subsidiary Tanzania Biotech Products Limited (TBPL), is strengthening public awareness of sustainable malaria control measures ahead of expected [[F15|El Nino=>El Niño]]-related rainfall. The initiative highlights the importance of early prevention and environmentally friendly interventions in reducing mosquito populations and mitigating the risk of malaria transmission.' },
        { p: 'Increased rainfall can lead to the accumulation of stagnant water, creating favourable breeding conditions for mosquitoes. Early intervention, proper environmental management and community participation are therefore essential in preventing mosquito breeding and reducing the potential spread of malaria, particularly during periods of heavy rainfall.' },
        { p: 'These efforts were highlighted during a live broadcast of Radio One’s Kumepambazuka programme from NDC Headquarters in Dar es Salaam, where TBPL showcased its contribution to public health through biotechnology-based solutions. The programme provided an opportunity to educate the public on preventive measures and the role of locally developed biological products in supporting the country’s malaria control efforts.' },
        { p: 'Speaking during the broadcast, Mr. Samwel Paul Mziray, TBPL Marketing Manager, expressed optimism about Tanzania’s progress in reducing malaria prevalence. He emphasized that sustained use of effective interventions and continued public awareness are important in advancing national and global efforts towards malaria elimination by 2030.' },
        { p: '“We believe that by continuing to effectively use these interventions, Tanzania can make further progress towards the national goal and the World Health Organization’s global target of eliminating malaria by 2030. National malaria prevalence has declined from [[F8|14.3 per cent to 5.5 per cent]], while Arusha and Njombe have recorded prevalence levels below one per cent, alongside similar progress in Zanzibar,” said Mr. Mziray.' },
        { p: 'Through its biotechnology-based approach, TBPL promotes solutions that target mosquito larvae at breeding sites before they develop into adult mosquitoes capable of transmitting malaria. This approach supports preventive vector control, particularly during rainy periods when mosquito breeding sites can increase. Its effectiveness, however, depends on appropriate product use alongside other recommended malaria prevention and control measures.' },
        { p: 'The initiative reflects NDC’s broader commitment to promoting local industrial capacity and innovative solutions that address national development priorities. Through TBPL, the Corporation continues to demonstrate how biotechnology can contribute to public health protection, environmental sustainability and the implementation of national development objectives.' },
        { p: 'As Tanzania continues its efforts towards malaria elimination, collaboration among government institutions, health-sector stakeholders and local communities remains vital. Public awareness, environmental management and the appropriate use of effective preventive interventions will be essential in sustaining progress and strengthening resilience against malaria, particularly during periods of increased rainfall.' }
      ],
      images: [{ file: 'src/assets/photos/p17-radio-one-broadcast.jpg', px: [2194, 1519], caption: 'TBPL on Radio One’s Kumepambazuka programme, broadcast live from NDC Headquarters, Dar es Salaam.' }]
    },

    /* Product reference for the explainer page: only what this issue states about each product. */
    products: [
      { name: '[[F9|Thurisave]]', variants: 'also “Thurisave-24”, “Thurisave 24”', type: 'Biological crop protection', said: 'Intended for use on maize, vegetables and cashew crops.', status: 'On display, Tanga; introduced at the Embassy of Canada', flags: ['F9'] },
      { name: 'Bactivec', type: 'Biological product', said: 'Introduced at the Embassy of Canada; uses not described in this issue.', status: 'Introduced to the Embassy' },
      { name: '[[F9|Griselesf]]', type: 'Biological product', said: 'Introduced at the Embassy of Canada; uses not described in this issue.', status: 'Introduced to the Embassy', flags: ['F9'] },
      { name: 'Fosforina', type: 'Bio-fertiliser', said: 'Trial production with Dimargon: 3,475 litres.', status: 'Expected on the market in early January 2027', projected: true, flags: ['F26'] },
      { name: 'Dimargon', type: 'Bio-fertiliser', said: 'Trial production with Fosforina: 3,475 litres.', status: 'Expected on the market in early January 2027', projected: true, flags: ['F26'] }
    ],
    // Bio-fertiliser milestones in sequence; each one is stated in the issue.
    pipeline: [
      { when: 'Trial', what: '3,475 litres of Fosforina and Dimargon produced on a trial basis', page: 4 },
      { when: 'Ongoing', what: 'Engagement with the Tanzania Fertilizer Regulatory Authority (TFRA)', page: 4 },
      { when: '10–16 Oct 2026', what: 'Introduced to visitors at the World Food Day Exhibition, Tanga', page: 14 },
      { when: 'Early Jan 2027', what: 'Expected market entry', page: 14, projected: true }
    ],
  },

  /* Places named in the issue, for the contents-page map. Page = new folio. Embassy and Parliament locations are not stated, so are not mapped. */
  storyMap: [
    { place: 'dar', page: 18, side: 'left', ox: 6, oy: 52 },
    { place: 'kibaha', page: 16, side: 'left', ox: -18, oy: -48 },
    { place: 'morogoro', page: 7, side: 'left', oy: 18 },
    { place: 'dodoma', page: 9, side: 'left' },
    { place: 'tanga', page: 14, side: 'left' },
    { place: 'chunya', page: 10, side: 'right' },
    { place: 'njombe', page: 16, side: 'right' }
  ],

  /* Table of contents, in source order. `page` is the printed folio in the original issue. */
  contents: [
    { page: 1, title: 'Message from the Chief Editor', byline: 'Samwel Mziray', template: 'editorial' },
    { page: 2, title: 'TBPL Expands Agricultural and Pest Control Solutions, Strengthens Market Reach', byline: 'Jackson Kelvin', template: 'data' },
    { page: 6, title: 'TBPL Hands Over Malaria Control Equipment to Nine Morogoro Councils', byline: 'Miriam Chavalla', template: 'field' },
    { page: 8, title: 'TBPL Promotes Biotechnology Solutions and Youth Participation in Ecological Agriculture', byline: 'Upendo Kessy', template: 'field' },
    { page: 9, title: 'TBPL Assesses Mosquito Breeding Sites at New Liuka Gold Mine In Chunya', byline: null, template: 'field' },
    { page: 11, title: 'TBPL Takes Biological Solutions to the Denmark Embassy: Promoting a Healthier and Safer Environment', byline: 'Joyce Mgaya', template: 'field', flags: ['F1'] },
    { page: 13, title: 'TBPL Showcases Agricultural Biotechnology Innovations at World Food Day Exhibition In Tanga', byline: 'Joyce Mgaya', template: 'explainer' },
    { page: 15, title: 'Njombe Regional Councillors Visit TBPL in Kibaha to Learn About Biological Products', byline: 'Aisha Mohammed', template: 'field' },
    { page: 17, title: 'NDC Through TBPL Strengthens Malaria Control Efforts Ahead of Expected El Nino', byline: 'Aisha Mohammed', template: 'explainer' }
  ]
};
