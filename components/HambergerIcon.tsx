import { useState, FC } from 'react'

const HambergerIcon:FC = () => {
  const [isActive, setIsActive] = useState(false);

  const toggleActive = () => {
    setIsActive(!isActive);
  }

  return (
        <div className={`openbtn1 ${isActive ? 'active' : ''}`} onClick={toggleActive}>
          <span></span>
          <span></span>
          <span></span>
        </div>
  )
}

export default HambergerIcon;
