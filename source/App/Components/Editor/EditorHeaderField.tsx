import 'App/Styles/EditorHeaderField.less';
import Store from 'App/State/Store';
import { h, Component } from 'preact';
import { Utils } from 'Base/Core';
import { ActionTypes } from 'App/State/ActionTypes';

interface IEditorHeaderFieldProps {
  actionType: ActionTypes;
  label: string;
  value: string;
}

export default class EditorHeaderField extends Component<IEditorHeaderFieldProps, any> {
  public constructor () {
    super();

    Utils.bindAll(this, '_onKeyUp');
  }

  public render (): JSX.Element {
    return (
      <span>
        <label>{ this.props.label }:</label>
        <input
          class="editor-header-input"
          type="text"
          onKeyUp={ this._onKeyUp }
          value={ this.props.value }
        />
      </span>
    );
  }

  private _onKeyUp (e: KeyboardEvent): void {
    const target: HTMLInputElement = e.target as HTMLInputElement;

    if (target.value) {
      Store.dispatch({
        type: this.props.actionType,
        payload: parseInt(target.value)
      });
    }
  }
}
