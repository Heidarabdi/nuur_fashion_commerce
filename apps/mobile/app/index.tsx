/**
 * Root Index - Redirects to tabs
 * The actual routing logic is in _layout.tsx which checks onboarding status
 */
import { Redirect } from 'expo-router';

export default function Index() {
    // Let _layout.tsx handle the onboarding check and redirect
    return <Redirect href="/(tabs)" />;
}
