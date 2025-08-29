export type PartnerCategory = 'Konten' | 'Versicherungen' | 'Abos' | 'Sonstiges'

export type PartnerItem = {
  id: string
  name: string
  category: PartnerCategory
  domain?: string
  logoUrl?: string
}

export const PARTNERS: PartnerItem[] = [
  // Konten (Banken)
  { id: 'nordlb', name: 'NORD/LB', category: 'Konten', domain: 'nordlb.de' },
  { id: 'sparkasse', name: 'Sparkasse', category: 'Konten', domain: 'sparkasse.de' },
  { id: 'dkb', name: 'DKB', category: 'Konten', domain: 'dkb.de' },
  { id: 'ing', name: 'ING', category: 'Konten', domain: 'ing.de' },
  { id: 'deutschebank', name: 'Deutsche Bank', category: 'Konten', domain: 'deutsche-bank.de' },
  { id: 'commerzbank', name: 'Commerzbank', category: 'Konten', domain: 'commerzbank.de' },
  { id: 'hypovereinsbank', name: 'HypoVereinsbank', category: 'Konten', domain: 'hypovereinsbank.de' },
  { id: 'n26', name: 'N26', category: 'Konten', domain: 'n26.com' },
  { id: 'targobank', name: 'Targobank', category: 'Konten', domain: 'targobank.de' },
  { id: 'postbank', name: 'Postbank', category: 'Konten', domain: 'postbank.de' },
  { id: 'comdirect', name: 'comdirect', category: 'Konten', domain: 'comdirect.de' },
  { id: 'santander', name: 'Santander', category: 'Konten', domain: 'santander.de' },
  { id: 'bbbank', name: 'BBBank', category: 'Konten', domain: 'bbbank.de' },
  { id: 'gls', name: 'GLS Bank', category: 'Konten', domain: 'gls.de' },
  { id: 'psd', name: 'PSD Bank', category: 'Konten', domain: 'psd-bank.de' },
  { id: 'sparda', name: 'Sparda-Bank', category: 'Konten', domain: 'sparda.de' },
  { id: 'consorsbank', name: 'Consorsbank', category: 'Konten', domain: 'consorsbank.de' },
  { id: 'revolut', name: 'Revolut', category: 'Konten', domain: 'revolut.com' },
  { id: 'bunq', name: 'bunq', category: 'Konten', domain: 'bunq.com' },
  { id: 'wise', name: 'Wise', category: 'Konten', domain: 'wise.com' },

  // Versicherungen / Krankenkassen
  { id: 'tk', name: 'Techniker Krankenkasse', category: 'Versicherungen', domain: 'tk.de' },
  { id: 'aok', name: 'AOK', category: 'Versicherungen', domain: 'aok.de' },
  { id: 'dak', name: 'DAK-Gesundheit', category: 'Versicherungen', domain: 'dak.de' },
  { id: 'barmer', name: 'Barmer', category: 'Versicherungen', domain: 'barmer.de' },
  { id: 'huk', name: 'HUK-COBURG', category: 'Versicherungen', domain: 'huk.de' },
  { id: 'allianz', name: 'Allianz', category: 'Versicherungen', domain: 'allianz.de' },
  { id: 'axa', name: 'AXA', category: 'Versicherungen', domain: 'axa.de' },
  { id: 'debeka', name: 'Debeka', category: 'Versicherungen', domain: 'debeka.de' },
  { id: 'ruv', name: 'R+V', category: 'Versicherungen', domain: 'ruv.de' },
  { id: 'signaliduna', name: 'SIGNAL IDUNA', category: 'Versicherungen', domain: 'signal-iduna.de' },
  { id: 'ergo', name: 'ERGO', category: 'Versicherungen', domain: 'ergo.de' },
  { id: 'generali', name: 'Generali', category: 'Versicherungen', domain: 'generali.de' },
  { id: 'gothaer', name: 'Gothaer', category: 'Versicherungen', domain: 'gothaer.de' },
  { id: 'provinzial', name: 'Provinzial', category: 'Versicherungen', domain: 'provinzial.de' },
  { id: 'lvm', name: 'LVM', category: 'Versicherungen', domain: 'lvm.de' },
  { id: 'hansemerkur', name: 'HanseMerkur', category: 'Versicherungen', domain: 'hansemerkur.de' },
  { id: 'ikkclassic', name: 'IKK classic', category: 'Versicherungen', domain: 'ikk-classic.de' },
  { id: 'hek', name: 'HEK', category: 'Versicherungen', domain: 'hek.de' },
  { id: 'kkh', name: 'KKH', category: 'Versicherungen', domain: 'kkh.de' },

  // Abos / Streaming / Dienste
  { id: 'netflix', name: 'Netflix', category: 'Abos', domain: 'netflix.com' },
  { id: 'spotify', name: 'Spotify', category: 'Abos', domain: 'spotify.com' },
  { id: 'disney', name: 'Disney+', category: 'Abos', domain: 'disneyplus.com' },
  { id: 'prime', name: 'Amazon Prime', category: 'Abos', domain: 'amazon.de' },
  { id: 'dazn', name: 'DAZN', category: 'Abos', domain: 'dazn.com' },
  { id: 'audible', name: 'Audible', category: 'Abos', domain: 'audible.de' },
  { id: 'dropbox', name: 'Dropbox', category: 'Abos', domain: 'dropbox.com' },
  { id: 'icloud', name: 'iCloud', category: 'Abos', domain: 'icloud.com' },
  { id: 'applemusic', name: 'Apple Music', category: 'Abos', domain: 'apple.com' },
  { id: 'youtube', name: 'YouTube Premium', category: 'Abos', domain: 'youtube.com' },
  { id: 'microsoft365', name: 'Microsoft 365', category: 'Abos', domain: 'microsoft.com' },
  { id: 'googleone', name: 'Google One', category: 'Abos', domain: 'google.com' },
  { id: 'adobe', name: 'Adobe', category: 'Abos', domain: 'adobe.com' },
  { id: 'playstation', name: 'PlayStation Plus', category: 'Abos', domain: 'playstation.com' },
  { id: 'xbox', name: 'Xbox Game Pass', category: 'Abos', domain: 'xbox.com' },
  { id: 'nintendo', name: 'Nintendo Switch Online', category: 'Abos', domain: 'nintendo.com' },
  { id: 'sky', name: 'Sky', category: 'Abos', domain: 'sky.de' },
  { id: 'waipu', name: 'waipu.tv', category: 'Abos', domain: 'waipu.tv' },
  { id: 'zattoo', name: 'Zattoo', category: 'Abos', domain: 'zattoo.com' },
  { id: 'joyn', name: 'Joyn', category: 'Abos', domain: 'joyn.de' },
  { id: 'rtlplus', name: 'RTL+', category: 'Abos', domain: 'rtlplus.com' },
  { id: 'paramount', name: 'Paramount+', category: 'Abos', domain: 'paramountplus.com' },
  { id: 'deezer', name: 'Deezer', category: 'Abos', domain: 'deezer.com' },
  { id: 'bahn', name: 'Deutsche Bahn', category: 'Abos', domain: 'bahn.de' },
  { id: 'adac', name: 'ADAC', category: 'Abos', domain: 'adac.de' },

  // Telekommunikation (als Abos)
  { id: 'telekom', name: 'Telekom', category: 'Abos', domain: 'telekom.de' },
  { id: 'vodafone', name: 'Vodafone', category: 'Abos', domain: 'vodafone.de' },
  { id: 'o2', name: 'o2', category: 'Abos', domain: 'o2online.de' },
  { id: '1und1', name: '1&1', category: 'Abos', domain: '1und1.de' },
  { id: 'congstar', name: 'congstar', category: 'Abos', domain: 'congstar.de' },
  { id: 'pyur', name: 'PYUR', category: 'Abos', domain: 'pyur.com' },
  { id: 'ewe', name: 'EWE', category: 'Abos', domain: 'ewe.de' },
  { id: 'mnet', name: 'M-net', category: 'Abos', domain: 'm-net.de' },
  { id: 'netcologne', name: 'NetCologne', category: 'Abos', domain: 'netcologne.de' },
  { id: 'telecolumbus', name: 'Tele Columbus', category: 'Abos', domain: 'telecolumbus.de' },

  // Energie/Versorger (Adresse wichtig) – Sonstiges
  { id: 'eon', name: 'E.ON', category: 'Sonstiges', domain: 'eon.de' },
  { id: 'vattenfall', name: 'Vattenfall', category: 'Sonstiges', domain: 'vattenfall.de' },
  { id: 'enbw', name: 'EnBW', category: 'Sonstiges', domain: 'enbw.com' },
  { id: 'rwe', name: 'RWE', category: 'Sonstiges', domain: 'rwe.com' },
  { id: 'lichtblick', name: 'LichtBlick', category: 'Sonstiges', domain: 'lichtblick.de' },
  { id: 'mainova', name: 'Mainova', category: 'Sonstiges', domain: 'mainova.de' },
  { id: 'swm', name: 'Stadtwerke München', category: 'Sonstiges', domain: 'swm.de' },
  { id: 'rheinenergie', name: 'RheinEnergie', category: 'Sonstiges', domain: 'rheinenergie.com' },
  { id: 'westenergie', name: 'Westenergie', category: 'Sonstiges', domain: 'westenergie.de' },
  { id: 'lew', name: 'LEW', category: 'Sonstiges', domain: 'lew.de' },
  { id: 'enercity', name: 'enercity', category: 'Sonstiges', domain: 'enercity.de' },
  { id: 'mvv', name: 'MVV Energie', category: 'Sonstiges', domain: 'mvv.de' },
  { id: 'swd', name: 'Stadtwerke Düsseldorf', category: 'Sonstiges', domain: 'swd-ag.de' },
  { id: 'new', name: 'NEW', category: 'Sonstiges', domain: 'new.de' },
  { id: 'stromnetzberlin', name: 'Stromnetz Berlin', category: 'Sonstiges', domain: 'stromnetz.berlin' },

  // Öffentliche Stellen / Beiträge (Adresse wichtig)
  { id: 'rundfunk', name: 'ARD ZDF Beitragsservice', category: 'Sonstiges', domain: 'rundfunkbeitrag.de' },
  { id: 'deutschepost', name: 'Deutsche Post', category: 'Sonstiges', domain: 'deutschepost.de' },

]

export const CATEGORIES: PartnerCategory[] = ['Konten', 'Versicherungen', 'Abos', 'Sonstiges']

export const brandLogoUrl = (domain: string, cssPx = 64, opts?: { dpr?: number; format?: 'svg' | 'png' }) => {
  const envAny = (import.meta as any)
  const client = envAny?.env?.VITE_BRANDFETCH_CLIENT_ID as string | undefined
  const dpr = typeof window !== 'undefined' && (window as any).devicePixelRatio ? (window as any).devicePixelRatio : (opts?.dpr ?? 2)
  const px = Math.ceil(cssPx * dpr)
  const useSvg = opts?.format === 'svg'
  // Build path: prefer pure logo endpoint for SVG; include w/h path only for raster
  const path = useSvg ? `https://cdn.brandfetch.io/${domain}/logo` : `https://cdn.brandfetch.io/${domain}/w/${px}/h/${px}/logo`
  const params = new URLSearchParams()
  if (client) params.set('c', client)
  if (useSvg) params.set('format', 'svg')
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}
