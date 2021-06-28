
import React from 'react';
import { SketchPicker } from 'react-color';
import './ColorPicker.scss';
export const ColorPicker = (props) => {
    const {
        mainColor,
        displayColorPicker,  
        handleClick,
        handleClose,
        handleChange,
        handleColorPickerChange2
    } = props;
    return(
      <div>
        {/* Color Picker Type */}
        <div className={'colorPicker--swatch'} onClick={handleClick}>
            <div style={{ background: `${mainColor}` }} className={'colorPicker--color'} />
        </div>
        { displayColorPicker ? <div className={'colorPicker--popover'}>
          <div className={'colorPicker--cover'} onClick={ handleClose }/>
          <SketchPicker color={mainColor} onChange={ handleChange } onChangeComplete={handleColorPickerChange2} />
        </div> : null }
      </div>  
    )
}