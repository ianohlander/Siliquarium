import socket
import base64
import os
import json
import urllib.request
import struct
import time
import subprocess
from urllib.parse import urlparse
from PIL import Image

def ws_connect(ws_url):
    u = urlparse(ws_url)
    s = socket.create_connection((u.hostname, u.port), timeout=15)
    key = base64.b64encode(os.urandom(16)).decode()
    req = (
        f'GET {u.path} HTTP/1.1\r\n'
        f'Host: {u.netloc}\r\n'
        'Upgrade: websocket\r\n'
        'Connection: Upgrade\r\n'
        f'Sec-WebSocket-Key: {key}\r\n'
        'Sec-WebSocket-Version: 13\r\n\r\n'
    )
    s.sendall(req.encode())
    res = b''
    while b'\r\n\r\n' not in res:
        chunk = s.recv(4096)
        if not chunk:
            raise EOFError('Connection closed during handshake')
        res += chunk
    return s

def ws_send(s, msg):
    payload = msg.encode('utf-8')
    length = len(payload)
    mask = os.urandom(4)
    if length < 126:
        header = struct.pack('!BB', 0x81, 0x80 | length)
    elif length < 65536:
        header = struct.pack('!BBH', 0x81, 0x80 | 126, length)
    else:
        header = struct.pack('!BBQ', 0x81, 0x80 | 127, length)
    masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
    s.sendall(header + mask + masked)

def ws_recv(s):
    def read_exact(n):
        buf = b''
        while len(buf) < n:
            chunk = s.recv(n - len(buf))
            if not chunk:
                raise EOFError('Unexpected EOF')
            buf += chunk
        return buf

    while True:
        hdr = read_exact(2)
        b1, b2 = hdr[0], hdr[1]
        opcode = b1 & 0x0f
        masked = bool(b2 & 0x80)
        length = b2 & 0x7f
        if length == 126:
            length = struct.unpack('!H', read_exact(2))[0]
        elif length == 127:
            length = struct.unpack('!Q', read_exact(8))[0]
        if masked:
            mask = read_exact(4)
            data = read_exact(length)
            payload = bytes(b ^ mask[i % 4] for i, b in enumerate(data))
        else:
            payload = read_exact(length)

        if opcode == 0x1: # Text
            return payload.decode('utf-8', errors='replace')
        elif opcode == 0x8: # Close
            raise EOFError('WebSocket closed by server')
        elif opcode == 0x9: # Ping
            # Send pong
            pong = struct.pack('!BB', 0x8a, 0)
            s.sendall(pong)

class ChromeCDP:
    def __init__(self, port=9222):
        self.port = port
        self.cmd_id = 1
        with urllib.request.urlopen(f'http://localhost:{port}/json/list') as resp:
            targets = json.loads(resp.read().decode())
        page = next(t for t in targets if t.get('type') == 'page')
        self.ws = ws_connect(page['webSocketDebuggerUrl'])

    def send_cmd(self, method, params=None):
        cid = self.cmd_id
        self.cmd_id += 1
        msg = {'id': cid, 'method': method}
        if params:
            msg['params'] = params
        ws_send(self.ws, json.dumps(msg))
        while True:
            resp_str = ws_recv(self.ws)
            resp = json.loads(resp_str)
            if resp.get('id') == cid:
                return resp

    def eval(self, expr):
        res = self.send_cmd('Runtime.evaluate', {'expression': expr, 'returnByValue': True})
        if 'result' in res and 'result' in res['result']:
            return res['result']['result'].get('value')
        return None

    def get_element_rect(self, selector):
        js = f'''
        (() => {{
            const el = document.querySelector("{selector}");
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return {{x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height)}};
        }})()
        '''
        return self.eval(js)

    def capture_screenshot(self, out_path, crop_box=None):
        res = self.send_cmd('Page.captureScreenshot', {'format': 'png'})
        b64_data = res['result']['data']
        img_bytes = base64.b64decode(b64_data)
        
        # Save temp or direct
        raw_path = out_path + '.raw.png'
        with open(raw_path, 'wb') as f:
            f.write(img_bytes)
        
        img = Image.open(raw_path)
        if crop_box:
            # crop_box is (left, top, right, bottom)
            # clamp to image bounds
            left = max(0, crop_box[0])
            top = max(0, crop_box[1])
            right = min(img.width, crop_box[2])
            bottom = min(img.height, crop_box[3])
            cropped = img.crop((left, top, right, bottom))
            cropped.save(out_path, optimize=True)
        else:
            img.save(out_path, optimize=True)
        
        if os.path.exists(raw_path):
            os.remove(raw_path)
        print(f'Saved: {out_path} ({os.path.getsize(out_path)} bytes)')

def main():
    out_dir = os.path.abspath('docs/curriculum/images')
    os.makedirs(out_dir, exist_ok=True)

    chrome_path = r'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
    proc = subprocess.Popen([
        chrome_path,
        '--headless',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--window-size=1920,1080',
        'http://localhost:3000'
    ])
    
    try:
        print('Waiting for Chrome to initialize...')
        time.sleep(3)
        cdp = ChromeCDP()
        print('Connected to Chrome via CDP!')

        # Wait for SiliquariumApp to initialize
        for _ in range(30):
            ready = cdp.eval('typeof window.siliquariumApp !== "undefined"')
            if ready:
                break
            time.sleep(0.5)
        print('SiliquariumApp ready!')
        time.sleep(2)

        # 1. Practicum 1: Seafloor survey & Hydrothermal Caldera
        print('\n--- Practicum 1: Seafloor Survey ---')
        # Center camera and let simulation run a few ticks to populate plumes
        cdp.eval('window.siliquariumApp.loop.start();')
        time.sleep(2)
        # Capture seafloor overview cropped to caldera and central hydrothermal zone
        p1_path = os.path.join(out_dir, 'practicum1_seafloor_overview.png')
        cdp.capture_screenshot(p1_path, crop_box=(150, 80, 1770, 980))

        # Select an active living cell and focus
        print('Selecting living pore and focusing...')
        cdp.eval('''
        (() => {
            const world = window.siliquariumApp.world;
            const living = world.getAllPores().filter(p => p.cell !== null && p.cell.isAlive);
            if (living.length > 0) {
                window.siliquariumApp.selectPoreAtCoord(living[0].coord);
            }
        })()
        ''')
        time.sleep(1)
        # Focus camera on selected pore
        cdp.eval('window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyF" }));')
        time.sleep(2)
        p1_focus_path = os.path.join(out_dir, 'practicum1_pore_focus.png')
        cdp.capture_screenshot(p1_focus_path, crop_box=(200, 100, 1500, 950))

        # 2. Practicum 2: Circuit Microscope Schematic & Testbench
        print('\n--- Practicum 2: Circuit Microscope ---')
        # Ensure microscope drawer is open and schematic tab is active
        cdp.eval('''
        (() => {
            window.siliquariumApp.openMicroscope();
            window.siliquariumApp.switchMicroscopeTab("schematic");
        })()
        ''')
        time.sleep(2)
        p2_schematic = os.path.join(out_dir, 'practicum2_microscope_schematic.png')
        # Crop to the right-hand docked microscope drawer
        rect = cdp.get_element_rect('#microscope-panel')
        if rect and rect['x'] < 1920 and rect['width'] > 0:
            crop = (rect['x'], rect['y'], rect['x'] + rect['width'], rect['y'] + rect['height'])
        else:
            crop = (1400, 0, 1920, 1080)
        cdp.capture_screenshot(p2_schematic, crop_box=crop)

        # Switch to Dynamics & Testbench
        print('Switching to Dynamics & Testbench tab and injecting probe signals...')
        cdp.eval('''
        (() => {
            window.siliquariumApp.switchMicroscopeTab("analysis");
            // Toggle Stream A, B, and Toxin
            const btnA = document.getElementById("probe-btn-a");
            const btnB = document.getElementById("probe-btn-b");
            if (btnA) btnA.click();
            if (btnB) btnB.click();
        })()
        ''')
        time.sleep(2)
        p2_testbench = os.path.join(out_dir, 'practicum2_microscope_testbench.png')
        rect_t = cdp.get_element_rect('#microscope-panel')
        if rect_t and rect_t['x'] < 1920 and rect_t['width'] > 0:
            crop_t = (rect_t['x'], rect_t['y'], rect_t['x'] + rect_t['width'], rect_t['y'] + rect_t['height'])
        else:
            crop_t = (1400, 0, 1920, 1080)
        cdp.capture_screenshot(p2_testbench, crop_box=crop_t)

        # Close microscope drawer
        cdp.eval('window.siliquariumApp.closeMicroscope();')
        time.sleep(0.5)

        # 3. Practicum 3: Closed-Universe Conservation Audit
        print('\n--- Practicum 3: Conservation Audit & Ecosystem Stats ---')
        cdp.eval('document.getElementById("hud-stats-btn")?.click();')
        time.sleep(1.5)
        p3_stats = os.path.join(out_dir, 'practicum3_ecosystem_stats_invariant.png')
        # Crop around the stats panel and top HUD cluster
        s_rect = cdp.get_element_rect('#hud-stats-panel')
        if s_rect:
            crop_s = (s_rect['x'] - 20, s_rect['y'] - 20, s_rect['x'] + s_rect['width'] + 20, s_rect['y'] + s_rect['height'] + 20)
        else:
            crop_s = (400, 30, 1520, 850)
        cdp.capture_screenshot(p3_stats, crop_box=crop_s)
        # Close stats panel
        cdp.eval('document.getElementById("hud-stats-close-btn")?.click();')
        time.sleep(0.5)

        # 4. Practicum 4: Naturalist Assistant & Guided Field Safari
        print('\n--- Practicum 4: Naturalist Assistant ---')
        cdp.eval('document.getElementById("hud-naturalist-btn")?.click();')
        time.sleep(1.5)
        p4_nat = os.path.join(out_dir, 'practicum4_naturalist_assistant.png')
        n_rect = cdp.get_element_rect('.naturalist-panel') or cdp.get_element_rect('#hud-naturalist-panel') or cdp.get_element_rect('[id*="naturalist"]')
        if n_rect:
            crop_n = (n_rect['x'] - 10, n_rect['y'] - 10, n_rect['x'] + n_rect['width'] + 10, n_rect['y'] + n_rect['height'] + 10)
        else:
            crop_n = (280, 50, 1640, 1030)
        cdp.capture_screenshot(p4_nat, crop_box=crop_n)
        # Close naturalist
        cdp.eval('document.querySelector(".naturalist-close-btn")?.click() || document.querySelector("[id*=\"naturalist-close\"]")?.click();')
        time.sleep(0.5)

        # 5. Practicum 5: Historical Kinematics & Chronicle Mode
        print('\n--- Practicum 5: Chronicle Historical Kinematics ---')
        cdp.eval('document.getElementById("btn-mode-chronicle")?.click();')
        time.sleep(2)
        p5_chron = os.path.join(out_dir, 'practicum5_chronicle_playback.png')
        # Crop to bottom playback bar & controls
        cdp.capture_screenshot(p5_chron, crop_box=(150, 680, 1770, 1050))
        # Reset back to observatory
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(0.5)

        # 6. Practicum 6: Design Studio & 3D Bathymetric CAD
        print('\n--- Practicum 6: Design Studio ---')
        cdp.eval('document.getElementById("btn-mode-studio")?.click();')
        time.sleep(2)
        p6_studio = os.path.join(out_dir, 'practicum6_design_studio.png')
        cdp.capture_screenshot(p6_studio, crop_box=(20, 50, 1900, 1030))
        # Reset back to observatory
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(0.5)

        # 7. Practicum 7: Evolutionary Branching & Deep Lab Export
        print('\n--- Practicum 7: Evolutionary Version Control ---')
        cdp.eval('document.getElementById("hud-branches-btn")?.click();')
        time.sleep(1.5)
        p7_branch = os.path.join(out_dir, 'practicum7_evolutionary_branching.png')
        b_rect = cdp.get_element_rect('#branch-modal') or cdp.get_element_rect('[id*="branch"]')
        if b_rect:
            crop_b = (b_rect['x'] - 10, b_rect['y'] - 10, b_rect['x'] + b_rect['width'] + 10, b_rect['y'] + b_rect['height'] + 10)
        else:
            crop_b = (300, 60, 1620, 1000)
        cdp.capture_screenshot(p7_branch, crop_box=crop_b)
        # Close branch modal
        cdp.eval('document.querySelector(".branch-modal-close")?.click() || document.querySelector("[id*=\"branch-close\"]")?.click();')
        time.sleep(0.5)

        print('Capturing Deep Lab Academic Export Toolbar...')
        cdp.eval('''
        (() => {
            window.siliquariumApp.setPortalMode("deeplab");
            const btn = document.getElementById("btn-deeplab-export");
            if (btn) btn.click();
        })()
        ''')
        time.sleep(1.5)
        p7_export = os.path.join(out_dir, 'practicum7_deeplab_export.png')
        cdp.capture_screenshot(p7_export, crop_box=(350, 30, 1570, 500))

        # In-App Course Tutorial Modal
        print('\n--- In-App Course Tutorial Modal ---')
        cdp.eval('document.getElementById("hud-course-btn")?.click();')
        time.sleep(1.5)
        course_modal_path = os.path.join(out_dir, 'tutorial_course_modal.png')
        c_rect = cdp.get_element_rect('#course-modal') or cdp.get_element_rect('[id*="course-modal"]')
        if c_rect:
            crop_c = (c_rect['x'] - 10, c_rect['y'] - 10, c_rect['x'] + c_rect['width'] + 10, c_rect['y'] + c_rect['height'] + 10)
        else:
            crop_c = (250, 40, 1670, 1030)
        cdp.capture_screenshot(course_modal_path, crop_box=crop_c)

        print('\nAll tutorial screenshots captured and cropped successfully!')

    finally:
        proc.terminate()

if __name__ == '__main__':
    main()
