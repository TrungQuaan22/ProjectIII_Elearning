const path = {
  home: '/',
  profile: '/user/profile',
  changePassword: '/user/password',
  login: '/login',
  register: '/register',
  logout: '/logout',
  bookDetail: 'books/:bookId',
  cart: '/cart'
} as const

export default path
