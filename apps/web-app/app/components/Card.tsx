import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  title,
  description,
  icon,
  children,
  className = '',
  hover = true,
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-6 border border-gray-200 ${
        hover ? 'hover:shadow-lg hover:-translate-y-1' : ''
      } transition-all duration-300 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
          {icon}
        </div>
      )}
      {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
}
