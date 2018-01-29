import MultiSelectable, { ISelectedItem } from '@components/Toolkit/MultiSelectable';
import SelectableButton from '@components/Toolkit/SelectableButton';
import { ActionCreators } from '@state/ActionCreators';
import { Bind, Callback, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { IAppState } from '@state/Types';
import { Selectors } from '@state/Selectors';
import { ShapeTypes } from '@core/Visualization/Types';
import '@styles/ShapeEditor.less';

interface IShapeOption {
  type: ShapeTypes;
  name: string;
}

interface IShapeEditorPropsFromState {
  shapeType?: ShapeTypes;
  size?: number;
}

interface IShapeEditorPropsFromDispatch {
  onChangeShape?: Callback<ShapeTypes>;
}

interface IShapeEditorProps extends IShapeEditorPropsFromState, IShapeEditorPropsFromDispatch {
  channelIndex: number;
}

function mapStateToProps (state: IAppState, { channelIndex }: IShapeEditorProps): IShapeEditorPropsFromState {
  const { shapeType, size } = Selectors.getShapeTemplate(state, channelIndex);

  return {
    shapeType,
    size
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { channelIndex }: IShapeEditorProps): IShapeEditorPropsFromDispatch {
  return {
    onChangeShape: (shapeType: ShapeTypes) => {
      const { setShapeTemplateProps } = ActionCreators;

      dispatch(setShapeTemplateProps(channelIndex, { shapeType }));
    }
  };
}

@Connect(mapStateToProps, mapDispatchToProps)
export default class ShapeEditor extends Component<IShapeEditorProps, any> {
  public static readonly SHAPE_OPTIONS: IShapeOption[] = [
    {
      type: ShapeTypes.BAR,
      name: 'Bar'
    },
    {
      type: ShapeTypes.BALL,
      name: 'Ball'
    }
  ];

  @Override
  public render (): JSX.Element {
    return (
      <div className="shape-editor">
        <label>Shape:</label>
        <MultiSelectable onChange={ this._onChangeShape }>
          { this._renderShapeButtons() }
        </MultiSelectable>
      </div>
    );
  }

  private _renderShapeButtons (): JSX.Element[] {
    const { shapeType } = this.props;

    return ShapeEditor.SHAPE_OPTIONS.map((shapeOption: IShapeOption) => {
      const { name, type } = shapeOption;

      return (
        <SelectableButton
          value={ name }
          selected={ type === shapeType }
        />
      );
    });
  }

  @Bind
  private _onChangeShape (selected: ISelectedItem[]): void {
    const { type } = ShapeEditor.SHAPE_OPTIONS[selected[0].index];

    this.props.onChangeShape(type);
  }
}
