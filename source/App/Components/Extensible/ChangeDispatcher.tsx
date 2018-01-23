import { h, Component } from 'preact';
import { Callback } from 'Base/Core';

export interface IChangeDispatcherProps<S> {
  onChange?: Callback<S>;
}

export default abstract class ChangeDispatcher<P extends IChangeDispatcherProps<S>, S> extends Component<P, S> {
  protected dispatchChange <K extends keyof S>(state: Pick<S, K>): void {
    const { onChange } = this.props;

    this.setState(state);

    if (onChange) {
      onChange(this.state);
    }
  }
}
