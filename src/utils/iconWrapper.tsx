import React from 'react';

interface IconWrapperProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  [key: string]: any;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, ...props }) => {
  return <Icon {...props} />;
};