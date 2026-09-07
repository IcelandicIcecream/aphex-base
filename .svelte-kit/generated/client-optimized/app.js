// in dev, this makes Vite inject its client as this module's first dependency,
// so that global constant replacements are installed before any other module
// (including user hooks) evaluates. In build it's inert.
import.meta.hot;

import * as client_hooks from '../../../src/hooks.client.ts';


export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24')
];

export const server_loads = [4,2,3,5];

export const dictionary = {
		"/(site)": [~15,[4]],
		"/(protected)/admin": [~6,[2]],
		"/(protected)/admin/activity": [7,[2]],
		"/(protected)/admin/organizations": [~8,[2]],
		"/(protected)/admin/settings": [~9,[2,3]],
		"/(protected)/admin/settings/account": [~10,[2,3]],
		"/(protected)/admin/settings/api-keys": [~11,[2,3]],
		"/(protected)/admin/settings/members": [~12,[2,3]],
		"/(protected)/admin/settings/plugins": [13,[2,3]],
		"/(protected)/admin/settings/roles": [~14,[2,3]],
		"/god-mode": [~17,[5]],
		"/god-mode/organizations": [~18,[5]],
		"/invitations": [~19],
		"/invite/[token]": [~20],
		"/login": [~21],
		"/reset-password/[token]": [~22],
		"/two-factor": [~23],
		"/verify-email": [24],
		"/(site)/[slug]": [~16,[4]]
	};

export const hooks = {
	handleError: client_hooks.handleError || (({ error }) => { console.error(error) }),
	init: client_hooks.init,
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));
export const encoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.encode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';

export const get_error_template = () => import('../shared/error-template.js').then(m => m.default);