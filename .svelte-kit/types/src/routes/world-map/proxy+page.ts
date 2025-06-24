// @ts-nocheck
import type { PageLoad } from './$types';

export const prerender = true;

export const load = async () => {
	return {
		title: 'World Map - Places I\'ve Lived',
		description: 'Interactive globe showing places where Zuo has lived and worked around the world'
	};
};;null as any as PageLoad;