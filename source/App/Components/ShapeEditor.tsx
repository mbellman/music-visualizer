import { h, Component } from 'preact';
import { IAppState } from '@state/Types';
import { IShapeTemplate, Shapes } from '@state/VisualizationTypes';
import { Bind, Override } from '@base';
import { Connect } from '@components/Decorators';
import MultiSelectable from '@components/Toolkit/MultiSelectable';
import SelectableButton from '@components/Toolkit/SelectableButton';

interface IShapeOption {
  type: Shapes;
  name: string;
}

interface IShapeEditorProps {
  channelIndex: number;
  selectedShapeTemplate?: IShapeTemplate;
}

function mapStateToProps (state: IAppState, props: IShapeEditorProps): Partial<IShapeEditorProps> {
  const { customizer } = state.selectedPlaylistTrack;
  const { channelIndex } = props;
  const { shapeTemplate } = customizer.channels[channelIndex].shapeCustomizer;

  return {
    selectedShapeTemplate: shapeTemplate
  };
}

@Connect(mapStateToProps)
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
        <MultiSelectable>
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

  /*
  @Bind
  private _onSelectShape (selected: ISelectedItem[]): void {
    const { type } = ShapeEditor.SHAPE_OPTIONS[selected[0].index];

    this.props.onChange({ type });
  }
  */
}
