import React from 'react'
import Footer from 'src/pages/components/Footer/Footer'
import Header from 'src/pages/components/Header'
import ScrollUp from 'src/components/Common/ScrollUp'
import BackToTop from 'src/components/Common/BackToTop'

interface Props {
  children?: React.ReactNode
}
const DefaultLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <ScrollUp />
      <div style={{ marginTop: '0px' }}>{children}</div>
      <Footer />
      <BackToTop />
    </>
  )
}

export default DefaultLayout
