export type Address = { street: string; postalCode: string; city: string };

export type MoveCore = {
  oldAddress: Address;
  newAddress: Address;
  moveDate?: string; // ISO yyyy-mm-dd (optional)
  proofFile?: File | null;
};

export type ProviderCategory =
  | 'Bank'
  | 'Versicherung'
  | 'Arbeitgeber'
  | 'Telekom'
  | 'Energie'
  | 'Gym'
  | 'Sonstige';

export type ConnectionStatus = 'not_contacted' | 'sent' | 'confirmed' | 'manual_done';

export type Connection = {
  id: string;
  name: string;
  category: ProviderCategory;
  customerId?: string;
  status: ConnectionStatus;
};

export const CATEGORIES: ProviderCategory[] = [
  'Bank',
  'Versicherung',
  'Arbeitgeber',
  'Telekom',
  'Energie',
  'Gym',
  'Sonstige',
];
