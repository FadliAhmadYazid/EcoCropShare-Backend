import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  footer,
  className = '',
  children,
  onClick,
  hoverable = false,
}) => {
  const cardClasses = `
    bg-white rounded-lg shadow-sm overflow-hidden
    ${hoverable ? 'transition-all duration-200 hover:shadow-md' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* Card Header */}
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-100">
          {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Card Body */}
      <div className="p-4">{children}</div>
      
      {/* Card Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">{footer}</div>
      )}
    </div>
  );
};

export default Card;