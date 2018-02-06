import NumberField, { INumberFieldProps } from '@components/Toolkit/NumberField';
import { ActionCreators } from '@state/ActionCreators';
import { Callback, Override } from '@base';
import { cloneElement, Component, h } from 'preact';
import { Connect } from '@components/Toolkit/Decorators';
import { Dispatch } from 'redux';
import { IAppState } from '@state/Types';
import { ICustomizerSettings } from '@core/Visualization/Types';
import '@styles/CustomizerSettingField.less';

interface ICustomizerSettingFieldPropsFromState {
  name?: keyof ICustomizerSettings;
  value?: string | number;
}

interface ICustomizerSettingFieldPropsFromDispatch {
  onChange?: Callback<number>;
}

interface ICustomizerSettingFieldProps extends ICustomizerSettingFieldPropsFromState, ICustomizerSettingFieldPropsFromDispatch {
  setting: keyof ICustomizerSettings;
}

function mapStateToProps ({ selectedPlaylistTrack }: IAppState, { setting }: ICustomizerSettingFieldProps): ICustomizerSettingFieldPropsFromState {
  const { settings } = selectedPlaylistTrack.customizer;

  return {
    name: setting,
    value: settings[setting]
  };
}

function mapDispatchToProps (dispatch: Dispatch<IAppState>, { setting }: ICustomizerSettingFieldProps): ICustomizerSettingFieldPropsFromDispatch {
  const { setCustomizerSettings } = ActionCreators;

  return {
    onChange: (value: number) => {
      dispatch(setCustomizerSettings({
        [setting]: value
      }));
    }
  };
}

@Connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class CustomizerSettingField extends Component<ICustomizerSettingFieldProps, any> {
  @Override
  public render (): JSX.Element {
    const { name, value, onChange } = this.props;

    return (
      <span>
        {
          this.props.children.map((child: JSX.Element) => {
            return cloneElement(child, {
              className: 'customizer-setting-field',
              name,
              value,
              onChange
            });
          })
        }
      </span>
    );
  }
}
