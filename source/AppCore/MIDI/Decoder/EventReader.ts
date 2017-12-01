import Stream from 'AppCore/MIDI/Decoder/Stream';
import {
  EventType, IMetaEvent, IMetaEventData, IMidiEvent, IMidiEventData,
  ISysexEvent, ISysexEventData, MetaEventType, MidiEventType, SysexEventType
} from 'AppCore/MIDI/Types';

/**
 * Adapted from:
 *
 * https://github.com/gasman/jasmid/blob/master/midifile.js
 * https://www.csie.ntu.edu.tw/~r92092/ref/midi/
 * http://www.ccarh.org/courses/253/handout/smf/#track_event
 * http://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html
 * https://www.midikits.net/midi_analyser/running_status.htm
 */
export default class EventReader {
  private _stream: Stream;
  private _runningStatusCode: number;

  public constructor (data: string) {
    this._stream = new Stream(data);
  }

  public * events (): IterableIterator<IMidiEvent | IMetaEvent | ISysexEvent> {
    while (!this._stream.done()) {
      const delta: number = this._stream.nextVarInt();
      const eventCode: number = this._stream.nextInt8();
      const eventType: EventType = this._getEventType(eventCode);
      let data: IMetaEventData | IMidiEventData | ISysexEventData;

      switch (eventType) {
        case EventType.META_EVENT:
          // The meta event code 0xFF is constant, so we need not pass
          // it into the meta event object generation method.
          data = this._nextMetaEventData();
          break;
        case EventType.MIDI_EVENT:
          data = this._nextMidiEventData(eventCode);
          break;
        case EventType.SYSEX_EVENT:
          data = this._nextSysexEventData(eventCode);
          break;
        default:
          throw new Error(`Invalid event code 0x${eventCode.toString(16)}!`);
      }

      yield { delta, ...data };
    }
  }

  private _getEventType (eventCode: number): EventType {
    if (eventCode < 0xF0) {
      return EventType.MIDI_EVENT;
    } else if (eventCode === 0xF0 || eventCode === 0xF7) {
      return EventType.SYSEX_EVENT;
    } else if (eventCode === 0xFF) {
      return EventType.META_EVENT;
    } else {
      return null;
    }
  }

  private _nextMetaEventData (): IMetaEventData {
    const type: number = this._stream.nextInt8();
    const size: number = this._stream.nextVarInt();
    const data: string = this._stream.next(size);

    return { header: 0xFF, type, size, data };
  }

  private _nextMidiEventData (eventCode: number): IMidiEventData {
    const isRunningStatusEvent: boolean = eventCode < 0x80;

    if (isRunningStatusEvent) {
      // Running status MIDI events are truncated from the front
      // by one byte, so we have to set our stream position back
      // accordingly.
      this._stream.rewind(1);
    } else {
      this._runningStatusCode = eventCode;
    }

    let type: number = (isRunningStatusEvent ? this._runningStatusCode : eventCode) >> 4;
    const channel: number = (isRunningStatusEvent ? this._runningStatusCode : eventCode) & 0x0F;
    let pitch: number;

    switch (type) {
      case MidiEventType.CHANNEL_AFTERTOUCH:
        this._stream.advance(1);
        break;
      case MidiEventType.CONTROLLER:
        this._stream.advance(2);
        break;
      case MidiEventType.NOTE_AFTERTOUCH:
        this._stream.advance(2);
        break;
      case MidiEventType.NOTE_OFF:
        pitch = this._stream.nextInt8();

        this._stream.advance(1);
        break;
      case MidiEventType.NOTE_ON:
        pitch = this._stream.nextInt8();

        const velocity: number = this._stream.nextInt8();

        if (velocity === 0) {
          // A zero-velocity note-on event is to be treated as the
          // note-off event for the previous note-on event.
          type = MidiEventType.NOTE_OFF;
        }

        break;
      case MidiEventType.PITCH_BEND:
        this._stream.advance(2);
        break;
      case MidiEventType.PROGRAM_CHANGE:
        this._stream.advance(1);
        break;
    }

    return { type, channel, pitch };
  }

  private _nextSysexEventData (eventCode: number): ISysexEventData {
    const size: number = this._stream.nextVarInt();
    const data: string = this._stream.next(size);

    return { type: eventCode, size, data };
  }
}
