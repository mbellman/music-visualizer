import { h, Component, ComponentConstructor } from 'preact';
import { Bind, Callback, Constructor } from 'Base/Core';

type ChangeableComponentConstructor = ComponentConstructor<IChangeableProps, any>;

export interface IChangeableProps {
  onChange?: Callback<UIEvent>;
}

export default function Changeable <P extends IChangeableProps, S>(AnyComponent: ChangeableComponentConstructor): ChangeableComponentConstructor {
  class ChangeableComponent extends Component<IChangeableProps, S> {
    public render (): JSX.Element {
      return <AnyComponent onChange={ this.onChange } />;
    }

    @Bind
    protected onChange (e: UIEvent): void {
      const { name, value } = e.target as HTMLInputElement;
      const { onChange } = this.props;

      this.setState({
        [name]: value
      });

      if (onChange) {
        onChange(this.state);
      }
    }
  }

  return ChangeableComponent;
}
