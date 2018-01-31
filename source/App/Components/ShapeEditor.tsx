import MultiSelectable, { ISelectedItem } from '@components/Toolkit/MultiSelectable';
import SelectableButton from '@components/Toolkit/SelectableButton';
import { ActionCreators } from '@state/ActionCreators';
import { Bind, Callback, Override } from '@base';
import { Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { IAppState } from '@state/Types';
import { IShapeTemplate, ShapeTypes } from '@core/Visualization/Types';
import { Selectors } from '@state/Selectors';
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
  changeShapeType?: Callback<ShapeTypes>;
  onChangeShapeSize?: Callback<number>;
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
  const { setShapeTemplateProps } = ActionCreators;

  const updateShape = ({ ...updatedShape }: Partial<IShapeTemplate>) => {
    dispatch(setShapeTemplateProps(channelIndex, updatedShape));
  };

  return {
    changeShapeType: (shapeType: ShapeTypes) => {
      updateShape({ shapeType });
    },
    onChangeShapeSize: (size: number) => {
      updateShape({ size });
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
    const { shapeType: selectedShapeType } = this.props;

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

    this.props.changeShapeType(type);
  }
}
