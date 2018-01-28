import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { h } from 'preact';
import '@styles/Toolkit/SelectableButton.less';

interface ISelectableButtonProps extends ISelectableProps {
  value: string;
}

const SelectableButton = ({ value, ...props }: ISelectableButtonProps) => {
  return (
    <Selectable className={ 'selectable-button' } { ...props }>
      { value }
    </Selectable>
  );
};

export default SelectableButton;
