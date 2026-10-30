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
      reporters: ['Aisha Mohamed', 'Jackson Kelvin', 'Miriam Chavalla', 'Upendo Kessy', 'Joyce Mgaya'],
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
    F1: { severity: 'critical', page: '2, 11, 12', text: 'Contents and headline say "Denmark Embassy"; the body text names the "Embassy of Canada" three times. Confirm which embassy was visited.' },
    F2: { severity: 'high', page: 2, text: 'Article says progress was recorded "during the 2026/2027 financial year", but the pesticide sales figure is "by June 2026", which falls in FY 2025/26 if the financial year runs July–June. Confirm the reporting period.' },
    F3: { severity: 'high', page: 4, text: 'The three annual figures (≈0.6 + ≈6.2 + ≈12) total ≈TZS 18.8 bn, which matches domestic sales (18.79) rather than the cumulative total (19.50). Confirm whether the annual series is domestic-only, and supply exact annual values.',
      resolution: 'Exact figures unavailable (client, 30 Oct 2026). Publish as approximate with the source qualifiers, and note that the annual figures do not sum exactly to the total. Do not show growth multiples.' },
    F4: { severity: 'medium', page: 4, text: 'Domestic (18.79) and export (0.71) sales sum exactly to 19.50, but the period they cover is not stated explicitly. Confirm they are three-year totals.' },
    F5: { severity: 'high', page: 3, text: 'Subhead says the "distribution network expands across the country", but councils served fell from 178 (2024/25) to 149 (2025/26). Headline and data point in different directions; editor to resolve wording or explain.' },
    F6: { severity: 'medium', page: 3, text: '751,870 litres "distributed": no period, product mix or relationship to the 13,131 litres sold is given (distribution volume is ~57× sales volume). Clarify scope before visualising alongside sales.' },
    F7: { severity: 'low', page: 4, text: 'Two different country lists: samples sent to Mozambique, Kenya and Malawi; export markets "include" Kenya and Uganda. Not contradictory, but the map must keep the categories distinct. Is the export list complete?' },
    F8: { severity: 'high', page: 18, text: 'Malaria prevalence 14.3% → 5.5%, Arusha/Njombe <1%: appears only within a quotation, with no years or survey source. Present as a quote, not a chart, unless an official source and survey years are supplied.' },
    F9: { severity: 'medium', page: '12–14', text: 'Product name variants: "Thurisave-24", "Thurisave" and "Thurisave 24"; "Griselesf" (spelling unverified); "Biolarvicides" capitalised as a product name. Supply the official product-name list.' },
    F10: { severity: 'low', page: 'multiple', text: 'Company name appears as both "Tanzania Biotech Products Limited" and "Tanzania Biotech Product Limited".' },
    F11: { severity: 'low', page: '2, 1', text: 'Contents lists "Message from the Chief Editor"; the page is headed "Message from the Editor". The editor\'s letter calls the publication a "Magazine"; the masthead says "Newsletter".' },
    F12: { severity: 'low', page: '2, 15, 17', text: 'Reporter spelled "Aisha Mohamed" (editorial board) and "Aisha Mohammed" (bylines).' },
    F13: { severity: 'critical', page: 10, text: 'Liuka Gold Mine article ends mid-sentence ("…strengthening preventive public health") with no closing text. It also has no byline and no date for the visit.' },
    F14: { severity: 'medium', page: 8, text: 'Nanenane pull quote ("Empowering young people…") is unattributed.' },
    F15: { severity: 'low', page: 'multiple', text: 'Typos and style: "Ecological Agricultur" (cover), "commitee" (p3), "equipment\'s" (p7), "Pg.." (cover); mixed UK/US spelling (fertiliser/fertilizer, neighbour/neighbor); "El Nino" vs "El Niño". Agree a house style.' },
    F16: { severity: 'high', page: 'all', text: 'No photograph has a caption or photographer credit, and people pictured are not identified. A caption and credit sheet is needed before publication; draft captions in this project are marked "to confirm".' },
    F17: { severity: 'high', page: 'all', text: 'Embedded photos are 1,000–1,700 px wide (one at 3,271 px). Full-page print needs ~2,500–3,500 px. Supply original camera files.',
      resolution: 'No originals available. Use the images embedded in the PDF (already extracted at full embedded resolution) and size each one to its resolution; see docs/02-design-system.md > Asset rules. Possible source: the original InDesign package from the layout designer.' },
    F18: { severity: 'medium', page: 'all', text: 'Logo is only available as a 345×145 px raster extracted from the PDF. Supply vector master files and brand guidelines (Pantone/CMYK values). Colours in this project are sampled from the artwork.',
      resolution: 'No vector logo available. Use the extracted raster as supplied, never redrawn or traced, at 30 mm wide or less (about 290 ppi), always on a light background.' },
    F19: { severity: 'low', page: '3, 5', text: 'Stray text fragments in the right margin ("P o o", "D J m p"): overset or hidden text frames in the source InDesign file. Check nothing was meant to appear there.' },
    F20: { severity: 'low', page: 'all', text: 'Page background is a pink tint (#FEF7FC), probably unintended.' },
    F21: { severity: 'low', page: '1, 6, 18', text: 'The Chief Editor (Samwel Mziray) is also quoted and pictured as TBPL Marketing Manager (Samwel Paul Mziray). Confirm the preferred name form.' },
    F22: { severity: 'medium', page: '6–18', text: 'Dates missing for most events (Morogoro handover, Liuka visit, Embassy visit, Njombe visit, Radio One broadcast, Nanenane). Only the Tanga exhibition is dated.' },
    F23: { severity: 'medium', page: 6, text: 'Morogoro handover: quantities of pumps, boots and Biolarvicides, and the names of the nine councils, are not stated. Cannot be visualised without them.' },
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
        { p: 'The trials form part of efforts to advance the use of biological products in agriculture. The [[F15|commitee]] was informed that engagement with the Tanzania Fertilizer Regulatory Authority (TFRA) was ongoing.' },
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
          draftCaption: 'A TBPL performance presentation. Speaker, venue and date to confirm.', credit: null, flags: ['F16'] }
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
        { p: 'As Tanzania continues to intensify efforts to combat mosquito-borne diseases, TBPL’s engagement with institutions and other stakeholders remains an important part of promoting sustainable mosquito control and strengthening preventive public health[[F13| […]]]' }
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
          draftCaption: 'TBPL specialists examine water samples during the assessment at New Liuka Gold Mine, Chunya. Names and date to confirm.', credit: null, flags: ['F16', 'F17'] }
      ]
    }
  },

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
