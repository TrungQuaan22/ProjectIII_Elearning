import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Aside from 'src/components/DashBoard/Aside'
import { useAppContext } from 'src/hooks/useAppContext'

export default function DashBoard() {
  const { profile } = useAppContext()
  if (profile?.role !== 'admin') {
    return <Navigate to='/' />
  }
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Aside />
      <main className='flex-1 p-8'>
        <Outlet />
      </main>
    </div>
  )
}
