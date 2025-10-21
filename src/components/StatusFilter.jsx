import React, { useState } from 'react';
import { Dropdown, Radio, Button } from 'antd';
import PropTypes from 'prop-types';

const StatusFilter = ({ 
  options = [
    { value: 'Active', color: '#1890ff' },
    { value: 'Block', color: '#E8505B' }
  ], 
  placeholder = 'Status Filter',
  style = {} 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOptionChange = (e) => {
    const newValue = e.target.value;
    setSelectedOption(newValue);
    setDropdownVisible(false);
  };

  const dropdownRender = () => (
    <div 
      className={`
        p-3 w-[200px] bg-white rounded-lg shadow-lg 
        ${options.length > 4 ? 'max-h-[250px] overflow-y-auto' : ''}
      `}
    >
      <Radio.Group 
        value={selectedOption} 
        onChange={handleOptionChange}
        className="w-full"
      >
        {options.map((option) => (
          <Radio 
            key={option.value} 
            value={option.value}
            className={`
              flex items-start gap-1 mb-2
              ${selectedOption === option.value 
                ? `text-[${option.color}]` 
                : 'text-black/85'}
            `}
          >
            {option.value}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );

  // Determine button text and color
  const buttonText = selectedOption || placeholder;
  const buttonColor = selectedOption 
    ? (options.find(option => option.value === selectedOption)?.color || '#E8505B')
    : '#E8505B';

  return (
    <Dropdown 
      dropdownRender={dropdownRender}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={(visible) => setDropdownVisible(visible)}
    >
      <Button 
        className="
          text-white 
          flex items-center justify-start 
          gap-5 
          text-[15px] 
          py-5 px-5
        "
        style={{ 
          backgroundColor: buttonColor,
          ...style
        }}
      >
        <img 
          src="/icons/filter.png" 
          alt="Filter" 
          className="w-5 h-5" 
        /> 
        {buttonText}
      </Button>
    </Dropdown>
  );
};

// PropTypes for type checking
StatusFilter.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  ),
  placeholder: PropTypes.string,
  style: PropTypes.object
};

export default StatusFilter;