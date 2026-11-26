import React from 'react';
import { Props as SelectProps } from 'react-select';

export interface SpkSelectProps extends Omit<SelectProps, 'options' | 'onChange' | 'isDisabled' | 'isMulti' | 'menuPlacement' | 'classNamePrefix' | 'defaultValue' | 'value' | 'isClearable' | 'isSearchable' | 'autoFocus' | 'noOptionsMessage' | 'instanceId'> {
    option?: any;
    menuplacement?: any;
    id?: string;
    autofocus?: boolean;
    noOptionsmessage?: any;
    classNameprefix?: string;
    defaultvalue?: any;
    mainClass?: string;
    onfunchange?: (val: any) => void;
    disabled?: boolean;
    name?: string;
    getValue?: any;
    clearable?: boolean;
    multi?: boolean;
    searchable?: boolean;
    placeholder?: string;
    [key: string]: any;
}

declare const SpkSelect: React.FC<SpkSelectProps>;
export default SpkSelect;
