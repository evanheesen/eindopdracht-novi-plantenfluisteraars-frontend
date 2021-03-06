import React from 'react';
import './SingleSelectElement.css';

function SingleSelectElement({ register, name, value, label, className, validationRules }) {
    return (
        <>
            <label htmlFor={`${name}-field`} className="value--singleSelect">
                <input
                    type="radio"
                    className={className}
                    value={value}
                    id={`field-${value}`}
                    {...register(name, validationRules)}
                />
                {label}
            </label>
        </>
    )
        ;
}

export default SingleSelectElement;