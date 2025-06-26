import React from 'react'
import Footer from 'src/pages/components/Footer/Footer'
import HeaderAuth from 'src/pages/components/Header/HeaderAuth'

interface Props {
  children?: React.ReactNode
}
const AuthLayout = ({ children }: Props) => {
  return (
    <>
      <HeaderAuth />
      {children}
      <Footer />
    </>
  )
}

export default AuthLayout
