/* RA10 Python Lab — runs student code with Pyodide (CPython compiled to WebAssembly) inside a Web Worker,
   so an infinite loop can be stopped by terminating the worker. */
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');

const HARNESS = `
import sys, io, json, traceback

def _ra10_run(code, stdin, check, setup, echo):
    feed = list(stdin)
    out = io.StringIO()
    def _input(prompt=''):
        if echo and prompt:
            out.write(str(prompt))
        if not feed:
            raise EOFError('the program asked for more input than was provided')
        value = feed.pop(0)
        if echo:
            out.write(value + '\\n')
        return value
    g = {'__name__': '__main__', 'input': _input}
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = out
    sys.stderr = out
    err = None
    line = None
    try:
        if setup:
            exec(compile(setup, 'setup.py', 'exec'), {})
        exec(compile(code, 'main.py', 'exec'), g)
        if check:
            exec(compile(check, 'test.py', 'exec'), g)
    except SyntaxError as e:
        line = e.lineno if e.filename == 'main.py' else None
        err = 'SyntaxError: ' + str(e.msg) + (' (line %d)' % e.lineno if line else '')
    except AssertionError as e:
        tb = traceback.extract_tb(sys.exc_info()[2])
        msg = str(e) or 'a test check failed'
        err = 'Test failed: ' + msg
    except BaseException as e:
        tb = traceback.extract_tb(sys.exc_info()[2])
        frames = [f for f in tb if f.filename == 'main.py']
        line = frames[-1].lineno if frames else None
        err = type(e).__name__ + ': ' + str(e) + (' (line %d)' % line if line else '')
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    return json.dumps({'out': out.getvalue(), 'err': err, 'line': line})
`;

let py = null;
const ready = (async () => {
  py = await loadPyodide();
  py.runPython(HARNESS);
  postMessage({ type: 'ready', version: py.runPython('import sys; sys.version.split()[0]') });
})().catch((e) => postMessage({ type: 'fatal', message: String(e && e.message || e) }));

onmessage = async (ev) => {
  const m = ev.data || {};
  await ready;
  if (!py) return;
  try {
    const fn = py.globals.get('_ra10_run');
    const res = fn(m.code || '', py.toPy(m.stdin || []), m.check || '', m.setup || '', !!m.echo);
    fn.destroy && fn.destroy();
    postMessage(Object.assign({ type: 'result', id: m.id }, JSON.parse(res)));
  } catch (e) {
    postMessage({ type: 'result', id: m.id, out: '', err: String(e && e.message || e), line: null });
  }
};
