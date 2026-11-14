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
        if not chunk: raise EOFError()
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
            if not chunk: raise EOFError()
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
            raise EOFError()
        elif opcode == 0x9:
            s.sendall(struct.pack('!BB', 0x8a, 0))

class ChromeCDP:
    def __init__(self, port=9222):
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
            resp = json.loads(ws_recv(self.ws))
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
        time.sleep(3)
        cdp = ChromeCDP()
        for _ in range(30):
            if cdp.eval('typeof window.siliquariumApp !== "undefined"'):
                break
            time.sleep(0.5)
        time.sleep(2)

        # Mute discovery and milestone popups
        cdp.eval('''
        (() => {
            document.getElementById("milestone-modal")?.classList.add("hidden");
            document.getElementById("geo-event-modal")?.classList.add("hidden");
            document.getElementById("discovery-modal")?.classList.add("hidden");
            window.siliquariumApp.getMilestoneModal().hide();
        })()
        ''')
        time.sleep(0.5)

        # 1. Fullscreen Circuit Autopsy
        print('Capturing Fullscreen Circuit Autopsy...')
        cdp.eval('''
        (() => {
            const world = window.siliquariumApp.getWorld();
            const living = world.getAllPores().filter(p => p.cell !== null && p.cell.isAlive);
            const coord = living.length > 0 ? living[0].coord : null;
            window.siliquariumApp.getCircuitAutopsyModal().show(coord);
        })()
        ''')
        time.sleep(2.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum3_circuit_autopsy_fullscreen.png'), crop_box=(100, 30, 1820, 1050))
        cdp.eval('window.siliquariumApp.getCircuitAutopsyModal().hide();')
        time.sleep(1)

        # 2. BioBank Cryo-Vault
        print('Capturing BioBank Cryo-Vault...')
        cdp.eval('''
        (() => {
            window.siliquariumApp.getFlyout().open();
            window.siliquariumApp.getFlyout().switchTab('biobank');
        })()
        ''')
        time.sleep(2)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum9_biobank_cryovault.png'), crop_box=(0, 0, 540, 1080))
        cdp.eval('window.siliquariumApp.getFlyout().close();')
        time.sleep(1)

        # 3. Deep Lab Export Dropdown
        print('Capturing Deep Lab Export Dropdown...')
        cdp.eval('''
        (() => {
            window.siliquariumApp.setPortalMode("deeplab");
            const btn = document.getElementById("btn-deeplab-export");
            if (btn) btn.click();
        })()
        ''')
        time.sleep(1.5)
        cdp.capture_screenshot(os.path.join(out_dir, 'practicum7_deeplab_export.png'), crop_box=(380, 0, 920, 320))

        print('Done!')
    finally:
        proc.terminate()

if __name__ == '__main__':
    main()
