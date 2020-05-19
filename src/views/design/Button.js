import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  font-size: 13px;
  text-align: center;
  color: rgba(248, 248, 148);
  width: ${props => props.width || null};
  height: ${props => props.height || "35px"}
  border: 2px solid;
  border-color: rgba(248, 248, 148);
  border-radius: 20px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgba(120, 26, 89, 0.8);
  transition: all 0.3s ease;
`;
