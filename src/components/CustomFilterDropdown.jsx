import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Radio, Space } from 'antd';
import { useState } from 'react';

// Main Dropdown component
export default function CustomFilterDropdown({ 
  options = [
    { label: 'All', value: 'all' },
    { label: 'Office', value: 'office' }, 
    { label: 'Government', value: 'government' }
  ],
  defaultValue = options[0]?.value,
  onChange,
  width = '100%',
  borderRadius = '8px'
}) {
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === defaultValue) || options[0]
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Colors configuration
  const colors = {
    border: '#d9e1e6',
    text: '#000000',
    background: '#ffffff',
    selectedBackground: '#f0f7fa',
    selectedDot: '#3ca9c0',
    hoverBackground: '#f5f5f5'
  };

  // Handle option selection
  const handleSelect = ({ key }) => {
    const option = options.find(opt => opt.value === key);
    setSelectedOption(option);
    setDropdownVisible(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  // Create menu items
  const menu = (
    <Menu 
      onClick={handleSelect}
      style={{ 
        border: `1px solid ${colors.border}`,
        borderRadius,
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '4px 0',
      }}
    >
      {options.map((option) => (
        <Menu.Item 
        className='flex justify-between items-center'
          key={option.value}
          style={{
            padding: '8px 16px',
            margin: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: selectedOption.value === option.value ? colors.selectedBackground : colors.background,
            color: colors.text,
          }}
        >
         <div className='flex items-center justify-between'>
         <Space>
            {/* {option.icon && option.icon} */}
            {option.label}
          </Space>
          <Radio 
            checked={selectedOption.value === option.value}
            style={{ marginLeft: '16px' }}
          />
         </div>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown 
      overlay={menu} 
      trigger={['click']}
      visible={dropdownVisible}
      onVisibleChange={(visible) => setDropdownVisible(visible)}
      style={{ width }}
    >
      <button 
        className="flex items-center justify-between px-4 py-2 text-left border rounded-md focus:outline-none"
        style={{ 
          borderColor: colors.border,
          backgroundColor: colors.background,
          color: colors.text,
          borderRadius,
          width: '100%'
        }}
      >
        <div className="flex items-center">
          {selectedOption.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <div className='flex items-center gap-3'>
            <img src="/icons/filterdrop.png" className='w-[18px] h-[18px]' alt="" /> <h3>{selectedOption.label}</h3>
          </div>
        </div>
        
        <DownOutlined 
          style={{ 
            color: '#f5a623',
            transition: 'transform 0.3s',
            transform: dropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)'
          }} 
        />
      </button>
    </Dropdown>
  );
}

// Demo component showing usage and options
// function DropdownDemo() {
//   const [selectedValue, setSelectedValue] = useState('all');

//   // Create some sample icons for the office dropdown
//   const OfficeIcon = () => (
//     <div className="flex items-center">
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2">
//         <line x1="8" y1="6" x2="16" y2="6"></line>
//         <line x1="8" y1="12" x2="16" y2="12"></line>
//         <line x1="8" y1="18" x2="16" y2="18"></line>
//       </svg>
//     </div>
//   );

//   // Options with icons
//   const officeOptions = [
//     { label: 'All', value: 'all', icon: <OfficeIcon /> },
//     { label: 'Office', value: 'office', icon: <OfficeIcon /> },
//     { label: 'Government', value: 'government', icon: <OfficeIcon /> }
//   ];

//   return (
//     <div className="p-6 flex flex-col gap-6">
//       <h2 className="text-xl font-bold">Ant Design Dropdown with Radio Selection</h2>
      
//       {/* Example 1: Default Dropdown */}
//       <div>
//         <h3 className="mb-2 font-medium">Standard Dropdown</h3>
//         <div className="w-64">
//           <CustomFilterDropdown 
//             options={officeOptions}
//             onChange={(value) => setSelectedValue(value)}
//           />
//         </div>
//         <p className="mt-2 text-sm text-gray-500">Selected value: {selectedValue}</p>
//       </div>
      
//       {/* Example 2: Rounded with Custom Width */}
//       <div>
//         <h3 className="mb-2 font-medium">Custom Styling</h3>
//         <div className="w-full">
//           <CustomFilterDropdown 
//             options={officeOptions}
//             width="300px"
//             borderRadius="16px"
//             onChange={(value) => console.log(value)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }