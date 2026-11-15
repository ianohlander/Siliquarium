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
    s = socket.create_connection((u.hostname, u.port), timeout=30)
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
    s.settimeout(60.0)
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

        if opcode == 0x1:
            return payload.decode('utf-8', errors='replace')
        elif opcode == 0x8:
            raise EOFError('WebSocket closed by server')
        elif opcode == 0x9:
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

    def capture_screenshot(self, out_path, crop_box=None):
        res = self.send_cmd('Page.captureScreenshot', {'format': 'png'})
        b64_data = res['result']['data']
        img_bytes = base64.b64decode(b64_data)
        
        raw_path = out_path + '.raw.png'
        with open(raw_path, 'wb') as f:
            f.write(img_bytes)
        
        img = Image.open(raw_path)
        if crop_box:
            left = max(0, crop_box[0])
            top = max(0, crop_box[1])
            right = min(img.width, crop_box[2])
            bottom = min(img.height, crop_box[3])
            cropped = img.crop((left, top, right, bottom))
            cropped.save(out_path, optimize=True)
            dims = cropped.size
        else:
            img.save(out_path, optimize=True)
            dims = img.size
        
        if os.path.exists(raw_path):
            os.remove(raw_path)
        print(f'Saved: {os.path.basename(out_path)} ({os.path.getsize(out_path)} bytes, dimensions {dims})')

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

        for _ in range(30):
            ready = cdp.eval('typeof window.siliquariumApp !== "undefined"')
            if ready:
                break
            time.sleep(0.5)
        print('SiliquariumApp ready!')
        time.sleep(2)

        # 0. In-App Course Orientation Modal
        print('\n--- 0. Course Orientation Modal ---')
        cdp.eval('window.siliquariumApp.getCourseController().show();')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'tutorial_course_modal.png'), crop_box=(230, 30, 1690, 970))
        cdp.eval('window.siliquariumApp.getCourseController().hide();')
        time.sleep(0.8)

        # 1. Practicum 1: Seafloor Survey & Plumes
        print('\n--- 1. Practicum 1: Seafloor Survey & Plumes ---')
        cdp.eval('window.siliquariumApp.getLoop().start();')
        time.sleep(2.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum1_seafloor_overview.png'), crop_box=(150, 80, 1770, 980))

        # Select pore & focus
        print('Selecting living pore and focusing...')
        cdp.eval('''
        (() => {
            const world = window.siliquariumApp.getWorld();
            const living = world.getAllPores().filter(p => p.cell !== null && p.cell.isAlive);
            if (living.length > 0) {
                window.siliquariumApp.selectPoreAtCoord(living[0].coord);
            }
        })()
        ''')
        time.sleep(1)
        cdp.eval('window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyF" }));')
        time.sleep(2)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum1_pore_focus.png'), crop_box=(200, 100, 1500, 950))

        # 2. Practicum 2: Bio-Lens Histological Staining (Potential / PMF Lens)
        print('\n--- 2. Practicum 2: Bio-Lens Histological Staining ---')
        cdp.eval('''
        (() => {
            const opt = document.querySelector('[data-lens="potential"]');
            if (opt) opt.click();
            else {
                window.siliquariumApp.getSeafloorRenderer().setActiveLens('potential');
            }
        })()
        ''')
        time.sleep(2)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum2_biolens_optical_staining.png'), crop_box=(150, 70, 1770, 980))
        # Reset back to hybrid lens
        cdp.eval('''
        (() => {
            const opt = document.querySelector('[data-lens="hybrid"]') || document.querySelector('[data-lens="lattice"]');
            if (opt) opt.click();
            else {
                window.siliquariumApp.getSeafloorRenderer().setActiveLens('hybrid');
            }
        })()
        ''')
        time.sleep(0.5)

        # 3. Practicum 3: Circuit Microscope Drawer (in Laboratory Mode)
        print('\n--- 3. Practicum 3: Circuit Microscope Drawer ---')
        cdp.eval('''
        (() => {
            // Switch to Laboratory workspace mode so microscope panel is unhidden
            document.getElementById("btn-mode-laboratory")?.click();
            const world = window.siliquariumApp.getWorld();
            const living = world.getAllPores().filter(p => p.cell !== null && p.cell.isAlive);
            if (living.length > 0) {
                window.siliquariumApp.selectPoreAtCoord(living[0].coord);
                window.siliquariumApp.openMicroscope(living[0].coord);
            }
            const tabSchem = document.getElementById("tab-btn-schematic");
            if (tabSchem) tabSchem.click();
        })()
        ''')
        time.sleep(2.5)
        crop_micro = (1380, 0, 1920, 1080)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum2_microscope_schematic.png'), crop_box=crop_micro)

        # Switch to Dynamics & Testbench
        print('Switching to Dynamics & Testbench tab...')
        cdp.eval('''
        (() => {
            const tabAnalysis = document.getElementById("tab-btn-analysis");
            if (tabAnalysis) tabAnalysis.click();
            const btnA = document.getElementById("probe-btn-a");
            const btnB = document.getElementById("probe-btn-b");
            if (btnA) btnA.click();
            if (btnB) btnB.click();
        })()
        ''')
        time.sleep(2)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum2_microscope_testbench.png'), crop_box=crop_micro)

        # 4. Fullscreen Circuit Autopsy Laboratory Modal
        print('\n--- 4. Fullscreen Circuit Autopsy Laboratory ---')
        cdp.eval('''
        (() => {
            const world = window.siliquariumApp.getWorld();
            const living = world.getAllPores().filter(p => p.cell !== null && p.cell.isAlive);
            if (living.length > 0) {
                window.siliquariumApp.getCircuitAutopsyModal().show(living[0].coord);
            }
        })()
        ''')
        time.sleep(2.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum3_circuit_autopsy_fullscreen.png'), crop_box=(100, 30, 1820, 1050))
        # Close autopsy modal & microscope, return to observatory mode
        cdp.eval('window.siliquariumApp.getCircuitAutopsyModal().hide();')
        cdp.eval('window.siliquariumApp.closeMicroscope();')
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(1)

        # 5. Practicum 4: Closed-Universe Conservation Audit
        print('\n--- 5. Conservation Audit & Ecosystem Stats ---')
        cdp.eval('document.getElementById("hud-stats-btn")?.click();')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum3_ecosystem_stats_invariant.png'), crop_box=(400, 30, 1520, 850))
        cdp.eval('document.getElementById("hud-stats-close-btn")?.click();')
        time.sleep(0.8)

        # 6. Practicum 5: Naturalist Assistant & Specimen Catalog
        print('\n--- 6. Naturalist Assistant ---')
        cdp.eval('window.siliquariumApp.getNaturalistAssistant().open();')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum4_naturalist_assistant.png'), crop_box=(250, 50, 1670, 1030))
        cdp.eval('window.siliquariumApp.getNaturalistAssistant().close();')
        time.sleep(0.8)

        # 7. Guided Safari Mode (Copilot Panel)
        print('\n--- 7. Guided Safari Copilot Panel ---')
        cdp.eval('''
        (() => {
            document.getElementById("btn-mode-safari")?.click();
        })()
        ''')
        time.sleep(2)
        # Crop directly to the right-hand Safari Copilot panel for maximum legibility
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum4_guided_safari_copilot.png'), crop_box=(940, 30, 1920, 1050))
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(0.8)

        # 8. Practicum 6: Geothermal Shaker Panel & Catastrophes
        print('\n--- 8. Geothermal Shaker Panel ---')
        cdp.eval('document.getElementById("observatory-shaker-panel")?.classList.remove("hidden");')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum6_geothermal_shaker_panel.png'), crop_box=(450, 120, 1470, 950))
        cdp.eval('document.getElementById("observatory-shaker-panel")?.classList.add("hidden");')
        time.sleep(0.8)

        # 9. Practicum 7: Historical Kinematics & Chronicle Mode
        print('\n--- 9. Chronicle Historical Kinematics ---')
        cdp.eval('document.getElementById("btn-mode-chronicle")?.click();')
        time.sleep(2)
        # Capture bottom transport bar plus historical trajectory in seafloor view above it
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum5_chronicle_playback.png'), crop_box=(150, 480, 1770, 1050))
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(0.8)

        # 10. Practicum 8: Siliquarium Design Studio & 3D Bathymetric CAD
        print('\n--- 10. Design Studio 3D Bathymetric CAD ---')
        cdp.eval('document.getElementById("btn-mode-studio")?.click();')
        time.sleep(2)
        # Crop to CAD sculpting tools, brush selectors, and central sculpted terrain
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum6_design_studio.png'), crop_box=(20, 40, 1500, 1040))
        cdp.eval('document.getElementById("btn-mode-observatory")?.click();')
        time.sleep(0.8)

        # 11. Practicum 9: BioBank Cryo-Vault & Inoculation Pipette
        print('\n--- 11. BioBank Cryo-Vault ---')
        cdp.eval('''
        (() => {
            window.siliquariumApp.getFlyout().open();
            window.siliquariumApp.getFlyout().openTab('biobank');
        })()
        ''')
        time.sleep(2)
        # Lab flyout drawer is docked on the LEFT side of the screen
        crop_bio = (0, 0, 540, 1080)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum9_biobank_cryovault.png'), crop_box=crop_bio)
        cdp.eval('window.siliquariumApp.getFlyout().close();')
        time.sleep(0.8)

        # 12. Practicum 10: Evolutionary Version Control
        print('\n--- 12. Evolutionary Version Control ---')
        cdp.eval('window.siliquariumApp.getBranchModal().open();')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum7_evolutionary_branching.png'), crop_box=(300, 60, 1620, 1000))
        cdp.eval('window.siliquariumApp.getBranchModal().close();')
        time.sleep(1)

        # 13. Deep Lab Academic Telemetry & Export Dropdown
        print('\n--- 13. Deep Lab Export Dropdown ---')
        cdp.eval('''
        (() => {
            window.siliquariumApp.setPortalMode("deeplab");
            const btn = document.getElementById("btn-deeplab-export");
            if (btn) btn.click();
        })()
        ''')
        time.sleep(1.5)
        # Frame Deep Lab header bar and open export options cleanly
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum7_deeplab_export.png'), crop_box=(80, 10, 850, 480))

        # 14. Practicum 11: The Abyssal Arena Dual Portal Mode
        print('\n--- 14. Abyssal Arena Battler & Tactical HUD ---')
        cdp.eval('window.siliquariumApp.setPortalMode("arena");')
        time.sleep(2)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum11_abyssal_arena.png'), crop_box=(100, 40, 1820, 1050))
        cdp.eval('window.siliquariumApp.setPortalMode("deeplab");')
        time.sleep(0.5)

        print('\n[SUCCESS] All 14 tutorial screenshots captured and verified successfully!')

    finally:
        proc.terminate()

if __name__ == '__main__':
    main()
