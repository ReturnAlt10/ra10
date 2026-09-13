"""Unit 2 diagram generator — produces REAL network diagrams with device
pictograms (router with antenna, switch, server, PC, laptop, phone, Wi-Fi,
printer, firewall, cloud, attacker, lock, etc.) connected by lines.

Each question carries:
  - `figure`: an INCOMPLETE SVG network diagram (the missing element shown as
               a dashed outline / '??' placeholder) — this is what the exam
               paper actually gives the candidate to finish off.
  - `model` : the COMPLETE SVG network diagram — the model answer.

The `figure`/`model` values are inline SVG strings (they begin with `<svg`).
The app + booklets detect `<svg` and render directly (no mermaid needed for
these), which produces the picture-like network diagrams real papers use.
"""
import json, os

def save(name, data):
    with open(os.path.join(BASE, name), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = 760
H = 360


# --------------------------------------------------------------------------
# Device icon snippets (each draws centred on an anchor at its top-middle).
# Returns SVG markup; caller wraps with <g transform="translate(x,y)">.
# --------------------------------------------------------------------------
def _label(text, w, y):
    return (f'<text x="{w//2}" y="{y}" text-anchor="middle" '
            f'font-family="Segoe UI, Arial, sans-serif" font-size="13" '
            f'font-weight="600" fill="#1f2937">{text}</text>')


def icon_router(w=90, h=64):
    s = f'<rect x="{w//2-32}" y="12" width="64" height="30" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += '<line x1="%d" y1="12" x2="%d" y2="0" stroke="#334155" stroke-width="2"/>' % (w//2-16, w//2-16)
    s += '<line x1="%d" y1="12" x2="%d" y2="2" stroke="#334155" stroke-width="2"/>' % (w//2, w//2)
    s += '<line x1="%d" y1="12" x2="%d" y2="0" stroke="#334155" stroke-width="2"/>' % (w//2+16, w//2+16)
    # LEDs
    s += '<circle cx="%d" cy="27" r="2.4" fill="#16a34a"/>' % (w//2-20)
    s += '<circle cx="%d" cy="27" r="2.4" fill="#f59e0b"/>' % (w//2-13)
    s += '<circle cx="%d" cy="27" r="2.4" fill="#ef4444"/>' % (w//2-6)
    s += _label('Router', w, h)
    return s


def icon_wifi_router(w=100, h=66):
    # router body + radiating Wi-Fi arcs
    s = f'<rect x="{w//2-30}" y="20" width="60" height="26" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += '<line x1="%d" y1="20" x2="%d" y2="4" stroke="#334155" stroke-width="2"/>' % (w//2-14, w//2-14)
    s += '<line x1="%d" y1="20" x2="%d" y2="2" stroke="#334155" stroke-width="2"/>' % (w//2+14, w//2+14)
    s += '<path d="M %d %d a 16 16 0 0 1 32 0" fill="none" stroke="#14b8a6" stroke-width="2"/>' % (w//2-16, 20)
    s += '<path d="M %d %d a 9 9 0 0 1 18 0" fill="none" stroke="#14b8a6" stroke-width="2"/>' % (w//2-9, 20)
    s += '<circle cx="%d" cy="20" r="2" fill="#14b8a6"/>' % (w//2)
    s += _label('Wi-Fi router', w, h)
    return s


def icon_switch(w=90, h=64):
    s = f'<rect x="{w//2-36}" y="14" width="72" height="30" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += '<path d="M %d 44 L %d 44" stroke="#334155" stroke-width="2" stroke-linecap="round"/>' % (w//2-14, w//2+14)
    for i, c in enumerate(['#16a34a', '#f59e0b', '#16a34a', '#f59e0b']):
        s += '<circle cx="%d" cy="22" r="2" fill="%s"/>' % (w//2-22 + i*15, c)
    s += _label('Switch', w, h)
    return s


def icon_server(w=70, h=70):
    s = f'<rect x="{w//2-26}" y="8" width="52" height="15" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<rect x="{w//2-26}" y="27" width="52" height="15" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<rect x="{w//2-26}" y="46" width="52" height="15" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    for r in (15, 34, 53):
        s += '<circle cx="%d" cy="%d" r="2" fill="#16a34a"/>' % (w//2-20, r)
    s += '<rect x="%d" y="%d" width="20" height="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>' % (w//2-10, 38)
    s += _label('Server', w, h)
    return s


def icon_pc(w=86, h=74):
    s = f'<rect x="{w//2-27}" y="8" width="54" height="34" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<rect x="{w//2-21}" y="48" width="18" height="14" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>'
    s += f'<rect x="{w//2-30}" y="62" width="60" height="6" rx="2" fill="#94a3b8"/>'
    s += '</g>'
    # screen
    s += '<rect x="%d" y="10" width="46" height="28" fill="#0ea5e9" opacity="0.25"/>' % (w//2-23)
    s += _label('PC', w, h)
    return s


def icon_laptop(w=86, h=62):
    s = f'<rect x="{w//2-26}" y="6" width="52" height="32" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<path d="M {w//2-32} 38 L {w//2+32} 38 L {w//2+38} 48 L {w//2-38} 48 Z" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += _label('Laptop', w, h)
    return s


def icon_phone(w=48, h=66):
    s = f'<rect x="{w//2-11}" y="8" width="22" height="38" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += '<line x1="%d" y1="12" x2="%d" y2="12" stroke="#94a3b8" stroke-width="1.5"/>' % (w//2-5, w//2+5)
    s += _label('Smartphone', w, h)
    return s


def icon_tablet(w=60, h=62):
    s = f'<rect x="{w//2-16}" y="8" width="32" height="42" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += _label('Tablet', w, h)
    return s


def icon_wap(w=72, h=64):
    # access point: box with radiating arcs up
    s = f'<rect x="{w//2-18}" y="26" width="36" height="22" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += '<path d="M %d %d a 20 20 0 0 1 40 0" fill="none" stroke="#14b8a6" stroke-width="2"/>' % (w//2-20, 26)
    s += '<path d="M %d %d a 11 11 0 0 1 22 0" fill="none" stroke="#14b8a6" stroke-width="2"/>' % (w//2-11, 26)
    s += _label('Access point', w, h)
    return s


def icon_printer(w=80, h=64):
    s = f'<rect x="{w//2-24}" y="8" width="48" height="18" rx="3" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<rect x="{w//2-34}" y="28" width="68" height="14" rx="2" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>'
    s += f'<path d="M {w//2-20} 42 L {w//2+20} 42 L {w//2+20} 50 L {w//2-20} 50 Z" fill="#ffffff" stroke="#334155" stroke-width="2"/>'
    s += f'<rect x="{w//2-20}" y="42" width="40" height="5" fill="#22c55e"/>'
    s += _label('Printer', w, h)
    return s


def icon_firewall(w=84, h=66):
    # brick wall with flame
    s = f'<rect x="{w//2-32}" y="14" width="64" height="34" rx="3" fill="#fff7ed" stroke="#b45309" stroke-width="2"/>'
    s += '<line x1="%d" y1="14" x2="%d" y2="48" stroke="#b45309" stroke-width="1"/>' % (w//2, w//2)
    for rx in range(-28, 33, 16):
        s += '<line x1="%d" y1="14" x2="%d" y2="48" stroke="#b45309" stroke-width="1"/>' % (w//2+rx, w//2+rx)
    s += '<line x1="%d" y1="31" x2="%d" y2="31" stroke="#b45309" stroke-width="1"/>' % (w//2-32, w//2+32)
    s += '<path d="M %d 8 q -6 8 2 12 q 4 -3 0 -9 q 6 4 6 12 q 8 -6 2 -16 z" fill="#f97316"/>' % (w//2)
    s += _label('Firewall', w, h)
    return s


def icon_cloud(w=92, h=58):
    s = '<path d="M %d %d a 16 16 0 0 1 30 -2 a 14 14 0 0 1 12 22 a 12 12 0 0 1 -42 0 a 14 14 0 0 1 0 -20 z" fill="#ffffff" stroke="#64748b" stroke-width="2"/>' % (w//2-22, 24)
    s += _label('Cloud / Internet', w, h)
    return s


def icon_attacker(w=80, h=70):
    # simple person with hood icon
    s = '<circle cx="%d" cy="20" r="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>' % (w//2)
    s += '<path d="M %d 32 q -14 0 -14 16 q 0 8 14 8 q 14 0 14 -8 q 0 -16 -14 -16 z" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>' % (w//2)
    s += '<path d="M %d 22 q 0 -10 12 -10" fill="none" stroke="#dc2626" stroke-width="2"/>' % (w//2)
    s += _label('Attacker', w, h)
    return s


def icon_lock(w=56, h=64):
    s = f'<path d="M {w//2-14} 30 v -8 a 14 14 0 0 1 28 0 v 8" fill="none" stroke="#334155" stroke-width="3"/>'
    s += f'<rect x="{w//2-18}" y="28" width="36" height="26" rx="4" fill="#fbbf24" stroke="#334155" stroke-width="2"/>'
    s += '<circle cx="%d" cy="39" r="3" fill="#334155"/>' % (w//2)
    s += _label('Lock', w, h)
    return s


def icon_door(w=64, h=70):
    s = f'<rect x="{w//2-22}" y="8" width="44" height="54" rx="3" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>'
    s += '<circle cx="%d" cy="35" r="2.6" fill="#b45309"/>' % (w//2+14)
    s += _label('Door', w, h)
    return s


def icon_desktop_unknown(w=86, h=70):
    # placeholder for the missing element: dashed outline + '??'
    s = f'<rect x="{w//2-27}" y="8" width="54" height="40" rx="4" fill="#ffffff" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>'
    s += f'<rect x="{w//2-30}" y="50" width="60" height="6" rx="2" fill="#cbd5e1"/>'
    s += f'<text x="{w//2}" y="34" text-anchor="middle" font-family="Segoe UI,Arial" font-size="20" font-weight="800" fill="#d20000">??</text>'
    s += _label('?', w, h)
    return s


# --------------------------------------------------------------------------
# Scene helper: place icons and draw connector lines between them.
# --------------------------------------------------------------------------
def _svg_open():
    return f'<svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg" role="img" style="width:100%;height:auto;background:#ffffff">'


def scene(nodes, links):
    """nodes: list of (id, icon_svg, x, y) — icon anchored so centre is (x,y).
       links: list of (from_id, to_id, style, label) where style in
              ('solid','dashed','arrow','double','wifi')."""
    node_by_id = {n[0]: n for n in nodes}
    lines = []
    def centre(nid):
        n = node_by_id[nid]
        return n[2], n[3] + 28  # approx centre of icon

    for (a, b, style, label) in links:
        (x1, y1), (x2, y2) = centre(a), centre(b)
        if style == 'dashed':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>'
        elif style == 'double':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="3"/>'
        elif style == 'arrow':
            ln = (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="2" '
                  f'marker-end="url(#arr)"/>')
        elif style == 'wifi':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#14b8a6" stroke-width="2" stroke-dasharray="5 4"/>'
        else:
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="2"/>'
        if label:
            mx, my = (x1+x2)//2, (y1+y2)//2
            ln += f'<text x="{mx}" y="{my-6}" text-anchor="middle" font-family="Segoe UI,Arial" font-size="12" fill="#334155">{label}</text>'
        lines.append(ln)

    defs = '<defs><marker id="arr" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#334155"/></marker></defs>'
    icons = ''.join(
        f'<g transform="translate({n[2]-anchor_width[n[0]]//2 if False else n[2]-44},{n[3]})">{n[1]}</g>'
        for n in nodes
    )
    return _svg_open() + defs + lines + icons + '</svg>'


anchor_width = {}


def S(nodes, links):
    """Build a complete SVG scene with given nodes and links."""
    node_by_id = {n[0]: n for n in nodes}
    lines = []
    for (a, b, style, label) in links:
        x1, y1 = node_by_id[a][2], node_by_id[a][3] + 28
        x2, y2 = node_by_id[b][2], node_by_id[b][3] + 28
        if style == 'dashed':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#64748b" stroke-width="2" stroke-dasharray="6 4"/>'
        elif style == 'double':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="3"/>'
        elif style == 'arrow':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="2" marker-end="url(#arr)"/>'
        elif style == 'wifi':
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#14b8a6" stroke-width="2" stroke-dasharray="5 4"/>'
        else:
            ln = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#334155" stroke-width="2"/>'
        if label:
            mx, my = (x1+x2)//2, (y1+y2)//2
            ln += f'<text x="{mx}" y="{my-6}" text-anchor="middle" font-family="Segoe UI,Arial" font-size="12" fill="#334155">{label}</text>'
        lines.append(ln)
    defs = '<defs><marker id="arr" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#334155"/></marker></defs>'
    icons = ''.join(f'<g transform="translate({n[2]-44},{n[3]})">{n[1]}</g>' for n in nodes)
    return _svg_open() + defs + ''.join(lines) + icons + '</svg>'


def q(qid, aim, topic, marks, scenario, question, figure_nodes, figure_links,
      model_nodes, model_links, points, kind='network diagram'):
    scheme = {
        'instruction': f'Award up to {marks} marks. Award marks for correctly completing/adding the required element(s) to the given diagram.',
        'points': points,
    }
    return {
        'id': qid, 'learning_aim': aim, 'topic': topic,
        'command_verb': 'Complete', 'marks': marks, 'ao': 'AO2',
        'scenario': scenario, 'question': question, 'guidance': f'({marks})',
        'type': 'diagram', 'diagram_kind': kind,
        'figure': S(figure_nodes, figure_links),
        'model': S(model_nodes, model_links),
        'mark_scheme': scheme,
    }


DIAGRAMS = [
    # ── A1 DDoS: add C2 server between attacker and botnet devices ──
    q('DIA001', 'A', 'A1.2 External threats — hacking (DoS/DDoS)', 4, '',
      'Figure 1 shows an incomplete diagram of a DDoS attack. Complete the diagram by adding the Command & Control (C2) server and its connections to the compromised devices.',
      [('att', icon_attacker(), 120, 170), ('gap', icon_desktop_unknown(), 360, 170), ('d1', icon_pc(), 240, 40), ('d2', icon_laptop(), 360, 40), ('d3', icon_phone(), 480, 40), ('tgt', icon_server(), 640, 170)],
      [('att', 'gap', 'solid', None), ('d1', 'tgt', 'solid', None), ('d2', 'tgt', 'solid', None), ('d3', 'tgt', 'solid', None)],
      [('att', icon_attacker(), 120, 170), ('c2', icon_server(), 360, 170), ('d1', icon_pc(), 240, 40), ('d2', icon_laptop(), 360, 40), ('d3', icon_phone(), 480, 40), ('tgt', icon_server(), 640, 170)],
      [('att', 'c2', 'arrow', None), ('c2', 'd1', 'arrow', None), ('c2', 'd2', 'arrow', None), ('c2', 'd3', 'arrow', None), ('d1', 'tgt', 'arrow', None), ('d2', 'tgt', 'arrow', None), ('d3', 'tgt', 'arrow', None)],
      ['Command & Control (C2) server placed between attacker and devices (1)', 'Lines connecting C2 to each compromised device (1)', 'Botnet shown feeding traffic into the target server (1)', 'Target labelled as overwhelmed (1)']),

    # ── A2 MitM: add attacker between client and server ──
    q('DIA002', 'A', 'A1.2 External threats — hacking (MitM)', 4, '',
      'Figure 2 shows an incomplete diagram of a man-in-the-middle attack. Complete the diagram by adding the attacker between the client and the server.',
      [('cli', icon_pc(), 120, 170), ('gap', icon_desktop_unknown(), 380, 170), ('srv', icon_server(), 640, 170)],
      [('cli', 'gap', 'solid', None), ('gap', 'srv', 'solid', None)],
      [('cli', icon_pc(), 120, 170), ('att', icon_attacker(), 380, 170), ('srv', icon_server(), 640, 170)],
      [('cli', 'att', 'arrow', None), ('att', 'srv', 'arrow', None), ('cli', 'srv', 'dashed', 'intended path')],
      ['Attacker placed between client and server (1)', 'Client→attacker and attacker→server links drawn (1)', 'Intercepted leg clearly labelled (1)', 'Logical, unambiguous flow (1)']),

    # ── A3 Firewall: add firewall between internet and internal network ──
    q('DIA013', 'A', 'A4.1 Software and hardware security — firewalls', 4,
      'A network administrator must secure the boundary of the network.',
      'Figure 3 shows an incomplete network diagram. Complete the diagram by adding the firewall between the internet and the internal network.',
      [('net', icon_cloud(), 100, 170), ('gap', icon_desktop_unknown(), 340, 170), ('sw', icon_switch(), 560, 90), ('srv', icon_server(), 560, 250), ('pc', icon_pc(), 680, 170)],
      [('net', 'gap', 'solid', None), ('gap', 'sw', 'solid', None)],
      [('net', icon_cloud(), 100, 170), ('fw', icon_firewall(), 340, 170), ('sw', icon_switch(), 560, 90), ('srv', icon_server(), 560, 250), ('pc', icon_pc(), 680, 170)],
      [('net', 'fw', 'solid', None), ('fw', 'sw', 'solid', None), ('sw', 'srv', 'solid', None), ('sw', 'pc', 'solid', None)],
      ['Firewall drawn between the internet and internal network (1)', 'Correct connection internet→firewall→switch (1)', 'Internal devices kept behind the firewall (1)', 'Clear boundary/protection implied (1)']),

    # ── B star: add central switch ──
    q('DIA003', 'B', 'B1.2 Network topologies', 4,
      'A network administrator wants to document the office network.',
      'Figure 4 shows an incomplete star topology. Complete the diagram by adding the central switch and connecting all four workstations to it.',
      [('gap', icon_desktop_unknown(), 380, 180), ('w1', icon_pc(), 120, 70), ('w2', icon_laptop(), 120, 300), ('w3', icon_pc(), 640, 70), ('w4', icon_laptop(), 640, 300)],
      [('w1', 'gap', 'dashed', None), ('w2', 'gap', 'dashed', None), ('w3', 'gap', 'dashed', None), ('w4', 'gap', 'dashed', None)],
      [('sw', icon_switch(), 380, 180), ('w1', icon_pc(), 120, 70), ('w2', icon_laptop(), 120, 300), ('w3', icon_pc(), 640, 70), ('w4', icon_laptop(), 640, 300)],
      [('sw', 'w1', 'solid', None), ('sw', 'w2', 'solid', None), ('sw', 'w3', 'solid', None), ('sw', 'w4', 'solid', None)],
      ['Central switch added (1)', 'All four workstations connected to the switch (1)', 'Each device has its own dedicated link (1)', 'Clean star structure (1)']),

    # ── B mesh: add missing links ──
    q('DIA004', 'B', 'B1.2 Network topologies', 4, '',
      'Figure 5 shows an incomplete mesh topology. Complete the diagram by adding the missing redundant links between nodes.',
      [('a', icon_pc(), 200, 80), ('b', icon_laptop(), 600, 80), ('c', icon_pc(), 200, 300), ('d', icon_laptop(), 600, 300)],
      [('a', 'b', 'solid', None), ('a', 'c', 'solid', None), ('a', 'd', 'solid', None), ('b', 'c', 'dashed', None), ('b', 'd', 'dashed', None), ('c', 'd', 'dashed', None)],
      [('a', icon_pc(), 200, 80), ('b', icon_laptop(), 600, 80), ('c', icon_pc(), 200, 300), ('d', icon_laptop(), 600, 300)],
      [('a', 'b', 'solid', None), ('a', 'c', 'solid', None), ('a', 'd', 'solid', None), ('b', 'c', 'solid', None), ('b', 'd', 'solid', None), ('c', 'd', 'solid', None)],
      ['B→C link added (1)', 'B→D link added (1)', 'C→D link added (1)', 'Full mesh — every node links to every other (1)']),

    # ── B DMZ: add web server ──
    q('DIA005', 'B', 'B1.4 Modern trends', 4,
      'A company uses firewalls and a VLAN strategy to isolate servers.',
      'Figure 6 shows an incomplete DMZ. Complete the diagram by adding the web server between the two firewalls.',
      [('net', icon_cloud(), 80, 170), ('fw1', icon_firewall(), 280, 170), ('gap', icon_desktop_unknown(), 470, 170), ('fw2', icon_firewall(), 660, 170)],
      [('net', 'fw1', 'solid', None), ('fw1', 'gap', 'solid', None), ('gap', 'fw2', 'solid', None)],
      [('net', icon_cloud(), 80, 170), ('fw1', icon_firewall(), 280, 170), ('web', icon_server(), 470, 170), ('fw2', icon_firewall(), 660, 170)],
      [('net', 'fw1', 'solid', None), ('fw1', 'web', 'solid', None), ('web', 'fw2', 'solid', None)],
      ['Web server placed between the two firewalls (1)', 'Correctly located inside the DMZ (1)', 'Perimeter firewall protects from internet (1)', 'Internal firewall shields trusted network (1)']),

    # ── B VLANs: add three VLANs ──
    q('DIA006', 'B', 'B1.4 Modern trends', 4, '',
      'Figure 7 shows a managed switch. Complete the diagram by adding three VLANs (Staff, Guests, Servers) and connecting them to the switch.',
      [('sw', icon_switch(), 380, 180), ('gap1', icon_desktop_unknown(), 120, 80), ('gap2', icon_desktop_unknown(), 380, 40), ('gap3', icon_desktop_unknown(), 640, 80)],
      [('sw', 'gap1', 'dashed', None), ('sw', 'gap2', 'dashed', None), ('sw', 'gap3', 'dashed', None)],
      [('sw', icon_switch(), 380, 180), ('g1', icon_pc(), 120, 80), ('g2', icon_phone(), 380, 40), ('g3', icon_server(), 640, 80)],
      [('sw', 'g1', 'solid', 'VLAN 10 Staff'), ('sw', 'g2', 'solid', 'VLAN 20 Guests'), ('sw', 'g3', 'solid', 'VLAN 30 Servers')],
      ['VLAN 10 (Staff) added (1)', 'VLAN 20 (Guests) added (1)', 'VLAN 30 (Servers) added (1)', 'All connected to the managed switch (1)']),

    # ── B TCP/IP: label missing layer ──
    q('DIA104', 'B', 'B3.1 TCP/IP model', 3, '',
      'Figure 8 shows the four-layer TCP/IP model with one layer missing. Complete the diagram by labelling the missing layer.',
      [('l4', icon_pc(), 380, 40), ('l3', icon_desktop_unknown(), 380, 130), ('l2', icon_switch(), 380, 220), ('l1', icon_phone(), 380, 310)],
      [('l4', 'l3', 'solid', None), ('l3', 'l2', 'solid', None), ('l2', 'l1', 'solid', None)],
      [('l4', icon_pc(), 380, 40), ('l3', icon_router(), 380, 130), ('l2', icon_switch(), 380, 220), ('l1', icon_phone(), 380, 310)],
      [('l4', 'l3', 'solid', 'Application'), ('l3', 'l2', 'solid', 'Transport'), ('l2', 'l1', 'solid', 'Internet + Network Access')],
      ['Missing layer identified as Transport (1)', 'Placed correctly between Application and Internet (1)', 'Recognised as carrying TCP/UDP (1)']),

    # ── B DNS: add authoritative server ──
    q('DIA008', 'B', 'B3.4 DNS', 4, '',
      'Figure 9 shows an incomplete DNS resolution chain. Complete the diagram by adding the authoritative DNS server.',
      [('cli', icon_pc(), 120, 170), ('rec', icon_server(), 380, 170), ('gap', icon_desktop_unknown(), 640, 170)],
      [('cli', 'rec', 'arrow', 'www.example.com'), ('rec', 'gap', 'arrow', None)],
      [('cli', icon_pc(), 120, 170), ('rec', icon_server(), 380, 170), ('auth', icon_server(), 640, 170)],
      [('cli', 'rec', 'arrow', 'www.example.com'), ('rec', 'auth', 'arrow', None), ('auth', 'rec', 'arrow', 'IP address'), ('rec', 'cli', 'arrow', 'IP address')],
      ['Authoritative DNS server added (1)', 'Recursive→authoritative query drawn (1)', 'IP address returned from authoritative to recursive (1)', 'IP address returned to client (1)']),

    # ── B DHCP: add Request and Ack ──
    q('DIA106', 'B', 'B3.5 DHCP', 4, '',
      'Figure 10 shows an incomplete DHCP exchange. Complete the diagram by adding the two missing messages (Request and Ack).',
      [('cli', icon_pc(), 120, 80), ('srv', icon_server(), 640, 80)],
      [('cli', 'srv', 'solid', 'DHCP Discover'), ('srv', 'cli', 'dashed', 'DHCP Offer')],
      [('cli', icon_pc(), 120, 80), ('srv', icon_server(), 640, 80)],
      [('cli', 'srv', 'solid', 'DHCP Discover'), ('srv', 'cli', 'dashed', 'DHCP Offer'), ('cli', 'srv', 'solid', 'DHCP Request'), ('srv', 'cli', 'dashed', 'DHCP Ack')],
      ['DHCP Request (client→server) added (1)', 'DHCP Ack (server→client) added (1)', 'Correct DORA order (1)', 'Sequence completed (1)']),

    # ── C Containment: add quarantine at switch ──
    q('DIA010', 'C', 'C1.3 Containment', 4,
      'A network is infected and the team must isolate the affected area.',
      'Figure 11 shows an infected server and other devices connected to a switch. Complete the diagram by adding the quarantine on the infected server.',
      [('inf', icon_server(), 200, 80), ('oth', icon_pc(), 200, 300), ('sw', icon_switch(), 500, 180), ('rest', icon_cloud(), 660, 180)],
      [('inf', 'sw', 'solid', None), ('oth', 'sw', 'solid', None)],
      [('inf', icon_server(), 200, 80), ('oth', icon_pc(), 200, 300), ('sw', icon_switch(), 500, 180), ('rest', icon_cloud(), 660, 180)],
      [('inf', 'sw', 'dashed', 'isolated'), ('oth', 'sw', 'solid', 'allowed'), ('sw', 'rest', 'solid', 'allowed')],
      ['Infected server marked as isolated (1)', 'Block applied at the switch (1)', 'Legitimate devices still reach rest of network (1)', 'Clear containment of infected host (1)']),

    # ── C BCP/DR: add replication + failover ──
    q('DIA011', 'C', 'C1.7 Business continuity', 4,
      'A business must illustrate its disaster recovery failover.',
      'Figure 12 shows a primary site and a secondary (DR) site. Complete the diagram by adding the replication link and the failover path.',
      [('pri', icon_server(), 200, 120), ('sec', icon_server(), 560, 120), ('usr', icon_laptop(), 380, 300)],
      [('usr', 'pri', 'solid', None)],
      [('pri', icon_server(), 200, 120), ('sec', icon_server(), 560, 120), ('usr', icon_laptop(), 380, 300)],
      [('pri', 'sec', 'double', 'real-time replication'), ('usr', 'pri', 'solid', None), ('usr', 'sec', 'dashed', 'on failure')],
      ['Replication link between primary and secondary added (1)', 'Replication shown as continuous (1)', 'Failover path from users to secondary drawn (1)', 'Failover triggered on failure (1)']),

    # ── C PDCA loop ──
    q('DIA012', 'C', 'C1.1 Internal policies', 4,
      'An organisation is documenting its cyber security policy.',
      'Figure 13 shows the first two stages of the Plan-Do-Check-Act loop. Complete the diagram by adding the remaining stages and closing the loop.',
      [('plan', icon_pc(), 200, 80), ('do', icon_switch(), 600, 80), ('gap1', icon_desktop_unknown(), 200, 300), ('gap2', icon_desktop_unknown(), 600, 300)],
      [('plan', 'do', 'arrow', None), ('do', 'gap1', 'dashed', None), ('gap1', 'gap2', 'dashed', None), ('gap2', 'plan', 'dashed', None)],
      [('plan', icon_pc(), 200, 80), ('do', icon_switch(), 600, 80), ('check', icon_server(), 600, 300), ('act', icon_firewall(), 200, 300)],
      [('plan', 'do', 'arrow', 'Plan → Do'), ('do', 'check', 'arrow', 'Do → Check'), ('check', 'act', 'arrow', 'Check → Act'), ('act', 'plan', 'arrow', 'Act → Plan')],
      ['Check stage added after Do (1)', 'Act stage added after Check (1)', 'Act loops back to Plan (1)', 'Continuous improvement loop completed (1)']),

    # ── D forensic process ──
    q('DIA009', 'D', 'D1.1 Forensic collection of evidence', 4,
      'A forensic investigator must document the process of collecting evidence.',
      'Figure 14 shows the first stage (Seize device) of the forensic process. Complete the diagram by adding the remaining stages in order.',
      [('seize', icon_lock(), 120, 180), ('gap1', icon_desktop_unknown(), 280, 180), ('gap2', icon_desktop_unknown(), 440, 180), ('gap3', icon_desktop_unknown(), 600, 180)],
      [('seize', 'gap1', 'arrow', None), ('gap1', 'gap2', 'arrow', None), ('gap2', 'gap3', 'arrow', None)],
      [('seize', icon_lock(), 120, 180), ('iso', icon_switch(), 280, 180), ('img', icon_server(), 440, 180), ('hash', icon_firewall(), 600, 180)],
      [('seize', 'iso', 'arrow', 'Seize'), ('iso', 'img', 'arrow', 'Isolate'), ('img', 'hash', 'arrow', 'Image'), ('hash', 'hash', 'arrow', 'Hash + custody')],
      ['Isolate stage added (1)', 'Take-image stage added (1)', 'Generate-hash stage added (1)', 'Custody documented, correct order (1)']),

    # ── D pen testing ──
    q('DIA108', 'D', 'D1.2 Pen testing', 4, '',
      'Figure 15 shows the first phase of a penetration test. Complete the diagram by adding the remaining phases in order.',
      [('scope', icon_pc(), 100, 180), ('gap1', icon_desktop_unknown(), 240, 180), ('gap2', icon_desktop_unknown(), 380, 180), ('gap3', icon_desktop_unknown(), 520, 180), ('rep', icon_server(), 660, 180)],
      [('scope', 'gap1', 'arrow', None), ('gap1', 'gap2', 'arrow', None), ('gap2', 'gap3', 'arrow', None), ('gap3', 'rep', 'arrow', None)],
      [('scope', icon_pc(), 100, 180), ('recon', icon_attacker(), 240, 180), ('scan', icon_switch(), 380, 180), ('exp', icon_laptop(), 520, 180), ('rep', icon_server(), 660, 180)],
      [('scope', 'recon', 'arrow', None), ('recon', 'scan', 'arrow', None), ('scan', 'exp', 'arrow', None), ('exp', 'rep', 'arrow', None)],
      ['Reconnaissance phase added (1)', 'Scanning & enumeration added (1)', 'Exploitation added (1)', 'Reporting completes the sequence (1)']),

    # ── D IDS: add NIDS + SIEM ──
    q('DIA107', 'D', 'D2.1 IDS/IPS', 4,
      'A security architect must show where monitoring devices are placed.',
      'Figure 16 shows a firewall and a switch. Complete the diagram by adding the network-based IDS and its alert link to a SIEM.',
      [('net', icon_cloud(), 100, 90), ('fw', icon_firewall(), 300, 90), ('sw', icon_switch(), 500, 90), ('srv', icon_server(), 500, 260)],
      [('net', 'fw', 'solid', None), ('fw', 'sw', 'solid', None)],
      [('net', icon_cloud(), 100, 90), ('fw', icon_firewall(), 300, 90), ('nids', icon_wap(), 400, 260), ('sw', icon_switch(), 500, 90), ('srv', icon_server(), 500, 200), ('siem', icon_server(), 260, 260)],
      [('net', 'fw', 'solid', None), ('fw', 'nids', 'solid', None), ('nids', 'sw', 'solid', None), ('sw', 'srv', 'solid', None), ('nids', 'siem', 'dashed', 'alerts')],
      ['NIDS placed inline/behind the firewall (1)', 'NIDS→SIEM alert link drawn (1)', 'Monitoring flow through the NIDS (1)', 'Clear placement of monitoring device (1)']),
]


def build():
    save('diagrams.json', DIAGRAMS)
    print(f'diagrams.json: {len(DIAGRAMS)} questions written')


if __name__ == '__main__':
    build()