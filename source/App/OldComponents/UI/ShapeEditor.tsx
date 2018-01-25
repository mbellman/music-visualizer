import MultiSelectable, { ISelectedItem } from 'App/Components/Toolkit/MultiSelectable';
import SelectableButton from 'App/Components/Toolkit/SelectableButton';
import { h, Component } from 'preact';
import { Bind, IHashMap, Override } from 'Base/Core';
import { IShapeTemplate, Shapes } from 'App/State/VisualizationTypes';
import Changeable, { IChangeableProps } from 'App/Components/Toolkit/Changeable';

interface IShapeOption {
  name: string;
  type: Shapes;
}

interface IShapeEditorProps extends IChangeableProps<IShapeEditorState> {}
interface IShapeEditorState extends IShapeTemplate {}

class ShapeEditor extends Component<IShapeEditorProps, IShapeEditorState> {
  public static readonly DEFAULT_SHAPE: Shapes = Shapes.BAR;

  public static readonly SHAPE_OPTIONS: IShapeOption[] = [
    {
      name: 'Bar',
      type: Shapes.BAR
    },
    {
      name: 'Ball',
      type: Shapes.BALL
    }
  ];

  public state: IShapeEditorState = {
    type: ShapeEditor.DEFAULT_SHAPE,
    size: 20
  };

  @Override
  public render (): JSX.Element {
    return (
      <span>
        <label>Shape:</label>
        <MultiSelectable onChange={ this.props.onChange }>
          { this._renderShapeButtons() }
        </MultiSelectable>
      </span>
    );
  }

  private _renderShapeButtons (): JSX.Element[] {
    return ShapeEditor.SHAPE_OPTIONS.map((shapeEntry: IShapeOption) => {
      const { name, type } = shapeEntry;

      return (
        <SelectableButton
          value={ name }
          selected={ type === ShapeEditor.DEFAULT_SHAPE }
        />
      );
    });
  }

  @Bind
  private _onSelectShape (selected: ISelectedItem[]): void {
    const { type } = ShapeEditor.SHAPE_OPTIONS[selected[0].index];

    this.props.onChange({ type });
  }
}

export default Changeable<IShapeEditorProps, IShapeEditorState>(ShapeEditor);
