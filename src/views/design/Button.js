import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  color: #fff;
  width: ${props => props.width || null};
  height: 35px;
  border: 2px solid;
  border-color: #c5c5c5;
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #0e3d61;
  transition: all 0.3s ease;
`;
