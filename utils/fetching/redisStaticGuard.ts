/** Next.js static generation treats Upstash as dynamic fetch; avoid noisy error logs. */
export function isRedisSkippedDuringStaticRender(e: unknown): boolean {
	if (!(e instanceof Error)) return false;
	const digest = (e as Error & { digest?: string }).digest;
	return (
		e.message.includes("Dynamic server usage") ||
		e.message.includes("no-store fetch") ||
		digest === "DYNAMIC_SERVER_USAGE"
	);
}
