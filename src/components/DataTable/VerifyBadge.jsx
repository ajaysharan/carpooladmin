import React from 'react';

export const VerifyBadge = ({ status, data_id ,onClick }) => {
  const getBadgeInfo = () => {
 
    switch (status) {
      case true:
        return {
          label: 'Verified',
          gradient: 'bg-violet-700'
        };
      case false:
        return {
          label: 'Un-Verified',
          gradient: 'bg-red-600'
        };
      default:
        return {
          label: 'Unknown',
          gradient: 'bg-gray-400'
        };
    }
  };

  const { label, gradient } = getBadgeInfo();
  return (
    // <span
    //   className={`cursor-pointer bg-gradient-to-tl ${gradient} px-2.5 text-xs rounded-md py-1.5 inline-block whitespace-nowrap text-center align-baseline font-bold uppercase leading-none text-white`}
    //   onClick={() => onClick(data_id,!status )}
    // >
    //   {label}
    // </span>
    <div className={`cursor-pointer inline-block px-2 py-0.5 text-xs  rounded-full bg-gradient-to-tl ${gradient} font-bold uppercase`}
        onClick={() => onClick(data_id,!status )}>
        {label}
    </div>
  );
};
