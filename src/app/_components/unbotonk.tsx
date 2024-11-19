import React from 'react';

interface BotonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const Boton: React.FC<BotonProps> = ({ onClick, label, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="mi-boton">
      {label}
    </button>
  );
};

export default Boton;