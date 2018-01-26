import '@styles/Toolkit/SelectableButton.less';

import Selectable, { ISelectableProps } from '@components/Toolkit/Selectable';
import { h } from 'preact';

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
