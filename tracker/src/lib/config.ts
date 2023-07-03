/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */

import { EventName, Properties, track } from './track';

export type OpenAnalyticsConfig = {
	readonly url: string;
	readonly token: string;
};

export type OpenAnalytics = {
	track: TrackFunction;
};

type TrackFunction = (event: EventName, properties?: Properties) => Promise<void>;

export async function configure(config: OpenAnalyticsConfig): Promise<OpenAnalytics> {
	// Configure the track function with the config
	function configuredTrack(event: EventName, properties?: Properties) {
		return track(event, properties, config);
	};

	// Update the global OpenAnalytics object with the configured track function
	// for global use
	window.OpenAnalytics.track = configuredTrack;

	// Return the OpenAnalytics object for library consumers
	return {
		track: configuredTrack
	};
}

// Set up the global OpenAnalytics object
window.OpenAnalytics = window.OpenAnalytics || {
	configure,
	track: async () => console.warn('OpenAnalytics not configured yet. Call OpenAnalytics.configure() first.')
};

declare global {
	// eslint-disable-next-line functional/prefer-type-literal
	interface Window {
		OpenAnalytics: OpenAnalytics & {
			readonly configure: (config: OpenAnalyticsConfig) => Promise<OpenAnalytics>;
		};
	}
}
