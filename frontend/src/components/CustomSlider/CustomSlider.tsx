import React, { useRef } from 'react'
import Slider from 'react-slick'
import EastIcon from '@mui/icons-material/East'
import styles from './CustomSlider.module.scss'

interface CustomSliderProps {
  children: React.ReactNode
  sliderRef?: React.RefObject<Slider>
  settings: any
}

export default function CustomSlider({ children, sliderRef, settings }: CustomSliderProps) {
  const localRef = useRef<Slider>(null)
  const activeRef = sliderRef || localRef // Dùng ref truyền vào, nếu không có thì tạo local ref

  return (
    <div>
      <div className={styles.arrowButton}>
        <div className={styles.leftArrow} onClick={() => activeRef.current?.slickPrev()}>
          <EastIcon />
        </div>
        <div className={styles.rightArrow} onClick={() => activeRef.current?.slickNext()}>
          <EastIcon />
        </div>
      </div>
      <div className={styles.sliderContainer}>
        <Slider {...settings} ref={activeRef} className={styles.slider}>
          {children}
        </Slider>
      </div>
    </div>
  )
}
