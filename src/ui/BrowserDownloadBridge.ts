/**
 * 📥 BrowserDownloadBridge - Presentation layer utility for triggering browser downloads.
 * Isolates DOM manipulation (document.createElement('a'), document.body.appendChild)
 * strictly within the presentation layer.
 */

export class BrowserDownloadBridge {
  /**
   * Triggers a browser file download of text/JSON data.
   */
  public static triggerDownload(filename: string, content: string, mimeType: string = 'application/json'): void {
    if (typeof document === 'undefined' || typeof URL === 'undefined') {
      return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }
}
