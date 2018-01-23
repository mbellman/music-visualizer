import MultiSelectable, { ISelectedItem } from 'App/Components/UI/MultiSelectable';
import SelectableButton from 'App/Components/UI/SelectableButton';
import { h, Component } from 'preact';
import { Bind, IHashMap, Override } from 'Base/Core';
import { IShapeTemplate, Shapes } from 'App/State/VisualizationTypes';
import ChangeDispatcher, { IChangeDispatcherProps } from 'App/Components/Extensible/ChangeDispatcher';

interface IShapeOption {
  name: string;
  type: Shapes;
}

interface IShapeEditorProps extends IChangeDispatcherProps<IShapeEditorState> {}
interface IShapeEditorState extends IShapeTemplate {}

export default class ShapeEditor extends ChangeDispatcher<IShapeEditorProps, IShapeEditorState> {
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
        <MultiSelectable onChange={ this._onSelectShape }>
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

    this.dispatchChange({ type });
  }
}
