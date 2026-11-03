/**
 * kennel status — health of the PLACE and everything in it.
 *
 * kennel (the agentMonitor) health model:
 *   walls  = Xvnc :99 listening on 5900
 *   bed    = WM on :99 (openbox, _NET_SUPPORTING_WM_CHECK)
 *   flap   = VNC door: :5900 direct + websockify :6080
 *   waterbowl = browser CDP :25234 (json/version)
 */
import { consola } from "consola";

async function check(name: string, fn: () => Promise<boolean>): Promise<Record<string, unknown>> {
  const t0 = Date.now();
  try {
    const ok = await fn();
    return { component: name, ok, ms: Date.now() - t0 };
  } catch (e) {
    return { component: name, ok: false, ms: Date.now() - t0, error: String(e).slice(0, 120) };
  }
}

const tcp = (port: number) => async () => {
  // RAW TCP connect (not HTTP): Xvnc speaks VNC/RFB, not HTTP — an http fetch
  // false-negatives a perfectly healthy wall.
  const t0 = Date.now();
  try {
    const conn = Bun.connect({ hostname: "127.0.0.1", port, socket: { data() {}, end() {}, error() {} } });
    await Promise.race([conn, new Promise((_, rej) => setTimeout(() => rej(new Error("tcp timeout")), 2500))]);
    void Date.now() - t0;
    return true;
  } catch {
    return false;
  }
};
const cdp = async () => {
  const r = await fetch("http://127.0.0.1:25234/json/version", { signal: AbortSignal.timeout(2500) }).catch(() => null);
  return r?.ok ?? false;
};
const wm = async () => {
  const p = Bun.spawn(["xprop", "-root", "_NET_SUPPORTING_WM_CHECK"], { env: { ...process.env, DISPLAY: ":99" }, stdout: "ignore", stderr: "ignore" });
  await p.exited;
  return p.exitCode === 0;
};

const results = await Promise.all([
  check("walls (Xvnc :5900)", tcp(5900)),
  check("flap (websockify :6080)", tcp(6080)),
  check("bed (WM on :99)", wm),
  check("waterbowl (CDP :25234)", cdp),
]);

const allOk = results.every((r) => r.ok);
console.log(JSON.stringify({ kennel: allOk ? "healthy" : "sick", components: results, at: new Date().toISOString() }, null, 2));
if (!allOk) process.exit(1);
