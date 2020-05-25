import { GoogleLoginProvider } from 'angularx-social-login';
import { AuthServiceConfig } from 'angularx-social-login';

const clientID = '638035954908-153brftsvis585ualmpvggms1a70bdc6.apps.googleusercontent.com';
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(clientID)
  },
]);

export function provideConfig() {
  return config;
}


