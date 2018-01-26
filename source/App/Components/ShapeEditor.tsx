import { h, Component } from 'preact';
import { IAppState } from '@state/Types';
import { IShapeTemplate, Shapes } from '@state/VisualizationTypes';
import { Bind, Callback, Override } from '@base';
import { Connect } from '@components/Toolkit/Decorators';
import MultiSelectable, { ISelectedItem } from '@components/Toolkit/MultiSelectable';
import SelectableButton from '@components/Toolkit/SelectableButton';
import { Dispatch } from 'redux';
import { ActionCreators } from '@state/ActionCreators';
import { Selectors } from '@state/Selectors';

interface IShapeOption {
  type: Shapes;
  name: string;
}

interface IShapeEditorPropsFromState {
  selectedShapeTemplate?: IShapeTemplate;
}

interface IShapeEditorPropsFromDispatch {
  onChange?: Callback<Shapes>;
}

interface IShapeEditorProps extends IShapeEditorPropsFromState, IShapeEditorPropsFromDispatch {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IShapeEditorProps): IShapeEditorPropsFromState {
  return {
    selectedShapeTemplate: Selectors.getShapeTemplate(state, channelIndex)
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IShapeEditorProps): IShapeEditorPropsFromDispatch {
  return {
    onChange: (shape: Shapes) => {
      const { changeShape } = ActionCreators;

      dispatch(changeShape(channelIndex, shape));
    }
  };
}

@Connect(mapStateToProps, mapDispatchToProps)
export default class ShapeEditor extends Component<IShapeEditorProps, any> {
  public static readonly SHAPE_OPTIONS: IShapeOption[] = [
    {
      type: Shapes.BAR,
      name: 'Bar'
    },
    {
      type: Shapes.BALL,
      name: 'Ball'
    }
  ];

  @Override
  public render (): JSX.Element {
    return (
      <span>
        <label>Shape:</label>
        <MultiSelectable onChange={ this._onChangeShape }>
          { this._renderShapeButtons() }
        </MultiSelectable>
      </span>
    );
  }

  private _renderShapeButtons (): JSX.Element[] {
    const { type: selectedShapeType } = this.props.selectedShapeTemplate;

    return ShapeEditor.SHAPE_OPTIONS.map((shapeOption: IShapeOption) => {
      const { name, type } = shapeOption;

      return (
        <SelectableButton
          value={ name }
          selected={ type === selectedShapeType }
        />
      );
    });
  }

  @Bind
  private _onChangeShape (selected: ISelectedItem[]): void {
    const { type } = ShapeEditor.SHAPE_OPTIONS[selected[0].index];

    this.props.onChange(type);
  }
}
