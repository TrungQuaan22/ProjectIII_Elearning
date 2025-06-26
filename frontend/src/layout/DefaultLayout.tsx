import React from 'react'
import Footer from 'src/pages/components/Footer/Footer'
import Header from 'src/pages/components/Header'

interface Props {
  children?: React.ReactNode
}
const DefaultLayout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <div style={{ marginTop: '0px' }}>{children}</div>
      <Footer />
    </>
  )
}

export default DefaultLayout
