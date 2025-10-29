// BackgroundPartial.js
import styled from 'styled-components';

const BackgroundPartial = styled.div`
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #95b1ed, #3abde9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;

  ${({ overlayImage }) =>
    overlayImage &&
    `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 500%;
      height: 100%;
      background-image: url(${overlayImage});
      background-size: cover;
      background-position: center;
      opacity: 0.3;
      border-radius: 10px;
    }
  `}
`;

export default BackgroundPartial;