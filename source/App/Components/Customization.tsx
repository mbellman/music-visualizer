import 'App/Styles/Customization.less';
import Channel from 'AppCore/MIDI/Channel';
import ChannelCustomization from 'App/Components/ChannelCustomization';
import Sequence from 'AppCore/MIDI/Sequence';
import Store from 'App/State/Store';
import { ActionTypes } from 'App/State/ActionTypes';
import { IPlaylistTrack, ICustomizer, ViewMode } from 'App/State/Types';
import { h, Component } from 'preact';
import { Utils, Partial } from 'Base/Core';

interface ICustomizationProps {
  playlistTrack: IPlaylistTrack;
}

export default class Customization extends Component<ICustomizationProps, any> {
  public constructor () {
    super();

    Utils.bindAll(this, '_onKeyUpTempo', '_onKeyUpScrollSpeed');
  }

  public render (): JSX.Element {
    const { customizer, sequence } = this.props.playlistTrack;

    return (
      <div class="customization">
        <h3 class="sequence-title">{ sequence.name }</h3>

        <div class="options">
          <label>Tempo:</label>
          <input class="tempo" type="text"
            onKeyUp={ this._onKeyUpTempo }
            value={ customizer.tempo.toString() }
          />

          <label>Scroll speed:</label>
          <input class="scroll-speed" type="text"
            onKeyUp={ this._onKeyUpScrollSpeed }
            value={ customizer.scrollSpeed.toString() }
          />

          <input type="button" onClick={ this._playVisualization } value="Play" />
        </div>

        <div class="channels">
          {
            [ ...sequence.channels() ].map((channel: Channel, index: number) => {
              return (
                <ChannelCustomization
                  channel={ channel }
                  channelCustomizer={ customizer.channels[index] }
                />
              );
            })
          }
        </div>
      </div>
    );
  }

  private _onKeyUpTempo (e: KeyboardEvent): void {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    this._setCustomizer({
      tempo: target.value ? parseInt(target.value) : 0
    });
  }

  private _onKeyUpScrollSpeed (e: KeyboardEvent): void {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    this._setCustomizer({
      scrollSpeed: target.value ? parseInt(target.value) : 0
    });
  }

  private _playVisualization (): void {
    Store.dispatch({
      type: ActionTypes.CHANGE_VIEW,
      viewMode: ViewMode.VISUALIZATION
    });
  }

  private _setCustomizer (partialCustomizer: Partial<ICustomizer>): void {
    const { playlistTrack } = this.props;

    Store.dispatch({
      type: ActionTypes.UPDATE_SELECTED_TRACK,
      track: {
        ...playlistTrack,
        customizer: {
          ...playlistTrack.customizer,
          ...partialCustomizer
        }
      }
    });
  }
}
