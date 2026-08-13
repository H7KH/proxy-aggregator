import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				ink: {
					50: '#f4f7fb',
					100: '#e6edf5',
					400: '#8aa0b8',
					700: '#243246',
					900: '#0b1220',
					950: '#070c14',
				},
				signal: {
					DEFAULT: '#1f9d6a',
					light: '#2ec98a',
				},
			},
			fontFamily: {
				sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
				mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
			},
		},
	},
	plugins: [],
};

export default config;
