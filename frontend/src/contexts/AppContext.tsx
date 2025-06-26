import { createContext, useState, useCallback } from 'react'
import { UserType } from 'src/types/user.type'
import { getAccessTokenFromLS, getProfileFromLS, clearLS } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: UserType | null
  setProfile: React.Dispatch<React.SetStateAction<UserType | null>>
  reset: () => void
  logout: () => void
  login: (accessToken: string, user: UserType) => void
}

const getInitialAppContext = (): AppContextInterface => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  logout: () => null,
  login: () => null
})

const initialAppContext = getInitialAppContext()

const AppContext = createContext<AppContextInterface>(initialAppContext)

const AppProvider = ({
  children,
  defaultValue = initialAppContext
}: {
  children: React.ReactNode
  defaultValue?: AppContextInterface
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(defaultValue.isAuthenticated)
  const [profile, setProfile] = useState<UserType | null>(defaultValue.profile)

  const reset = useCallback(() => {
    setIsAuthenticated(false)
    setProfile(null)
  }, [])

  const logout = useCallback(() => {
    // Clear localStorage
    clearLS()
    // Reset state
    reset()
  }, [reset])

  const login = useCallback((accessToken: string, user: UserType) => {
    // Update state
    setIsAuthenticated(true)
    setProfile(user)
  }, [])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
        logout,
        login
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export { AppContext, AppProvider, getInitialAppContext }
