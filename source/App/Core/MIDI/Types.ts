export enum ChunkType {
  HEADER = 'MThd',
  TRACK = 'MTrk'
}

export enum EventType {
  META_EVENT,
  MIDI_EVENT,
  SYSEX_EVENT
}

export enum MidiEventType {
  CHANNEL_AFTERTOUCH = 0x0D,
  CONTROLLER = 0x0B,
  NOTE_AFTERTOUCH = 0x0A,
  NOTE_OFF = 0x08,
  NOTE_ON = 0x09,
  PITCH_BEND = 0x0E,
  PROGRAM_CHANGE = 0x0C
}

export enum MetaEventType {
  CUE_POINT = 0x07,
  COPYRIGHT_NOTICE = 0x02,
  END_OF_TRACK = 0x2F,
  INSTRUMENT_NAME = 0x04,
  KEY_SIGNATURE = 0x59,
  LYRIC_TEXT = 0x05,
  MARKER_TEXT = 0x06,
  PREFIX = 0x20,
  SEQUENCE_NAME = 0x03,
  SEQUENCE_NUMBER = 0x00,
  SEQUENCER_EVENT = 0x7F,
  SMPTE_OFFSET = 0x54,
  TEMPO = 0x51,
  TEXT_EVENT = 0x01,
  TIME_SIGNATURE = 0x58,
}

export enum SysexEventType {
  F0 = 0xF0,
  F7 = 0xF7
}

export interface IChunk {
  type: string;
  size: number;
  data: string;
}

export interface IHeader {
  format: number;
  trackCount: number;
  ticksPerBeat: number;
}

export interface ITrack {
  trackEvents: ITrackEvent[];
}

export interface ITrackEvent {
  delta: number;
}

export interface IMetaEventData {
  header: 0xFF;
  type: MetaEventType;
  size: number;
  data: string;
}

export interface IMidiEventData {
  type: MidiEventType;
  channel?: number;
  pitch?: number;
}

export interface ISysexEventData {
  type: SysexEventType;
  size: number;
  data: string;
}

export interface IMetaEvent extends IMetaEventData, ITrackEvent {}
export interface IMidiEvent extends IMidiEventData, ITrackEvent {}
export interface ISysexEvent extends ISysexEventData, ITrackEvent {}
