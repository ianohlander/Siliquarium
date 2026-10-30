/**
 * 🐠 Siliquarium Server Subsystem
 * SseEventBroadcaster: Server-Sent Events (SSE) stream coordinator for headless clients.
 */

export interface ISSEResponse {
  writeHead(statusCode: number, headers: Record<string, string>): void;
  write(chunk: string): boolean;
  end(): void;
  on(event: 'close' | 'finish', listener: () => void): this;
}

export class SseEventBroadcaster {
  private readonly subscribers: Set<ISSEResponse> = new Set();

  public subscribe(res: ISSEResponse, getInitialPayload: () => unknown): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });

    this.subscribers.add(res);

    res.on('close', () => {
      this.subscribers.delete(res);
    });
    res.on('finish', () => {
      this.subscribers.delete(res);
    });

    const initialPayload = getInitialPayload();
    this.sendEventTo(res, 'init', initialPayload);
  }

  public unsubscribe(res: ISSEResponse): void {
    this.subscribers.delete(res);
  }

  public getSubscriberCount(): number {
    return this.subscribers.size;
  }

  public broadcast(eventType: string, data: unknown): void {
    if (this.subscribers.size === 0) return;
    const jsonStr = JSON.stringify(data);
    const message = `event: ${eventType}\ndata: ${jsonStr}\n\n`;

    for (const sub of this.subscribers) {
      try {
        sub.write(message);
      } catch {
        this.subscribers.delete(sub);
      }
    }
  }

  public sendEventTo(res: ISSEResponse, eventType: string, data: unknown): void {
    try {
      res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch {
      this.subscribers.delete(res);
    }
  }

  public closeAll(): void {
    for (const sub of this.subscribers) {
      try {
        sub.end();
      } catch {
        // ignore
      }
    }
    this.subscribers.clear();
  }
}
