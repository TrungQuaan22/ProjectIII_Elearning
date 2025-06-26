import { UserType } from 'src/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const setProfileToLS = (profile: UserType) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileFromLS = (): UserType | null => {
  const profile = localStorage.getItem('profile')
  return profile ? JSON.parse(profile) : null
}

// Function to handle authentication redirects using URL query parameters
export const handleAuthRedirect = (currentPath: string) => {
  // Redirect to login with return URL as query parameter
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
}

// Function to get return URL from query parameters
export const getReturnUrlFromQuery = (): string => {
  const urlParams = new URLSearchParams(window.location.search)
  const redirectParam = urlParams.get('redirect')
  console.log('URL Search:', window.location.search)
  console.log('Redirect param:', redirectParam)

  if (redirectParam) {
    try {
      const decodedUrl = decodeURIComponent(redirectParam)
      console.log('Decoded URL:', decodedUrl)

      // Clear the redirect parameter from URL
      urlParams.delete('redirect')
      const newSearch = urlParams.toString()
      const newUrl = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname

      // Update URL without the redirect parameter
      window.history.replaceState({}, '', newUrl)

      return decodedUrl
    } catch (error) {
      console.error('Error decoding URL:', error)
      return '/'
    }
  }

  return '/'
}
