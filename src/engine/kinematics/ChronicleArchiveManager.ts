/**
 * 🐠 Siliquarium Kinematics Subsystem
 * ChronicleArchiveManager: Serialization, Export, and Restoration of Historical Simulation Archives.
 * 
 * Packages the entire recorded kinematics trajectory, geodynamic shocks, trophic interactions,
 * and curated Historical Guided Tour stops into a portable `.silichronicle` archive format.
 * Enables long-term comparative study, longitudinal replay, and sharing of evolutionary events.
 */

import { ColonyKinematicsRecorder, IKinematicFrame } from './ColonyKinematicsRecorder.js';

export interface IChronicleArchiveMetadata {
  readonly version: string;
  readonly format: 'SILIQUARIUM_CHRONICLE_ARCHIVE';
  readonly savedAt: number;
  readonly startTick: number;
  readonly endTick: number;
  readonly totalFrames: number;
  readonly activeCladesCount: number;
  readonly shannonDiversity: number;
  readonly pinnedLineageId?: string | null;
  readonly pinnedBodyId?: string | null;
  readonly notes?: string;
}

export interface ISiliquariumChronicleArchive<TStop = unknown> {
  readonly metadata: IChronicleArchiveMetadata;
  readonly frames: readonly IKinematicFrame[];
  readonly tourStops?: readonly TStop[];
}

export class ChronicleArchiveManager {
  public static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Compiles the in-memory recorded kinematic frames and optional tour stops into
   * a structured ISiliquariumChronicleArchive object.
   */
  public static createArchive<TStop = unknown>(
    recorder: ColonyKinematicsRecorder,
    tourStops?: readonly TStop[],
    notes?: string
  ): ISiliquariumChronicleArchive<TStop> {
    const frames = recorder.getAllFrames();
    const startTick = frames.length > 0 ? frames[0].tick : 0;
    const endTick = frames.length > 0 ? frames[frames.length - 1].tick : 0;
    const latestFrame = frames.length > 0 ? frames[frames.length - 1] : null;

    const metadata: IChronicleArchiveMetadata = {
      version: ChronicleArchiveManager.CURRENT_VERSION,
      format: 'SILIQUARIUM_CHRONICLE_ARCHIVE',
      savedAt: Date.now(),
      startTick,
      endTick,
      totalFrames: frames.length,
      activeCladesCount: latestFrame ? latestFrame.activeCladesCount : 0,
      shannonDiversity: latestFrame ? latestFrame.shannonDiversity : 0,
      pinnedLineageId: recorder.pinnedLineageId,
      pinnedBodyId: recorder.pinnedBodyId,
      notes
    };

    return {
      metadata,
      frames: frames.slice(),
      tourStops: tourStops ? tourStops.slice() : []
    };
  }

  /**
   * Serializes the chronicle archive to a JSON string.
   */
  public static serializeArchive<TStop = unknown>(archive: ISiliquariumChronicleArchive<TStop>): string {
    return JSON.stringify(archive, null, 2);
  }

  /**
   * Deserializes and validates a chronicle archive from a JSON string.
   */
  public static deserializeArchive<TStop = unknown>(jsonString: string): ISiliquariumChronicleArchive<TStop> {
    const parsed = JSON.parse(jsonString) as ISiliquariumChronicleArchive<TStop>;
    if (!parsed || !parsed.metadata || parsed.metadata.format !== 'SILIQUARIUM_CHRONICLE_ARCHIVE') {
      throw new Error('Invalid archive format: expected SILIQUARIUM_CHRONICLE_ARCHIVE');
    }
    if (!Array.isArray(parsed.frames)) {
      throw new Error('Invalid archive format: missing frames array');
    }
    return parsed;
  }

  private static downloadHandler: ((filename: string, content: string, mimeType: string) => void) | null = null;

  /**
   * Sets the external file download handler (e.g. BrowserDownloadBridge in UI).
   */
  public static setDownloadHandler(handler: ((filename: string, content: string, mimeType: string) => void) | null): void {
    ChronicleArchiveManager.downloadHandler = handler;
  }

  /**
   * Exports the chronicle archive to a downloadable file (.silichronicle) via the registered download handler.
   */
  public static exportToFile<TStop = unknown>(
    recorder: ColonyKinematicsRecorder,
    tourStops?: readonly TStop[],
    filenamePrefix: string = 'siliquarium_chronicle'
  ): void {
    const archive = ChronicleArchiveManager.createArchive<TStop>(recorder, tourStops);
    const json = ChronicleArchiveManager.serializeArchive<TStop>(archive);

    const tick = archive.metadata.endTick;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${filenamePrefix}_tick${tick}_${timestamp}.silichronicle`;

    if (ChronicleArchiveManager.downloadHandler) {
      ChronicleArchiveManager.downloadHandler(filename, json, 'application/json');
    }
  }

  /**
   * Reads a .silichronicle or .json file and loads its contents into ColonyKinematicsRecorder.
   */
  public static async loadFromFile<TStop = unknown>(
    file: File,
    recorder: ColonyKinematicsRecorder,
    onStopsLoaded?: (stops: readonly TStop[]) => void
  ): Promise<ISiliquariumChronicleArchive<TStop>> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const content = reader.result as string;
          const archive = ChronicleArchiveManager.deserializeArchive<TStop>(content);
          recorder.loadFrames(archive.frames);

          if (archive.metadata.pinnedBodyId) {
            recorder.pinBody(archive.metadata.pinnedBodyId);
          } else if (archive.metadata.pinnedLineageId) {
            recorder.pinLineage(archive.metadata.pinnedLineageId);
          }

          if (archive.tourStops && archive.tourStops.length > 0 && onStopsLoaded) {
            onStopsLoaded(archive.tourStops);
          }

          resolve(archive);
        } catch (err: unknown) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}
