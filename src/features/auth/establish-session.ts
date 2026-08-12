import {
  saveTokens,
  tokensFromResponse,
  type AuthTokenResponse,
} from '@/lib/auth';
import { fetchCurrentFarm, setCurrentFarmId } from '@/lib/farm';

/**
 * Persists a fresh token pair and populates the farm context from
 * `GET /api/farms/current`. Shared by sign-in and the "new farm" register
 * flow — anywhere a token pair should become the active session.
 */
export async function establishSession(
  tokens: AuthTokenResponse,
): Promise<void> {
  await saveTokens(tokensFromResponse(tokens));
  const farm = await fetchCurrentFarm(tokens.accessToken);
  setCurrentFarmId(farm.publicId);
}
