import React from 'react';
import SvgIcon from './SvgIcon';

const FormInput = (props:any) => {

  return (
    <label className="input input-bordered flex items-center gap-2">
      <SvgIcon icon = {props.icon} />
      <input
        type={props.type}
        className="grow"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        required
      />
    </label>
  );
};

export default FormInput;
