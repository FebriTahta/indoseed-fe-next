import Select from 'react-select';
import { useId } from 'react';

const SpkSelect = (props) => {
    const { option, menuplacement, id, autofocus, noOptionsmessage, classNameprefix, defaultvalue, mainClass="", onfunchange, disabled, name, getValue, clearable, multi, searchable, placeholder, ...rest } = props;
    const defaultId = useId();
    const instanceId = id || name || defaultId;

    return (
        <>
            <Select name={name} options={option} className={mainClass} id={id} onChange={onfunchange} isDisabled={disabled} isMulti={multi}
                menuPlacement={menuplacement} classNamePrefix={classNameprefix} defaultValue={defaultvalue} value={getValue} isClearable={clearable} isSearchable={searchable} placeholder={placeholder}
                autoFocus={autofocus} noOptionsMessage={noOptionsmessage} instanceId={instanceId} {...rest}
            />
        </>
    )
}
export default SpkSelect;