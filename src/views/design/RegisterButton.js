import styled from "styled-components";

export const Button2 = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0;
  border: 0;
  background: rgba(255, 255, 255, 0);
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  color: #B9BAFF;
  width: ${props => props.width || null};
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  transition: all 0.3s ease;
`;
