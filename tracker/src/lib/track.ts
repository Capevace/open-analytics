import type { OpenAnalyticsConfig } from './config';

export type EventName = 'client-pageview' | string;
export type Properties = Record<string, unknown>;

export async function track(
	event: EventName,
	properties: Properties,
	config: OpenAnalyticsConfig
): Promise<void> {
	return new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open('POST', config.url, true);
		request.setRequestHeader('Content-Type', 'application/json');

		request.send(
			JSON.stringify({
				event,
				properties,
			})
		);

		// eslint-disable-next-line functional/immutable-data
		request.onreadystatechange = () => {
			if (request.readyState === 4) {
				if (request.status === 200) {
					resolve();
				} else {
					reject();
				}
			}
		};
	});
}
