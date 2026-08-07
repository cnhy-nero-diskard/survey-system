import styled, { keyframes } from 'styled-components';
import { fontFamily } from '../../../config/fontConfig';

// Animation keyframes
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

// Shared container styles
export const ModernContainer = styled.div`
  padding: 24px;
  background: white;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const SectionHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  margin: -24px -24px 24px -24px;

  h2 {
    font-family: ${fontFamily};
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  p {
    font-family: ${fontFamily};
    margin: 8px 0 0 0;
    opacity: 0.9;
    font-size: 14px;
  }
`;

// Form styles
export const ModernForm = styled.form`
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 24px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-family: ${fontFamily};
  font-weight: 500;
  color: #4a5568;
  font-size: 14px;
`;

export const ModernInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: ${fontFamily};
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }

  &:hover {
    border-color: #cbd5e0;
  }
`;

export const ModernSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-family: ${fontFamily};
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }

  &:hover {
    border-color: #cbd5e0;
  }
`;

// Button styles
export const ModernButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-family: ${fontFamily};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  min-height: 44px;

  ${(props) =>
    props.variant === 'primary' &&
    `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}

  ${(props) =>
    props.variant === 'secondary' &&
    `
    background: #f7fafc;
    color: #4a5568;
    border: 2px solid #e2e8f0;
    
    &:hover {
      background: #edf2f7;
      border-color: #cbd5e0;
    }
  `}
  
  ${(props) =>
    props.variant === 'danger' &&
    `
    background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 101, 101, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  ${(props) =>
    props.variant === 'success' &&
    `
    background: linear-gradient(135deg, #68d391 0%, #48bb78 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(72, 187, 120, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

// Table styles
export const TableSection = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

export const TableHeader = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-family: ${fontFamily};
    font-weight: 600;
    color: #2d3748;
    margin: 0;
    font-size: 18px;
  }
`;

export const TableContainer = styled.div`
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #5a6fd8, #6a4c93);
  }
`;

export const ModernTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${fontFamily};
`;

export const ModernTableHead = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;

  th {
    padding: 16px 24px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    border: none;
  }
`;

export const ModernTableRow = styled.tr`
  transition: all 0.2s ease;

  &:nth-child(even) {
    background-color: #f8fafc;
  }

  &:hover {
    background-color: #e6fffa;
    transform: scale(1.001);
  }
`;

export const ModernTableCell = styled.td`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
  font-size: 14px;
  vertical-align: middle;
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  ${(props) =>
    props.variant === 'edit' &&
    `
    background: linear-gradient(135deg, #ffd93d 0%, #ff9500 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 149, 0, 0.3);
    }
  `}

  ${(props) =>
    props.variant === 'delete' &&
    `
    background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
    }
  `}
`;

// Utility components
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #718096;

  .icon {
    font-size: 48px;
    color: #cbd5e0;
    margin-bottom: 16px;
  }

  h4 {
    font-family: ${fontFamily};
    font-size: 18px;
    margin: 0 0 8px 0;
    color: #4a5568;
  }

  p {
    font-family: ${fontFamily};
    margin: 0;
    font-size: 14px;
  }
`;

export const StatsCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.2);

  h4 {
    font-family: ${fontFamily};
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 4px 0;
  }

  p {
    font-family: ${fontFamily};
    margin: 0;
    opacity: 0.9;
    font-size: 14px;
  }
`;
