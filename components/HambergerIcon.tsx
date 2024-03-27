import { useState, FC } from 'react'

type Props = {
  width: number
}

const HambergerIcon: FC<Props> = ({ width }) => {
  const [isActive, setIsActive] = useState(false)

  const toggleActive = () => {
    setIsActive(!isActive)
  }
  if (width > 640) {
    return (
      <div
        className={`openbtn1 ${isActive ? 'active' : ''}`}
        onClick={toggleActive}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  } else {
    return (
      <div
        className={`openbtn1_mobile ${isActive ? 'active' : ''}`}
        onClick={toggleActive}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  }
}

export default HambergerIcon
