import React from 'react'
import { Outlet } from 'react-router-dom'
import Aside from 'src/components/DashBoard/Aside'

export default function DashBoard() {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Aside />
      <main className='flex-1 p-8'>
        <Outlet />
      </main>
    </div>
  )
}
