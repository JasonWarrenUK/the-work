import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * The version stamped into saves: the nearest git tag (`v0.14.0`, or
 * `v0.14.0-3-gabc1234` past it; a bare short SHA when no tag is reachable,
 * as on a shallow checkout), falling back to the package version when git
 * is not available at all.
 */
function appVersion(): string {
	try {
		return execSync('git describe --tags --always', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
	} catch {
		const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version?: string };
		return pkg.version ? `v${pkg.version}` : 'dev';
	}
}

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__APP_VERSION__: JSON.stringify(appVersion())
	}
});
