import Channel from '@core/MIDI/Channel';
import EventReader from '@core/MIDI/Decoder/EventReader';
import Stream from '@core/MIDI/Decoder/Stream';
import { ITempoEvent, MetaEventType, MidiEventType, INoteEvent } from '@core/MIDI/Types';

export default class TrackReader {
  public static readonly TICK_MICROSECONDS: number = 1000000;
  private _currentBeat: number = 0;
  private _eventReader: EventReader;
  private _ticksPerBeat: number;

  public constructor (trackChunkData: string, ticksPerBeat: number) {
    this._eventReader = new EventReader(trackChunkData);
    this._ticksPerBeat = ticksPerBeat;
  }

  public getChannel (): Channel {
    const channel: Channel = new Channel();

    for (const event of this._eventReader.events()) {
      this._currentBeat += (event.delta / this._ticksPerBeat);

      switch (event.type) {
        case MetaEventType.TEMPO:
          const tempoEvent: ITempoEvent = this._parseTempoEvent(event.data);

          channel.addEvent(tempoEvent);
          break;
        case MidiEventType.NOTE_ON:
          /**
           * When a note-on event is read, we still can't ascertain its
           * duration until its corresponding note-off event is read as
           * well, so we initialize its duration to 0.
           */
          const noteEvent: INoteEvent = {
            type: MidiEventType.NOTE_ON,
            pitch: event.pitch,
            duration: 0,
            delay: this._currentBeat
          };

          channel.addEvent(noteEvent);
          break;
        case MidiEventType.NOTE_OFF:
          /**
           * Whenever note-off events are read, we find their corresponding
           * note-on event and set its duration to the difference between
           * the time delays.
           */
          const noteOn: INoteEvent = channel.getLastNoteAtPitch(event.pitch);

          if (noteOn) {
            noteOn.duration = this._currentBeat - noteOn.delay;
          }
          break;
      }
    }

    return channel;
  }

  private _parseTempoEvent (eventData: string): ITempoEvent {
    const stream: Stream = new Stream(eventData);
    const tempo: number = Math.floor(60 / (stream.nextInt24() / TrackReader.TICK_MICROSECONDS));

    return {
      type: MetaEventType.TEMPO,
      tempo,
      delay: this._currentBeat
    };
  }
}
