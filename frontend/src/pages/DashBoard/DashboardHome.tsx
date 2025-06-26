import { FaDollarSign, FaChartLine, FaUsers, FaBook } from 'react-icons/fa'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const fakeStats = [
  { label: 'Last Month Earning', value: '$72,056.00', icon: <FaDollarSign />, color: 'from-green-400 to-green-600' },
  { label: 'Average Earning', value: '12,056', icon: <FaChartLine />, color: 'from-blue-400 to-blue-600' },
  { label: 'Total Students', value: '1,200', icon: <FaUsers />, color: 'from-purple-400 to-purple-600' },
  { label: 'Total Courses', value: '24', icon: <FaBook />, color: 'from-yellow-400 to-yellow-600' }
]

const fakeChartData = [
  { name: 'Mon', Enrolled: 40, Left: 5 },
  { name: 'Tue', Enrolled: 60, Left: 8 },
  { name: 'Wed', Enrolled: 80, Left: 2 },
  { name: 'Thu', Enrolled: 70, Left: 4 },
  { name: 'Fri', Enrolled: 50, Left: 6 }
]

export default function DashboardHome() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>Welcome back, Admin!</h1>
      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {fakeStats.map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-6 shadow bg-gradient-to-br ${stat.color} text-white flex items-center gap-4`}
          >
            <div className='text-3xl'>{stat.icon}</div>
            <div>
              <div className='text-lg font-bold'>{stat.value}</div>
              <div className='text-sm'>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className='bg-white rounded-xl shadow p-6 mb-8'>
        <div className='font-semibold mb-4'>Student Analysis</div>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={fakeChartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Line type='monotone' dataKey='Enrolled' stroke='#6366f1' strokeWidth={2} />
            <Line type='monotone' dataKey='Left' stroke='#f87171' strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Top Courses Table (fake) */}
      <div className='bg-white rounded-xl shadow p-6'>
        <div className='font-semibold mb-4'>Top Courses</div>
        <table className='w-full'>
          <thead>
            <tr>
              <th className='text-left'>Course Name</th>
              <th>Instructor</th>
              <th>Sale</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Machine Learning Algorithms</td>
              <td>Annette Black</td>
              <td>562</td>
              <td>$400</td>
              <td>
                <span className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs'>Published</span>
              </td>
            </tr>
            <tr>
              <td>Recipes for a Balanced Diet</td>
              <td>Annette Black</td>
              <td>340</td>
              <td>$300</td>
              <td>
                <span className='bg-green-100 text-green-700 px-2 py-1 rounded text-xs'>Published</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
