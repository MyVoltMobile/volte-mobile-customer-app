export const AppIdentity = {
  name: 'VoLTE Mobile',
  tagline: 'Powering Every Connection!',
} as const;

export const IntegrationState = {
  supabaseAuthConnected: false,
  customerApiConnected: false,
  financeConnected: false,
  paymentsConnected: false,
  supportConnected: false,
  notificationsConnected: false,
  personalizedOffersConnected: false,
} as const;
